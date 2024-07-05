import { GithubIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center p-2 text-gray-700">
      <a
        href={"https://github.com/gitcoinco/easy-retro-pgf"}
        target="_blank"
        className="group py-4 text-sm font-medium hover:text-black"
      >
        <div className="flex tracking-wide">Powered by EasyRetroPGF.xyz</div>
      </a>
    </footer>
  );
}
