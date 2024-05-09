import BtnHeroSection from "./BtnHeroSection";
import header from "../../../../../public/builderIdeas/static/homepage/config.json";
export default function HeroSection() {
  return (
    <div className="grid grid-cols-1 items-center justify-center gap-8 sm:gap-16 md:grid-cols-8 md:gap-24 lg:gap-32 xl:gap-40 ">
      {/* lg:max-w-[30rem] xl:max-w-[36rem] */}
      {/* <div className="animate-slidedown flex w-full grid-cols-1 justify-center duration-1000 md:hidden">
        <Image
          src="img/home_sunny.svg"
          alt="welcome_svg"
          width={300}
          height={300}
          className="animate-none"
        />
      </div> */}
      <div className="animate-slideleft flex flex-col text-center duration-200 md:col-span-5 md:text-left">
        <h6 className="font-rubik text-5xl font-semibold text-primary-dark ">
          {header["welcome-message"]}
        </h6>
        <p className="mx-8 my-6 max-w-[45em] text-base font-normal text-onPrimary-light md:mx-0">
          {header["welcome-desc"]}
        </p>
        <div className="mt-2">
          <BtnHeroSection text={header["button-text"]} />
        </div>
      </div>
      {/* <div className="animate-slideright hidden  duration-1000 md:col-span-3 md:flex md:flex-row md:justify-center">
        <Image
          src="builderIdeas/img/home_sunny.svg"
          alt="retro hero icon"
          width={450}
          height={450}
          className="animate-none"
        />
      </div> */}
    </div>
  );
}
