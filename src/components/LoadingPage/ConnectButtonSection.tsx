import Link from "next/link";
import { ConnectButton } from "../ConnectButton";
import { Button } from "../ui/Button";

export const ConnectButtonSection = () => 
<ConnectButton>
    <Button className="text-[#182d32] text-base font-semibold" variant="primary" as={Link} href={"/app"}>
        Enter RAF
    </Button>
</ConnectButton>