import PageShell from "@/components/PageShell";
import Sidebar from "@/components/Sidebar";
import About from "@/components/sections/About";
import Certifications from "@/components/sections/Certifications";
import Blogs from "@/components/sections/Blogs";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Recommendations from "@/components/sections/Recommendations";

export default function Home() {
  return (
    <PageShell>
      <Sidebar />
      <div className="flex-1">
        <About />
        <Certifications />
        <Projects />
        <Skills />
        <Blogs />
        <Recommendations />
      </div>
    </PageShell>
  );
}