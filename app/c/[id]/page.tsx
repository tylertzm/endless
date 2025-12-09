"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, Suspense, useState, useRef, useCallback, use as useReact } from 'react';
import Head from 'next/head';
import { useParams } from 'next/navigation';
import { useUser } from '@stackframe/stack';
import dynamic from 'next/dynamic';

let html2canvasPromise: Promise<typeof import('html2canvas')> | null = null;
let qrCodePromise: Promise<typeof import('qrcode')> | null = null;

const loadHtml2Canvas = () => {
  if (!html2canvasPromise) html2canvasPromise = import('html2canvas');
  return html2canvasPromise;
};

const loadQRCode = () => {
  if (!qrCodePromise) qrCodePromise = import('qrcode');
  return qrCodePromise;
};

// Dynamic import for 3D card component (client-side only)
const CardPreview3D = dynamic(() => import('../../components/CardPreview3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-black/20 rounded-lg flex items-center justify-center">
      <div className="text-white/50">Loading 3D card...</div>
    </div>
  )
});

interface SocialLink {
  platform: string;
  handle: string;
}

interface CardData {
  name?: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  socials?: SocialLink[];
  imageData?: string;
  style?: 'kosma';
}

interface HistoryItem {
  id: string;
  data: CardData;
  timestamp: string;
}

