import type { Vote } from "~/features/ballot/types";

export function filterKnownNullBallots(
  roundId: string,
  ballots: { voterId: string; votes: Vote[] }[],
): { voterId: string; votes: Vote[] }[] {
  switch (roundId) {
    case "clw51aqhg0000llf7qgyqgrbl":
      return ballots.map((ballot) => {
        switch (ballot.voterId) {
          case "0xB9B04D9667D439215268DBe9F0F7126Dc8486bc8":
            return {
              ...ballot,
              votes: ballot.votes.filter(
                (vote) =>
                  ![
                    "0xc0d4e44c0f3821ec058f176c1037191754c94fbf589458c43ac1c5696771dcf6",
                    "0x7ff9f6b18d91d1c68a7ffe9a8ae47d1d80c901d41aa09a421396940f9d52c78b",
                    "0x5148a380bcde7d5bd2711a6b3700292a1ccde7a8397592d3a1e398e10f5ea4ae",
                    "0x97c4d252752415eafc3a8f471be23ef03389ea2871035162ad262db067d727f4",
                    "0x42717b94bd215827036600416cca928d2872b39ccd61d8efc56a265ef5084a5a",
                  ].includes(vote.projectId),
              ),
            };
          default:
            return ballot;
        }
      });
    default:
      return ballots;
  }
}
