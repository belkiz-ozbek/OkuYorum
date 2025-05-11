import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate ve endDate parametreleri gerekli' },
        { status: 400 }
      )
    }

    // API URL'sini kontrol et
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('NEXT_PUBLIC_API_URL environment variable is not set')
      return NextResponse.json(
        { error: 'API URL yapılandırması eksik' },
        { status: 500 }
      )
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/kiraathane-events/between-dates?startDate=${startDate}&endDate=${endDate}`
    
    console.log('Fetching from URL:', url) // Debug log
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      return NextResponse.json(
        { error: `Backend API hatası: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json(
      { error: 'Etkinlikler yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 