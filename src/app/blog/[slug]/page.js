import sleek from '@/lib/sleek';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const blogPages = await sleek.findPages('/blog/');

    const slugs = blogPages
      .map((page) => {
        const path = page._path || page.path || page._slug || page.slug || '';
        if (path.startsWith('/blog/')) {
          return path.replace('/blog/', '').replace(/\/$/, '');
        }
        if (page.slug && typeof page.slug === 'string') {
          return page.slug;
        }
        return null;
      })
      .filter((slug) => typeof slug === 'string' && slug.length > 0);

    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function BlogPost({ params }) {
  const resolvedParams = await params;

  const slug = resolvedParams?.slug;

  if (!slug) {
    console.error('Slug is undefined after awaiting params:', resolvedParams);
    return notFound();
  }

  const path = `/blog/${slug}`;

  try {
    const data = await sleek.findPages(path);

    if (!data || data.length === 0) {
      console.error('No data found for path:', path);
      return notFound();
    }

    const pageData = data[0];

    return (
      <article className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-indigo-600 hover:underline mb-12 inline-block">
          ← Back to home
        </Link>
        <div className="max-w-3xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
              {pageData.title}
            </h1>

            {pageData.image?.url && (
              <div className="relative w-full h-64 sm:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={pageData.image.url} 
                  alt={pageData.title} 
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