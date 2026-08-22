"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

// --- Types ---
type LeaderboardEntry = { name: string; score: number };
type PipeData = { x: number; topHeight: number; bottomY: number; passed: boolean };

const links = [
  { href: "#about", label: "About", num: "01" },
  { href: "#certifications", label: "Certifications", num: "02" },
  { href: "#projects", label: "Projects", num: "03" },
  { href: "#skills", label: "Skills", num: "04" },
  { href: "#blogs", label: "Blogs", num: "05" },
  { href: "#recommendations", label: "Recommendations", num: "06" },
];

export default function Sidebar() {
  // Initialize Supabase Client
  const supabase = createClient();

  const [active, setActive] = useState("#about");
  const [isOpen, setIsOpen] = useState(false);

  // --- Game State ---
  const [showGameModal, setShowGameModal] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const gameData = useRef({
    birdY: 150,
    velocity: 0,
    pipes: [] as PipeData[],
    score: 0,
    frames: 0,
  });

  // --- Supabase: Fetch Leaderboard (Deduplicated) ---
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!showGameModal) return;

      const { data, error } = await supabase
        .from("flappy_scores")
        .select("name, score")
        .order("score", { ascending: false })
        .limit(50); // Fetch a chunk to ensure we find unique names

      if (!error && data) {
        // Filter to only keep the highest score for each unique name
        const uniqueScores: LeaderboardEntry[] = [];
        const seenNames = new Set<string>();
        
        for (const entry of data) {
          if (!seenNames.has(entry.name)) {
            seenNames.add(entry.name);
            uniqueScores.push(entry);
            if (uniqueScores.length === 3) break; // Stop once we have top 3 unique
          }
        }
        
        setLeaderboard(uniqueScores);
      }
    };

    fetchLeaderboard();
  }, [showGameModal, supabase]);

  // --- Supabase: Save Score (Deduplicated) ---
  const handleGameOver = async (finalScore: number) => {
    setGameState("gameover");
    if (finalScore === 0) return;

    // 1. Optimistic UI update with deduplication
    setLeaderboard((prev) => {
      const combined = [...prev, { name: playerName, score: finalScore }];
      
      // Group by name to keep only the highest score per person
      const maxScores: Record<string, number> = {};
      combined.forEach((entry) => {
        if (!maxScores[entry.name] || entry.score > maxScores[entry.name]) {
          maxScores[entry.name] = entry.score;
        }
      });
      
      // Convert back to array, sort, take top 3
      return Object.entries(maxScores)
        .map(([name, score]) => ({ name, score: Number(score) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    });

    // 2. Database Update Logic (Prevent Duplicates)
    const { data: existingRecords } = await supabase
      .from("flappy_scores")
      .select("id, score")
      .eq("name", playerName)
      .order("score", { ascending: false });

    if (existingRecords && existingRecords.length > 0) {
      const bestRecord = existingRecords[0];
      
      // Update DB only if new score is higher
      if (finalScore > bestRecord.score) {
        await supabase
          .from("flappy_scores")
          .update({ score: finalScore })
          .eq("id", bestRecord.id);
      }

      // Clean up any historical duplicates for this name in the DB
      const duplicateIds = existingRecords.slice(1).map((r) => r.id);
      if (duplicateIds.length > 0) {
        await supabase.from("flappy_scores").delete().in("id", duplicateIds);
      }
    } else {
      // First time player
      await supabase.from("flappy_scores").insert([
        { name: playerName, score: finalScore }
      ]);
    }
  };

  // --- Navigation Intersection Observer ---
  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // --- Game Loop Logic ---
  const resetGame = useCallback(() => {
    gameData.current = {
      birdY: 150,
      velocity: 0,
      pipes: [],
      score: 0,
      frames: 0,
    };
    setScore(0);
    setGameState("playing");
  }, []);

  const handleJump = useCallback(() => {
    if (gameState === "menu" || gameState === "gameover") {
      resetGame();
    } else if (gameState === "playing") {
      // Toned down jump height for better mobile control (was -7.5)
      gameData.current.velocity = -5.5;
    }
  }, [gameState, resetGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleJump();
      }
    };
    if (showGameModal && hasJoined) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showGameModal, hasJoined, handleJump]);

  useEffect(() => {
    if (!showGameModal || !hasJoined || gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mobile-optimized difficulty configuration
    const GRAVITY = 0.25; // Slower fall (was 0.45)
    const PIPE_SPEED = 2.5; // Slower pipes to give more reaction time (was 3.5)
    const PIPE_WIDTH = 40;
    const PIPE_SPAWN_RATE = 120; // Spaced out pipes to match slower speed (was 90)
    const GAP_SIZE = 110;
    const BIRD_SIZE = 16;
    const BIRD_X_POS = canvas.width / 3;

    const update = () => {
      const data = gameData.current;

      data.velocity += GRAVITY;
      data.birdY += data.velocity;

      if (data.frames % PIPE_SPAWN_RATE === 0) {
        const minPipeHeight = 40;
        const maxPipeHeight = canvas.height - GAP_SIZE - minPipeHeight;
        const topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1) + minPipeHeight);

        data.pipes.push({
          x: canvas.width,
          topHeight,
          bottomY: topHeight + GAP_SIZE,
          passed: false
        });
      }

      let collision = false;
      data.pipes.forEach((pipe) => {
        pipe.x -= PIPE_SPEED;

        // Score logic: if pipe's right edge passes bird's left edge
        if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X_POS) {
          data.score += 1;
          setScore(data.score);
          pipe.passed = true;
        }

        const hitTopPipe =
          BIRD_X_POS < pipe.x + PIPE_WIDTH &&
          BIRD_X_POS + BIRD_SIZE > pipe.x &&
          data.birdY < pipe.topHeight;

        const hitBottomPipe =
          BIRD_X_POS < pipe.x + PIPE_WIDTH &&
          BIRD_X_POS + BIRD_SIZE > pipe.x &&
          data.birdY + BIRD_SIZE > pipe.bottomY;

        if (hitTopPipe || hitBottomPipe) collision = true;
      });

      if (data.birdY + BIRD_SIZE > canvas.height || data.birdY < 0) {
        collision = true;
      }

      data.pipes = data.pipes.filter(p => p.x + PIPE_WIDTH > 0);
      data.frames++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 2;

      ctx.strokeRect(BIRD_X_POS, data.birdY, BIRD_SIZE, BIRD_SIZE);

      data.pipes.forEach(pipe => {
        ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        ctx.strokeRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);
      });

      if (collision) {
        handleGameOver(data.score);
      } else {
        requestRef.current = requestAnimationFrame(update);
      }
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showGameModal, hasJoined, gameState]);

  // Sort real leaderboard data without faking entries
  const podiumData = [...leaderboard].sort((a, b) => b.score - a.score);
  const first = podiumData[0];
  const second = podiumData[1];
  const third = podiumData[2];

  return (
    <>
      {/* Floating Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
        className="md:hidden fixed top-4 left-4 z-40 p-2.5 rounded-lg border border-line bg-paper/90 backdrop-blur-md text-inkSoft hover:text-accent focus:outline-none shadow-sm transition-all cursor-pointer"
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          font-mono flex flex-col bg-paper border-r border-line
          fixed top-0 bottom-0 left-0 z-50 w-[260px] px-6 py-8 transition-transform duration-300 ease-in-out shadow-2xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:sticky md:top-0 md:h-screen md:w-[220px] md:flex-shrink-0 md:self-start md:translate-x-0 md:px-7 md:py-12 md:shadow-none md:z-auto
        `}
      >
        <div className="flex flex-col gap-9 h-full">
          {/* Header & Links */}
          <div className="flex flex-col gap-9">
            <div className="flex items-center justify-between">
              <div className="font-display font-semibold text-[15px] text-ink">
                [liam-hdp]
                <span className="block text-[11px] text-inkSoft font-medium mt-0.5">Portfolio</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="md:hidden text-inkSoft hover:text-accent p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2.5 text-sm px-2.5 py-2 rounded-md transition-colors ${
                    active === l.href ? "bg-accentSoft text-accent font-medium" : "text-inkSoft hover:bg-accentSoft hover:text-accent"
                  }`}
                >
                  <span className="text-[11px] tabular-nums w-3.5">{l.num}</span>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Pinned Bottom Group */}
          <div className="mt-auto pt-6 flex flex-col gap-3">
            <div className="flex flex-col items-center w-full gap-1">
              <div className="text-[11px] font-medium text-inkSoft/80 tracking-wider flex items-center gap-1 lowercase">
                <span>contact me!</span>
                <span className="animate-pulse">↓</span>
              </div>
              <div className="w-full border-b border-line/80 my-0.5" />
            </div>

            <div className="flex items-center justify-center gap-3 w-full">
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-md border border-line bg-white text-inkSoft hover:text-accent hover:border-accent hover:bg-accentSoft transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" />
                </svg>
              </a>
              <a href="mailto:liamhadap.2@gmail.com" className="w-9 h-9 flex items-center justify-center rounded-md border border-line bg-white text-inkSoft hover:text-accent hover:border-accent hover:bg-accentSoft transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.4 2 7.1 6.2a1 1 0 0 0 1.3 0L20 7" />
                </svg>
              </a>
            </div>

            {/* Minigame Trigger */}
            <button
              onClick={() => setShowGameModal(true)}
              className="group border-2 border-dashed border-ink/30 rounded-xl py-3 px-3 text-center text-[11px] font-medium text-ink hover:text-accent hover:border-accent transition-all flex flex-col items-center justify-center gap-1 cursor-pointer bg-paper"
            >
              <span className="font-display text-sm">Play a game!</span>
              <span className="text-inkSoft/70 group-hover:text-accent/70">Flappy Bird</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- Minigame Modal Overlay --- */}
      {showGameModal && (
        <div className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-paper border border-line rounded-2xl w-full max-w-md p-6 sm:p-8 flex flex-col items-center shadow-2xl relative">
            <button
              onClick={() => { setShowGameModal(false); setHasJoined(false); setGameState("menu"); }}
              className="absolute top-4 right-4 text-inkSoft hover:text-ink text-xl font-bold p-2"
            >
              ×
            </button>

            <h2 className="font-display font-semibold text-2xl mb-1 text-ink">Terminal Flappy</h2>

            {/* Name Input Screen */}
            {!hasJoined ? (
              <div className="w-full mt-6 space-y-4 font-mono">
                <input
                  type="text"
                  placeholder="Enter your name (max 10 chars)"
                  maxLength={10}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-white border border-line rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent"
                />
                <button
                  onClick={() => {
                    const trimmed = playerName.trim();
                    setPlayerName(trimmed);
                    if (trimmed) {
                      setHasJoined(true);
                    }
                  }}
                  disabled={!playerName.trim()}
                  className="w-full bg-ink text-white rounded-lg py-3 text-sm hover:bg-accent disabled:opacity-50 transition-colors uppercase tracking-widest"
                >
                  Enter Arena
                </button>
              </div>
            ) : (
              /* Game Screen */
              <div className="w-full flex flex-col items-center mt-4">
                <div className="font-mono text-sm mb-2 flex justify-between w-full px-2">
                  <span>Player: {playerName}</span>
                  <span className="text-accent font-bold">Score: {score}</span>
                </div>

                {/* Canvas Container */}
                <div
                  className="relative w-full h-[300px] border-2 border-ink bg-white cursor-pointer overflow-hidden rounded-md touch-none"
                  onPointerDown={(e) => {
                    e.preventDefault(); // Prevents touch scrolling/zooming
                    handleJump();
                  }}
                >
                  <canvas ref={canvasRef} width={400} height={300} className="w-full h-full block" />

                  {/* Overlays */}
                  {gameState === "menu" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 font-mono text-sm uppercase tracking-widest font-bold pointer-events-none">
                      Tap or Space to Start
                    </div>
                  )}
                  {gameState === "gameover" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 font-mono pointer-events-none">
                      <span className="text-lg font-bold mb-2">Game Over!</span>
                      <span className="text-sm text-inkSoft mb-4">Final Score: {score}</span>
                      <button
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          resetGame();
                        }}
                        className="border-2 border-ink px-4 py-2 hover:bg-ink hover:text-white transition-colors uppercase text-xs font-bold cursor-pointer pointer-events-auto"
                      >
                        Play Again
                      </button>
                    </div>
                  )}
                </div>

                {/* Podium Leaderboard */}
                {leaderboard.length > 0 && (
                  <div className="w-full mt-8 font-mono">
                    <h3 className="text-xs text-inkSoft text-center uppercase tracking-widest mb-6">Leaderboard Top 3</h3>

                    <div className="flex items-end justify-center gap-2 sm:gap-4 h-32 px-4">
                      {/* 2nd Place */}
                      {second ? (
                        <div className="flex flex-col items-center w-1/3">
                          <span className="text-xs truncate max-w-[80px] mb-1">{second.name}</span>
                          <span className="text-xs font-bold text-inkSoft mb-1">{second.score}</span>
                          <div className="w-full h-20 bg-paper border-t-2 border-l-2 border-r-2 border-line rounded-t-sm flex items-start justify-center pt-2 text-inkSoft">2</div>
                        </div>
                      ) : <div className="w-1/3" />}

                      {/* 1st Place */}
                      {first ? (
                        <div className="flex flex-col items-center w-1/3">
                          <span className="text-xs truncate max-w-[80px] mb-1 text-accent font-bold">{first.name}</span>
                          <span className="text-xs font-bold text-accent mb-1">{first.score}</span>
                          <div className="w-full h-28 bg-accentSoft border-t-2 border-l-2 border-r-2 border-accent rounded-t-sm flex items-start justify-center pt-2 text-accent font-bold shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.1)]">1</div>
                        </div>
                      ) : <div className="w-1/3" />}

                      {/* 3rd Place */}
                      {third ? (
                        <div className="flex flex-col items-center w-1/3">
                          <span className="text-xs truncate max-w-[80px] mb-1">{third.name}</span>
                          <span className="text-xs font-bold text-inkSoft mb-1">{third.score}</span>
                          <div className="w-full h-14 bg-paper border-t-2 border-l-2 border-r-2 border-line rounded-t-sm flex items-start justify-center pt-2 text-inkSoft">3</div>
                        </div>
                      ) : <div className="w-1/3" />}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}