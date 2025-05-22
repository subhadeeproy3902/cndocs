import { Metadata } from "next";
import { createMetadata, metadataImage } from "@/lib/metadata";
import Qnaclient from "@/components/qnaclient";
// Generate metadata for the page
export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  // Get the slug from params
  const params = await props.params;
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];

  // Create a title based on the slug
  const pageTitle =
    slug.length > 0
      ? `${slug[slug.length - 1]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())} Exam Q&A`
      : "Exam Questions & Answers";

  const description =
    "Practice with exam-style questions and detailed answers generated from our documentation content.";

  return createMetadata({
    title: pageTitle,
    description,
    openGraph: {
      url: `/qna/${slug.join("/")}`,
    },
  });
}

export default function QnAPage() {
  return <Qnaclient />;
}

// Generate static params for all possible QnA pages
export async function generateStaticParams() {
  return metadataImage.generateParams();
}
