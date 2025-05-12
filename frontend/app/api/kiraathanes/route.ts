import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

    console.log('Fetching kiraathanes from:', `${backendUrl}/api/kiraathanes`)
    console.log('Auth header:', authHeader ? 'Present' : 'Not present')

    const response = await fetch(`${backendUrl}/api/kiraathanes`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': authHeader || '',
      },
      cache: 'no-store'
    })

    console.log('Backend response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error('Backend error:', errorData)
      throw new Error(errorData?.error || 'Kıraathaneler getirilemedi')
    }

    const data = await response.json()
    console.log('Received kiraathanes:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching kiraathanes:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Kıraathaneler yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 