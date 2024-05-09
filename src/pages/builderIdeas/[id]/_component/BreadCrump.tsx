"use client";
import Link from "next/link";
import type { MarkDownData } from "~/builderIdeas/(navbar)/(home)/component/Home";
import HomeIcon from "../../../../../public/builderIdeas/icon/HomeIcon";

export default function BreadCrump({ content }: { content: MarkDownData }) {
  return (
    <div className="font-inter hidden flex-wrap items-center gap-3   lg:flex ">
      <Link href="/builderIdeas#project" className="flex items-center gap-2 ">
        <HomeIcon />
        <h6 className="text-sm font-medium text-onPrimary-light hover:underline">
          Home
        </h6>
      </Link>
      <div className="text-sm font-medium text-onPrimary-light">&gt;</div>
      <h6 className="text-sm font-medium text-outline-dark">{content.title}</h6>
    </div>
  );
}
