import Link from "next/link";
import { RoundProgress } from "~/features/info/components/RoundProgress";
import { Layout } from "~/layouts/DefaultLayout";
import { Markdown } from "~/components/ui/Markdown";

export default function InfoPage() {
  return (
    <Layout>
      <Markdown>{`### Timeline`}</Markdown>
      <RoundProgress />
      <div className="flex flex-col gap-4">
        <Markdown>{`### Application process`}</Markdown>

        <p className=" leading-normal">
          The Retro POKT Goods Funding initiative supports contributors working
          on tools and resources across three key categories:
          <ol className=" my-4 ml-4 flex list-disc flex-col gap-2">
            <li>
              <b>Protocol:</b> Expanding network capabilities.
            </li>
            <li>
              <b>Ecosystem:</b> Streamlining development within the ecosystem.
            </li>
            <li>
              <b>Adoption:</b> Enhancing knowledge and awareness.
            </li>
          </ol>
        </p>
        <p className=" leading-normal">
          The funding level is determined through a community review process,
          considering each project's goals and impact.&nbsp;
          <Link
            className=" underline hover:text-primary-dark"
            href="https://docs.pokt.network/community/retro-pokt-goods-funding/application-process"
            target="_blank"
          >
            For more details and to apply, visit the linked application page!
          </Link>
        </p>
      </div>
    </Layout>
  );
}
