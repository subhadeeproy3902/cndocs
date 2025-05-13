"use client";

import {
  Activity,
  MessageCircle,
  Network,
  Code,
  Shield,
  Wifi,
  Server,
  Layers,
  Terminal,
  Database,
} from "lucide-react";
import DottedMap from "dotted-map";
import { Area, AreaChart, CartesianGrid } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function FeaturesSection() {
  return (
    <section className="relative px-4 sm:mt-16 pt-0 pb-16 sm:pt-16 md:py-32">
      {/* Background gradient blurs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent rounded-full blur-[100px] opacity-50 -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-lime-500/20 via-green-500/10 to-transparent rounded-full blur-[80px] opacity-40 -z-10" />

      {/* Section Heading */}
      <div className="relative text-center mb-16 pt-14 overflow-hidden">
        <div className="absolute -top-10 left-1/2 h-16 w-44 -translate-x-1/2 select-none rounded-full bg-primary opacity-40 blur-3xl"></div>
        <div className="absolute left-1/2 top-0 h-px w-3/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-all ease-in-out"></div>
        <h2 className="text-4xl md:text-5xl mb-4">
          Features
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive tools and resources for mastering computer networking
          concepts and socket programming
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl border md:grid-cols-2 rounded-lg shadow-sm bg-background/50 backdrop-blur-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="group transition-all">
          <div className="p-6 sm:p-12 relative z-10 bg-gradient-to-b from-transparent to-background">
            <span className="text-muted-foreground flex items-center gap-2">
              <Network className="size-4 text-primary" />
              <span className="font-medium text-primary">
                Network Topology Visualization
              </span>
            </span>

            <p className="mt-8 text-2xl font-semibold">
              Explore network structures with interactive visualizations and
              diagrams.
            </p>
          </div>

          <div aria-hidden className="relative">
            <div className="absolute inset-0 z-10 m-auto size-fit">
              <div className="rounded-(--radius) bg-background z-1 dark:bg-muted relative flex size-fit w-fit items-center gap-2 border px-3 py-1 text-xs font-medium shadow-md shadow-zinc-950/5">
                <span className="text-lg">🇨🇩</span>
                Connected to Cndocs
              </div>
              <div className="rounded-(--radius) bg-background absolute inset-2 -bottom-2 mx-auto border px-3 py-4 text-xs font-medium shadow-md shadow-zinc-950/5 dark:bg-zinc-900"></div>
            </div>

            <div className="relative overflow-hidden">
              <div className="bg-radial z-1 to-background absolute inset-0 from-transparent to-75%"></div>
              <Map />
            </div>
          </div>
        </div>
        <div className="overflow-hidden border-t bg-zinc-50 p-6 sm:p-12 md:border-0 md:border-l dark:bg-transparent group transition-all">
          <div className="relative z-10">
            <span className="text-muted-foreground flex items-center gap-2">
              <MessageCircle className="size-4 text-primary" />
              <span className="font-medium text-primary">
                Socket Programming Support
              </span>
            </span>

            <p className="my-8 text-2xl font-semibold">
              Get expert guidance on client-server implementations and
              protocols.
            </p>
          </div>
          <div aria-hidden className="flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-2">
                <img src="/logo.webp" alt="Cndocs Logo" className="size-6" />
                <span className="text-muted-foreground text-xs">Today</span>
              </div>
              <div className="rounded-(--radius) bg-background mt-1.5 w-3/5 border border-primary/10 p-3 text-xs font-mono transition-all group-hover:border-primary/30">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Question
                </span>
                <div>How do I implement a TCP server in C?</div>
              </div>
            </div>

            <div>
              <div className="rounded-(--radius) mb-1 ml-auto w-3/5 bg-primary p-3 text-xs text-black font-mono font-bold">
                <span className="opacity-70">Answer</span>
                <div className="mt-1">
                  socket(), bind(), listen(), accept(), read/write, close()
                </div>
              </div>
              <span className="text-muted-foreground block text-right text-xs">
                Just now
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-full border-y p-12 relative group transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-muted-foreground">
                System Status: Operational
              </span>
            </div>
            <p className="text-center text-4xl font-semibold lg:text-7xl bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              99.99% Uptime
            </p>
            <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block size-2 rounded-full bg-green-500/80"></span>
                TCP/IP Services
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block size-2 rounded-full bg-green-500/80"></span>
                Socket API
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block size-2 rounded-full bg-green-500/80"></span>
                Documentation
              </span>
            </div>
          </div>
        </div>
        <div className="relative col-span-full group transition-all">
          <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              <span className="font-medium text-primary">
                Network Traffic Analysis
              </span>
            </span>

            <p className="my-8 text-2xl font-semibold">
              Monitor your network traffic in real-time.{" "}
              <span className="text-muted-foreground">
                {" "}
                Identify bottlenecks and optimize performance.
              </span>
            </p>
          </div>
          <MonitoringChart />
        </div>

        {/* New Row - Protocol Stack */}
        <div className="col-span-full border-t grid md:grid-cols-2">
          <div className="group transition-all p-6 sm:p-12 border-b md:border-b-0 md:border-r">
            <span className="text-muted-foreground flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <span className="font-medium text-primary">
                Protocol Stack Visualization
              </span>
            </span>

            <p className="my-8 text-2xl font-semibold">
              Understand the TCP/IP and OSI models with detailed layer
              explanations.
            </p>

            <div className="space-y-3 mt-8">
              {[
                {
                  name: "Application",
                  color:
                    "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
                },
                {
                  name: "Transport",
                  color:
                    "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
                },
                {
                  name: "Network",
                  color:
                    "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400",
                },
                {
                  name: "Link",
                  color:
                    "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400",
                },
                {
                  name: "Physical",
                  color:
                    "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
                },
              ].map((layer, i) => (
                <div
                  key={layer.name}
                  className="flex items-center gap-3 group-hover:translate-x-1 transition-transform"
                >
                  <div
                    className={`h-8 rounded flex items-center justify-center px-3 text-sm font-medium ${layer.color}`}
                  >
                    {layer.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Layer {5 - i}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="group transition-all p-6 sm:p-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <Terminal className="size-4 text-primary" />
              <span className="font-medium text-primary">
                Command Line Tools
              </span>
            </span>

            <p className="my-8 text-2xl font-semibold">
              Master essential networking commands for troubleshooting and
              analysis.
            </p>

            <div className="mt-8 rounded-lg overflow-hidden border">
              <div className="bg-zinc-950 p-4 font-mono text-xs text-white">
                <div className="flex items-center gap-2 mb-3 text-zinc-400">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-red-500"></div>
                    <div className="size-3 rounded-full bg-yellow-500"></div>
                    <div className="size-3 rounded-full bg-green-500"></div>
                  </div>
                  <div>Terminal</div>
                </div>
                <div className="flex">
                  <span className="text-green-400">user@server</span>
                  <span className="text-white">:</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-white">$ </span>
                  <span className="ml-1 group-hover:text-green-400 transition-colors">
                    traceroute example.com
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div>
                    traceroute to example.com (93.184.216.34), 30 hops max, 60
                    byte packets
                  </div>
                  <div>
                    <span className="text-green-400">1</span> router.local
                    (192.168.1.1) 2.456 ms
                  </div>
                  <div>
                    <span className="text-green-400">2</span> isp-gateway.net
                    (10.10.10.1) 12.054 ms
                  </div>
                  <div>
                    <span className="text-green-400">3</span>{" "}
                    core-router-1.isp.net (82.14.23.1) 18.333 ms
                  </div>
                  <div>
                    <span className="text-green-400">4</span>{" "}
                    core-router-2.isp.net (82.14.23.17) 19.456 ms
                  </div>
                  <div>
                    <span className="text-green-400">5</span>{" "}
                    edge-router.cdn.net (93.184.216.1) 22.876 ms
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Row - Security & IPC */}
        <div className="col-span-full border-t grid md:grid-cols-2">
          <div className="group transition-all p-6 sm:p-12 border-b md:border-b-0 md:border-r">
            <span className="text-muted-foreground flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              <span className="font-medium text-primary">Network Security</span>
            </span>

            <p className="my-8 text-2xl font-semibold">
              Learn essential security protocols and encryption techniques.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm">
                <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                  <span className="text-lg">🔒</span>
                </div>
                <h4 className="font-medium mb-1">SSL/TLS</h4>
                <p className="text-xs text-muted-foreground">
                  Secure communication protocols for data encryption
                </p>
              </div>
              <div className="rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm">
                <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                  <span className="text-lg">🔑</span>
                </div>
                <h4 className="font-medium mb-1">Authentication</h4>
                <p className="text-xs text-muted-foreground">
                  Verify identity and control access to resources
                </p>
              </div>
              <div className="rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm">
                <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <span className="text-lg">🛡️</span>
                </div>
                <h4 className="font-medium mb-1">Firewalls</h4>
                <p className="text-xs text-muted-foreground">
                  Filter network traffic based on security rules
                </p>
              </div>
              <div className="rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm">
                <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3">
                  <span className="text-lg">🔍</span>
                </div>
                <h4 className="font-medium mb-1">Intrusion Detection</h4>
                <p className="text-xs text-muted-foreground">
                  Monitor networks for suspicious activities
                </p>
              </div>
            </div>
          </div>

          <div className="group transition-all p-6 sm:p-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <Database className="size-4 text-primary" />
              <span className="font-medium text-primary">
                Inter-Process Communication
              </span>
            </span>

            <p className="my-8 text-2xl font-semibold">
              Explore methods for communication between processes on networked
              systems.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg border transition-all hover:border-primary/50 hover:shadow-sm">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Code className="size-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Message Queues</h4>
                  <p className="text-sm text-muted-foreground">
                    Asynchronous communication with buffered messages
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg border transition-all hover:border-primary/50 hover:shadow-sm">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Server className="size-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Shared Memory</h4>
                  <p className="text-sm text-muted-foreground">
                    Fast communication through common memory regions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg border transition-all hover:border-primary/50 hover:shadow-sm">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Wifi className="size-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Sockets</h4>
                  <p className="text-sm text-muted-foreground">
                    Network communication endpoints for data exchange
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const map = new DottedMap({ height: 55, grid: "diagonal" });

const points = map.getPoints();

const svgOptions = {
  backgroundColor: "var(--color-background)",
  color: "currentColor",
  radius: 0.15,
};

const Map = () => {
  const viewBox = `0 0 120 60`;
  return (
    <svg viewBox={viewBox} style={{ background: svgOptions.backgroundColor }}>
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={svgOptions.radius}
          fill={svgOptions.color}
        />
      ))}
    </svg>
  );
};

const chartConfig = {
  desktop: {
    label: "TCP Traffic",
    color: "#36b44b", // Green color matching our theme
  },
  mobile: {
    label: "UDP Traffic",
    color: "#75ff91", // Lighter green color matching our theme
  },
} satisfies ChartConfig;

const chartData = [
  { month: "May", desktop: 56, mobile: 224 },
  { month: "June", desktop: 56, mobile: 224 },
  { month: "January", desktop: 126, mobile: 252 },
  { month: "February", desktop: 205, mobile: 410 },
  { month: "March", desktop: 200, mobile: 126 },
  { month: "April", desktop: 400, mobile: 800 },
];

const MonitoringChart = () => {
  return (
    <ChartContainer className="h-120 aspect-auto md:h-96" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 0,
          right: 0,
        }}
      >
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.8}
            />
            <stop
              offset="55%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.8}
            />
            <stop
              offset="55%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          active
          cursor={false}
          content={<ChartTooltipContent className="dark:bg-muted" />}
        />
        <Area
          strokeWidth={2}
          dataKey="mobile"
          type="stepBefore"
          fill="url(#fillMobile)"
          fillOpacity={0.1}
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          strokeWidth={2}
          dataKey="desktop"
          type="stepBefore"
          fill="url(#fillDesktop)"
          fillOpacity={0.1}
          stroke="var(--color-desktop)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};
