"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MinusIcon, PlusIcon } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "pricing" | "technical" | "support";
}

const faqItems: FaqItem[] = [
  {
    id: "1",
    question: "What is CNdocs?",
    answer: "CNdocs is a comprehensive documentation platform for computer networking and socket programming. It provides clear explanations, practical examples, and code samples to help students and professionals master networking concepts and implementation.",
    category: "general",
  },
  {
    id: "2",
    question: "Is CNdocs free to use?",
    answer: "Yes, CNdocs is completely free and open-source. You can use all our documentation, examples, and code samples for personal, educational, and commercial projects without any restrictions.",
    category: "general",
  },
  {
    id: "3",
    question: "Do I need prior networking knowledge to use CNdocs?",
    answer: "No, CNdocs is designed for learners at all levels. We start with fundamental concepts and progressively move to more advanced topics, making it accessible for beginners while still providing valuable resources for experienced professionals.",
    category: "general",
  },
  {
    id: "4",
    question: "How can I run the code examples provided in CNdocs?",
    answer: "All code examples can be run on standard Unix/Linux systems or Windows with appropriate development tools installed. Each example includes compilation and execution instructions. For socket programming examples, you'll need a C compiler like gcc or clang.",
    category: "technical",
  },
  {
    id: "5",
    question: "Does CNdocs cover both theoretical concepts and practical implementation?",
    answer: "Absolutely! CNdocs bridges the gap between theory and practice. We explain networking concepts thoroughly and then demonstrate their implementation with real-world code examples and projects.",
    category: "technical",
  },
  {
    id: "6",
    question: "Does CNdocs support both light and dark modes?",
    answer: "Yes, CNdocs is designed to work seamlessly with both light and dark modes. The documentation automatically adapts to your preferred theme settings for comfortable reading in any environment.",
    category: "technical",
  },
  {
    id: "7",
    question: "How often is new content added to CNdocs?",
    answer: "We regularly update and expand our documentation with new topics, examples, and projects. Our goal is to provide the most comprehensive and up-to-date resource for networking and socket programming.",
    category: "general",
  },
  {
    id: "8",
    question: "How can I contribute to CNdocs?",
    answer: "We welcome contributions! You can contribute by improving existing documentation, adding new examples, fixing errors, or suggesting new topics. Check our GitHub repository for contribution guidelines.",
    category: "support",
  },
  {
    id: "9",
    question: "Does CNdocs cover network security topics?",
    answer: "Yes, CNdocs includes sections on network security principles, secure socket programming, encryption techniques, and best practices for building secure networked applications.",
    category: "technical",
  },
  {
    id: "10",
    question: "Are there complete projects I can study and modify?",
    answer: "Yes, CNdocs includes several complete networking projects with full source code, including message queues, client-server applications, and inter-process communication examples that you can study, modify, and use in your own work.",
    category: "technical",
  },
];

const categories = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "technical", label: "Technical" },
  { id: "pricing", label: "Pricing" },
  { id: "support", label: "Support" },
];

export default function Faq2() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFaqs = activeCategory === "all"
    ? faqItems
    : faqItems.filter(item => item.category === activeCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col items-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-xs font-medium uppercase tracking-wider border-primary"
          >
            FAQs
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>

          <p className="text-muted-foreground text-center max-w-2xl">
            Find answers to common questions about CNdocs and how to use our documentation to master networking concepts and socket programming.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "border border-border rounded-xl overflow-hidden h-fit",
                  expandedId === faq.id ? "bg-card/50 shadow-3xl" : "bg-card/50"
                )}
                style={{ minHeight: '88px' }}
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="text-lg font-medium text-foreground">{faq.question}</h3>
                  <div className="ml-4 flex-shrink-0">
                    {expandedId === faq.id ? (
                      <MinusIcon className="h-5 w-5 text-primary" />
                    ) : (
                      <PlusIcon className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-border">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary rounded-lg font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
}