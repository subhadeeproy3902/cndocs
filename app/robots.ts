export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: "https://cndocs.vercel.app",
    sitemap: "https://cndocs.vercel.app/sitemap.xml",
  };
}