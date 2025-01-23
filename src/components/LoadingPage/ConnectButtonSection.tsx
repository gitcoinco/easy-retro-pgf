import Link from "next/link";
import { ConnectButton } from "../ConnectButton";
import { Button } from "../ui/Button";

export const ConnectButtonSection = () =>
    <ConnectButton>
        {/* move it as a variant to button ui same as connect button */}
        {/* [TODO Hanan] This link will be changed with each round during testing phases*/}
        <Button className="text-secondary-600 h-10 px-6 py-3 w-36 inline-flex items-center justify-center text-center transition-colors  backdrop-blur-sm  rounded-lg duration-150 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" variant="primary" as={Link} href={"/raf1"}> 
            Go To App
        </Button>
    </ConnectButton>
