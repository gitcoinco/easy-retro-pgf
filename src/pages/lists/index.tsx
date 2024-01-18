import { Layout } from "~/layouts/DefaultLayout";

import { Lists } from "~/features/lists/components/Lists";
import { Button } from "~/components/ui/Button";
import Link from "next/link";

export default function ListsPage() {
  return (
    <Layout sidebar="left" showBallot eligibilityCheck>
      <div className="flex justify-end">
        <Button as={Link} href={`/lists/new`} variant="primary">
          New list
        </Button>
      </div>
      <Lists />
    </Layout>
  );
}
