import sleek from '@/lib/sleek';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// 1. Generate Static Routes for all blog posts
export async function generateStaticParams() {
  // Returns an array of slugs, e.g., ['hello-world', 'second-post']
  const slugs = await sleek.getSlugs('/blog/');

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// 2. The Page Component
export default async function BlogPost({ params }) {
  const { slug } = params;
  
  // Construct the full path to fetch data
  const path = `/blog/${slug}`;
  
  try {
    const data = await sleek.getPage(path);

    return (
      <article className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
              {data.title}
            </h1>
            
            {data.image && (
              <div className="relative w-full h-64 sm:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
                {/* Ensure you configure remote patterns in next.config.js for external images */}
                <img 
                  src={data.image} 
                  alt={data.title} 
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg prose-blue mx-auto text-gray-700"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </div>
      </article>
    );
  } catch (error) {
    console.error("Error fetching page:", error);
    return notFound();
  }
}