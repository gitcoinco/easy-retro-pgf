import { BaseLayout } from "~/layouts/BaseLayout";
import { Button } from "~/components/ui/Button";
import Link from "next/link";
import { ConnectButton } from "~/components/ConnectButton";
//mybe we cant import them from a library
import { LinkedinIcon } from "public/linkedin";
import { GithubIcon } from "public/Github";
import { TwitterIcon } from "public/Twitter";
import { TelegramIcon } from "public/Telegram";
import { DiscordIcon } from "public/Discord";
import { YoutubeIcon } from "public/Youtube";

const Header = () => {
  return (
    <header className="flex justify-between items-center py-6 bg-white px-3 md:px-20 ">
      <div className="flex items-center">
        <img src="/ObolLogo.svg" alt="Obol Logo" />
      </div>
      <ConnectButton>
        <Button className="text-[#182d32] text-base font-semibold" variant="primary" as={Link} href={"/app"}>
          Enter RAF
        </Button>
      </ConnectButton>

    </header>
  );
};


const Hero = () => {
  return (
    <section className="mt-32 md:mt-0 md:relative flex flex-col items-center">
      <div className="mb-10 md:mb-0" >
        <img alt="Background" src="/Hero.png" />
      </div>
      <div className="md:absolute md:top-36 flex flex-col gap-10 items-center text-center">
        <h1 className="sm:max-w-[332px] md:max-w-[625.61px] text-[#091011] text-[40px] md:text-[64px] leading-[40px] md:leading-[64px] font-medium">Obol Retroactive Funding</h1>
        <p className="text-[32px] leading-[48px]">for everyone</p>
        <ConnectButton>
          <Button className="text-[#182d32] text-base font-semibold" variant="primary" as={Link} href={"/app"}>
            Enter RAF
          </Button>
        </ConnectButton>
        <a href="#what-is-raf" className="text-black text-lg font-bold leading-7">What is RAF?</a>
      </div>
    </section>
  );
};

const InfoUnit = ({ heading, description }: { heading: string, description: string }) => {
  return (
    <div className="sm:w-full md:w-1/3">
      <h3 className="text-black text-lg font-semibold leading-7 mb-2">{heading}</h3>
      <p className="text-[#2d4d53] text-base font-normal">{description}</p>
    </div>
  );
};

const InfoSection = () => {
  return (
    <section id="what-is-raf" className="py-24">
      <h2 className="text-black text-[40px] leading-[56px] mb-10">What is RAF?</h2>
      <div className="sm:flex-col md:flex md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8 mb-8">
        <InfoUnit heading="What is Obol’s Retroactive Funding (RAF)?" description="All Obol Distributed Validators (DVs) contribute 1% of their staking rewards into a retroactive funding program, which will reward projects building on distributed validators and generally working to decentralise Ethereum. These might include staking protocols & products, DV client teams, DV tooling, node operators, educators, and community squad stakers." />
        <InfoUnit heading="Who is it for?" description="Any Obol Collective member can apply for retroactive funding, with their ecosystem impact and value-add being assessed based on KPIs such as TVL, code contributed, number of active DVs, etc." />
        <InfoUnit heading="How does it work?" description="Using the voting power earned from your contributions, you can vote for the projects to receive retroactive funding. Together, the community will determine which projects have created the most value for the ecosystem and can best put the funds to use decentralising Ethereum." />
      </div>
      <div className="flex justify-center md:justify-start">
        <div className="w-36 h-10 px-6 py-3 bg-[#182d32] rounded-lg justify-center items-center inline-flex">
          <Link target="_blank" href="https://blog.obol.org/1-percent-for-decentralisation/" className="text-[#e1e9eb] text-base font-semibold">Learn more</Link>
        </div>
      </div>
    </section>
  );
};

const SocialLink = ({ href, SvgIcon }: { href: string, SvgIcon: () => JSX.Element }) => {
  return <a target="_blank" href={href} className="text-gray-600 hover:text-gray-800">
    <SvgIcon />
  </a>
}

const Footer = () => {
  return (
    <footer className="flex flex-col-reverse md:flex-row justify-between items-center py-6">
      <div className="flex items-center">
        <img src="/ObolLogo.svg" alt="Obol Logo" />
      </div>
      <div className="flex space-x-6 mb-8 md:mb-0">
        <SocialLink href="https://www.linkedin.com/company/obol-labs" SvgIcon={LinkedinIcon} />
        <SocialLink href="https://github.com/ObolNetwork" SvgIcon={GithubIcon} />
        <SocialLink href="https://x.com/Obol_Collective" SvgIcon={TwitterIcon} />
        <SocialLink href="https://web.telegram.org" SvgIcon={TelegramIcon} />
        <SocialLink href="https://www.youtube.com/@ObolCollective" SvgIcon={YoutubeIcon} />
        <SocialLink href="https://discord.com/channels/849256203614945310/950735199124226109" SvgIcon={DiscordIcon} />
      </div>
    </footer>
  );
};

export default function ProjectsPage({ }) {
  return (

    <BaseLayout header={<Header />} customClassName="px-3 md:px-20 max-w-full">
      <Hero />
      <InfoSection />
      <Footer />
    </BaseLayout>
  );
}

