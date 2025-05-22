import { Metadata } from 'next';
import { createMetadata, metadataImage } from '@/lib/metadata';
import QuizClient from '@/components/quiz/quiz-client';
// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug?: string[] } }): Promise<Metadata> {
  // Get the slug from params
  const slug = Array.isArray(params.slug) ? params.slug : params.slug ? [params.slug] : [];

  // Create a title based on the slug
  const pageTitle = slug.length > 0
    ? `${slug[slug.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Quiz`
    : 'Interactive Quiz';

  const description = 'Test your knowledge with this interactive quiz generated from our documentation content.';

  return createMetadata({
    title: pageTitle,
    description,
    openGraph: {
      url: `/quiz/${slug.join('/')}`,
    },
  });
}

export default function QuizPage() {
return (
  <QuizClient />
)
}

// Generate static params for all possible quiz pages
export async function generateStaticParams() {
  return metadataImage.generateParams();
}