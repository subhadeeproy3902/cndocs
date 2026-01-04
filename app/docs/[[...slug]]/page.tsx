import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { createMetadata, metadataImage } from "@/lib/metadata";
import { EditIcon, AlertCircle, Lightbulb, FileText, MessagesSquare } from "lucide-react";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Callout } from "fumadocs-ui/components/callout";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { File, Folder, Files } from "fumadocs-ui/components/files";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { MDXComponents } from "mdx/types";
import { type ComponentProps, type FC } from "react";
import type { Metadata } from "next";
import DocActions from "@/components/doc-actions";
import AudioPlayerWrapper from "@/components/audio-player-wrapper";
import { LLMCopyButton, ViewOptions } from "@/components/actions";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);


  if (!page) notFound();
  const MDX = page.data.body;

  const path = `content/docs/${page.file.path}`;
  const lastModified = page.data.lastModified;

  const footer = (
    <div className="flex flex-col space-y-2">
      <h3 className="mb-1 font-medium">Contribute</h3>
      <div className="flex flex-col space-y-2">
        <a
          href="https://github.com/subhadeeproy3902/cndocs/issues/new?labels=documentation&template=documentation_request.md"
          target="_blank"
          rel="noreferrer noopener"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          <FileText className="size-4 text-primary" />
          Request a doc
        </a>
        <a
          href="https://github.com/subhadeeproy3902/cndocs/issues/new?labels=bug&template=bug_report.md"
          target="_blank"
          rel="noreferrer noopener"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          <AlertCircle className="size-4 text-red-500" />
          Report a bug
        </a>
        <a
          href="https://github.com/subhadeeproy3902/cndocs/discussions/4"
          target="_blank"
          rel="noreferrer noopener"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          <MessagesSquare className="size-4 text-blue-500" />
          View discussion
        </a>
        <a
          href={`https://github.com/subhadeeproy3902/cndocs/blob/main/${path}`}
          target="_blank"
          rel="noreferrer noopener"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          <EditIcon className="size-4 text-gray-500" />
          Edit this page
        </a>
      </div>
    </div>
  );

  return (
    <DocsPage
      breadcrumb={{}}
      article={{
        className: "max-w-5xl max-sm:pb-16",
      }}
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        footer,
        single: false,
        style: "clerk",
      }}
      lastUpdate={lastModified ? new Date(lastModified) : undefined}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-2">
        {page.data.description}
      </DocsDescription>
      <div className="mb-4 flex gap-2">
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`https://github.com/subhadeeproy3902/cndocs/tree/main/content/docs/${page.slugs.join("/")}.mdx`}
        />
      </div>
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            ...((await import("lucide-react")) as unknown as MDXComponents),
            Tabs,
            Tab,
            TypeTable,
            Accordion,
            a: ({ href, ...props }) => {
              return (
                // Primary color not underlined
                <a
                  href={href}
                  className="text-primary no-underline"
                  {...props}
                />
              );
            },
            Accordions,
            File,
            Folder,
            Files,
            blockquote: Callout as unknown as FC<
              ComponentProps<"blockquote">
            >,
          }}
        />

      </DocsBody >
      <DocActions title={page.data.title} path={path} />
    </DocsPage >
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const description =
    page.data.description ?? "All your MVP blocks needs in one place!";

  return createMetadata(
    metadataImage.withImage(page.slugs, {
      title: page.data.title,
      description,
      openGraph: {
        url: `/docs/${page.slugs.join("/")}`,
      },
      twitter: {
        card: "summary_large_image",
        site: "@subhadeeproy3902",
        creator: "@subhadeeproy3902",
        images: [
          metadataImage.getImageMeta(page.slugs).url,
        ]
      },
    }),
  );
}