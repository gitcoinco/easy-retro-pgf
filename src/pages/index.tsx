import { BaseLayout } from "~/layouts/BaseLayout";
import { Button } from "~/components/ui/Button";
import Link from "next/link";
import { ConnectButton } from "~/components/ConnectButton";
import { createComponent } from "~/components/ui";
import { tv } from "tailwind-variants";
import { Github, Send } from "lucide-react";

//extract all to reusable components and use already ones with variants and custom css
const Header = () => {
  return (
    <header className="flex justify-between items-center py-6 bg-white px-3 md:px-20 ">
      <div className="flex items-center">
        <img src="/ObolLogo.svg" alt="Obol Logo" />
      </div>
          <ConnectButton>
            <Button className="text-[#182d32] text-base font-semibold font-['DM Sans'] leading-normal" variant="primary" as={Link} href={"/app"}>
              Enter RAF
            </Button>
          </ConnectButton>
      
    </header>
  );
};


const Hero = () => {
  return (
    <section className="mt-32 md:mt-0 md:relative flex flex-col items-center">
      <div className="mb-10 md:mb-0" >
        <img alt="Background" src="/Hero.png" />
      </div>
      <div className="md:absolute md:top-36 flex flex-col gap-10 items-center text-center">
        <h1 className="sm:max-w-[332px] md:max-w-[625.61px] text-[#091011] text-[40px] md:text-[64px] leading-[40px]  md:leading-[64px] font-medium">Obol Retroactive Funding</h1>
        <p className="text-[32px] font-['DM Sans'] leading-[48px]">for everyone</p>
        <div className="mb-20 md:mb-0 h-10 py-3  rounded-lg backdrop-blur-sm justify-center items-center gap-2.5 inline-flex">
            <ConnectButton>
              <Button className="text-[#182d32] text-base font-semibold font-['DM Sans'] leading-normal" variant="primary" as={Link} href={"/app"}>
                Enter RAF
              </Button>
            </ConnectButton>
        </div>
        <a href="#what-is-raf" className="text-black text-lg font-bold font-['DM Sans'] leading-7">What is RAF?</a>
      </div>
    </section>
  );
};

