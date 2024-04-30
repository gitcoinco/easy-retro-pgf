// Proxy requests to Filecoin EAS

import { IncomingMessage, ServerResponse } from "http";
import httpProxy from "http-proxy";

const NEXT_PUBLIC_EASSCAN_URL = process.env.NEXT_PUBLIC_EASSCAN_URL;

const proxy = httpProxy.createProxyServer();

export const config = { api: { bodyParser: false } };

export default function handler(req: IncomingMessage, res: ServerResponse) {
  req.url = req.url?.replace("/api/eas", "");

  console.log(req.url);
  return new Promise((resolve, reject) => {
    proxy.web(
      req,
      res,
      { target: NEXT_PUBLIC_EASSCAN_URL, changeOrigin: true },
      (err) => (err ? reject(err) : resolve({})),
    );
  });
}
