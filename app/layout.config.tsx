import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

export const baseOptions: BaseLayoutProps = {
  githubUrl: "https://github.com/subhadeeproy3902/cndocs",
  nav: {
    title: (
      <div className="flex items-center justify-center gap-2">
        <Image src="/logo.webp" alt="logo" width={32} height={32} className="h-8 w-8 rounded-full" />
        <span className="text-2xl font-semibold text-foreground md:text-xl">
          Cndocs
        </span>
      </div>
    ),
    transparentMode: "top",
  },
};