import Link from "next/link";

const InfoUnit = ({ heading, description }: { heading: string, description: string }) => {
    return (
      <div className="sm:w-full md:w-1/3">
        <h3 className="text-black text-lg font-semibold leading-7 mb-2">{heading}</h3>
        <p className="text-[#2d4d53] text-base font-normal">{description}</p>
      </div>
    );
  };
  
  export const InfoSection = () => {
    return (
      <section id="what-is-raf" className="pt-24">
        <h2 className="text-black text-4xl leading-10 mb-10">What is RAF?</h2>
        <div className="sm:flex-col md:flex md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8 mb-8">
          <InfoUnit heading="What is Obol’s Retroactive Funding (RAF)?" description="Obol Retroactive Funding rewards projects which strengthen and promote the Obol Collective’s Decentralized Operator Ecosystem and its ability to scale decentralized infrastructure networks like Ethereum." />
          <InfoUnit heading="Who is it for?" description="The funding is designed to reward tangible impact while creating strong incentives for sustained innovation and collaboration by the community. Any project can apply for retroactive funding. Their ecosystem impact and value-add will be assessed via voting by the community of delegates, using impact metrics-based evaluation." />
          <InfoUnit heading="How does it work?" description="The responsibility for allocating votes and determining funding distribution, through quadratic funding, lies with the Delegates. Together, the community will determine which projects have created the most value for the ecosystem." />
        </div>
        <div className="flex justify-center md:justify-start">
          <div className="w-36 h-10 px-6 py-3 bg-secondary-600 hover:bg-secondary-500 rounded-lg justify-center items-center inline-flex">
            <Link target="_blank" href="https://docs.obol.org/gov/governance/raf" className="text-secondary-100 hover:text-white text-base ">Learn more</Link>
          </div>
        </div>
      </section>
    );
  };