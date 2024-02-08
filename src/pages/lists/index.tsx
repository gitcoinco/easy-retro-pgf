import { LayoutWithBallot } from "~/layouts/DefaultLayout";

import { Lists } from "~/features/lists/components/Lists";
import { Button } from "~/components/ui/Button";
import Link from "next/link";

export default function ListsPage() {
  return (
    <LayoutWithBallot sidebar="left" showBallot eligibilityCheck>
      <div className="flex justify-end">
        <Button as={Link} href={`/lists/new`} variant="primary">
          New list
        </Button>
      </div>
      <Lists />
    </LayoutWithBallot>
  );
}
