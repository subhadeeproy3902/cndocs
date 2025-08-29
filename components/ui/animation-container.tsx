"use client";
import { useState, useEffect, useRef, ReactNode } from "react";

interface AnimationContainerProps {
    children: ReactNode;
    className?: string;
    animationDuration?: number;
    animationType?: "full" | "fade";
    style?: React.CSSProperties;
}

const AnimationContainer = ({
    children,
    className = "w-full h-fit flex flex-col gap-6",
    animationDuration = 800,
    animationType = "full",
    style,
}: AnimationContainerProps) => {
    const animationClass =
        animationType === "full"
            ? "animation-container"
            : "animation-container-fade";
    const [activeClass, setActiveClass] = useState(animationClass);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveClass("");
        }, animationDuration);

        return () => clearTimeout(timer);
    }, [animationDuration]);

    return (
        <div
            ref={containerRef}
            className={`${className} ${activeClass}`.trim()}
            style={style}
        >
            {children}
        </div>
    );
};

export default AnimationContainer;