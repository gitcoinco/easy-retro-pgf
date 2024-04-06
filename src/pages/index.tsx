import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/Button";
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
        alt="Filecoin RetroPGF"
        src={"/filrpgf.jpg"}
        width={1600}
        height={900}
      />
    </Layout>
  );
}
