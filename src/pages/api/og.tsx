import { ImageResponse } from "next/og";
import { metadata } from "~/config";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="bg-white w-full h-full flex flex-col justify-center">
        <div tw="font-bold text-[128px] flex justify-center items-center w-full">
          {metadata.title}
        </div>
        <div tw="text-3xl flex justify-center">{metadata.description}</div>
      </div>
    ),
    {
      ...size,
    },
  );
}
