// Simple reversible obfuscation for IDs
// This is NOT cryptographically secure but prevents casual enumeration and hides the raw ID

const SECRET_KEY = process.env.NEXT_PUBLIC_APP_URL || "smartfolio-secret-key"

export function encodeId(text: string): string {
    if (!text) return ""
    try {
        // Simple XOR with key + Base64 encoding
        const textBytes = new TextEncoder().encode(text)
        const keyBytes = new TextEncoder().encode(SECRET_KEY)
        const resultBytes = new Uint8Array(textBytes.length)

        for (let i = 0; i < textBytes.length; i++) {
            resultBytes[i] = textBytes[i] ^ keyBytes[i % keyBytes.length]
        }

        // Convert to hex to be URL safe and look like a hash
        return Array.from(resultBytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
    } catch (e) {
        console.error("Error encoding ID:", e)
        return text
    }
}

export function decodeId(hash: string): string {
    if (!hash) return ""
    try {
        // Check if it looks like hex
        if (!/^[0-9a-fA-F]+$/.test(hash)) return hash

        const resultBytes = new Uint8Array(hash.length / 2)
        for (let i = 0; i < hash.length; i += 2) {
            resultBytes[i / 2] = parseInt(hash.substring(i, i + 2), 16)
        }

        const keyBytes = new TextEncoder().encode(SECRET_KEY)
        const textBytes = new Uint8Array(resultBytes.length)

        for (let i = 0; i < resultBytes.length; i++) {
            textBytes[i] = resultBytes[i] ^ keyBytes[i % keyBytes.length]
        }

        return new TextDecoder().decode(textBytes)
    } catch (e) {
        console.error("Error decoding ID:", e)
        return hash
    }
}
