import { GithubIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center bg-background-dark p-2 text-onPrimary-light">
      <a
        href={
          "https://github.com/Microflow-xyz/retroactive-pokt-goods-funding/tree/main"
        }
        target="_blank"
        className="group py-4 text-sm hover:text-onPrimary-light"
      >
        <div className="flex">
          Built with{" "}
          <span className="relative -mt-1 w-6 px-1 text-xl text-red-600">
            <span className="absolute">❤️</span>
            <span className="absolute group-hover:animate-ping">❤️</span>
          </span>
          &nbsp;using EasyRetroPGF by Microflow.
        </div>
      </a>
    </footer>
  );
}
