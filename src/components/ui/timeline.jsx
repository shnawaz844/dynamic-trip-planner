"use client";;
import { CalendarSearchIcon, IndianRupee, PersonStanding, Plane, Wallet2 } from "lucide-react";
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ data, tripData }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans"
      ref={containerRef}>
      <div className="py-10 px-4 md:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Destination */}
          <div className="flex items-center gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
              <Plane className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 transition-colors">Destination</p>
              <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white transition-colors">
                {tripData?.tripDetails?.destination}
              </h3>
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 transition-colors">Budget</p>
              <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white transition-colors">
                {tripData?.tripDetails?.budget}
              </h3>
            </div>
          </div>

          {/* Travelers */}
          <div className="flex items-center gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <PersonStanding className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 transition-colors">Travelers</p>
              <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white transition-colors">
                {tripData?.tripDetails?.travelers}
              </h3>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              <CalendarSearchIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 transition-colors">Duration</p>
              <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white transition-colors">
                {tripData?.tripDetails?.duration || tripData?.itinerary?.length} Days
              </h3>
            </div>
          </div>
        </div>

        <p className="relative mt-10 text-base md:text-lg leading-relaxed text-neutral-600 dark:text-neutral-300 transition-colors">
          <span className="absolute -left-3 top-1 h-7 w-1.5 rounded-full bg-purple-500"></span>
          Below are the{" "}
          <span className="font-semibold text-primary">
            recommended hotels
          </span>{" "}
          along with your{" "}
          <span className="font-semibold text-primary">
            personalized travel plan
          </span>{" "}
          for this trip.
        </p>

      </div>
      <div ref={ref} className="relative pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:pt-10">
            {/* Left Section - 20% width */}
            <div className="sticky flex-shrink-0 w-1/5 max-w-xs self-start top-40 z-40">
              <div className="flex flex-col md:flex-row items-center">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    <div className="h-5 w-5 rounded-full bg-white dark:bg-gray-900" />
                  </div>
                </div>
                <h3 className="hidden md:block mt-4 md:mt-0 md:ml-4 text-xl font-bold text-neutral-900 dark:text-neutral-100 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Right Content Section - 80% width */}
            <div className="flex-grow w-4/5 pl-4 md:pl-8 pr-4">
              <h3 className="md:hidden block text-2xl mb-4 font-bold text-neutral-900 dark:text-neutral-100 transition-colors">
                {item.title}
              </h3>
              <div className="relative bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-200 dark:border-neutral-800">
                {item.content}
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] ">
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full" />
        </div>
      </div>
    </div>
  );
};
