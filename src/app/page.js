import sleek from '@/lib/sleek';

export default async function Home() {
  // Fetch data for the home page ('/')
  const data = await sleek.getPage('/');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          {data.title}
        </h1>
        
        <p className="text-gray-500">
          Welcome to the blog. Check out our posts below.
        </p>

        {/* Example link to a blog post if you have one created */}
        <a 
          href="/blog/hello-world" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Read "Hello World" Post
        </a>
      </div>
    </main>
  );
}