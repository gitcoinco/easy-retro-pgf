import fs from "fs";
import formidable from "formidable";
import type { NextApiResponse, NextApiRequest, PageConfig } from "next";
import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

async function pinFileToIPFS(file: formidable.File) {
  try {
    const stream = fs.createReadStream(file.filepath);
    const response = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: { name: file.originalFilename },
    });
    fs.unlinkSync(file.filepath);

    return response;
  } catch (error) {
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const form = formidable({});
      form.parse(req, (err, _, files) => {
        if (err) {
          return res.status(500).send("Upload Error");
        }
        const [file] = files.file ?? [];
        if (file) {
          pinFileToIPFS(file)
            .then(({ IpfsHash: cid }) => res.send({ cid }))
            .catch(console.log);
        }
      });
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    }
  } else {
    return res.status(405);
  }
}

export const config: PageConfig = {
  api: { bodyParser: false },
};
