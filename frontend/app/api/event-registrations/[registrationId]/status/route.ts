import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { registrationId: string } }
) {
  try {
    const body = await request.json()
    const { status, notes, checkedInBy } = body

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/event-registrations/${params.registrationId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': request.headers.get('Authorization') || '',
        },
        body: JSON.stringify({
          status,
          notes,
          checkedInBy
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || 'Katılım durumu güncellenirken bir hata oluştu' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating registration status:', error)
    return NextResponse.json(
      { error: 'Katılım durumu güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 