import { LinkedinIcon } from "public/Linkedin";
import { GithubIcon } from "public/Github";
import { TwitterIcon } from "public/Twitter";
import { TelegramIcon } from "public/Telegram";
import { YoutubeIcon } from "public/Youtube";
import { DiscordIcon } from "public/Discord";
import { LoadingPageLogo } from "./LoadingPageLogo";

const SocialLink = ({ href, SvgIcon }: { href: string, SvgIcon: () => JSX.Element }) => {
    return <a target="_blank" href={href} className="text-gray-600 hover:text-gray-800">
        <SvgIcon />
    </a>
}
export const Footer = () => {
    return (
        <footer className="flex flex-col-reverse md:flex-row justify-between items-center py-6">
            <LoadingPageLogo />
            <div className="flex space-x-6 mb-8 md:mb-0">
                <SocialLink href="https://www.linkedin.com/showcase/obol-collective" SvgIcon={LinkedinIcon} />
                <SocialLink href="https://github.com/ObolNetwork" SvgIcon={GithubIcon} />
                <SocialLink href="https://x.com/Obol_Collective" SvgIcon={TwitterIcon} />
                <SocialLink href="https://www.youtube.com/@ObolCollective" SvgIcon={YoutubeIcon} />
                <SocialLink href="https://discord.gg/obol" SvgIcon={DiscordIcon} />
            </div>
        </footer>
    );
};