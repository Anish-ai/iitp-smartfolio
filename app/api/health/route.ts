import { NextRequest, NextResponse } from 'next/server'

// GET /api/health - Health check endpoint to verify environment and database
export async function GET(request: NextRequest) {
  try {
    const envStatus = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DIRECT_URL: !!process.env.DIRECT_URL,
      JWT_SECRET: !!process.env.JWT_SECRET,
      NEXT_PUBLIC_IITP_AUTH_GATEWAY: !!process.env.NEXT_PUBLIC_IITP_AUTH_GATEWAY,
      NODE_ENV: process.env.NODE_ENV,
    }

    // Try to import Prisma
    let prismaStatus = 'not tested'
    let dbConnection = 'not tested'
    
    try {
      const { prisma } = await import('@/lib/db')
      prismaStatus = 'imported successfully'
      
      // Try a simple query
      await prisma.$queryRaw`SELECT 1`
      dbConnection = 'connected'
    } catch (error: any) {
      prismaStatus = `error: ${error.message}`
      dbConnection = `error: ${error.message}`
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: envStatus,
      prisma: prismaStatus,
      database: dbConnection,
      message: 'Health check completed'
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
