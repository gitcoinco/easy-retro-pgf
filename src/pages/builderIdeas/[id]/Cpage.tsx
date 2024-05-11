"use client";
import { useRef } from "react";
import type { MarkDownData } from "~/builderIdeas/(navbar)/(home)/component/Home";
import OverViewSection from "~/builderIdeas/(navbar)/issue/_component/OverViewSection";
import ScrollSpy from "~/builderIdeas/(navbar)/issue/_component/ScrollSpy";
import SpecificationSection from "~/builderIdeas/(navbar)/issue/_component/SpecificationSection";

export default function Cpage({ content }: { content: MarkDownData }) {
  const overViewRef = useRef<HTMLElement | null>(null);
  const specificationRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <div className="sticky top-24 h-fit min-h-[calc(100vh-72px-6rem-3.5rem)]">
        <ScrollSpy
          overViewRef={overViewRef}
          specificationRef={specificationRef}
        />
      </div>

      <div className="flex w-full flex-col lg:mx-10 lg:w-3/4 lg:gap-8">
        <OverViewSection content={content} overViewRef={overViewRef} />
        {/* <div className="lg:hidden bg-white p-4 lg:rounded-md lg:shadow-md items-center w-auto lg:mx-10 lg:my-6">
            <hr className="mx-4 border-t border-gray-300" />
          </div> */}

        {/* <ProjectSummarySection
          content={content}
          /> */}

        <div className="mx-4 w-auto items-center bg-white lg:mx-10 lg:my-6 lg:hidden lg:rounded-md lg:shadow-md">
          <hr className="border-t border-gray-300 lg:mx-4" />
        </div>

        <SpecificationSection
          content={content}
          specificationRef={specificationRef}
        />
      </div>
    </>
  );
}
