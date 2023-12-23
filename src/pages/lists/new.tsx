import { Layout } from "~/layouts/DefaultLayout";

import { ListCreateForm } from "~/features/lists/components/ListCreateForm";

export default function NewListPage() {
  return (
    <Layout>
      <ListCreateForm />
    </Layout>
  );
}
