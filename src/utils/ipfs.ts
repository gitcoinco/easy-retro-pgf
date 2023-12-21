import { Web3Storage } from "web3.storage";

const ipfsClient = new Web3Storage({
  token: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY!,
});

export const uploadIpfs = async (data: object, fileName = "metadata.json") => {
  // Data can be either File or a js object
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const file = new File([blob], fileName);
  return ipfsClient
    .put([file])
    .then((cid: string) => `https://w3s.link/ipfs/${cid}/${file.name}`);
};
