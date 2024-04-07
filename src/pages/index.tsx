import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/Button";
import { Markdown } from "~/components/ui/Markdown";
import { RoundProgress } from "~/features/info/components/RoundProgress";
import { Layout } from "~/layouts/DefaultLayout";

export default function LandingPage({}) {
  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Filecoin RetroPGF</h1>
        <Button icon={Plus} as={Link} href={"/applications/new"}>
          Apply with your project
        </Button>
      </div>
      <RoundProgress />
      <Image
        className="mb-4"
        alt="Filecoin RetroPGF"
        src={"/filrpgf.jpg"}
        width={1600}
        height={900}
      />
      <Markdown>
        {`### Welcome to FIL-RetroPGF-1, the Filecoin network’s first Optimism-inspired Retroactive Public Goods Funding round.

The round will allocate FIL tokens to projects that have created an impact toin the Filecoin network between Oct 2023 - Mar 2024. Future impact windows will be rewarded in future rounds.

Between Apr 8th and Apr 21st, eligible nominations may submit an application. Projects that are eligible are listed [here](https://fil-retropgf.notion.site/Round-1-Invited-Applications-3fe95da0c9da4aeba9c6420d1efd0bd6?pvs=74).

After this, badgeholders will then vote on the projects between Apr 22nd and May 6th.

For more information, visit [FIL-RetroPGF documentation](https://fil-retropgf.notion.site/FIL-RetroPGF-4b6f5358440043c8bb1bf53f0297541e).
        
        
        `}
      </Markdown>
    </Layout>
  );
}
