import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { registrationId: string } }
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/event-registrations/${params.registrationId}/mark-attended`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': request.headers.get('Authorization') || '',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || 'Katılım durumu güncellenirken bir hata oluştu' },
        { status: response.status }
      )
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