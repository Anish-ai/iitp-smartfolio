"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Share2 } from "lucide-react"
import { encodeId } from "@/lib/crypto"

interface ShareResumeDialogProps {
    username: string // This is the raw userId
    name?: string
}

export function ShareResumeDialog({ username, name }: ShareResumeDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [url, setUrl] = useState("")

    useEffect(() => {
        if (typeof window !== "undefined" && username) {
            const encodedId = encodeId(username)
            setUrl(`${window.location.origin}/resume/${encodedId}`)
        }
    }, [username])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Share2 size={16} />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Resume</DialogTitle>
                    <DialogDescription>
                        Share {name ? `${name}'s` : "this"} resume with others via link or QR code.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-6 py-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                        {url && (
                            <QRCodeSVG
                                value={url}
                                size={200}
                                level="H"
                                includeMargin={true}
                            />
                        )}
                    </div>
                    <div className="w-full space-y-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="link"
                                value={url}
                                readOnly
                                className="flex-1"
                            />
                            <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
                                <span className="sr-only">Copy</span>
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
