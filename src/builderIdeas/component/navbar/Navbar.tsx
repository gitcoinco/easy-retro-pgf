"use client";
import React, { useState } from "react";
// import './Navbar.css'
import Link from "next/link";
import Image from "next/image";
import { config } from "~/config";
import DrawerNav from "./DrawerNav";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const menu = [
    { name: "RetroPGF", link: "https://app.optimism.io/retropgf-signup" },
    { name: "Bridge", link: "https://app.optimism.io/bridge/deposit" },
    { name: "Airdrop", link: "https://app.optimism.io/airdrops" },
    { name: "Builder", link: "/" },
  ];

  const dropdownMenu = [
    {
      title: "OPTIMISM",
      items: [
        { name: "About Optimism", link: "https://www.optimism.io/about" },
        { name: "Superchain", link: "https://app.optimism.io/superchain" },
      ],
    },
    {
      title: "GOVERNANCE",
      items: [
        { name: "Optimist NFT", link: "https://app.optimism.io/optimist-nft" },
        { name: "OP Collective", link: "https://app.optimism.io/announcement" },
        { name: "About RetroPGF", link: "https://app.optimism.io/retropgf" },
        { name: "Delegates", link: "https://vote.optimism.io" },
        { name: "Forum", link: "https://gov.optimism.io/" },
      ],
    },
    {
      title: "ECOSYSTEM",
      items: [
        { name: "Apps", link: "https://www.optimism.io/apps/all" },
        { name: "Quests", link: "https://app.optimism.io/quests" },
      ],
    },
    {
      title: "DEVELOPERS",
      items: [
        { name: "Superchain Faucet", link: "https://app.optimism.io/faucet" },
        { name: "Documentation", link: "https://docs.optimism.io/" },
        { name: "Github", link: "https://github.com/ethereum-optimism/" },
        { name: "Bug bounty", link: "https://immunefi.com/bounty/optimism/" },
      ],
    },
  ];

  return (
    <>
      <div className=" z-20 flex h-[4.5em]  items-center justify-between bg-background-dark md:px-6 lg:justify-start">
        <div className="mr-12">
          <Link
            className="text-custom-red font-rubik !font-semibold"
            href="/builderIdeas"
          >
            <Image
              className="max-h-full scale-75"
              width={144}
              height={48}
              alt="logo"
              src={config.logoUrl}
            />{" "}
          </Link>
        </div>
        {/* <div className="hidden lg:flex space-x-8 pr-2 items-center text-custom ">
          <ul className="flex gap-8 !font-inter  ">
            {menu.map((item, index) => (
              <a href={item.link} key={index}>
                <li className="NavMenu !font-medium transition ease-in-out duration-300">
                  <ul>{item.name}</ul>
                </li>
              </a>
            ))}
            {/* <li>
              <a
                className="NavMenu flex items-center gap-1 !font-medium"
                href="#"
              >
                More
                <div className="mt-0.5">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </a>

              <ul className="Dropdown overflow-y-auto max-h-90vh">
                {dropdownMenu.map((section, sectionIndex) => (
                  <li className="Content" key={sectionIndex}>
                    <span className="Title">{section.title}</span>
                    <li className="Content">
                      {section.items.map((item, itemIndex) => (
                        <a
                          className="Link"
                          href={item.link}
                          target="_blank"
                          key={itemIndex}
                        >
                          {item.name}
                        </a>
                      ))}
                      <div className="Line"></div>
                    </li>
                  </li>
                ))}
              </ul>
            </li> 
          </ul>
        </div> */}

        {/* <div
          className="flex lg:hidden Hamburger cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <a href="#">
            <svg
              fill="#424242"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2,4A1,1,0,0,1,3,3H21a1,1,0,0,1,0,2H3A1,1,0,0,1,2,4Zm1,9H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Zm0,8H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Z" />
            </svg>
          </a>
        </div> */}
      </div>

      <DrawerNav open={open} onClose={() => setOpen(false)}></DrawerNav>
    </>
  );
};
export default Navbar;
