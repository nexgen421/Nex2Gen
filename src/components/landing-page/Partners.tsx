"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "~/lib/utils";
import { AnimatedBeam } from "~/components/magicui/animated-beam";
import Image from "next/image";
import HyperText from "../magicui/hyper-text";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex items-center justify-center rounded-full bg-white p-1 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105",
        className,
      )}
      style={{ width: "100px", height: "100px" }}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

function Partners() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <section className="container my-20 flex flex-col items-center">
      <HyperText
        className="text-center text-2xl font-bold tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:text-6xl md:leading-[5rem]"
        text="Our Trusted Partners"
      />
      <div
        className="relative mx-auto flex h-[450px] w-full max-w-4xl items-center justify-center overflow-hidden rounded-3xl p-8 dark:from-gray-900 dark:to-gray-800"
        ref={containerRef}
      >
        <div className="flex size-full max-h-[300] flex-col items-stretch justify-between gap-10">
          <div className="flex flex-row items-center justify-between">
            <Circle ref={div1Ref}>
              <Image
                src="/partners/delhivery.png"
                alt="delhivery"
                height={80}
                width={80}
                className="rounded-full object-contain p-1"
              />
            </Circle>
            <Circle ref={div5Ref}>
              <Image
                src="/partners/ecomexpress.png"
                alt="ecomexpress"
                height={80}
                width={80}
                className="rounded-full object-contain p-1"
              />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={div2Ref}>
              <Image
                src="/partners/shadowfax.png"
                alt="shadowfax"
                height={80}
                width={80}
                className="rounded-full object-contain p-1 invert"
              />
            </Circle>
            <Circle ref={div4Ref} className="border-2 border-primary/20">
              <Image
                src="/logo.png"
                alt="logo"
                height={90}
                width={90}
                className="rounded-full object-contain p-1"
              />
            </Circle>
            <Circle ref={div6Ref}>
              <Image
                src="/partners/xpressbees.png"
                alt="xpressbees"
                height={80}
                width={80}
                className="rounded-full object-contain p-1"
              />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={div3Ref}>
              <Image
                src="/partners/ekart.png"
                alt="ekart"
                height={80}
                width={80}
                className="rounded-full object-contain p-1"
              />
            </Circle>
            <Circle ref={div7Ref}>
              <Image
                src="/partners/amazon-shipping.png"
                alt="amazon-shipping"
                height={80}
                width={80}
                className="rounded-full object-contain p-1"
              />
            </Circle>
          </div>
        </div>

        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div1Ref}
          toRef={div4Ref}
          curvature={-60}
          endYOffset={-8}
          pathWidth={4}
          className="transition-all duration-700 ease-in-out"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div2Ref}
          toRef={div4Ref}
          curvature={-60}
          endYOffset={-8}
          pathWidth={4}
          className="transition-all duration-700 ease-in-out"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div3Ref}
          toRef={div4Ref}
          curvature={60}
          endYOffset={8}
          pathWidth={4}
          className="transition-all duration-700 ease-in-out"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div5Ref}
          toRef={div4Ref}
          curvature={-60}
          endYOffset={-8}
          reverse
          pathWidth={4}
          className="transition-all duration-700 ease-in-out"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div6Ref}
          toRef={div4Ref}
          curvature={-60}
          endYOffset={-8}
          reverse
          pathWidth={4}
          className="transition-all duration-700 ease-in-out"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div7Ref}
          toRef={div4Ref}
          curvature={60}
          endYOffset={8}
          reverse
          pathWidth={4}
          className="transition-all duration-700 ease-in-out"
        />
      </div>
    </section>
  );
}

export default Partners;
