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
import { EditIcon } from "lucide-react";
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

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  

  if (!page) notFound();
  const MDX = page.data.body;

  const path = `content/docs/${page.file.path}`;
  // const lastModified = await getLastModified(page);

  const footer = (
    <a
      href={`https://github.com/subhadeeproy3902/mvpblocks/blob/main/${path}`}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        buttonVariants({
          variant: "secondary",
          size: "sm",
          className: "gap-1.5 text-xs",
        }),
      )}
    >
      <EditIcon className="size-3" />
      Edit on Github
    </a>
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
        // lastUpdate={lastModified ? new Date(lastModified) : undefined}
      >
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
        </DocsBody>
      </DocsPage>
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
    }),
  );
}