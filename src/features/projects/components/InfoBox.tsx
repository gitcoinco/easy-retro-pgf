import { ExternalLink } from "~/components/ui/Link";
import {
  SiFarcaster as Farcaster,
  SiTelegram as Telegram,
} from "react-icons/si";
import { FaXTwitter as Twitter } from "react-icons/fa6";
import { LuGithub as Github, LuGlobe as Globe } from "react-icons/lu";
import { MdOutlineMail as Mail } from "react-icons/md";
import { type IconType } from "react-icons/lib";

const InfoItem = ({
  type,
  value,
}: {
  type: "github" | "twitter" | "farcaster" | "telegram" | "email" | "country";
  value: string;
}) => {
  const Icon: IconType | undefined = {
    github: Github,
    twitter: Twitter,
    farcaster: Farcaster,
    telegram: Telegram,
    email: Mail,
    country: Globe,
  }[type];

  const sanitizedValue = value.startsWith("@") ? value.slice(1) : value;

  const url =
    sanitizedValue.startsWith("http://") ||
    sanitizedValue.startsWith("https://")
      ? sanitizedValue
      : {
          github: `https://github.com/${sanitizedValue}`,
          twitter: `https://x.com/${sanitizedValue}`,
          farcaster: `https://warpcast.com/${sanitizedValue}`,
          telegram: `https://t.me/${sanitizedValue}`,
          email: `mailto:${sanitizedValue}`,
          country: `https://www.google.com/maps/search/${sanitizedValue}`,
        }[type];

  if (type === "country") {
    return (
      <div className="flex gap-2">
        <Icon className="mt-1 h-4 w-4" />
        {value}
      </div>
    );
  }

  return (
    <ExternalLink href={url} className="flex gap-2 hover:underline">
      <Icon className="mt-1 h-4 w-4" />
      {value}
    </ExternalLink>
  );
};

export interface InfoBoxProps {
  label: string;
  elements?: {
    type: "github" | "twitter" | "farcaster" | "telegram" | "email" | "country";
    value?: string;
  }[];
}

export const InfoBox = ({ label, elements }: InfoBoxProps) => {
  const filteredElements = elements?.filter(({ value }) => value);
  return (
    <div className="rounded-xl border p-3 dark:border-gray-700">
      <div className="mb-2 font-bold tracking-wider text-gray-600 dark:text-gray-500">
        {label}
      </div>
      <div className="space-y-2">
        {filteredElements?.map(({ type, value }, i) => (
          <InfoItem key={i} type={type} value={value!} />
        ))}
      </div>
    </div>
  );
};
