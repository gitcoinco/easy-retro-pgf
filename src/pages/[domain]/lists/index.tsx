import { LayoutWithBallot } from "~/layouts/DefaultLayout";

import { Lists } from "~/features/lists/components/Lists";
import { Button } from "~/components/ui/Button";
import Link from "next/link";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";

export default function ListsPage() {
  const domain = useCurrentDomain();
  return (
    <LayoutWithBallot sidebar="left" showBallot eligibilityCheck>
      <div className="mb-2 flex justify-end">
        <Button as={Link} href={`/${domain}/lists/new`} variant="primary">
          New list
        </Button>
      </div>
      <Lists />
    </LayoutWithBallot>
  );
}
