import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const zai = await ZAI.create()
    const response = await zai.images.generations.create({
      prompt: `A realistic photo of a lost item: ${prompt}. Professional product photography style, clean background, well-lit, detailed. No text, no watermarks.`,
      size: '1024x1024',
    })

    const imageBase64 = response.data[0]?.base64
    if (!imageBase64) {
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
    }

    // Return as base64 data URL
    const dataUrl = `data:image/png;base64,${imageBase64}`

    return NextResponse.json({ imageUrl: dataUrl })
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}
