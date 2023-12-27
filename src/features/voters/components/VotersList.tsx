import { api } from "~/utils/api";

function useVoters() {
  return api.voters.list.useQuery({});
}

export function VotersList() {
  const voters = useVoters();
  return (
    <div className="space-y-1">
      {voters.data?.map((voter) => (
        <div key={voter.recipient}>
          <div className="font-mono">{voter.recipient}</div>
        </div>
      ))}
    </div>
  );
}
