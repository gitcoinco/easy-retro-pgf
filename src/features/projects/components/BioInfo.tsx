import { Markdown } from "~/components/ui/Markdown";
import { type Application } from "~/features/applications/types";
import { InfoBox, type InfoBoxProps } from "./InfoBox";

type Props = {
  project?: Application & {
    githubUrl?: string;
    twitterHandle?: string;
    farcasterHandle?: string;
    telegramHandle?: string;
    githubHandle?: string;
    emailHandle?: string;
    country?: string;
  };
};

export default function BioInfo({ project }: Props) {
  const {
    bio,
    twitterHandle,
    farcasterHandle,
    telegramHandle,
    githubHandle,
    emailHandle,
    country,
  } = project ?? {};

  const elements: InfoBoxProps["elements"] = [
    { type: "country", value: country },
    { type: "email", value: emailHandle },
    { type: "twitter", value: twitterHandle },
    { type: "farcaster", value: farcasterHandle },
    { type: "telegram", value: telegramHandle },
    { type: "github", value: githubHandle },
  ];

  const showInfoBox = elements.some(({ value }) => value);

  if (!showInfoBox) return <Markdown>{bio}</Markdown>;

  return (
    <div className="mb-4 flex flex-col gap-4 md:flex-row">
      <div className="md:w-2/3">
        <Markdown>{bio}</Markdown>
      </div>
      <div className="md:w-1/3">
        <InfoBox label="Info" elements={elements} />
      </div>
    </div>
  );
}
