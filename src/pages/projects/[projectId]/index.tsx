import dynamic from "next/dynamic";

export default dynamic(() => import("./Project"), { ssr: false });

export { getServerSideProps } from "./Project";
