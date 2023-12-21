import { Layout } from "~/layouts/DefaultLayout";

import { type GetServerSideProps } from "next";

export default function ProjectsPage({}) {
  return <Layout>...</Layout>;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/projects",
    permanent: false,
  },
});
