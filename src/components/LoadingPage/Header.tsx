import { ConnectButtonSection } from "./ConnectButtonSection";
import { ObolLogo } from "./ObolLogo";

export const Header = () => {
    return (
      <header className="flex justify-between items-center py-6 bg-white px-3 md:px-20 ">
      <ObolLogo/>
      </header>
    );
  };