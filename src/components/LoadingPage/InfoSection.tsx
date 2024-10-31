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
      <section id="what-is-raf" className="py-24">
        <h2 className="text-black text-[40px] leading-[56px] mb-10">What is RAF?</h2>
        <div className="sm:flex-col md:flex md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8 mb-8">
          <InfoUnit heading="What is Obol’s Retroactive Funding (RAF)?" description="All Obol Distributed Validators (DVs) contribute 1% of their staking rewards into a retroactive funding program, which will reward projects building on distributed validators and generally working to decentralise Ethereum. These might include staking protocols & products, DV client teams, DV tooling, node operators, educators, and community squad stakers." />
          <InfoUnit heading="Who is it for?" description="Any Obol Collective member can apply for retroactive funding, with their ecosystem impact and value-add being assessed based on KPIs such as TVL, code contributed, number of active DVs, etc." />
          <InfoUnit heading="How does it work?" description="Using the voting power earned from your contributions, you can vote for the projects to receive retroactive funding. Together, the community will determine which projects have created the most value for the ecosystem and can best put the funds to use decentralising Ethereum." />
        </div>
        <div className="flex justify-center md:justify-start">
          <div className="w-36 h-10 px-6 py-3 bg-[#182d32] hover:bg-[#243d42] rounded-lg justify-center items-center inline-flex">
            <Link target="_blank" href="https://blog.obol.org/1-percent-for-decentralisation/" className="text-[#e1e9eb] hover:text-[#FFFFFF] text-base ">Learn more</Link>
          </div>
        </div>
      </section>
    );
  };