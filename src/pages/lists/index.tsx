import { Layout } from "~/layouts/DefaultLayout";

import { Lists } from "~/features/lists/components/Lists";

export default function ListsPage() {
  return (
    <Layout sidebar="left" showBallot eligibilityCheck>
      <Lists />
    </Layout>
  );
}
