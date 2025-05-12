import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID\'si gerekli' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/kiraathane-events/${params.id}/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      }
    )
    
    if (!response.ok) {
      throw new Error('Kayıt işlemi başarısız oldu')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error registering for event:', error)
    return NextResponse.json(
      { error: 'Kayıt işlemi sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
} 