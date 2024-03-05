import { Heading } from "~/components/ui/Heading";
import ConfigurePool from "~/features/distribute/components/CreatePool";
import { Distributions } from "~/features/distribute/components/Distributions";
import { Layout } from "~/layouts/DefaultLayout";
import { getAppState } from "~/utils/state";

export default function DistributePage() {
  return (
    <Layout sidebar="left" sidebarComponent={<ConfigurePool />}>
      {getAppState() === "RESULTS" ? (
        <>
          <Distributions />
        </>
      ) : (
        <div>Round hasn&apos;t ended yet</div>
      )}
    </Layout>
  );
}
