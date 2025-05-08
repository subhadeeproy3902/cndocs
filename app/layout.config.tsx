import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import {
  AlbumIcon,
  Globe,
  Code,
} from "lucide-react";
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
  links: [
    {
      text: "Introduction",
      url: "/docs/introduction",
      active: "nested-url",
      icon: <AlbumIcon />,
    },
    {
      text: "IP",
      url: "/docs/ip",
      active: "nested-url",
      icon: <Globe />,
    },
    {
      text: "Codes",
      url: "/docs/codes",
      active: "nested-url",
      icon: <Code />,
    },
  ],
};