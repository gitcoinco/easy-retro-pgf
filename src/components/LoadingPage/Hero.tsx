import { ConnectButtonSection } from "./ConnectButtonSection";

export const Hero = () => {
    return (
        <section className="mt-32 md:mt-0 md:relative flex flex-col items-center">
            <div className="mb-10 md:mb-0" >
                <img alt="Background" src="/Hero.png" />
            </div>
            <div className="md:absolute md:top-36 flex flex-col gap-10 items-center text-center">
                <h1 className="sm:max-w-[332px] md:max-w-[625.61px] text-[#091011] text-[40px] md:text-[64px] leading-[40px] md:leading-[64px] font-medium">Obol Retroactive Funding</h1>
                <p className="text-[32px] leading-[48px]">for everyone</p>
                <ConnectButtonSection />
                <a href="#what-is-raf" className="text-black text-lg font-bold leading-7">What is RAF?</a>
            </div>
        </section>
    );
};