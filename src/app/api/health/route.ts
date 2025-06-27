import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health check
    const timestamp = new Date().toISOString()
    
    return NextResponse.json({
      status: 'healthy',
      timestamp,
      version: '1.0.0',
      service: 'Caldera Token Allocation Checker',
      environment: process.env.NODE_ENV || 'production',
      memory: {
        used: process.memoryUsage().heapUsed / 1024 / 1024,
        total: process.memoryUsage().heapTotal / 1024 / 1024,
      },
      uptime: process.uptime(),
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    }, {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
