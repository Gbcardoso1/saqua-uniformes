import { NextResponse } from "next/server"

type Submission = {
  id: string
  timestamp: string
  name: string
  matricula: string
  institution: string
  uniforms: Array<{
    type: string
    gender: string
    size: string
    quantity: string
  }>
  shoes: Array<{
    size: string
    quantity: string
  }>
}

export async function GET() {
  return NextResponse.json({ submissions: [] })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const submission: Submission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...data,
    }

    return NextResponse.json({ success: true, submission })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save submission" }, { status: 500 })
  }
}
