import { Heading } from "~/components/ui/Heading";
import { ApproveVoters } from "~/features/voters/components/ApproveVoters";
import { VotersList } from "~/features/voters/components/VotersList";
import { AdminLayout } from "~/layouts/AdminLayout";

export default function VotersPage() {
  return (
    <AdminLayout title="Manage voters">
      <div className="flex items-center justify-between">
        <Heading as="h1" size="3xl">
          Approved voters
        </Heading>
        <ApproveVoters />
      </div>
      <VotersList />
    </AdminLayout>
  );
}
