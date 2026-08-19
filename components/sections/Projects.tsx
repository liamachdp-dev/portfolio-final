"use client";

import { useState, useEffect } from "react";

const PROJECTS_DATA = [
  {
    id: "1",
    title: "UST AAI: A Web Based Content Management System",
    date: "August 2024 - April 2025",
    description: "Developed by Third-year Information Technology students at the University of Santo Tomas for the University of Santo Tomas Alumni Association Inc. The project, entitled, UST AAI Web-Based Content Management System is designed to streamline digital administration and alumni engagement for the organization. The platform provides an intuitive, non-technical interface that allows association officers across varying digital skill levels to effortlessly manage and update website content, and maintain a direct communication bridge with the UST alumni community.",
    link: "ustaai.me",
    thumbnail: "/pictures/aai-project2.png",
    images: [ //gdrive
      "/pictures/aai-project1.png",
      "/pictures/aai-project2.png",
      "/pictures/aai-project3.png",
      "/pictures/aai-project4.png"
    ]
  },
  // {
  //   id: "2", //medium writeup 1
  //   title: "Custom Python Keylogger",
  //   date: "January 2024",
  //   description: "Developed a proof-of-concept keylogger in Python for educational purposes. It hooks into keyboard events, encrypts the logged strokes using AES, and securely exfiltrates the data over a local C2 server.",
  //   link: "https://github.com/yourusername/python-keylogger",
  //   thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
  //   images: [
  //     "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop"
  //   ]
  // },
];

type Project = typeof PROJECTS_DATA[0];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [visibleCount, setVisibleCount] = useState(2);

  // Disables background scrolling when the modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  return (
    <section id="projects" className="px-16 py-14 border-b border-line max-w-[1100px]">
      <span className="block font-mono text-accent text-xs tracking-widest uppercase mb-3">
        03 — Portfolio
      </span>
      <h2 className="font-display font-semibold text-[clamp(28px,3vw,40px)] text-ink mb-10">
        Projects
      </h2>

      {/* Grid limited strictly to 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROJECTS_DATA.slice(0, visibleCount).map((project) => (
          <div 
            key={project.id} 
            className="group cursor-pointer" 
            onClick={() => setSelectedProject(project)}
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-line/30 mb-4 border border-line shadow-sm">
              <img 
                src={project.thumbnail} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Hover Buttons Overlay */}
              <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2.5 backdrop-blur-[2px]">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(project);
                  }}
                  className="w-36 text-center font-mono text-xs uppercase tracking-widest bg-accent text-white py-2.5 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:opacity-90 cursor-pointer"
                >
                  Read More
                </button>
                
                <a 
                  href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-36 text-center font-mono text-xs uppercase tracking-widest bg-white/10 text-white border border-white/30 py-2.5 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:bg-white hover:text-ink cursor-pointer"
                >
                  Visit Project
                </a>
              </div>
            </div>
            
            <h4 className="font-display font-medium text-lg text-ink group-hover:text-accent transition-colors">
              {project.title}
            </h4>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {visibleCount < PROJECTS_DATA.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleShowMore}
            className="font-mono text-xs tracking-widest uppercase px-8 py-3.5 rounded-lg border border-line text-ink bg-white hover:border-ink hover:shadow-sm transition-all duration-200 cursor-pointer"
          >
            Show More
          </button>
        </div>
      )}

      {/* 40/60 Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur border border-line rounded-full flex items-center justify-center text-inkSoft hover:text-ink hover:bg-white transition-all shadow-sm cursor-pointer"
              aria-label="Close modal"
            >
              ×
            </button>

            {/* Left 40% Text */}
            <div className="w-full md:w-[40%] h-full p-8 md:p-12 flex flex-col border-r border-line bg-white shrink-0 overflow-y-auto">
              <p className="font-mono text-xs tracking-widest text-inkSoft mb-4 uppercase">
                {selectedProject.date}
              </p>
              
              {/* Title with Top-Right Diagonal Redirect Arrow Link */}
              <div className="flex items-start justify-between gap-3 mb-6">
                <h3 className="font-display text-3xl md:text-4xl font-semibold text-ink">
                  {selectedProject.title}
                </h3>
                <a 
                  href={selectedProject.link.startsWith("http") ? selectedProject.link : `https://${selectedProject.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-ink transition-colors p-1 shrink-0"
                  aria-label="Visit project site"
                  title="Visit site"
                >
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <p className="text-base text-inkSoft leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Right 60% Images */}
            <div className="w-full md:w-[60%] h-full bg-line/20 p-8 overflow-y-auto">
              <div className="flex flex-col gap-8 pb-12">
                {selectedProject.images.map((imgUrl, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border border-line shadow-sm bg-white">
                    <img 
                      src={imgUrl} 
                      alt={`${selectedProject.title} showcase ${idx + 1}`} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}