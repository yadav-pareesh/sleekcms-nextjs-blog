import sleek from '@/lib/sleek';
import Link from 'next/link';

export default async function Home() {
  let data = { title: 'My site' };
  let blogPosts = [];

  try {
    if (sleek) {
      const allContent = await sleek.getContent();
      const homePage = allContent.pages?.find((page => page._path === '/'));
      const blogPostsPage = allContent.pages?.filter((page => page._path.includes('/blog/')));
      if (homePage && typeof homePage === 'object') data = homePage;
      if (Array.isArray(blogPostsPage)) blogPosts = blogPostsPage;
      else if (blogPostsPage && Array.isArray(blogPostsPage.results)) blogPosts = blogPostsPage.results;
    } else {
      console.error('sleek client methods not available', sleek);
    }
  } catch (err) {
    console.error('Error in Home while calling sleek client:', err);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="max-w-2xl w-full text-center space-y-8">
        

        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            {data.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
           {data.description || 'Welcome to my sleek blog!'}
          </p>
        </div>

        {blogPosts.length === 0 ? (
          <p className="text-center text-gray-500">No posts available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {blogPosts.map((post) => (
              <Link key={post._id} href={post._path} className="group">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                  {post.image?.url && (
                    <div className="relative h-56">
                      <img
                        src={post.image.url}
                        alt={post.image.description || post.title}
                        className="w-full h-56 object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <time className="text-sm text-gray-500 block mb-2">
                      {post._meta?.updated_at
                        ? new Date(post._meta.updated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : ''}
                    </time>
                    <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h2>
                    <div
                      className="mt-3 text-gray-600 line-clamp-3 prose-sm"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}