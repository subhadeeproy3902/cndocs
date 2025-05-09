import { readFileSync } from "node:fs";
import { ImageResponse } from "next/og";
import { metadataImage } from "@/lib/metadata";

export const runtime = "edge";

export const GET = metadataImage.createAPI((page) => {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(0, 255, 170, 0.2) 0%, transparent 35%), " +
            "radial-gradient(circle at 85% 85%, rgba(0, 255, 170, 0.2) 0%, transparent 35%), " +
            "radial-gradient(circle at 50% 50%, rgba(0, 200, 150, 0.15) 0%, transparent 50%), " +
            "radial-gradient(circle at 80% 20%, rgba(0, 230, 160, 0.1) 0%, transparent 40%)",
          padding: "40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Enhanced blurry gradient patches */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "5%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(0, 255, 170, 0.25) 0%, transparent 70%)",
            filter: "blur(60px)",
            borderRadius: "100%",
            opacity: 0.8,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: "350px",
            height: "350px",
            background:
              "radial-gradient(circle, rgba(0, 200, 150, 0.2) 0%, transparent 70%)",
            filter: "blur(50px)",
            borderRadius: "100%",
            opacity: 0.8,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            right: "20%",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(0, 230, 160, 0.15) 0%, transparent 70%)",
            filter: "blur(45px)",
            borderRadius: "100%",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "30%",
            left: "15%",
            width: "250px",
            height: "250px",
            background:
              "radial-gradient(circle, rgba(0, 180, 140, 0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
            borderRadius: "100%",
            opacity: 0.7,
          }}
        />

        {/* Network grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(0, 255, 170, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 170, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
            opacity: 0.5,
          }}
        />

        {/* Binary code background effect - simplified */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            color: "#00ffaa",
            fontSize: 12,
            lineHeight: 1,
            overflow: "hidden",
            display: "block",
          }}
        >
          01010101010101010101010101
        </div>

        {/* Decorative network nodes */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "20%",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 255, 170, 0.8)",
            boxShadow: "0 0 8px rgba(0, 255, 170, 0.8)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "70%",
            left: "80%",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 255, 170, 0.8)",
            boxShadow: "0 0 8px rgba(0, 255, 170, 0.8)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "60%",
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 255, 170, 0.8)",
            boxShadow: "0 0 8px rgba(0, 255, 170, 0.8)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "80%",
            left: "30%",
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 255, 170, 0.8)",
            boxShadow: "0 0 8px rgba(0, 255, 170, 0.8)",
          }}
        />

        {/* Header with logo and name */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {/* Wifi icon from Lucide - smaller size */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(0, 255, 170, 1)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <path d="M12 20h.01" />
          </svg>

          {/* Cndocs name - now white */}
          <div
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "white",
              textShadow: "0 0 10px rgba(0, 255, 170, 0.3)",
            }}
          >
            Cndocs
          </div>
        </div>

        {/* Decorative circuit board pattern */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            width: "180px",
            height: "180px",
            opacity: 0.1,
            display: "flex",
          }}
        >
          <svg
            width="180"
            height="180"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10,10 L90,10 L90,90 L10,90 Z"
              stroke="rgba(0, 255, 170, 0.8)"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M30,10 L30,90"
              stroke="rgba(0, 255, 170, 0.8)"
              strokeWidth="0.5"
            />
            <path
              d="M50,10 L50,90"
              stroke="rgba(0, 255, 170, 0.8)"
              strokeWidth="0.5"
            />
            <path
              d="M70,10 L70,90"
              stroke="rgba(0, 255, 170, 0.8)"
              strokeWidth="0.5"
            />
            <path
              d="M10,30 L90,30"
              stroke="rgba(0, 255, 170, 0.8)"
              strokeWidth="0.5"
            />
            <path
              d="M10,50 L90,50"
              stroke="rgba(0, 255, 170, 0.8)"
              strokeWidth="0.5"
            />
            <path
              d="M10,70 L90,70"
              stroke="rgba(0, 255, 170, 0.8)"
              strokeWidth="0.5"
            />
            <circle cx="30" cy="30" r="3" fill="rgba(0, 255, 170, 0.8)" />
            <circle cx="50" cy="50" r="3" fill="rgba(0, 255, 170, 0.8)" />
            <circle cx="70" cy="70" r="3" fill="rgba(0, 255, 170, 0.8)" />
            <circle cx="30" cy="70" r="3" fill="rgba(0, 255, 170, 0.8)" />
            <circle cx="70" cy="30" r="3" fill="rgba(0, 255, 170, 0.8)" />
          </svg>
        </div>

        {/* Title with enhanced styling */}
        <div
          style={{
            fontSize: 40,
            fontWeight: "bold",
            background:
              "linear-gradient(to right, rgba(255, 255, 255, 1), rgba(0, 255, 175, 0.8))",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "24px",
            textShadow: "0 0 20px rgba(0, 255, 170, 0.3)",
            textAlign: "center",
            width: "100%",
            position: "relative",
            zIndex: 10,
          }}
        >
          {page.data.title}
        </div>

        {/* Description with enhanced styling */}
        <div
          style={{
            fontSize: 16,
            color: "rgba(255, 255, 255, 0.85)",
            marginTop: "10px",
            textAlign: "center",
            maxWidth: "600px",
            lineHeight: 1.4,
            position: "relative",
            zIndex: 10,
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
          }}
        >
          {page.data.description}
        </div>

        {/* Decorative hexagon pattern */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "30px",
            opacity: 0.2,
            display: "flex",
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50,10 L85,30 L85,70 L50,90 L15,70 L15,30 Z"
              stroke="rgba(0, 255, 170, 0.8)"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M50,30 L67.5,40 L67.5,60 L50,70 L32.5,60 L32.5,40 Z"
              stroke="rgba(0, 255, 170, 0.8)"
              strokeWidth="0.5"
              fill="none"
            />
            <circle cx="50" cy="10" r="2" fill="rgba(0, 255, 170, 0.8)" />
            <circle cx="85" cy="30" r="2" fill="rgba(0, 255, 170, 0.8)" />
            <circle cx="85" cy="70" r="2" fill="rgba(0, 255, 170, 0.8)" />
            <circle cx="50" cy="90" r="2" fill="rgba(0, 255, 170, 0.8)" />
            <circle cx="15" cy="70" r="2" fill="rgba(0, 255, 170, 0.8)" />
            <circle cx="15" cy="30" r="2" fill="rgba(0, 255, 170, 0.8)" />
          </svg>
        </div>

        {/* Subtle version indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            fontSize: "10px",
            color: "rgba(0, 255, 170, 0.4)",
          }}
        >
          v2.0
        </div>

        {/* Data flow lines - simplified */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: 0,
            width: "100%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(0, 255, 170, 0.8), transparent)",
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "60%",
            left: 0,
            width: "100%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(0, 255, 170, 0.8), transparent)",
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "40%",
            width: "1px",
            height: "100%",
            background:
              "linear-gradient(180deg, transparent, rgba(0, 255, 170, 0.8), transparent)",
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "70%",
            width: "1px",
            height: "100%",
            background:
              "linear-gradient(180deg, transparent, rgba(0, 255, 170, 0.8), transparent)",
            opacity: 0.3,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
});

export function generateStaticParams() {
  return metadataImage.generateParams();
}
