import {
  Github,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Linkedin,
  BookOpen,
  Code,
  Network,
  Shield,
  Server,
} from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/subhadeeproy3902/cndocs" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com/mvp_Subha" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

const documentationLinks = [
  { text: "Networking Fundamentals", href: "/docs/fundamentals" },
  { text: "Socket Programming", href: "/docs/socket-programming" },
  { text: "TCP/IP Model", href: "/docs/fundamentals/tcp" },
  { text: "Code Examples", href: "/docs/code-in-action" },
];

const resourceLinks = [
  { text: "Network Topologies", href: "/docs/fundamentals/network-topologies" },
  { text: "Socket API Reference", href: "/docs/socket-programming/socket-fundamentals" },
  { text: "IPC Mechanisms", href: "/docs/socket-programming/ipc" },
  { text: "Security Best Practices", href: "/docs/socket-programming/socket-fundamentals/best-practices" },
];

const helpfulLinks = [
  { text: "FAQs", href: "#faq" },
  { text: "GitHub Issues", href: "https://github.com/subhadeeproy3902/cndocs/issues" },
  { text: "Contribute", href: "https://github.com/subhadeeproy3902/cndocs/blob/main/README.md", hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: "contact@cndocs.dev" },
  { icon: Github, text: "subhadeeproy3902", href: "https://github.com/subhadeeproy3902" },
  { icon: MapPin, text: "Kolkata, India", isAddress: true },
];

export default function Footer4Col() {
  return (
    <footer className="mt-16 w-full place-self-end rounded-t-xl bg-secondary dark:bg-secondary/20">
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-center gap-2 text-primary sm:justify-start">
              <img src="/logo.webp" alt="Cndocs Logo" className="size-8" />
              <span className="bg-primary from-foreground via-green-200 to-primary bg-clip-text text-2xl font-semibold text-transparent dark:bg-gradient-to-b">
                Cndocs
              </span>
            </div>

            <p className="mt-6 max-w-md text-center leading-relaxed text-foreground/50 sm:max-w-xs sm:text-left">
              Comprehensive documentation for computer networking and socket programming.
              Learn, build, and master networking concepts with practical examples.
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-primary transition hover:text-primary/80"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                Documentation
              </p>

              <ul className="mt-8 space-y-4 text-sm">
                {documentationLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-secondary-foreground/70 transition hover:text-primary"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium flex items-center gap-2">
                <Code className="size-5 text-primary" />
                Resources
              </p>

              <ul className="mt-8 space-y-4 text-sm">
                {resourceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-secondary-foreground/70 transition hover:text-primary"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                Support
              </p>

              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <Link
                      href={href}
                      className={`${
                        hasIndicator
                          ? "group flex justify-center gap-1.5 sm:justify-start"
                          : "text-secondary-foreground/70 transition hover:text-primary"
                      }`}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      <span className="text-secondary-foreground/70 transition group-hover:text-primary">
                        {text}
                      </span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-secondary-foreground/70">
              <span className="block sm:inline">All rights reserved.</span>
            </p>

            <p className="text-secondary-foreground/70 mt-4 text-sm transition sm:order-first sm:mt-0">
              &copy; {new Date().getFullYear()} CNdocs
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
