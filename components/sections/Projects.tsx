"use client";

import { useState, useEffect } from "react";

const PROJECTS_DATA = [
  {
    id: "1",
    title: "UST AAI: A Web Based Content Management System",
    date: "August 2024 - April 2025",
    description: "Built a fully functional Active Directory environment mimicking a corporate network. Configured Domain Controllers, Windows 10 endpoints, and vulnerable services. Executed basic attacks (LLMNR poisoning, Kerberoasting) and implemented defensive mitigations to secure the domain.",
    link: "ustaai.me",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    images: [ //gdrive
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "2", //medium writeup 1
    title: "Custom Python Keylogger",
    date: "January 2024",
    description: "Developed a proof-of-concept keylogger in Python for educational purposes. It hooks into keyboard events, encrypts the logged strokes using AES, and securely exfiltrates the data over a local C2 server.",
    link: "https://github.com/yourusername/python-keylogger",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "3", //medium writeup 2
    title: "Automated Vulnerability Scanner",
    date: "March 2024",
    description: "A bash-based automation script that chains together Nmap, Gobuster, and Nikto. It takes a target IP, runs a comprehensive reconnaissance pipeline, and outputs a formatted HTML report.",
    link: "https://github.com/yourusername/auto-scanner",
    thumbnail: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "4",
    title: "Network Intrusion Detection System",
    date: "May 2024",
    description: "Configured Snort NIDS with custom rule sets to detect port scans, brute-force attempts, and malware signatures. Integrated with ELK Stack for log management.",
    link: "https://github.com/yourusername/nids-elk",
    thumbnail: "https://images.unsplash.com/photo-1551808525-51a94da548ce?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551808525-51a94da548ce?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "5",
    title: "SOC Automation Playbooks",
    date: "July 2024",
    description: "Automated alert triage and incident response playbooks in Shuffle SOAR connected to TheHive and Cortex for threat intelligence enrichment.",
    link: "https://github.com/yourusername/soc-automation",
    thumbnail: "https://images.unsplash.com/photo-1510511459019-5dee997dd1db?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1510511459019-5dee997dd1db?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "6",
    title: "Cloud Infrastructure Hardening",
    date: "September 2024",
    description: "Terraform scripts and AWS Security Hub configurations enforcing CIS Benchmarks across multi-account AWS environments.",
    link: "https://github.com/yourusername/aws-hardening",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop"
    ]
  }
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
              <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <span className="font-mono text-xs uppercase tracking-widest bg-accent text-white px-5 py-2.5 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Read More
                </span>
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
            className="font-mono text-xs tracking-widest uppercase px-8 py-3.5 rounded-lg border border-line text-ink bg-white hover:border-ink hover:shadow-sm transition-all duration-200"
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
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur border border-line rounded-full flex items-center justify-center text-inkSoft hover:text-ink hover:bg-white transition-all shadow-sm"
              aria-label="Close modal"
            >
              ×
            </button>

            {/* Left 40% Text */}
            <div className="w-full md:w-[40%] h-full p-8 md:p-12 flex flex-col border-r border-line bg-white shrink-0 overflow-y-auto">
              <p className="font-mono text-xs tracking-widest text-inkSoft mb-4 uppercase">
                {selectedProject.date}
              </p>
              <h3 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-6">
                {selectedProject.title}
              </h3>
              <p className="text-base text-inkSoft leading-relaxed mb-12">
                {selectedProject.description}
              </p>
              
              <div className="mt-auto pt-8">
                <a 
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-accent text-white font-medium px-6 py-4 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Visit Project
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
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