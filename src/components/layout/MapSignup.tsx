"use client";
import React from "react";
import Image from "next/image";
import "./../../styles/globals.css";
import SignupForm from "~/app/(user)/(authentication)/register/_RegisterForm";
import { PinContainer } from "../ui/3d-pin";
import { Button } from "~/components/ui/button";

export default function MapSignup() {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col-reverse items-center justify-center lg:flex-row ">
        {/* 3D Pin */}
        <div className="mt-6 flex  h-[40rem] w-full flex-col items-center justify-center  lg:w-[50%]">
          <h1 className="tex t-gray-900 p-2 text-2xl font-bold md:text-3xl lg:p-4 lg:text-5xl">
            Explore Our Location
          </h1>
          <div className=" flex h-[40rem] w-full items-center justify-center  ">
            <PinContainer
              title="/nex-gen-courier.com"
              href="https://nextjs.org/"
            >
              <div className="flex h-[20rem] w-[20rem] basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 md:h-[26rem] md:w-[26rem] ">
                <h3 className="!m-0 max-w-xs !pb-2 text-base  font-bold text-slate-100">
                  Nex-Gen-Courier
                </h3>
                <div className="!m-0 !p-0 text-base font-normal">
                  <span className="text-slate-200 ">
                    Contact Us for Fast and Reliable Service!
                  </span>
                </div>
                <a
                  href="https://maps.app.goo.gl/VLou8YhnsPZfFgts8"
                  target="_blank"
                  className="bg-image-map mt-4 flex w-full flex-1 rounded-lg"
                />
                {/* <div className="mt-4 flex w-full flex-1 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" /> */}
              </div>
            </PinContainer>
          </div>
        </div>
        <div className="flex w-[90%] flex-col items-center justify-center bg-white lg:w-[50%] lg:flex-row">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
