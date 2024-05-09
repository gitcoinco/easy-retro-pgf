"use client";
import Link from "next/link";
import type { MarkDownData } from "../../../(home)/component/Home";
import HomeIcon from "../../../../../../public/builderIdeas/icon/HomeIcon";

export default function BreadCrump({ content }: { content: MarkDownData }) {
  return (
    <div className="font-inter hidden flex-wrap items-center gap-3 lg:flex ">
      <Link href="/#project" className="flex items-center gap-2 ">
        <HomeIcon />
        <h6 className="text-sm font-medium text-gray-700 hover:underline">
          Home
        </h6>
      </Link>
      <div className="text-sm font-medium text-gray-600">&gt;</div>
      <h6 className="text-sm font-medium text-gray-500">{content.title}</h6>
    </div>
  );
}
