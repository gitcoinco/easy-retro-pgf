export const config = {
  logoUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='80'%3E%3Crect width='200' height='80' style='stroke-width:10;stroke:rgb(255,255,255);fill:transparent' stroke-dasharray='8' /%3E%3Ctext x='16' y='48' style='fill:white;font-family:system-ui;font-size:32' textLength='170'%3EYour logo%3C/text%3E%3C/svg%3E`,

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
