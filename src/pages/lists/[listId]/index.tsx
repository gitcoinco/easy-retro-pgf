import { type GetServerSideProps } from "next";

import { Layout } from "~/layouts/DefaultLayout";
import ListDetails from "~/features/lists/components/ListDetails";
import { useListById } from "~/features/lists/hooks/useLists";

export default function ProjectDetailsPage({ listId = "" }) {
  const project = useListById(listId);

  return (
    <Layout sidebar="left" title={project.data?.name}>
      <ListDetails attestation={project.data!} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { listId },
}) => ({ props: { listId } });
