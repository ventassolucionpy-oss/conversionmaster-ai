import { NextRequest, NextResponse } from 'next/server'
import { calculateROI } from '@/lib/utils'
import { ROIInputs } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const inputs: ROIInputs = await req.json()
    const result = calculateROI(inputs)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: 'Error calculando ROI' }, { status: 500 })
  }
}
