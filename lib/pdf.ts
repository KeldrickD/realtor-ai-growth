import { CMASummary } from '@/types/cma';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function renderPDF(subject: string | undefined, s: CMASummary){
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  let y = 760;
  const draw = (text: string, size=12) => { page.drawText(text, { x: 40, y, size, font, color: rgb(0,0,0) }); y -= size+8; };

  draw('AI CMA Summary', 18);
  draw(subject || 'Subject Property');
  draw(`Suggested List: $${s.suggested_price_range.low.toLocaleString()} - $${s.suggested_price_range.high.toLocaleString()}`);
  y -= 8;
  draw('Rationale:', 14);
  s.rationale.slice(0,6).forEach(b=>draw(`• ${b}`));
  y -= 8;
  draw('Risks:', 14);
  s.risks.slice(0,4).forEach(b=>draw(`• ${b}`));
  y -= 8;
  draw('Talking Points:', 14);
  s.talking_points.slice(0,5).forEach(b=>draw(`• ${b}`));

  const bytes = await pdf.save();
  return bytes;
}


