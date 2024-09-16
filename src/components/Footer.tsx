import { GithubIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center p-2 text-gray-700">
      <a
        href={"https://github.com/gitcoinco/easy-retro-pgf"}
        target="_blank"
        className="group py-4 text-sm font-medium hover:text-black"
      >

        <div className="flex">
          Built with{"  "}
          <span className="relative -mt-1 w-6 px-1 text-xl text-red-600">
            <span className="absolute">❤️</span>
            <span className="absolute group-hover:animate-ping">❤️</span>
          </span>
          &nbsp;on EasyRetroPGF.
        </div>

      </a>
    </footer>
  );
}
