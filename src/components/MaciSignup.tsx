import { Button } from "./ui/Button"
import { useEffect } from "react"
import { useAccount } from "wagmi"
import { useProfile } from "~/hooks/useProfile"

/**
 * Signup to the MACI contract for voting
 * @returns 
 */
export const MaciSignup = () => {

    const { address } = useAccount()
    const profile = useProfile(address)

    console.log("address", address)
    console.log("profile", profile)
   
    useEffect(() => {
        const _getAttestations = async () => {
            // const profile = useProfile(address) // Fetch the profile for the current Ethereum address
            console.log("profile", profile.data)        
        }

        _getAttestations()
    }, [])

    const signup = () => {
        console.log("signup")

    }

    return (
        <Button onClick={signup}>Signup to MACI</Button>
    )
}