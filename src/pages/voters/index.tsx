import { Heading } from "~/components/ui/Heading";
import { ApproveVoters } from "~/features/voters/components/ApproveVoters";
import { VotersList } from "~/features/voters/components/VotersList";
import { Layout } from "~/layouts/DefaultLayout";

export default function VotersPage() {
  return (
    <Layout title="Manage voters">
      <div className="flex items-center justify-between">
        <Heading as="h1" size="3xl">
          Approved voters
        </Heading>
        <ApproveVoters />
      </div>
      <VotersList />
    </Layout>
  );
}
