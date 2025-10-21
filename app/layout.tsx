import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Realtor AI Growth – AI CMA Summarizer',
  description: 'Upload comps CSV → get a clean pricing range + talking points.',
};

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}