const InfoSection = () => {
  return (
    <section id="what-is-raf" className="py-24">
      <h2 className="text-black text-[40px] font-['DM Sans'] leading-[56px] mb-10">What is RAF?</h2>
      <div className="sm:flex-col md:flex md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8 mb-8">
        <div className="sm:w-full md:w-1/3">
          <h3 className="text-black text-lg font-semibold font-['DM Sans'] leading-7 mb-2">What is Obol’s Retroactive Funding (RAF)?</h3>
          <p className="text-[#2d4d53] text-base font-normal font-['DM Sans'] leading-normal">All Obol Distributed Validators (DVs) contribute 1% of their staking rewards into a retroactive funding program, which will reward projects building on distributed validators and generally working to decentralise Ethereum. These might include staking protocols & products, DV client teams, DV tooling, node operators, educators, and community squad stakers.</p>
        </div>
        <div className="sm:w-full  md:w-1/3">
          <h3 className="text-black text-lg font-semibold font-['DM Sans'] leading-7 mb-2">Who is it for?</h3>
          <p className="text-[#2d4d53] text-base font-normal font-['DM Sans'] leading-normal">Any Obol Collective member can apply for retroactive funding, with their ecosystem impact and value-add being assessed based on KPIs such as TVL, code contributed, number of active DVs, etc.</p>
        </div>
        <div className="sm:w-full  md:w-1/3">
          <h3 className="text-black text-lg font-semibold font-['DM Sans'] leading-7 mb-2">How does it work?</h3>
          <p className="text-[#2d4d53] text-base font-normal font-['DM Sans'] leading-normal">Using the voting power earned from your contributions, you can vote for the projects to receive retroactive funding. Together, the community will determine which projects have created the most value for the ecosystem and can best put the funds to use decentralising Ethereum.</p>
        </div>
      </div>
      <div className="w-36 h-10 px-6 py-3 bg-[#182d32] rounded-lg justify-center items-center gap-2.5 inline-flex">
        <Link target="_blank" href="https://docs.obol.org/docs/v0.17.1/sec/smart_contract_audit#l-01-obol-fees-will-be-applied-retroactively-to-all-non-distributed-funds-in-the-splitter" className="text-[#e1e9eb] text-base font-semibold font-['DM Sans'] leading-normal">Learn more</Link>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="flex justify-between items-center py-6">
      <div className="flex items-center">
        <img src="/ObolLogo.svg" alt="Obol Logo" />
      </div>
      <div className="flex space-x-6">
        <a target="_blank" href="https://www.linkedin.com/company/obol-labs/mycompany/" className="text-gray-600 hover:text-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5ZM6.88 8.56C7.32556 8.56 7.75288 8.383 8.06794 8.06794C8.383 7.75288 8.56 7.32556 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C6.43178 5.19 6.00193 5.36805 5.68499 5.68499C5.36805 6.00193 5.19 6.43178 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM8.27 18.5V10.13H5.5V18.5H8.27Z" fill="#2D4D53" />
          </svg>
        </a>
        <a target="_blank" href="https://github.com/ObolNetwork" className="text-gray-600 hover:text-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_4304_8835)">
              <path d="M22.2708 6.66618C21.2653 4.87557 19.8072 3.38038 18.0425 2.33018C16.28 1.27001 14.2591 0.716847 12.2025 0.731631C10.1486 0.714904 8.12973 1.2669 6.35736 2.33018C4.59051 3.37941 3.13056 4.87472 2.12391 6.66618C1.08482 8.48689 0.546329 10.5503 0.563182 12.6465C0.536152 15.1582 1.31344 17.6127 2.78136 19.6509C4.1815 21.6631 6.19218 23.1712 8.51591 23.952C8.61826 23.9842 8.72687 23.9911 8.83248 23.9722C8.93809 23.9534 9.03758 23.9093 9.12245 23.8436C9.18666 23.7848 9.23743 23.7129 9.27131 23.6327C9.3052 23.5525 9.3214 23.4659 9.31882 23.3789L9.31082 22.5411C9.305 22.0131 9.30282 21.5542 9.30282 21.1644L8.95518 21.2305C8.67736 21.2764 8.39518 21.2945 8.11445 21.2858C7.76073 21.2793 7.4082 21.2428 7.06064 21.1767C6.68983 21.1066 6.34164 20.9474 6.04609 20.7127C5.73277 20.4689 5.50053 20.136 5.37991 19.7578L5.22864 19.4014C5.10186 19.1195 4.94195 18.8536 4.75227 18.6094C4.58347 18.3625 4.35707 18.1603 4.09264 18.0204L3.98718 17.9425C3.91445 17.8887 3.849 17.8262 3.79082 17.7564C3.73482 17.6909 3.689 17.6182 3.65482 17.5389C3.62427 17.4662 3.64973 17.4065 3.73045 17.36C3.87009 17.3025 4.02064 17.2793 4.16973 17.2902L4.473 17.3367C4.74427 17.4109 4.99882 17.5374 5.22355 17.7091C5.52391 17.9185 5.77482 18.1942 5.95809 18.5156C6.15809 18.9033 6.44682 19.2356 6.79882 19.4851C7.08973 19.6953 7.43518 19.8109 7.79082 19.8182C8.08027 19.8225 8.36973 19.7964 8.65482 19.7404C8.88973 19.6916 9.11809 19.6131 9.33555 19.5076C9.38426 18.9036 9.64737 18.3369 10.0774 17.9098C9.55373 17.8574 9.03518 17.7644 8.52536 17.6305C8.02669 17.4901 7.54793 17.2868 7.10064 17.0254C6.62939 16.7624 6.21468 16.409 5.88027 15.9854C5.51964 15.4955 5.25059 14.9443 5.08609 14.3585C4.86758 13.6035 4.76267 12.8201 4.77482 12.0342C4.74783 10.8541 5.17685 9.70895 5.97264 8.83709C5.60037 7.80786 5.63813 6.67489 6.07809 5.67272C6.52318 5.59927 6.97991 5.67272 7.38136 5.88218C7.817 6.048 8.23954 6.248 8.64536 6.47927C8.913 6.64436 9.12755 6.78472 9.289 6.89818C11.193 6.35999 13.2032 6.35999 15.1072 6.89818L15.6825 6.52581C16.1246 6.25381 16.5915 6.02545 17.0766 5.84363C17.4558 5.65451 17.8864 5.59449 18.3028 5.67272C18.754 6.67163 18.7978 7.8071 18.425 8.83781C19.2205 9.70983 19.6492 10.8549 19.6221 12.0349C19.6339 12.8242 19.529 13.6109 19.3108 14.3694C19.1479 14.96 18.8745 15.512 18.5086 15.9971C18.1688 16.4159 17.7524 16.7664 17.2817 17.0298C16.833 17.2916 16.3552 17.4953 15.857 17.6349C15.3479 17.7687 14.8286 17.8625 14.3043 17.9156C14.5865 18.2015 14.8032 18.5484 14.9392 18.9294C15.0752 19.3113 15.1283 19.7193 15.0919 20.1236V23.3971C15.09 23.4835 15.1059 23.5694 15.1386 23.6495C15.1712 23.7296 15.2199 23.8021 15.2817 23.8625C15.3652 23.9279 15.4633 23.9718 15.5677 23.9906C15.672 24.0093 15.7793 24.0023 15.8803 23.9702C18.2038 23.1894 20.2143 21.6813 21.6141 19.6691C23.0849 17.6257 23.8618 15.1647 23.8308 12.6473C23.8461 10.5462 23.3072 8.47927 22.2708 6.66618Z" fill="#2D4D53" />
            </g>
            <defs>
              <clipPath id="clip0_4304_8835">
                <rect width="24" height="23.2727" fill="white" transform="translate(0 0.727295)" />
              </clipPath>
            </defs>
          </svg>
        </a>
        <a target="_blank" href="https://x.com/Obol_Collective" className="text-gray-600 hover:text-gray-800">
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_4337_52)">
              <path d="M11.9027 8.8875L19.3482 0H17.5838L11.119 7.71689L5.95547 0H0L7.8082 11.6693L0 20.9892H1.76443L8.59152 12.8399L14.0445 20.9892H20L11.9023 8.8875H11.9027ZM9.48608 11.7721L8.69495 10.6101L2.40018 1.36396H5.11025L10.1902 8.8259L10.9813 9.9879L17.5847 19.6873H14.8746L9.48608 11.7726V11.7721Z" fill="#2D4D53" />
            </g>
            <defs>
              <clipPath id="clip0_4337_52">
                <rect width="20" height="21" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </a>
        <a target="_blank" href="https://web.telegram.org" className="text-gray-600 hover:text-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_4304_8831)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M23.9532 2.52809C23.9338 2.43947 23.8913 2.35756 23.83 2.29065C23.7687 2.22375 23.6908 2.17422 23.6042 2.14709C23.2889 2.08464 22.9626 2.10777 22.6592 2.21409C22.6592 2.21409 1.63021 9.77309 0.429212 10.6101C0.171212 10.7901 0.0842119 10.8951 0.0412119 11.0181C-0.166788 11.6181 0.480212 11.8761 0.480212 11.8761L5.90021 13.6421C5.99185 13.6585 6.08609 13.653 6.17521 13.6261C7.40721 12.8471 18.5752 5.79209 19.2242 5.55509C19.3242 5.52509 19.4012 5.55509 19.3812 5.63009C19.1232 6.53509 9.47221 15.1081 9.41921 15.1601C9.39339 15.1812 9.37328 15.2085 9.3607 15.2394C9.34813 15.2703 9.34349 15.3039 9.34721 15.3371L8.84121 20.6291C8.84121 20.6291 8.62921 22.2761 10.2762 20.6291C11.4442 19.4601 12.5652 18.4921 13.1252 18.0211C14.9892 19.3081 16.9942 20.7311 17.8592 21.4761C18.0047 21.6169 18.1771 21.727 18.3661 21.7997C18.5551 21.8723 18.7569 21.9062 18.9592 21.8991C19.2084 21.8687 19.4425 21.7632 19.6302 21.5965C19.818 21.4298 19.9505 21.2099 20.0102 20.9661C20.0102 20.9661 23.8402 5.54309 23.9682 3.47709C23.9812 3.27709 23.9982 3.14509 24.0002 3.00609C24.0065 2.84536 23.9906 2.68453 23.9532 2.52809Z" fill="#2D4D53" />
            </g>
            <defs>
              <clipPath id="clip0_4304_8831">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </a>
        <a target="_blank" href="https://www.youtube.com/@ObolCollective" className="text-gray-600 hover:text-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M23.8 7.20107C23.8 7.20107 23.6 5.50107 22.8 4.80107C21.9 3.80107 20.9 3.80107 20.4 3.80107C17 3.60107 12 3.60107 12 3.60107C12 3.60107 7 3.60107 3.6 3.80107C3.1 3.90107 2.1 3.90107 1.2 4.80107C0.5 5.50107 0.2 7.20107 0.2 7.20107C0.2 7.20107 0 9.10107 0 11.1011V12.9011C0 14.8011 0.2 16.8011 0.2 16.8011C0.2 16.8011 0.4 18.5011 1.2 19.2011C2.1 20.2011 3.3 20.1011 3.8 20.2011C5.7 20.4011 12 20.4011 12 20.4011C12 20.4011 17 20.4011 20.4 20.1011C20.9 20.0011 21.9 20.0011 22.8 19.1011C23.5 18.4011 23.8 16.7011 23.8 16.7011C23.8 16.7011 24 14.8011 24 12.8011V11.0011C24 9.10107 23.8 7.20107 23.8 7.20107ZM9.5 15.1011V8.40107L16 11.8011L9.5 15.1011Z" fill="#2D4D53" />
          </svg>
        </a>
        <a target="_blank" href="https://discord.com/channels/849256203614945310/950735199124226109" className="text-gray-600 hover:text-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_4304_8825)">
              <mask id="mask0_4304_8825">
                <path d="M23.7368 0.714172H0V23.3024H23.7368V0.714172Z" fill="white" />
              </mask>
              <g mask="url(#mask0_4304_8825)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.7274 0.714172H18.8615C20.1378 0.714172 21.1768 1.75323 21.1768 3.04076V23.3024L18.7486 21.1565L17.382 19.8916L15.9363 18.5476L16.5349 20.637H3.7274C2.45117 20.637 1.41211 19.5979 1.41211 18.3104V3.04076C1.41211 1.75323 2.45117 0.714172 3.7274 0.714172ZM13.7566 14.5495C14.0954 14.9786 14.502 15.4643 14.502 15.4643C16.998 15.3852 17.958 13.7476 17.958 13.7476C17.958 10.1109 16.3316 7.16311 16.3316 7.16311C14.7053 5.94335 13.158 5.97723 13.158 5.97723L12.9999 6.15794C14.9199 6.74523 15.8121 7.59229 15.8121 7.59229C14.6375 6.94853 13.4855 6.63229 12.4126 6.50806C11.5994 6.4177 10.8201 6.44029 10.1312 6.53064C10.072 6.53064 10.0215 6.53925 9.96451 6.54895C9.95618 6.55037 9.94778 6.5518 9.93917 6.55323C9.54387 6.58711 8.58387 6.73394 7.3754 7.26476C6.95752 7.45676 6.70905 7.59229 6.70905 7.59229C6.70905 7.59229 7.64646 6.70006 9.6794 6.11276L9.56646 5.97723C9.56646 5.97723 8.01917 5.94335 6.39282 7.16311C6.39282 7.16311 4.76646 10.1109 4.76646 13.7476C4.76646 13.7476 5.71517 15.3852 8.21117 15.4643C8.21117 15.4643 8.62905 14.956 8.96787 14.5269C7.53352 14.0977 6.9914 13.1942 6.9914 13.1942C6.9914 13.1942 7.10434 13.2732 7.30764 13.3862C7.31893 13.3975 7.33023 13.4087 7.35282 13.42C7.36976 13.4313 7.3867 13.4398 7.40364 13.4483C7.42058 13.4567 7.43752 13.4652 7.45446 13.4765C7.73682 13.6346 8.01917 13.7589 8.27893 13.8605C8.74199 14.0412 9.2954 14.2219 9.93917 14.3462C10.7862 14.5043 11.7801 14.5607 12.8643 14.3575C13.3952 14.2671 13.9373 14.109 14.502 13.8718C14.8973 13.725 15.3378 13.5104 15.8008 13.2055C15.8008 13.2055 15.2361 14.1316 13.7566 14.5495ZM8.09731 11.4448C8.09731 10.7559 8.60555 10.1912 9.24931 10.1912C9.89307 10.1912 10.4126 10.7559 10.4013 11.4448C10.4013 12.1338 9.89307 12.6985 9.24931 12.6985C8.61684 12.6985 8.09731 12.1338 8.09731 11.4448ZM12.2197 11.4448C12.2197 10.7559 12.7279 10.1912 13.3717 10.1912C14.0154 10.1912 14.5237 10.7559 14.5237 11.4448C14.5237 12.1338 14.0154 12.6985 13.3717 12.6985C12.7392 12.6985 12.2197 12.1338 12.2197 11.4448Z" fill="#2D4D53" />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_4304_8825">
                <rect width="24" height="23.2941" fill="white" transform="translate(0 0.705872)" />
              </clipPath>
            </defs>
          </svg>
        </a>
      </div>
    </footer>
  );
};

export default function ProjectsPage({ }) {
  return (

    <BaseLayout header={<Header />} customClassName="px-3 md:px-20 max-w-full">
      <Hero />
      <InfoSection />
      <Footer />
    </BaseLayout>
  );
}

