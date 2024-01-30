import { signup } from "maci-cli";
import { useAccount } from "wagmi";
import { eas } from "~/config";
import { genRandomBabyJubValue } from "maci-crypto";
import { Keypair, PrivKey } from "maci-domainobjs";
import { config } from "~/config";
import { toBytes } from "viem";
import { useEthersSigner } from "~/hooks/useEthersSigner";

/**
 * Signup to MACI 
 */
export const maciSignup = async () => {
    // get the ethereum address of the connected user
    const { address } = useAccount();

    // get the signer
    const signer = useEthersSigner()
    
    // generate the maci keypair from a signature
    // 1. request signature

    // 2. generate private key (mock for now)
    const privateKey = new PrivKey(genRandomBabyJubValue());

    // 3. generate keypair
    const keypair = new Keypair(privateKey)

    // 4. save them to local storage 
    localStorage.setItem("maciPrivateKey", privateKey.serialize());
    localStorage.setItem("maciPublicKey", keypair.pubKey.serialize());

    // 5. get the attestation and eas related data
    const schema = eas.schemas.badgeholder;
    const attester = eas.schemas.badgeholderAttester;
    const attestation = "todo"

    // 6. call the maci signup function
    const stateIndex = await signup({
        maciPubKey: keypair.pubKey.serialize(),
        maciAddress: config.maciAddress,
        sgDataArg: toBytes(attestation).toString(),
        // for now we can leave out the initial voice credit proxy data
        // signer to be added once new package is published
    })

    // 7. save the state index to local storage
    localStorage.setItem("userStateIndex", stateIndex.toString());
}