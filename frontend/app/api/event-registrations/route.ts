import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event-registrations`, {
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Kayıtlar yüklenirken bir hata oluştu')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching event registrations:', error)
    return NextResponse.json(
      { error: 'Kayıtlar yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { registrationId: string } }
) {
  try {
    const registrationId = params.registrationId
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/event-registrations/${registrationId}/mark-attended`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': request.headers.get('Authorization') || '',
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Katılım durumu güncellenirken bir hata oluştu')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating attendance:', error)
    return NextResponse.json(
      { error: 'Katılım durumu güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 