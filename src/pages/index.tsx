import Link from "next/link";
import Image from "next/image";
import { Layout } from "~/layouts/DefaultLayout";
import { Chip } from "~/components/ui/Chip";

export default function HomePage({}) {
  return (
    <Layout isFullWidth>
      <div className="flex w-full flex-col items-center  justify-start  md:flex-row ">
        <div className="flex flex-col  px-5 pb-5 pt-0 md:w-1/2 md:px-7  xl:px-20">
          <h1 className=" font-bold lg:text-xl xl:text-2xl">
            Applications for Retroactive POKT Goods Funding Round 1 are open until May 31 2024!
          </h1>
          <p className=" mt-4 leading-relaxed lg:text-lg xl:text-xl">
            Have you created an impact for POKT Network? Eligible applicants can
            apply under the Protocol, Ecosystem, or Adoption categories now.
          </p>

          <div className="mt-6 flex flex-col items-center gap-4 md:flex-row lg:mt-8">
            <Chip
              className="gap-2 px-8 py-4 text-base font-semibold md:py-4 lg:px-8"
              as={Link}
              target="_blank"
              href="https://docs.pokt.network/community/retro-pokt-goods-funding"
            >
              Get more info
            </Chip>

            <Link
              href="/projects"
              className="rounded-full bg-onPrimary-light px-8 py-4 font-semibold text-scrim-dark hover:bg-primary-dark"
            >
              Enter Round 1
            </Link>
          </div>
        </div>
        <div className=" md:w-1/2">
          <Image
            className="w-full"
            src="/homeAsset.png"
            alt="Image"
            height={600}
            width={680}
          />
        </div>
      </div>
    </Layout>
  );
}
