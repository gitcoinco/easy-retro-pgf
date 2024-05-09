import { useState, useEffect } from "react";
import { promises as fsPromises } from "fs";
import JsonData from "../../../public/builderIdeas/static/json/output.json";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import Custom500 from "~/builderIdeas/custom-error";
import Cpage from "~/builderIdeas/(navbar)/(home)/Cpage";
import type {
  LoadMarkDownType,
  MarkDownData,
} from "~/builderIdeas/(navbar)/(home)/component/Home";
import HeroSection from "~/builderIdeas/(navbar)/(home)/component/HeroSection";
import Footer from "~/builderIdeas/component/footer/Footer";
import type { Metadata } from "next";
import Layout from "~/builderIdeas/(navbar)/layout";

async function getResources(): Promise<{
  jsonData: Omit<MarkDownData, "contentHtml">[];
  overViewData: string | LoadMarkDownType;
}> {
  try {
    const jsonData = await getJsonData();

    const overViewData = await getOverViewData("overview");

    return { jsonData, overViewData };
  } catch (error) {
    console.log("error in getResources", error);
    throw error;
  }
}

async function getJsonData(): Promise<Omit<MarkDownData, "contentHtml">[]> {
  const directoryPath = path.join(
    process.cwd(),
    "public",
    "builderIdeas",
    "static",
    "json",
    "output.json",
  );
  console.log("directoryPath", directoryPath);

  const fileContents = fs.readFile(directoryPath, "utf8");
  const jsonData: Omit<MarkDownData, "contentHtml">[] =
    JSON.parse(fileContents);

  return jsonData;
}

async function getOverViewData(id: string): Promise<LoadMarkDownType | string> {
  const encodedFileName = encodeURIComponent(id);
  const fullPath = path.join(process.cwd(), "README.md");
  try {
    const fileContents = fs?.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);

    const contentHtml = processedContent.toString();

    return {
      id: id.replace(/\.md$/, ""),
      contentHtml: contentHtml,
    };
  } catch (error) {
    console.error("Error processing markdown data:", error);
    return String(error);
  }
}

export default function BuilderIdeas() {
  const [data, setData] = useState({ jsonData: JsonData, overViewData: "" });

  console.log("Data:", data);

  return (
    <Layout title="Builder Ideas">
      <div className="min-h-screen bg-background-dark">
        <div className="bg-background-dark px-4 py-[2.5rem]  text-onPrimary-light md:px-[4rem] lg:px-[8rem]">
          <div className="md:my-8 md:pt-14">
            <HeroSection />
          </div>
        </div>

        <div className="animate-slideup bg-background-dark px-4 py-[2.5rem] text-onPrimary-light md:px-[4rem] lg:px-[8rem]">
          <div className="flex flex-col gap-1 ">
            <h6 className="font-rubik text-lg text-onPrimary-light">Explore</h6>
            <h4 className="font-rubik text-2xl font-semibold text-onPrimary-light">
              Project Ideas
            </h4>
          </div>
          <div className="">
            <Cpage markdownContents={data.jsonData} />
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
}
