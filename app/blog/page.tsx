export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts: { id: string; title: string }[] = await data.json()
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Blog Posts</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  )
}