import { NextRequest, NextResponse } from 'next/server';
import { renderPDF } from '@/lib/pdf';

export async function POST(req: NextRequest){
  const { subject, summary } = await req.json();
  if(!summary) return NextResponse.json({ error: 'summary required' }, { status: 400 });
  const bytes = await renderPDF(subject, summary);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="cma-summary.pdf"'
    }
  });
}


