import type React from "react"
import { Button } from "./ui/Button"
import { TwitterIcon } from "public/Twitter"

const getTwitterHref = (url: string) => {
    const encodedUrl = encodeURIComponent(url)
    return `https://twitter.com/intent/tweet?text=Checkout%20my%20project%20on%20Obol's%20RAF!%20&url=${encodedUrl}`
}

export type TwitterShareButtonProps = {
    url: string
}

export const TwitterShareButton = ({ url }: TwitterShareButtonProps) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        window.open(getTwitterHref(url), "_blank")
    }

    return (
        <Button
            onClick={handleClick}
            className="text-secondary-600 h-10 px-6 py-3  inline-flex items-center justify-center  text-center transition-colors  backdrop-blur-sm  rounded-lg duration-150 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
            variant="primary"
        >
            <TwitterIcon  />
            Share my project
        </Button>
    )
}

