import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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

    // Authorization header'ını al
    const authHeader = request.headers.get('Authorization')
    console.log('API Route - Auth header:', authHeader ? 'Bearer [hidden]' : 'absent')

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    const url = `${apiUrl}/api/kiraathane-events/between-dates?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    
    console.log('API Route - Request URL:', url)
    
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }

    if (authHeader) {
      headers['Authorization'] = authHeader
      console.log('API Route - Forwarding Authorization header')
    }

    console.log('API Route - Final headers:', {
      ...headers,
      Authorization: headers.Authorization ? 'Bearer [hidden]' : undefined
    })
    
    const response = await fetch(url, {
      headers,
      next: { revalidate: 0 }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API error:', {
        status: response.status,
        statusText: response.statusText,
        url,
        errorText
      })
      
      if (response.status === 403) {
        return NextResponse.json(
          { 
            error: 'Etkinlikleri görüntülemek için giriş yapmanız gerekiyor',
            details: 'Yetkilendirme hatası'
          },
          { status: 403 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Etkinlikler yüklenirken bir hata oluştu',
          details: errorText
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { 
        error: 'Etkinlikler yüklenirken bir hata oluştu',
        details: error instanceof Error ? error.message : 'Bilinmeyen bir hata'
      },
      { status: 500 }
    )
  }
} 