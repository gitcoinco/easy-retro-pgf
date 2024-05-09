import Heart from "../../../../public/builderIdeas/icon/Heart";
import Lightning from "../../../../public/builderIdeas/icon/Lightning";
import GitHubIcon from "../../../../public/builderIdeas/icon/github-mark";
import Twitter from "../../../../public/builderIdeas/icon/Twitter";
interface FooterProps {
  color?: string;
}
const Footer = ({ color = "bg-background-dark" }: FooterProps) => {
  return (
    <footer id="footer" className={`w-full py-8 text-xs font-normal ${color}`}>
      <div className="mb-3 flex flex-row items-center justify-center gap-2">
        <a
          href="https://github.com/ethereum-optimism/ecosystem-contributions"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon></GitHubIcon>
        </a>
        <a
          href="https://twitter.com/Optimism"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter></Twitter>
        </a>
      </div>
      <div className="flex flex-row items-center justify-center gap-x-2 text-gray-700">
        {/* <h6 className=" ">© 2024 Optimism</h6>
        <div>|</div> */}
        <div className="flex items-center justify-center">
          <span>Made With</span>
          <span className="mx-1">
            <Heart />
          </span>
          <span>By</span>

          <a
            href="https://twitter.com/catalyzt_tech"
            className="flex items-center text-[#865CBB] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div>
              <Lightning />
            </div>
            <div>Catalyzt</div>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
