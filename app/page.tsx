import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import GradientBlur from "@/components/GradientBlur";
import { ArrowRight, Github } from "lucide-react";
import { SparklesText } from "@/components/ui/sparkles-text";
import FeaturesSection from "@/components/Features";
import Testimonials from "@/components/testimonials-marquee";
import Faq2 from "@/components/faq-2";
import Footer4Col from "@/components/footer";
import { NavbarDemo } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <NavbarDemo />
      <GradientBlur />
      <div
        className="absolute inset-x-0 top-[360px] h-[250px]"
        style={{
          background: `
            repeating-linear-gradient(
              to right,
              color-mix(in oklab, var(--color-fd-primary) 10%, transparent),
              color-mix(in oklab, var(--color-fd-primary) 10%, transparent) 1px,
              transparent 1px,
              transparent 50px
            ),
            repeating-linear-gradient(
              to bottom,
              color-mix(in oklab, var(--color-fd-primary) 10%, transparent),
              color-mix(in oklab, var(--color-fd-primary) 10%, transparent) 1px,
              transparent 1px,
              transparent 50px
            )
          `,
        }}
      ></div>

      <main className="container relative max-w-[1100px] px-2 py-4 lg:py-8 mt-20 min-h-screen sm:min-h-1">
        <div className="relative">
          <div className="relative flex flex-col border border-green-500/10 bg-fd-background/70 backdrop-blur-md px-4 pt-12 max-md:text-center md:px-12 md:pt-16 rounded-xl shadow-xl shadow-green-500/5 items-start justify-start">
            <div
              className="absolute inset-0 z-0 top-1/5 blur-2xl hidden dark:block"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent, white, transparent)",
                background:
                  "repeating-linear-gradient(65deg, var(--color-emerald-400), var(--color-emerald-500) 12px, color-mix(in oklab, var(--color-emerald-600) 30%, transparent) 20px, transparent 200px)",
              }}
            />
            <div
              className="absolute text-left inset-0 z-0 top-1/5 blur-2xl dark:hidden"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent, white, transparent)",
                background:
                  "repeating-linear-gradient(65deg, var(--color-emerald-300), var(--color-emerald-300) 12px, color-mix(in oklab, var(--color-emerald-600) 30%, transparent) 20px, transparent 200px)",
              }}
            />
            <h1 className="mb-4 flex flex-wrap gap-2 text-3xl md:text-5xl font-medium leading-tight">
              Master{" "}
              <SparklesText
                colors={{
                  first: "#ed5ade",
                  second: "#5aedda",
                }}
              >
                Network Programming
              </SparklesText>{" "}
              with Confidence
            </h1>
            <p className="mb-8 text-left text-muted-foreground md:max-w-[80%] md:text-xl">
              Your comprehensive platform for learning socket programming,
              protocols, and network architecture. From TCP/IP fundamentals to
              advanced client-server implementations with detailed examples and
              visualizations.
            </p>
            <div className="flex flex-wrap gap-4 mb-6 md:flex-row">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Socket Programming</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>TCP/IP Model</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Client-Server Architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Advanced Codes</span>
              </div>
            </div>

            <div className="inline-flex justify-start z-10 mt-2 items-center gap-3">
              <Link
                href="/docs/fundamentals"
                className={cn(
                  buttonVariants({
                    size: "lg",
                    className:
                      "rounded-full bg-gradient-to-b from-emerald-400 to-green-400 text-black",
                  })
                )}
              >
                Getting Started <ArrowRight className="size-4" />
              </Link>
              <a
                href="https://github.com/subhadeeproy3902/cndocs"
                target="_blank"
                rel="noreferrer noopener"
                className={cn(
                  buttonVariants({
                    size: "lg",
                    variant: "outline",
                    className: "rounded-full bg-fd-background",
                  })
                )}
              >
                Github <Github className="size-4" />
              </a>
            </div>

            <div className="relative mt-16 z-10 w-full">
              <Image
                src="/bg.png"
                alt="Network programming documentation preview"
                width={1000}
                height={600}
                priority
                className="w-full select-none duration-1000 animate-in fade-in -mb-60 slide-in-from-bottom-12 z-10 lg:-mb-40 rounded-lg mx-auto object-cover border-6 border-neutral-100 dark:border-neutral-600 shadow-2xl"
              />

              {/* Floating badges */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-3 rotate-9 transform animate-in fade-in slide-in-from-left-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="font-medium">Practical Examples</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FeaturesSection />
      <Testimonials />
      <Faq2 />
      <Footer4Col />
    </>
  );
}
