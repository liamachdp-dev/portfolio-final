const courses = [{ name: "[Course name]", provider: "[Provider]", status: "Completed" }];

export default function Courses() {
  return (
    <section id="courses" className="min-h-[70vh] px-16 py-24 border-b border-line max-w-[860px]">
      <span className="block font-mono text-accent text-xs tracking-widest uppercase mb-3">04 — Courses</span>
      <h2 className="font-display font-semibold text-[clamp(28px,3vw,40px)] text-ink mb-6">Courses</h2>
      <div className="flex flex-col gap-3">
        {courses.map((course) => (
          <div
            key={course.name}
            className="flex items-center justify-between border border-line rounded-lg px-5 py-4"
          >
            <div>
              <span className="text-ink font-medium block">{course.name}</span>
              <span className="text-inkSoft text-sm">{course.provider}</span>
            </div>
            <span className="text-inkSoft text-sm font-mono">{course.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
