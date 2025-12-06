"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo } from 'react';
import { useSearchParams, useParams } from 'next/navigation';

interface SocialLink {
  platform: string;
  handle: string;
  label: string;
}

interface CardData {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  photo: string;
  logo: string;
  socials: SocialLink[];
  style?: 'kosma' | 'techno';
}

interface HistoryItem {
  id: string;
  data: CardData;
  timestamp: string;
}

export default function CardViewer() {
  const searchParams = useSearchParams();
  const params = useParams();

  const data = useMemo(() => {
    const encodedData = searchParams.get('data');
    if (!encodedData) return null;
    try {
      return JSON.parse(atob(encodedData)) as CardData;
    } catch (e) {
      console.error('Failed to decode card data', e);
      return null;
    }
  }, [searchParams]);

  useEffect(() => {
    if (data && params.id) {
      try {
        const history: HistoryItem[] = JSON.parse(localStorage.getItem('card_history') || '[]');
        const newEntry: HistoryItem = {
          id: params.id as string,
          data: data,
          timestamp: new Date().toISOString(),
        };
        
        const exists = history.find((h) => h.id === params.id);
        if (!exists) {
          localStorage.setItem('card_history', JSON.stringify([newEntry, ...history]));
        }
      } catch (e) {
        console.error('Failed to save history', e);
      }
    }
  }, [data, params.id]);

  if (!data) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  const cardStyle = data.style || 'kosma';

  const saveContact = () => {
    if (!data) return;
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
    
    // Note: Photo is excluded from QR data, so it won't be here unless we fetch it separately
    
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

  return (
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
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
        }

        .kosma-contact-details strong {
          display: block;
          font-size: clamp(7px, 1.7vw, 14px);
          color: #050505;
          font-weight: 600;
          margin-bottom: clamp(2px, 0.5vw, 4px);
        }

        /* Techno Card Styles */
        .techno-card-wrapper {
          width: clamp(300px, 80vw, 600px);
          aspect-ratio: 1.75;
          position: relative;
          perspective: 1500px;
        }

        .techno-card {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border-radius: 0;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }

        .techno-card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 0;
          overflow: hidden;
          box-sizing: border-box;
        }

        .techno-front {
          background-color: #EAEAE6;
          color: #111111;
          padding: clamp(12px, 3vw, 25px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-family: 'Space Mono', monospace;
        }

        .techno-back {
          background-color: #EAEAE6;
          color: #111111;
          padding: clamp(12px, 3vw, 25px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-family: 'Space Mono', monospace;
          transform: rotateY(180deg);
        }

        .top-label {
          font-size: clamp(6px, 1.2vw, 10px);
          text-transform: uppercase;
          letter-spacing: 1px;
          text-align: right;
          border-bottom: 1px solid #ccc;
          padding-bottom: clamp(4px, 1vw, 10px);
          margin-bottom: clamp(4px, 1vw, 10px);
          width: 100%;
        }

        .center-content {
          text-align: center;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-bottom: 20px;
        }

        .name {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(10px, 3vw, 24px);
          text-transform: uppercase;
          margin: 0 0 clamp(2px, 0.6vw, 5px) 0;
          letter-spacing: clamp(0.5px, 0.15vw, 1px);
        }

        .role {
          font-size: clamp(6px, 1.5vw, 12px);
          color: #555;
          margin: 0; 
        }

        .role span {
          color: #F24A29;
        }

        .social {
          margin-top: clamp(6px, 1.8vw, 15px);
          font-size: clamp(5px, 1.3vw, 11px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(2px, 0.6vw, 5px);
        }

        .interface-area {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          position: relative;
        }

        .knob-group {
          display: flex;
          gap: clamp(8px, 2.5vw, 20px);
          position: relative;
          z-index: 1;
          background: #EAEAE6;
          padding: 0 clamp(4px, 1.2vw, 10px);
          margin: 0 auto;
        }

        .knob {
          width: clamp(20px, 6vw, 50px);
          height: clamp(20px, 6vw, 50px);
          border: clamp(1px, 0.25vw, 2px) solid #111111;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .knob::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 12px;
          background-color: #F24A29;
          top: 5px;
          transform-origin: bottom center;
        }

        .knob:nth-child(1)::after { transform: rotate(-45deg) translateY(12px); }
        .knob:nth-child(2)::after { transform: rotate(0deg) translateY(12px); }
        .knob:nth-child(3)::after { transform: rotate(45deg) translateY(12px); }

        .corner-text {
          font-size: clamp(4px, 1.1vw, 9px);
          text-transform: uppercase;
          position: absolute;
          bottom: 5px;
        }
        .corner-left { left: clamp(12px, 3vw, 25px); bottom: clamp(14px, 4vw, 35px);}
        .corner-right { right: clamp(12px, 3vw, 25px); bottom: clamp(14px, 4vw, 35px);}

        .wave-line {
          position: absolute;
          bottom: 30px;
          left: 0;
          width: 100%;
          height: 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* Auto flip animation */
        @keyframes autoFlip {
          0% { transform: rotateY(0deg); }
          20% { transform: rotateY(20deg); }
          50% { transform: rotateY(180deg); }
          70% { transform: rotateY(200deg); }
          100% { transform: rotateY(360deg); }
        }

        .kosma-card, .techno-card {
          animation: autoFlip 4s ease-in-out infinite;
        }
      `}</style>

      <div className="mb-12">
         <img src="/endless.webp?v=2" alt="Endless Logo" className="w-32 h-auto" />
      </div>

      <div className="relative group cursor-pointer" onClick={saveContact}>
        <div className="absolute -inset-4 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        {cardStyle === 'techno' ? (
        <div className="techno-card-wrapper">
          <div className="techno-card">
            <div className="techno-card-face techno-front">
              <div className="top-label">
                {data.logo && (
                  <img src={data.logo} alt="Logo" style={{ width: 'clamp(30px, 8vw, 60px)', height: 'auto', marginBottom: '5px' }} />
                )}
                {data.company || "Your Company"}
              </div>
              <div className="center-content">
                <h1 className="name">{data.name || "Your Name"}</h1>
                <p className="role">[ <span>{data.title || "Your Title"}</span> ]</p>
                <div className="social">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  @{data.socials[0]?.handle || data.name?.toLowerCase().replace(' ', '.') || 'your.handle'}
                </div>
              </div>
              <div className="interface-area">
                <div className="corner-text corner-left">{data.email || "your@email.com"}</div>
                <div className="knob-group">
                  <div className="knob"></div>
                  <div className="knob"></div>
                  <div className="knob"></div>
                </div>
                <div className="corner-text corner-right">{data.website || "www.yoursite.com"}</div>
              </div>
              <svg className="wave-line">
                <path d="M0,60 L20,60 Q40,60 40,40 L40,30 Q40,10 60,10 L540,10 Q560,10 560,30 L560,40 Q560,60 580,60 L600,60" fill="none" stroke="#CCC" strokeWidth="1" />
              </svg>
            </div>
            <div className="techno-card-face techno-back">
              <div className="center-content" style={{ textAlign: 'center' }}>
                <h2>Contact Information</h2>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: '1.6' }}>
                  <p><strong>Phone:</strong> {data.phone || "Not provided"}</p>
                  <p><strong>Email:</strong> {data.email || "Not provided"}</p>
                  <p><strong>Website:</strong> {data.website || "Not provided"}</p>
                  <p><strong>Address:</strong> {data.address || "Not provided"}</p>
                  {data.socials.length > 0 && (
                    <div>
                      <strong>Social:</strong>
                      {data.socials.map((social, i) => (
                        <div key={i}>{social.platform}: {social.handle}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="kosma-card-wrapper">
          <div className="kosma-card">
            <div className="kosma-card-face kosma-front">
              <div className="kosma-front-content">
                <div className="kosma-brand-header">
                  {data.company || "Your Company"}<br />
                </div>
                <div className="kosma-topo-symbol-container">
                  {data.logo ? (
                    <img src={data.logo} alt="Logo" style={{ width: 'clamp(80px, 24vw, 200px)', height: 'auto', maxHeight: '180px', objectFit: 'contain' }} />
                  ) : (
                    <div className="kosma-topo-k">{data.name ? data.name.charAt(0).toUpperCase() : "K"}</div>
                  )}
                </div>
                <div className="kosma-logo-text-bottom">
                  <span>{data.name || "Your Name"}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2L2 22H22L12 2Z" fill="white"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="kosma-card-face kosma-back">
              <div className="kosma-back-content">
                <div className="kosma-headline-large">
                  {data.title || "Your Title"}
                </div>
                <div style={{ fontSize: 'clamp(6px, 1.4vw, 12px)', lineHeight: '1.6', color: '#FFFFFF' }}>
                  <p><strong>Phone:</strong> {data.phone || "Not provided"}</p>
                  <p><strong>Email:</strong> {data.email || "Not provided"}</p>
                  <p><strong>Website:</strong> {data.website || "Not provided"}</p>
                  <p><strong>Address:</strong> {data.address || "Not provided"}</p>
                  {data.socials.length > 0 && (
                    <div>
                      <p><strong>Social Links:</strong></p>
                      {data.socials.map((social, i) => (
                        <p key={i}>{social.platform}: {social.handle}</p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="kosma-info-grid">
                  <div className="kosma-palette-pill">
                    <div className="kosma-swatch kosma-s1"></div>
                    <div className="kosma-swatch kosma-s2"></div>
                    <div className="kosma-swatch kosma-s3"></div>
                    <div className="kosma-swatch kosma-s4"></div>
                  </div>
                  <div className="kosma-contact-details">
                    <strong>{data.name || "Your Name"}</strong>
                    {data.company || "Your Company"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={saveContact}
        className="mt-12 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        Save Contact
      </button>
      </div>
    </div>
  );
}
