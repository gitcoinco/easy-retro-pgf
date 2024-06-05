# Trouble Shooting of MACI

## Error codes

Below are error codes and their related contract errors.

| Error Code   | Contract and Error Name                | Description                                                                                                                                                                                                                    |
| ------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `0xf5ee9a14` | MACI: PoseidonHashLibrariesNotLinked() | The poseidon contracts are not linked to the MACI deployment factory, or the linked poseidon contracts are not working correctly.                                                                                              |
| `0x79fae7af` | MACI: InvalidPubKey()                  | The generated MACI keypair is not on the curve, try to update the dependencies and re-generate one.                                                                                                                            |
| `0xcd74a32b` | EASGatekeeper: AttesterNotTrusted()    | The attestation submitted to the contract is not given by the trusted address registered to the contract. Make sure you deploy the EASGatekeeper contract with correct attester, or ask for an attestation from that attester. |
| `0xbff3c451` | EASGatekeeper: AlreadyRegistered()     | The provided attestation is already used to registered before.                                                                                                                                                                 |

## Sign up revert

There's no description in detail for signing up reverted by the contract. The following are some possible reasons:

- Make sure the trusted attester in the `EASGatekeeper` contract is same as `NEXT_PUBLIC_ADMIN_ADDRESS` in the `.env` file and the attestation giver.

- Make sure the provided `easAddress` in the `deploy-config.json` file is correct.

## Cannot get duration of a poll

If you found it displays "Voting is over", but you actually just started a poll:

- Make sure that you are deploying through **MACI v1.2.2**.

## Fail to process message and tally result

Check if the `useQV` flag is consistent.
