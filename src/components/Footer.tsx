import { GithubIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center bg-surfaceContainerLow-dark p-2 text-onSurfaceVariant-dark">
      <a
        href={"https://github.com/gitcoinco/easy-retro-pgf/"}
        target="_blank"
        className="group py-4 text-sm hover:text-white"
      >
        <div className="flex">
          Built with{" "}
          <span className="relative -mt-1 w-6 px-1 text-xl text-red-600">
            <span className="absolute">❤️</span>
            <span className="absolute group-hover:animate-ping">❤️</span>
          </span>
          on EasyRetroPGF.
        </div>
      </a>
    </footer>
  );
}
