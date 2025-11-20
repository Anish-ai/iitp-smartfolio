import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { decodeId } from '@/lib/crypto'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params
        const decodedId = decodeId(username)

        // Find profile by userId (decoded) or email (raw username)
        let profile = await prisma.profile.findUnique({
            where: { userId: decodedId },
            include: {
                projects: true,
                education: true,
                courses: true,
                achievements: true,
                skills: true,
                positions: true,
                certifications: true,
            },
        })

        // Fallback: Try finding by email if the param looks like an email
        if (!profile && username.includes('@')) {
            profile = await prisma.profile.findUnique({
                where: { email: username },
                include: {
                    projects: true,
                    education: true,
                    courses: true,
                    achievements: true,
                    skills: true,
                    positions: true,
                    certifications: true,
                },
            })
        }

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }

        return NextResponse.json(profile)
    } catch (error) {
        console.error('Error fetching public profile:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
