import { BaseLayout } from "~/layouts/BaseLayout";
import { Button } from "~/components/ui/Button";
import Link from "next/link";
import { ConnectButton } from "~/components/ConnectButton";

export default function ProjectsPage({}) {
  return (
    <BaseLayout
      header={
        <div className="flex justify-end p-3">
          <ConnectButton>
            <Button variant="primary" as={Link} href={"/app"}>
              Go to app
            </Button>
          </ConnectButton>
        </div>
      }
    >
      <div className="py-16">
        <h1 className="text-pretty text-center font-heading text-7xl tracking-tight sm:text-[160px] sm:leading-[8rem]">
          Retroactive Public Goods Funding
        </h1>
        <h2 className="text-center font-serif text-4xl">for everyone</h2>
      </div>
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-2">
        <Button
          className="w-full"
          variant="primary"
          as={Link}
          size="lg"
          href={`/create-round`}
        >
          Create a round
        </Button>
        <Button
          className="w-full"
          as={Link}
          target="_blank"
          size="lg"
          href={`https://github.com/gitcoinco/easy-retro-pgf`}
        >
          Self-hosted
        </Button>
        <Button
          size="lg"
          className="w-full "
          variant="ghost"
          onClick={() => alert("where does this link?")}
        >
          What is RPGF?
        </Button>
      </div>
    </BaseLayout>
  );
}
