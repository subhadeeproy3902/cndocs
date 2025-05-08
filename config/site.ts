export const siteLink =
  process.env.NODE_ENV !== "development"
    ? "https://cn.mvp-subha.me"
    : "http://localhost:3000";
export const siteName = "MVPBlocks";
export const launched = true;
export const siteConfig = {
  name: "CN Docs",
  url: "https://cn.mvp-subha.me",
  ogImage: "/og.png",
  description:
    "CN Docs serves as a comprehensive guide for students and enthusiasts diving into the world of computer networking. It covers essential theoretical concepts like the OSI and TCP/IP models, network devices, and IP addressing, while also providing practical insights through hands-on topics such as socket programming, inter-process communication (IPC), network troubleshooting, and data link layer mechanisms like flow and error control. Whether you're preparing for labs or building real-world networking applications, this guide bridges the gap between theory and implementation.",
  links: {
    twitter: "https://x.com/mvp_Subha",
    github: "https://github.com/subhadeeproy3902/cndocs",
  },
  keywords: [
    "computer networking",
    "OSI model",
    "TCP/IP model",
    "network devices",
    "IP addressing",
    "socket programming",
    "inter-process communication",
    "IPC",
    "network troubleshooting",
    "data link layer",
    "flow control",
    "error control",
    "CN Docs",
  ],
  author: {
    name: "Subhadeep Roy",
    url: "https://github.com/subhadeeproy3902",
  },
  creator: "CN Docs",
  publisher: "CN Docs",
  locale: "en-US",
  category: "technology",
};

export type SiteConfig = typeof siteConfig;