import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/kiraathane-events/${params.id}`
    )
    
    if (!response.ok) {
      throw new Error('Etkinlik detayları yüklenirken bir hata oluştu')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching event details:', error)
    return NextResponse.json(
      { error: 'Etkinlik detayları yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 