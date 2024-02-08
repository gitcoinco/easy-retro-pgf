import { Heading } from "~/components/ui/Heading";
import CreatePool from "~/features/distribute/components/CreatePool";
import { Distributions } from "~/features/distribute/components/Distributions";
import { Layout } from "~/layouts/DefaultLayout";
import { getAppState } from "~/utils/state";

export default function DistributePage() {
  return (
    <Layout>
      <Heading as="h1" size="3xl">
        Distribute
      </Heading>

      {getAppState() === "RESULTS" ? (
        <>
          <div className="mx-auto max-w-sm">
            <CreatePool />
          </div>
          <Distributions />
        </>
      ) : (
        <div>Round hasn&apos;t ended yet</div>
      )}
    </Layout>
  );
}
