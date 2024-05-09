"use client";
export default function BtnHeroSection({ text }: { text: string }) {
  const handleClickBtn = () => {
    window.scrollTo({
      top: 450,
      behavior: "smooth",
    });
  };

  return (
    <button
      className="-48 hidden rounded-full bg-onPrimary-light px-8 py-4 text-scrim-dark shadow-md  transition duration-300 ease-linear   hover:bg-primary-dark hover:opacity-90 lg:block"
      onClick={handleClickBtn}
    >
      <div className=" font-semibold">{text} &darr;</div>
    </button>
  );
}
