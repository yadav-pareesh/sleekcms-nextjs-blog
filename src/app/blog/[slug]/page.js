import sleek from '@/lib/sleek';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 1. Generate Static Routes
export async function generateStaticParams() {
  try {
    const blogPages = await sleek.findPages('/blog/');

    // Safeguard: Ensure blogPages is an array
    if (!Array.isArray(blogPages)) {
      console.error('findPages did not return an array:', blogPages);
      return []; // Vercel build continues, but no static pages generated
    }

    const slugs = blogPages
      .map((page) => {
        // Extra safety: skip if page is not an object
        if (!page || typeof page !== 'object') return null;

        const path = page._path || page.path || page._slug || page.slug || '';
        if (typeof path !== 'string') return null;

        if (path.startsWith('/blog/')) {
          return path.replace('/blog/', '').replace(/\/$/, '');
        }

        // Fallback
        if (typeof page._slug === 'string') return page._slug;
        if (typeof page.slug === 'string') return page.slug;

        return null;
      })
      .filter((slug) => typeof slug === 'string' && slug.length > 0);

    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return []; // Allow build to succeed
  }
}

// 2. The Page Component
export default async function BlogPost({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    console.error('Slug is undefined:', resolvedParams);
    return notFound();
  }

  const path = `/blog/${slug}`;

  try {
    const data = await sleek.findPages(path);

    // Safeguard: handle non-array response
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.error('No data found for path:', path);
      return notFound();
    }

    const pageData = Array.isArray(data) ? data[0] : data;

    return (
      <article className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-indigo-600 hover:underline mb-12 inline-block">
          ← Back to home
        </Link>
        <div className="max-w-3xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
              {pageData.title || 'Untitled Post'}
            </h1>

            {pageData.image?.url && (
              <div className="relative w-full h-64 sm:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={pageData.image.url}
                  alt={pageData.title || 'Blog post image'}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </header>

          <div
            className="prose prose-lg prose-blue mx-auto text-gray-700"
            dangerouslySetInnerHTML={{ __html: pageData.content || '<p>No content available</p>' }}
          />
        </div>
      </article>
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return notFound();
  }
}