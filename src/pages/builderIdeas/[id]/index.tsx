/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { GetServerSidePropsContext } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type { MarkDownData } from "~/builderIdeas/(navbar)/(home)/component/Home";
import BreadCrump from "~/builderIdeas/(navbar)/issue/_component/BreadCrump";
import Cpage from "./Cpage";
import Custom500 from "~/builderIdeas/custom-error";
import Footer from "~/builderIdeas/component/footer/Footer";
import type { Metadata, ResolvingMetadata } from "next";
import { Layout } from "~/layouts/DefaultLayout";

async function getMarkDownData(id: string): Promise<MarkDownData | string> {
  const encodedFileName = encodeURIComponent(id);
  const fullPath =
    path.join(process.cwd(), "contributions", encodedFileName) + ".md";

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();
    console.log("matterResult", matterResult.data?.["skill-sets"]);
    return {
      id: id.replace(/\.md$/, ""),
      contentHtml: contentHtml,
      title: matterResult?.data?.title,
      description: matterResult?.data?.description,
      lang: matterResult?.data?.lang,
      type: matterResult?.data?.type,
      authors: matterResult?.data?.authors,
      category: matterResult?.data?.category,
      effort: matterResult.data.effort,
      labels: matterResult.data.labels,
      contributions: matterResult.data.contributions,
      ["skill-sets"]: matterResult.data?.["skill-sets"],
    };
  } catch (error) {
    console.error("Error processing markdown data:", error);
    return String(error);
  }
}

export default function Page({ content }: { content: string | MarkDownData }) {
  if (typeof content === "string") {
    return (
      <Custom500
        errorMsg={content}
        status={500}
        titleError="Process Markdown data failed"
      />
    );
  }

  return (
    <Layout isFullWidth title={content?.id}>
      <div className=" bg-background-dark">
        <div className="lg:px-[4rem] lg:py-8 xl:px-[10rem]">
          <BreadCrump content={content} />
        </div>
        <div className="flex justify-center lg:px-[4rem] lg:pb-[1rem] xl:px-[10rem] xl:pb-[1.5rem]">
          <Cpage content={content} />
        </div>
      </div>
      {/* <Footer color="bg-background-dark" /> */}
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context?.params?.id;
  const content = await getMarkDownData(id as string);

  return {
    props: {
      content,
    },
  };
}
