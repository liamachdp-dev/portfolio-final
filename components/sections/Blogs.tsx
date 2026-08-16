const posts = [
  { title: "[Post title]", excerpt: "[Short excerpt goes here]", date: "[Date]", readTime: "[X] min" },
];

export default function Blogs() {
  return (
    <section id="blogs" className="min-h-[70vh] px-16 py-24 border-b border-line max-w-[860px]">
      <span className="block font-mono text-accent text-xs tracking-widest uppercase mb-3">03 — Blogs</span>
      <h2 className="font-display font-semibold text-[clamp(28px,3vw,40px)] text-ink mb-6">Blogs</h2>
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <a key={post.title} href="#" className="group">
            <h3 className="text-ink font-medium group-hover:text-accent transition-colors">{post.title}</h3>
            <p className="text-inkSoft text-sm mt-1">{post.excerpt}</p>
            <span className="text-inkSoft text-xs font-mono mt-1 block">
              {post.date} · {post.readTime} read
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
