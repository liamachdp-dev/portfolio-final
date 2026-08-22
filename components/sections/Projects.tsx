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
    images: [
      "/pictures/aai-project1.png",
      "/pictures/aai-project2.png",
      "/pictures/aai-project3.png",
      "/pictures/aai-project4.png"
    ]
  },
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
    <section id="projects" className="px-6 sm:px-12 md:px-16 py-12 md:py-14 border-b border-line w-full max-w-[1100px]">
      <span className="block font-mono text-accent text-xs tracking-widest  mb-3">
        03 — Projects
      </span>
      <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-[clamp(28px,3vw,40px)] text-ink mb-10">
        Projects
      </h2>

      {/* Responsive Grid */}
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
              
              {/* Hover Overlay */}
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

      {/* Responsive Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] md:h-[85vh] flex flex-col md:flex-row overflow-y-auto md:overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur border border-line rounded-full flex items-center justify-center text-inkSoft hover:text-ink hover:bg-white transition-all shadow-sm cursor-pointer"
              aria-label="Close modal"
            >
              ×
            </button>

            {/* Left 40% Text (Top on mobile) */}
            <div className="w-full md:w-[40%] p-6 sm:p-8 md:p-12 flex flex-col border-b md:border-b-0 md:border-r border-line bg-white shrink-0 md:overflow-y-auto">
              <p className="font-mono text-xs tracking-widest text-inkSoft mb-3 sm:mb-4 uppercase">
                {selectedProject.date}
              </p>
              
              <div className="flex items-start justify-between gap-3 mb-4 sm:mb-6 pr-8 md:pr-0">
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-ink">
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
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <p className="text-sm sm:text-base text-inkSoft leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Right 60% Images (Bottom on mobile) */}
            <div className="w-full md:w-[60%] bg-line/20 p-4 sm:p-6 md:p-8 md:overflow-y-auto">
              <div className="flex flex-col gap-4 sm:gap-8 pb-6 md:pb-12">
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