function CardContent({ autoExport }: { autoExport: boolean }) {
  const params = useParams();
  const id = params.id as string;
  const user = useUser();

  const [data, setData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`/api/cards/${id}`, { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error('Card not found');
        }
        const cardData = await response.json();
        setData(cardData);
      } catch (err) {
        console.error('Failed to fetch card:', err);
        setError('Card not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCard();
    }
  }, [id]);

  const autoExportTriggeredRef = useRef(false);

  useEffect(() => {
    if (data && params.id) {
      try {
        const history: HistoryItem[] = JSON.parse(localStorage.getItem('card_history') || '[]');
        const newEntry: HistoryItem = {
          id: params.id as string,
          data: {
            // Only store essential display fields, not large data like images
            name: data.name,
            title: data.title,
            company: data.company,
          } as CardData,
          timestamp: new Date().toISOString(),
        };
        
        const exists = history.find((h) => h.id === params.id);
        if (!exists) {
          // Limit history to 50 entries to prevent quota issues
          const newHistory = [newEntry, ...history].slice(0, 50);
          localStorage.setItem('card_history', JSON.stringify(newHistory));
        }
      } catch (e) {
        console.error('Failed to save history', e);
      }
    }
  }, [data, params.id]);

  const exportAsPNG = useCallback(async () => {
    if (!data) return;

    console.log('Starting QR code export...');
    try {
      const [QRCode, html2canvasLib] = await Promise.all([loadQRCode(), loadHtml2Canvas()]);
      const { default: html2canvas } = html2canvasLib;
      // Generate QR Code for the card
      const url = `${window.location.origin}/c/${id}`;
      console.log('Generating QR code for URL:', url);
      const qrDataUrl = await QRCode.toDataURL(url, { width: 400, margin: 1, errorCorrectionLevel: 'M' });
      console.log('QR code generated successfully');

      // Create a temporary div for the QR code image
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '400px';
      tempDiv.style.height = '600px';
      tempDiv.style.background = 'linear-gradient(135deg, #C0C0C0 0%, #F5F5F5 50%, #C0C0C0 100%)';
      tempDiv.style.display = 'flex';
      tempDiv.style.flexDirection = 'column';
      tempDiv.style.alignItems = 'center';
      tempDiv.style.justifyContent = 'center';
      tempDiv.style.padding = '30px 20px';
      tempDiv.innerHTML = `
        <img src="/endless.webp" style="width: 120px; height: auto; margin-bottom: 20px; filter: brightness(0);" />
        <img src="${qrDataUrl}" style="width: 220px; height: 220px; display: block; margin-bottom: 16px; filter: brightness(0);" />
        <div style="font-family: Arial, sans-serif; font-size: 9px; color: #000000; opacity: 0.8; text-align: center; word-break: break-all; padding: 0 20px; line-height: 1.4;">${url}</div>
      `;

      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        width: 400,
        height: 600,
        backgroundColor: '#C0C0C0',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 5000
      });

      // Convert canvas to blob for better mobile compatibility
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          
          // Create download link that works on both mobile and desktop
          const link = document.createElement('a');
          link.href = url;
          link.download = `${data.name || 'business-card'}-qr.png`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');

      // Clean up
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export card. Please try again.');
    }
  }, [data, id]);

  // Trigger auto-export once when requested via query param and data is ready
  useEffect(() => {
    if (autoExport && data && !autoExportTriggeredRef.current) {
      autoExportTriggeredRef.current = true;
      const t = setTimeout(() => {
        exportAsPNG();
      }, 250);
      return () => clearTimeout(t);
    }
  }, [autoExport, data, exportAsPNG]);

  const saveContact = () => {
    if (!data || !data.name) return;
    const nameParts = data.name.trim().split(' ');
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    
    let vCardData = 'BEGIN:VCARD\nVERSION:3.0\n';
    vCardData += `N:${lastName};${firstName};;;\n`;
    vCardData += `FN:${data.name}\n`;
    vCardData += `TITLE:${data.title}\n`;
    vCardData += `ORG:${data.company}\n`;
    vCardData += `TEL:${data.phone}\n`;
    vCardData += `EMAIL:${data.email}\n`;
    vCardData += `URL:${data.website}\n`;
    vCardData += `ADR:;;${(data.address || '').replace(/\n/g, ';')};;;;\n`;
    
    // Add photo if available
    if (data.imageData) {
      // Extract base64 data from data URL (remove "data:image/jpeg;base64," prefix)
      const base64Data = data.imageData.split(',')[1];
      vCardData += `PHOTO;ENCODING=BASE64;TYPE=JPEG:${base64Data}\n`;
    }
    
    if (data.socials) {
      data.socials.forEach(social => {
        let url = '';
        switch (social.platform) {
          case 'Instagram': url = `https://instagram.com/${social.handle}`; break;
          case 'X': url = `https://twitter.com/${social.handle}`; break;
          case 'LinkedIn': url = social.handle.startsWith('http') ? social.handle : `https://linkedin.com/in/${social.handle}`; break;
          case 'GitHub': url = `https://github.com/${social.handle}`; break;
          default: url = social.handle;
        }
        vCardData += `X-SOCIALPROFILE;type=${social.platform}:${url}\n`;
      });
    }

    vCardData += `NOTE:Create your own here ;) ${process.env.NEXT_PUBLIC_BASE_URL || 'https://endlessproduction.vercel.app'}\n`;

    vCardData += 'END:VCARD';

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.name || 'contact'}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveToProfile = async () => {
    if (!user) {
      window.location.href = '/';
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/cards/${id}/save`, {
        method: 'POST',
      });

      if (response.ok) {
        setIsSaved(true);
        alert('Card saved to your profile!');
      } else {
        const data = await response.json();
        if (data.error === 'Card already saved') {
          setIsSaved(true);
          alert('You already have this card saved!');
        } else {
          throw new Error('Failed to save');
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save card. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black grid place-items-center">
        <img
          src="/endless.webp"
          alt="Endless"
          className="w-12 h-12 md:w-16 md:h-16 object-contain animate-spin animate-pulse"
          style={{ animationDuration: '1.25s' }}
        />
      </div>
    );
  }

  if (error || !data) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Card not found</div>;
  }

  return (
    <>
      <Head>
        <title>{data.name ? `${data.name}'s Business Card` : 'Business Card'}</title>
        <meta name="description" content={`${data.company || 'Company'} - ${data.title || 'Professional'} - Digital Business Card`} />
        <meta property="og:title" content={data.name ? `${data.name}'s Business Card` : 'Business Card'} />
        <meta property="og:description" content={`${data.company || 'Company'} - ${data.title || 'Professional'}`} />
        <meta property="og:image" content="/endless.webp" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.name ? `${data.name}'s Business Card` : 'Business Card'} />
        <meta name="twitter:description" content={`${data.company || 'Company'} - ${data.title || 'Professional'}`} />
        <meta name="twitter:image" content="/endless.webp" />
      </Head>
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans overflow-hidden p-4">
      <style jsx global>{`
        /* KOSMA Card Styles */
        .kosma-card-wrapper {
          width: clamp(300px, 80vw, 600px);
          aspect-ratio: 1.75;
          position: relative;
          perspective: 1500px;
        }

        .kosma-card {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border-radius: 0;
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.15);
        }

        .kosma-card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 0;
          overflow: hidden;
          padding: clamp(14px, 4.2vw, 35px);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .kosma-front {
          background-color: #050505;
          color: #FFFFFF;
        }

        .kosma-front-content {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .kosma-brand-header {
          font-size: clamp(7px, 1.7vw, 14px);
          font-weight: 400;
          letter-spacing: 0.5px;
          color: #888888;
          font-family: 'Inter', sans-serif;
          z-index: 10;
          position: relative;
        }

        .kosma-topo-symbol-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 180px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kosma-topo-k {
          font-size: clamp(80px, 24vw, 200px);
          font-weight: 700;
          line-height: 1;
          background: repeating-radial-gradient(
            circle at 30% 30%, 
            #333 0px, 
            #333 1px, 
            transparent 2px, 
            transparent 6px
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          opacity: 0.6;
          filter: drop-shadow(0 0 1px rgba(255,255,255,0.1));
        }

        .kosma-logo-text-bottom {
          font-size: clamp(10px, 3vw, 24px);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          z-index: 10;
          position: relative;
        }

        .kosma-back {
          background-color: #050505;
          color: #FFFFFF;
          transform: rotateY(180deg);
        }

        .kosma-back::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, transparent 60%);
          opacity: 1;
        }

        .kosma-back-content {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .kosma-headline-large {
          font-size: clamp(16px, 4.6vw, 38px);
          line-height: 1.1;
          font-weight: 600;
          max-width: 80%;
          letter-spacing: -1px;
          z-index: 10;
          position: relative;
        }

        .kosma-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(8px, 2.4vw, 20px);
          align-items: end;
        }

        .kosma-palette-pill {
          display: inline-flex;
          height: clamp(20px, 4.8vw, 40px);
          background: #FFFFFF;
          border-radius: clamp(10px, 2.4vw, 20px);
          padding: clamp(2px, 0.5vw, 4px);
          align-items: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          width: fit-content;
        }
        
        .kosma-swatch {
          width: clamp(16px, 3.8vw, 32px);
          height: clamp(16px, 3.8vw, 32px);
          border-radius: 50%;
          margin-right: clamp(-5px, -1.2vw, -10px);
          border: clamp(1px, 0.25vw, 2px) solid #FFFFFF;
        }
        .kosma-s1 { background: #050505; z-index: 4; }
        .kosma-s2 { background: #1F1F1F; z-index: 3; }
        .kosma-s3 { background: #888888; z-index: 2; }
        .kosma-s4 { background: #E0E0E0; z-index: 1; }

        .kosma-contact-details {
          text-align: right;
          font-family: sans-serif;
          font-size: clamp(6px, 1.4vw, 12px);
          line-height: 1.6;
          color: #1F1F1F;
          z-index: 10;
          position: relative;
        }

        .kosma-contact-details strong {
          display: block;
          font-size: clamp(7px, 1.7vw, 14px);
          color: #050505;
          font-weight: 600;
          margin-bottom: clamp(2px, 0.5vw, 4px);
        }

        /* Auto flip animation */
        @keyframes autoFlip {
          0% { transform: rotateY(0deg); }
          20% { transform: rotateY(20deg); }
          50% { transform: rotateY(180deg); }
          70% { transform: rotateY(200deg); }
          100% { transform: rotateY(360deg); }
        }

        .kosma-card {
          /* animation: autoFlip 4s ease-in-out infinite; */
        }

        .kosma-card.flipped {
          transform: rotateY(180deg);
        }

        .kosma-card.flipped .kosma-front {
          visibility: hidden;
        }

        .kosma-card.zoomed {
          transform: scale(1.5);
        }

        .kosma-card.flipped.zoomed {
          transform: scale(1.5) rotateY(180deg);
        }

        @keyframes promptPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.9; }
        }

        .prompt-animation {
          animation: promptPulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Full screen 3D card */}
      <div className="fixed inset-0 z-10">
        {data ? (
          <CardPreview3D cardData={data} fullscreen={true} />
        ) : (
          <div className="w-full h-full bg-black/20 flex items-center justify-center">
            <div className="text-white/50">Loading card...</div>
          </div>
        )}
      </div>

      {/* Impressum below 3D render */}
      {/* Floating buttons at bottom */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col sm:flex-row gap-2 sm:gap-4 max-w-full px-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button 
            onClick={saveContact}
            className="px-4 sm:px-8 py-2 sm:py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
          >
            <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span className="hidden xs:inline">Save Contact</span>
            <span className="xs:hidden">Save</span>
          </button>

          {user && (
            <button 
              onClick={handleSaveToProfile}
              disabled={saving || isSaved}
              className={`px-4 sm:px-8 py-2 sm:py-3 font-bold rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base ${
                isSaved 
                  ? 'bg-green-600 text-white cursor-not-allowed' 
                  : 'bg-black border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black'
              }`}
            >
              {saving ? 'Saving...' : isSaved ? 'Saved!' : 'Save to Profile'}
            </button>
          )}

          <button 
            onClick={exportAsPNG}
            className="px-4 sm:px-8 py-2 sm:py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
          >
            <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span className="hidden sm:inline">Export as PNG</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Impressum below floating buttons */}
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-20 text-white/50 text-center text-xs">
        <a href="/impressum" className="hover:text-white/80 transition-colors">
          Impressum
        </a>
      </div>

      {/* Instructions overlay - responsive */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20 text-center text-white/70 text-xs sm:text-sm bg-black/50 backdrop-blur-sm rounded-full px-3 sm:px-6 py-1 sm:py-2 max-w-[90vw] sm:max-w-none">
        <span className="hidden sm:inline">Click and drag to rotate • Double-click to flip • Scroll to zoom</span>
        <span className="sm:hidden">Drag to rotate • Tap to flip • Pinch to zoom</span>
      </div>

      {/* Endless logo below hints */}
      <div className="fixed top-12 sm:top-14 left-1/2 transform -translate-x-1/2 z-20">
        <a href={process.env.NEXT_PUBLIC_BASE_URL || "https://endlessproduction.vercel.app"} target="_blank" rel="noopener noreferrer">
          <img src="/endless.webp?v=2" alt="Endless Logo" className="w-20 sm:w-24 h-auto cursor-pointer hover:opacity-80 transition-opacity" />
        </a>
      </div>
    </div>
    </>
  );
}

export default function CardViewer({ searchParams }: { searchParams: Promise<{ export?: string }> }) {
  const params = useReact(searchParams);
  const exportParam = (params?.export || '').toLowerCase();
  const autoExport = exportParam === 'png';
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black grid place-items-center">
          <img
            src="/endless.webp"
            alt="Endless"
            className="w-12 h-12 md:w-16 md:h-16 object-contain animate-spin animate-pulse"
            style={{ animationDuration: '1.25s' }}
          />
        </div>
      }
    >
      <CardContent autoExport={autoExport} />
    </Suspense>
  );
}
