"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";

export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function TestimonialCard({
  description,
  name,
  img,
  role,
  className,
  ...props // Capture the rest of the props
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4",
        // theme styles
        "border border-border bg-card/50 shadow-sm",
        // hover effect
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
      {...props}
    >
      <div className="select-none text-sm font-normal text-muted-foreground">
        {description}
        <div className="flex flex-row py-1">
          <Star className="size-4 fill-primary text-primary" />
          <Star className="size-4 fill-primary text-primary" />
          <Star className="size-4 fill-primary text-primary" />
          <Star className="size-4 fill-primary text-primary" />
          <Star className="size-4 fill-primary text-primary" />
        </div>
      </div>

      <div className="flex w-full select-none items-center justify-start gap-5">
        <Image
          width={40}
          height={40}
          src={img || ""}
          alt={name}
          className="size-10 rounded-full ring-1 ring-primary/20 ring-offset-2"
        />

        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-xs font-normal text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}
const testimonials = [
  {
    name: "Alex Chen",
    role: "Computer Science Professor",
    img: "https://randomuser.me/api/portraits/men/22.jpg",
    description: (
      <p>
        CNdocs has transformed how I teach networking concepts to my students. The clear explanations and practical examples make complex topics accessible. My students consistently praise the socket programming guides.
      </p>
    ),
  },
  {
    name: "Priya Sharma",
    role: "Network Engineer",
    img: "https://randomuser.me/api/portraits/women/33.jpg",
    description: (
      <p>
        As a professional network engineer, I&apos;m impressed by CNdocs&apos; comprehensive coverage of both theoretical concepts and practical implementations. The TCP/IP model explanations are the clearest I&apos;ve seen anywhere.
      </p>
    ),
  },
  {
    name: "Marcus Johnson",
    role: "CS Student at MIT",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    description: (
      <p>
        CNdocs helped me ace my networking course! The interactive visualizations made it easy to understand complex protocols, and the C code examples were invaluable for my lab assignments.
      </p>
    ),
  },
  {
    name: "Emma Wilson",
    role: "DevOps Specialist",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    description: (
      <p>
        The documentation on inter-process communication in CNdocs is exceptional. I reference it regularly in my work. The message queue examples were particularly helpful for a recent project.
      </p>
    ),
  },
  {
    name: "Raj Patel",
    role: "Security Analyst",
    img: "https://randomuser.me/api/portraits/men/55.jpg",
    description: (
      <p>
        CNdocs&apos; explanations of network security principles are outstanding. I appreciate how the documentation connects theoretical concepts with practical implementation details. A must-read resource.
      </p>
    ),
  },
  {
    name: "Sophia Lee",
    role: "Full Stack Developer",
    img: "https://randomuser.me/api/portraits/women/67.jpg",
    description: (
      <p>
        The socket programming tutorials on CNdocs helped me implement real-time features in my web applications. The step-by-step guides and code examples made it easy to follow along and adapt to my needs.
      </p>
    ),
  },
  {
    name: "David Rodriguez",
    role: "Systems Administrator",
    img: "https://randomuser.me/api/portraits/men/78.jpg",
    description: (
      <p>
        CNdocs has become my go-to reference for troubleshooting network issues. The clear explanations of protocols and network architecture have helped me resolve complex problems quickly and efficiently.
      </p>
    ),
  },
  {
    name: "Aisha Khan",
    role: "IoT Developer",
    img: "https://randomuser.me/api/portraits/women/89.jpg",
    description: (
      <p>
        Working with IoT devices requires solid networking knowledge, and CNdocs delivers exactly what I need. The documentation on low-level protocols and efficient communication patterns has been invaluable.
      </p>
    ),
  },
  {
    name: "Thomas Wright",
    role: "Cybersecurity Researcher",
    img: "https://randomuser.me/api/portraits/men/92.jpg",
    description: (
      <p>
        CNdocs provides an excellent foundation for understanding network vulnerabilities. The clear explanations of how protocols work have helped me develop more effective security testing methodologies.
      </p>
    ),
  },
  {
    name: "Mei Lin",
    role: "Computer Engineering Student",
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    description: (
      <p>
        As someone new to networking, CNdocs has been an incredible learning resource. The progression from basic concepts to advanced topics is well-structured, and the visual aids really help with understanding.
      </p>
    ),
  },
];

export default function Testimonials() {
  return (
    <section className="container relative py-10 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 text-center text-4xl font-bold leading-[1.2] tracking-tighter text-foreground md:text-5xl">
          What Our Users Are Saying
        </h2>
        <h3 className="mx-auto mb-8 max-w-lg text-balance text-center text-lg font-medium tracking-tight text-muted-foreground">
          Don&apos;t just take our word for it. Here&apos;s what{" "}
          <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
            students
          </span>{" "}
          are saying about{" "}
          <span className="font-semibold text-primary">Cndocs</span>
        </h3>
      </motion.div>
 
      <div className="relative mt-6 max-h-screen max-w-7xl mx-auto overflow-hidden rounded-xl">
        <div className="gap-4 md:columns-2 xl:columns-3">
          {Array(Math.ceil(testimonials.length / 3))
            .fill(0)
            .map((_, i) => (
              <Marquee
                vertical
                key={i}
                className={cn({
                  "[--duration:60s]": i === 1,
                  "[--duration:30s]": i === 2,
                  "[--duration:70s]": i === 3,
                  "[--duration:50s]": i === 4,
                })}
              >
                {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: Math.random() * 0.8,
                      duration: 1.2,
                    }}
                  >
                    <TestimonialCard {...card} />
                  </motion.div>
                ))}
              </Marquee>
            ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-background from-20%"></div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-background from-20%"></div>
      </div>
    </section>
  );
}