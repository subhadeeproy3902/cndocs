import type { ReactNode } from "react";
import { baseOptions } from "../layout.config";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
        <div className="absolute left-1/2 top-0 ml-[-30rem] h-[27rem] w-[85rem] dark:[mask-image:linear-gradient(white,transparent)]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#36b44b] to-[#75ff91] opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-[#3ac25c]/30 dark:to-[#7cfc84]/30 dark:opacity-100">
            <svg
              aria-hidden="true"
              className="dark:fill-white/2.5 absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 mix-blend-overlay dark:stroke-white/5"
            >
              <defs>
                <pattern
                  id=":r26:"
                  width="72"
                  height="56"
                  patternUnits="userSpaceOnUse"
                  x="-12"
                  y="4"
                >
                  <path d="M.5 56V.5H72" fill="none"></path>
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                strokeWidth="0"
                fill="url(#:r26:)"
              ></rect>
              <svg x="-12" y="4" className="overflow-visible">
                <rect
                  strokeWidth="0"
                  width="73"
                  height="57"
                  x="288"
                  y="168"
                ></rect>
                <rect
                  strokeWidth="0"
                  width="73"
                  height="57"
                  x="144"
                  y="56"
                ></rect>
                <rect
                  strokeWidth="0"
                  width="73"
                  height="57"
                  x="504"
                  y="168"
                ></rect>
                <rect
                  strokeWidth="0"
                  width="73"
                  height="57"
                  x="720"
                  y="336"
                ></rect>
              </svg>
            </svg>
          </div>
          <svg
            viewBox="0 0 1113 440"
            aria-hidden="true"
            className="absolute left-1/2 top-0 ml-[-19rem] w-[69.5625rem] fill-white blur-[26px] dark:hidden"
          >
            <path d="M.016 439.5s-9.5-300 434-300S882.516 20 882.516 20V0h230.004v439.5H.016Z"></path>
          </svg>
        </div>
      </div>
      <DocsLayout
        {...baseOptions}
        tree={source.pageTree}
        sidebar={{
          defaultOpenLevel: 1,
          tabs: {
            transform(option, node) {
              const meta = source.getNodeMeta(node);
              console.log(meta);
              if (!meta) return option;

              return {
                ...option,
                icon: (
                  <div
                    className="rounded-md border bg-gradient-to-t from-fd-background/80 p-1 shadow-md [&_svg]:size-5"
                    style={{
                      color: `hsl(var(--${meta.file.dirname}-color))`,
                      backgroundColor: `hsl(var(--${meta.file.dirname}-color)/.3)`,
                    }}
                  >
                    {node.icon}
                  </div>
                ),
              };
            },
          },
        }}
      >
        {children}
      </DocsLayout>
    </>
  );
}
