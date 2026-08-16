import PageShell from "@/components/PageShell";
import Sidebar from "@/components/Sidebar";
import About from "@/components/sections/About";
import Certifications from "@/components/sections/Certifications";
import Blogs from "@/components/sections/Blogs";
import Courses from "@/components/sections/Courses";
import Recommendations from "@/components/sections/Recommendations";

// Server Component: safe to render Recommendations here (it reads
// Supabase via cookies on the server). PageShell handles the
// client-only boot animation and wraps everything below it.
export default function Home() {
  return (
    <PageShell>
      <Sidebar />
      <div className="flex-1">
        <About />
        <Certifications />
        <Blogs />
        <Courses />
        <Recommendations />
      </div>
    </PageShell>
  );
}
