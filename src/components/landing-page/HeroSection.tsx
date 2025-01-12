import React from "react";
import AnimatedGradientText from "../magicui/animated-gradient-text";
import { cn } from "~/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import HeroNotifications from "./HeroNotifications";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="relative flex w-full flex-col items-center justify-between gap-2 md:gap-16">
        {/* Gradient Circles */}
        <div className="absolute -top-16 left-1/2 -z-10 size-60 -translate-x-1/2 transform rounded-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 opacity-30 blur-3xl"></div>
        <div className="absolute left-1/4 top-1/2 -z-10 size-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-br from-green-300 via-teal-300 to-blue-300 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 -z-10 size-40 translate-x-1/2 translate-y-1/2 transform rounded-full bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300 opacity-30 blur-3xl"></div>

        <div className="flex w-full flex-col items-center justify-between gap-2 md:gap-16">
          <div className="z-10 flex items-center justify-center">
            <div
              className={cn(
                "group rounded-full border border-black/5 bg-neutral-100/80 text-base text-black/80 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-neutral-200/80 dark:border-white/5 dark:bg-neutral-900/80 dark:text-white/80 dark:hover:bg-neutral-800/80",
                "backdrop-blur-sm",
              )}
            >
              <AnimatedGradientText className="flex items-center justify-center px-6 py-2 text-sm font-medium transition ease-out md:text-base">
                <span className="w-full text-clip text-nowrap bg-gradient-to-t from-gray-800 to-gray-600 bg-clip-text">
                  🎉 Introducing Next Generation of Courier Services
                </span>
                <ArrowRightIcon className="ml-2 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedGradientText>
            </div>
          </div>

          <div className="relative mt-6 flex flex-col items-center gap-12 md:mt-0 md:gap-16 xl:flex-row xl:items-start">
            <div className="flex flex-col items-center text-center xl:items-start xl:text-left">
              <h1 className="mb-6 max-w-3xl bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl lg:text-6xl">
                The Only Courier Service You&apos;ll Ever Need
              </h1>
              <p className="mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Experience lightning-fast deliveries, real-time tracking, and
                exceptional customer service. We&apos;re revolutionizing the
                courier industry, one package at a time.
              </p>
              <Button
                size={"lg"}
                className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Get Started
              </Button>
            </div>
            <HeroNotifications className="w-full max-w-md xl:max-w-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
