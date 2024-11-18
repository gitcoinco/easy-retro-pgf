import { ConnectButtonSection } from "./ConnectButtonSection";

export const Hero = () => {
    return (
        <section className="mt-32 md:mt-0 md:relative flex flex-col items-center">
            <div className="mb-10 md:mb-0" >
                <img alt="Background" src="/Hero.png" />
            </div>
            <div className="md:absolute flex flex-col items-center text-center md:bottom-[20%] gap-10  md:gap-2 lg:gap-4 xl:gap-10">
                <h1 className="w-3/4 text-[#091011] text-4xl md:text-3xl lg:text-5xl xl:text-6xl  leading-10 lg:leading-normal font-medium">Obol Retroactive Funding</h1>
                <p className="text-[32px] lg:text-3xl md:text-2xl xl:text-[32px] leading-tight">for the Obol Collective</p>
                <ConnectButtonSection />
                <a href="#what-is-raf" className="text-black text-lg font-bold leading-7">What is RAF?</a>
            </div>
        </section>
    );
};