import PhotoCarousel from "@/components/PhotoCarousel";

export default function About() {
  return (
    <section id="about" className="min-h-[70vh] px-6 sm:px-12 md:px-16 py-12 md:py-24 border-b border-line w-full max-w-[1100px]">
      <span className="block font-mono text-accent text-xs tracking-widest  mb-3">01 — About</span>

      <div className="flex flex-col md:flex-row gap-8 md:gap-14 items-start">
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl text-ink mb-6">
            Hi, I&apos;m Liam.
          </h2>

          <div className="text-inkSoft text-base sm:text-lg leading-relaxed max-w-[56ch] space-y-4">
            <p> Currently pursuing my Bachelor of Science in Information Technology with a specialization in Network and Security, I am a research- and output-driven individual who thrives on identifying system flaws and engineering practical, working fixes. </p>
            <p>Throughout my academic journey, I’ve developed a strong passion for cybersecurity—particularly in threat defense and system hardening. </p>
            <p> As I near the completion of my degree, I aspire to step into a role as a Blue Team or Cloud Security to help defend digital infrastructure. </p>
          </div>
        </div>

        <div className="w-full md:w-[440px] flex-shrink-0">
          <PhotoCarousel />
        </div>
      </div>
    </section>
  );
}