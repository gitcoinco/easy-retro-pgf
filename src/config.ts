export const config = {
  logoUrl: "",

  pageSize: 3 * 4,
};

export const metadata = {
  title: "OpenRPGF",
  description: "OpenRPGF: Open-source Retro Public Goods Funding platform",
  url: "https://open-rpgf.vercel.app",
  image: "",
};

export const theme = {
  colorMode: "dark",
};

export const eas = {
  url: process.env.NEXT_PUBLIC_EASSCAN_URL ?? "",
  attesterAddress: process.env.NEXT_PUBLIC_APPROVED_APPLICATIONS_ATTESTER ?? "",
  schemas: {
    applicationsSchema: process.env.NEXT_PUBLIC_APPLICATIONS_SCHEMA ?? "",
    approvedApplicationsSchema:
      process.env.NEXT_PUBLIC_APPROVED_APPLICATIONS_SCHEMA ?? "",
    badgeholderAttester: process.env.NEXT_PUBLIC_BADGEHOLDER_ATTESTER ?? "",
    badgeholderSchema: process.env.NEXT_PUBLIC_BADGEHOLDER_SCHEMA ?? "",
    profileSchema: process.env.NEXT_PUBLIC_PROFILE_SCHEMA ?? "",
    listsSchema: process.env.NEXT_PUBLIC_LISTS_SCHEMA ?? "",
  },
};
