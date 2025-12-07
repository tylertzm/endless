"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from "react";
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import FluidBackground from "./FluidBackground";

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
  style?: 'kosma';
}

const STEP_KEYS = [
  "name",
  "title",
  "company",
  "phone",
  "email",
  "website",
  "address",
  "photo",
  "logo",
  "socials",
  "preview",
];

const styles = ["kosma"] as const;

export default function Home() {
  const [cardData, setCardData] = useState<CardData>({
    name: "",
    title: "",
    company: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    photo: "",
    logo: "",
    socials: [],
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [styleIndex, setStyleIndex] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [platformPopup, setPlatformPopup] = useState<{ platform: string | null; platformName?: string; handle: string } | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [steps] = useState<string[]>(STEP_KEYS);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('remember_card_data');
    const savedStep = localStorage.getItem('remember_current_step');
    const savedStyle = localStorage.getItem('remember_style_index');

    if (savedData) {
      try {
        setCardData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved card data", e);
      }
    }
    if (savedStep) {
      const step = parseInt(savedStep, 10);
      if (!isNaN(step) && step >= 0 && step < STEP_KEYS.length) {
        setCurrentStep(step);
      }
    }
    if (savedStyle) {
      const style = parseInt(savedStyle, 10);
      if (!isNaN(style) && style >= 0 && style < styles.length) {
        setStyleIndex(style);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('remember_card_data', JSON.stringify(cardData));
    } catch (e) {
      console.error('Failed to save card data to localStorage:', e);
    }
  }, [cardData]);

  useEffect(() => {
    localStorage.setItem('remember_current_step', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('remember_style_index', styleIndex.toString());
  }, [styleIndex]);

  const cardStyle = styles[styleIndex];

  const handleInputChange = (field: keyof CardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const exportAsVCard = () => {
    const nameParts = cardData.name.trim().split(' ');
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    let vCardData = 'BEGIN:VCARD\nVERSION:3.0\nN:' + lastName + ';' + firstName + ';;;\nFN:' + cardData.name + '\nTITLE:' + cardData.title + '\nORG:' + cardData.company + '\nTEL:' + cardData.phone + '\nEMAIL:' + cardData.email + '\nURL:' + cardData.website + '\nADR:' + cardData.address.replace(/\n/g, ';');
    if (cardData.photo) {
      vCardData += '\nPHOTO;ENCODING=b;TYPE=JPEG:' + cardData.photo.split(',')[1];
    }

    cardData.socials.forEach(social => {
      let url = '';
      switch (social.platform) {
        case 'Instagram':
          url = `https://instagram.com/${social.handle}`;
          break;
        case 'X':
          url = `https://twitter.com/${social.handle}`;
          break;
        case 'LinkedIn':
          url = social.handle.startsWith('http') ? social.handle : `https://linkedin.com/in/${social.handle}`;
          break;
        case 'GitHub':
          url = `https://github.com/${social.handle}`;
          break;
        default:
          url = social.handle;
      }
      vCardData += '\nURL:' + url;
    });

    vCardData += '\nEND:VCARD';

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cardData.name || 'contact'}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsPNG = async () => {
    console.log('Starting QR code export...');
    try {
      // Generate Master QR Code for the back of the card
      // This encodes the card data into a URL parameter for the website to render
      // We exclude heavy assets like photos from the QR code to keep the URL short
      const exportData = { ...cardData, style: cardStyle, photo: '' };
      const encodedData = btoa(JSON.stringify(exportData));
      const uuid = crypto.randomUUID();
      // Use the production domain for the QR code
      const masterUrl = `https://endless-two.vercel.app/c/${uuid}?data=${encodedData}`;
      console.log('Generating QR code for URL:', masterUrl);
      const masterQrDataUrl = await QRCode.toDataURL(masterUrl, { width: 400, margin: 1, errorCorrectionLevel: 'M' });
      console.log('QR code generated successfully');

      // Create a temporary div for the QR code image
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '400px';
      tempDiv.style.height = '550px';
      tempDiv.style.background = 'black';
      tempDiv.style.display = 'flex';
      tempDiv.style.flexDirection = 'column';
      tempDiv.style.alignItems = 'center';
      tempDiv.style.justifyContent = 'center';
      tempDiv.style.padding = '20px';
      tempDiv.innerHTML = `
        <img src="${masterQrDataUrl}" style="width: 240px; height: 240px; display: block; margin-bottom: 15px; filter: brightness(0.8) contrast(1.2) saturate(1.5);" />
        <div style="font-family: Arial, sans-serif; font-size: 5px; color: #FFFFFF; opacity: 0.7; text-align: center; word-break: break-all; padding: 0 10px;">${masterUrl}</div>
      `;

      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        width: 400,
        height: 550,
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 5000
      });

      // Convert canvas to blob for better mobile compatibility
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${cardData.name || 'business-card'}-qr.png`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          console.log('QR code downloaded successfully');
        } else {
          alert('Failed to generate QR code image. Please try again.');
        }
      }, 'image/png');

      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Error exporting QR code:', error);
      alert('Failed to export QR code. Please check the console for details.');
    }
  };

  const copyCardLink = async () => {
    // Exclude heavy assets like photos from the URL to keep it short
    const exportData = { ...cardData, style: cardStyle, photo: '' };
    const encodedData = btoa(JSON.stringify(exportData));
    const uuid = crypto.randomUUID();
    // Use the production domain
    const url = `https://endless-two.vercel.app/c/${uuid}?data=${encodedData}`;
    
    try {
      await navigator.clipboard.writeText(url);
      alert('Card link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL: ', err);
      alert('Failed to copy URL. Please copy manually: ' + url);
    }
  };

  const totalSteps = steps.length;

  const goNext = () => {
    setCurrentStep(s => Math.min(s + 1, totalSteps - 1));
  };

  const goBack = () => {
    setCurrentStep(s => Math.max(s - 1, 0));
  };

  

  // inline social inputs removed; editor popup handles social edits

  const removeSocial = (index: number) => {
    const newSocials = cardData.socials.filter((_, i) => i !== index);
    setCardData(prev => ({ ...prev, socials: newSocials }));
  };

  // handleAddPlatform removed: platform chips now open a popup directly

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setCardData(prev => ({ ...prev, photo: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setCardData(prev => ({ ...prev, logo: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStyle = () => setStyleIndex((i) => (i + 1) % styles.length);
  const prevStyle = () => setStyleIndex((i) => (i - 1 + styles.length) % styles.length);

  return (
    <>
      <FluidBackground />
      <div className="h-screen px-4  flex-col">
        {/* Header with login button */}
{/* <div className="relative">
  {!isLoading && (
    user ? (
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <span className="text-white">Welcome, {user.name}!</span>
        <a
          href="/api/auth/logout"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </a>
      </div>
    ) : (
      <a
        href="/api/auth/login"
        className="absolute top-4 right-4 bg-black-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
      >
        Login
      </a>
    )
  )}
</div> */}
      <style jsx>{`
        .card-front {
          background-color: #EAEAE6;
          color: #111111;
          padding: 25px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-family: monospace;
        }

        .card-wrapper {
          width: clamp(300px, 80vw, 600px);
          aspect-ratio: 1.75;
          position: relative;
          perspective: 1000px;
        }

        .card {
          width: 100%;
          height: 100%;
          border-radius: 0;
          position: relative;
          box-sizing: border-box;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          overflow: hidden;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .card-front {
          background-color: #EAEAE6;
          color: #111111;
          padding: 25px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-family: monospace;
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

        /* Typeform-like question card */
        .question-card {
          margin: 0 auto clamp(8px, 2vh, 16px);
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
          padding: clamp(16px, 4vw, 24px);
          border-radius: 0;
          box-shadow: none;
          transition: none;
        }
        
        /* Custom scrollbar */
        .scrollable-form::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollable-form::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        
        .scrollable-form::-webkit-scrollbar-thumb {
          background: rgba(255, 140, 0, 0.6);
          border-radius: 4px;
        }
        
        .scrollable-form::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 140, 0, 0.8);
        }
        
        .question {
          color: #fff;
          font-size: clamp(18px, 5vw, 24px);
          margin-bottom: clamp(8px, 1vh, 12px);
          font-weight: 500;
          font-family: 'Modern Prestige', sans-serif;
          animation: fadeInUp 0.5s ease-out;
        }
        .small {
          color: #9CA3AF;
          font-size: clamp(14px, 4vw, 16px);
          margin-bottom: clamp(8px, 1vh, 12px);
          animation: fadeInUp 0.5s ease-out 0.1s both;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 0;
          border: 1px solid rgba(255,255,255,0.3);
          background: transparent;
          color: #fff;
          font-size: 16px;
          transition: none;
        }
        .input:focus {
          outline: none;
          border-color: #fff;
          background: transparent;
          box-shadow: none;
        }
        .large-input-wrapper {
          position: relative;
          margin-top: clamp(10px, 2vh, 20px);
          margin-bottom: clamp(10px, 2vh, 20px);
        }
        .large-input {
          width: 100%;
          padding: clamp(12px, 3vw, 20px) clamp(16px, 4vw, 20px);
          font-size: clamp(16px, 4vw, 20px);
          font-weight: 300;
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          outline: none;
          transition: none;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 4px 16px rgba(255, 255, 255, 0.1);
        }
        .large-input:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 6px 20px rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        .input-prefix {
          position: absolute;
          left: 24px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.7);
          font-size: 24px;
          font-weight: 300;
          pointer-events: none;
          z-index: 1;
        }
        .controls {
          display:flex;
          gap:12px;
          justify-content: flex-end;
          margin-top: 20px;
        }
        .controls button {
          padding: 10px 20px;
          border-radius: 0;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: none;
        }
        @media (max-width: 640px) {
          .controls button {
            padding: 20px 40px;
            font-size: 20px;
          }
        }
        .controls button:first-child {
          background: transparent;
          color: #888;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .controls button:first-child:hover {
          background: transparent;
          color: #fff;
        }
        .controls button:last-child {
          background: #fff;
          color: #000;
          border: 1px solid #fff;
        }
        .controls button:last-child:hover {
          transform: none;
          box-shadow: none;
        }
        .btn-back, .btn-next {
          padding: 10px 20px;
          border-radius: 0;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: none;
        }
        .btn-back {
          background: transparent;
          color: #888;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .btn-back:hover {
          background: transparent;
          color: #fff;
        }
        .btn-back:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .btn-next {
          background: #fff;
          color: #000;
          border: 1px solid #fff;
        }
        .btn-next:hover {
          transform: none;
          box-shadow: none;
        }
        @media (max-width: 640px) {
          .btn-back, .btn-next {
            padding: 10px 20px;
            font-size: 14px;
          }
        }
        .progress {
          height: 12px;
          background: transparent;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: clamp(16px, 3vh, 24px);
          box-shadow: 
            inset 0 3px 6px rgba(0,0,0,0.4),
            inset 0 -2px 4px rgba(255,215,0,0.2);
          position: relative;
        }
        .progress::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, 
            rgba(255,255,255,0.9) 0%, 
            rgba(255,255,255,0.5) 30%, 
            rgba(255,255,255,0.1) 50%,
            rgba(255,255,255,0.5) 70%, 
            rgba(255,255,255,0.9) 100%);
          border-radius: 6px;
        }
        .progress > i {
          display:block;
          height:100%;
          background: linear-gradient(135deg, #ff8c00, #ff4500, #ff6b35, #ffa500);
          width:0%;
          transition: width 0.5s ease;
          border-radius: 6px;
          position: relative;
          box-shadow: 
            inset 0 2px 4px rgba(0,0,0,0.3),
            0 2px 4px rgba(255,140,0,0.4);
          transform: rotate(-1deg);
        }
        .progress > i::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, 
            rgba(255,255,255,0.8) 0%, 
            rgba(255,255,255,0.3) 50%, 
            rgba(255,255,255,0.8) 100%);
          border-radius: 6px;
        }

        /* KOSMA Card Styles */
        .kosma-card-wrapper {
          width: clamp(300px, 80vw, 600px);
          aspect-ratio: 1.75;
          position: relative;
          perspective: 1500px;
          cursor: pointer;
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

        .kosma-card:hover {
          transform: rotateY(180deg);
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

        .kosma-noise-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          opacity: 0.15;
          pointer-events: none;
          background-image: none;
          z-index: 0;
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

        .kosma-signature {
          width: clamp(50px, 14vw, 120px);
          margin-top: clamp(4px, 1.2vw, 10px);
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

        /* Auto flip animation: small tilt then full flip then reset */
        @keyframes autoFlip {
          0% { transform: rotateY(0deg); }
          20% { transform: rotateY(20deg); }
          50% { transform: rotateY(180deg); }
          70% { transform: rotateY(200deg); }
          100% { transform: rotateY(360deg); }
        }

        .kosma-card {
          animation: autoFlip 4s ease-in-out infinite;
        }

        .kosma-card.flipped {
          animation: none;
          transform: rotateY(180deg);
        }

        .kosma-card.flipped .kosma-front {
          visibility: hidden;
        }

        .kosma-card.zoomed {
          animation: none;
          transform: scale(1.5);
        }

        .kosma-card.flipped.zoomed {
          animation: none;
          transform: rotateY(180deg) scale(1.5);
        }
      `}</style>

      <div className="max-w-4xl mx-auto flex flex-col h-full gap-4">
        
        <div className="flex justify-start h-[20vh] items-center gap-4">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/endless.webp?v=2" alt="Endless Logo" className="w-24 h-auto sm:w-32 md:w-36 lg:w-40" />
          </div>
          <div style={{ flex: 1, maxWidth: '60%' }}>
            <div className="progress" aria-hidden>
              <i style={{ width: `${(currentStep / Math.max(totalSteps - 1, 1)) * 100}%` }} />
            </div>
          </div>
        </div>
        
        {/* Questions / Form area - 30% height */}
        <div className="scrollable-form min-h-[20vh] overflow-y-auto">
          <div className="question-card">
                {/* old in-card progress removed — header progress bar is used instead */}

              {steps[currentStep] !== 'socials' && steps[currentStep] !== 'preview' && steps[currentStep] !== 'photo' && (
                <div>
                  <h1 className="text-2xl font-bold mb-3">{(() => {
                    const k = steps[currentStep];
                    switch(k) {
                      case 'name': return 'What is your full name?';
                      case 'title': return "What's your role/title?";
                      case 'company': return 'Company name';
                      case 'phone': return 'Phone number';
                      case 'email': return 'Email address';
                      case 'website': return 'Company Website';
                      case 'address': return 'Address';
                      case 'photo': return 'Upload your photo';
                      case 'logo': return 'Upload company logo';
                      default: return '';
                    }
                  })()}</h1>
                  <div className="large-input-wrapper">
                    <input
                      className="large-input"
                      value={(cardData[steps[currentStep] as keyof CardData] as string) || ''}
                      onChange={(e) => handleInputChange(steps[currentStep] as keyof CardData, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && steps[currentStep] !== 'preview') goNext(); }}
                      placeholder="Type here..."
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {steps[currentStep] === 'photo' && (
                <div>
                  <div className="question">Upload a profile photo (optional)</div>
                  <div className="small">This photo will only be included in exported contact vCards for easy importing into address books.</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="input"
                  />
                  {cardData.photo && (
                    <div className="mt-2">
                      <img src={cardData.photo} alt="Preview" className="w-16 h-16 object-cover rounded" />
                    </div>
                  )}
                </div>
              )}

              {steps[currentStep] === 'logo' && (
                <div>
                  <div className="question">Upload company logo (optional)</div>
                  <div className="small">This logo will appear at the top of your exported QR code PNG for branding.</div>
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="input mt-4" />
                  {cardData.logo && (
                    <div className="mt-2">
                      <img src={cardData.logo} alt="Logo Preview" className="w-16 h-16 object-contain" />
                    </div>
                  )}
                </div>
              )}

              {steps[currentStep] === 'socials' && (
                <div>
                  <div className="question">Add social links (optional)</div>
                  <div className="mt-4 space-y-3">
                    {/* platform selection handled in modal popup */}

                    <div className="mt-4">
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '10px' }}>
                        {['Instagram','LinkedIn','X','GitHub','Facebook','TikTok','YouTube','Other'].map((plat) => {
                          const existing = cardData.socials.find(s => s.platform === plat);
                          const selected = !!existing;
                          const label = plat === 'LinkedIn' ? 'in' : plat === 'Instagram' ? 'IG' : plat === 'GitHub' ? 'gh' : plat === 'YouTube' ? 'yt' : plat === 'TikTok' ? 'tt' : plat === 'Facebook' ? 'fb' : plat === 'X' ? 'X' : plat === 'Other' ? '+' : plat;
                          return (
                            <div key={plat} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <button
                                onClick={() => setPlatformPopup({ platform: plat, handle: existing?.handle || '', platformName: plat === 'Other' ? '' : undefined })}
                                style={{ padding: '10px', borderRadius: '10px', fontSize: '13px', background: selected ? '#ff8c00' : 'transparent', color: selected ? '#000' : '#fff', border: '1px solid rgba(255,255,255,0.06)' }}
                                title={plat}
                              >
                                {label}
                              </button>
                              {selected && (
                                <div style={{ marginTop: '6px', fontSize: '12px', color: '#ccc', maxWidth: '80px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{existing?.handle}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {cardData.socials.length > 0 && (
                        <div className="mt-6">
                          <div className="text-sm text-gray-300 mb-3">Selected social links:</div>
                          <div className="flex flex-wrap gap-2">
                            {cardData.socials.map((social, idx) => (
                              <div key={idx} className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded">
                                <span className="text-sm">{social.platform}: {social.handle}</span>
                                <button onClick={() => removeSocial(idx)} className="btn-back text-xs">×</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {platformPopup && (
                        <div role="dialog" aria-modal="true" style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120 }}>
                          <div style={{ background: 'rgba(10,10,10,0.98)', padding: '18px', borderRadius: '12px', width: 'min(520px, 94%)' }}>
                            <div style={{ fontWeight: 700, marginBottom: 8 }}>{platformPopup.platform === 'Other' ? 'Add platform' : `Edit ${platformPopup.platform}`}</div>
                            {platformPopup.platform === 'Other' && (
                              <input
                                className="input"
                                value={platformPopup.platformName || ''}
                                onChange={(e) => setPlatformPopup(p => p ? { ...p, platformName: e.target.value } : p)}
                                placeholder="Platform name"
                              />
                            )}
                            <input
                              className="input"
                              value={platformPopup.handle}
                              onChange={(e) => setPlatformPopup(p => p ? { ...p, handle: e.target.value } : p)}
                              placeholder="Handle or URL"
                              autoFocus
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                              <button onClick={() => {
                                const plat = platformPopup.platform === 'Other' ? (platformPopup.platformName || 'Other') : (platformPopup.platform || 'Other');
                                const handle = (platformPopup.handle || '').trim();
                                setCardData(prev => {
                                  const others = prev.socials.filter(s => s.platform !== plat);
                                  if (handle.length > 0) return { ...prev, socials: [...others, { platform: plat, handle, label: plat }] };
                                  return { ...prev, socials: others };
                                });
                                setPlatformPopup(null);
                              }} className="btn-next">Save</button>
                              <button onClick={() => {
                                const plat = platformPopup.platform === 'Other' ? (platformPopup.platformName || 'Other') : (platformPopup.platform || 'Other');
                                setCardData(prev => ({ ...prev, socials: prev.socials.filter(s => s.platform !== plat) }));
                                setPlatformPopup(null);
                              }} className="btn-back">Remove</button>
                              <button onClick={() => setPlatformPopup(null)} className="btn-back">Cancel</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {steps[currentStep] === 'preview' && (
                <div>
                  <div className="question">✨ Done!</div>
                  <div className="small">This is the final preview of your digital business card. Export when ready.</div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <button onClick={exportAsVCard} className=" hover:bg-orange-400 text-white font-bold py-2 px-4 rounded">Export as Contact</button>
                    <button onClick={exportAsPNG} className=" hover:bg-orange-400 text-white font-bold py-2 px-4 rounded">Save QR Code</button>
                    <button onClick={copyCardLink} className=" hover:bg-orange-400 text-white font-bold py-2 px-4 rounded">Copy Link</button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-5 mt-4">
                <button onClick={goBack} disabled={currentStep === 0} className="btn-back">Back</button>
                {steps[currentStep] !== 'preview' ? (
                  <button onClick={goNext} className="btn-next">Next</button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Preview below - 40% height */}
          <div className="h-[40vh] flex flex-col justify-center">

              <div className="relative flex justify-center">
                <div
                  onTouchStart={(e) => setStartX(e.touches[0].clientX)}
                  onTouchEnd={(e) => {
                    if (startX === null) return;
                    const endX = e.changedTouches[0].clientX;
                    const diff = startX - endX;
                    if (Math.abs(diff) > 50) {
                      if (diff > 0) nextStyle();
                      else prevStyle();
                    }
                    setStartX(null);
                  }}
                  onMouseDown={(e) => setStartX(e.clientX)}
                  onMouseUp={(e) => {
                    if (startX === null) return;
                    const endX = e.clientX;
                    const diff = startX - endX;
                    if (Math.abs(diff) > 50) {
                      if (diff > 0) nextStyle();
                      else prevStyle();
                    }
                    setStartX(null);
                  }}
                >
                  <div className="kosma-card-wrapper relative" style={{ transform: 'scale(1)', transformOrigin: 'center' }} onClick={(e) => {
                    e.stopPropagation();
                    clickCountRef.current++;
                    if (clickCountRef.current === 1) {
                      clickTimerRef.current = setTimeout(() => {
                        setFlipped(!flipped);
                        clickCountRef.current = 0;
                      }, 300);
                    } else if (clickCountRef.current === 2) {
                      if (clickTimerRef.current) {
                        clearTimeout(clickTimerRef.current);
                      }
                      setZoomed(!zoomed);
                      setPanX(0);
                      setPanY(0);
                      clickCountRef.current = 0;
                    }
                  }}
                  onTouchStart={(e) => {
                    if (zoomed) {
                      const touch = e.touches[0];
                      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
                    }
                  }}
                  onTouchMove={(e) => {
                    if (zoomed && touchStartRef.current) {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const deltaX = touch.clientX - touchStartRef.current.x;
                      const deltaY = touch.clientY - touchStartRef.current.y;
                      setPanX(panX + deltaX / 2);
                      setPanY(panY + deltaY / 2);
                      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
                    }
                  }}
                  onMouseDown={(e) => {
                    if (zoomed) {
                      touchStartRef.current = { x: e.clientX, y: e.clientY };
                    }
                  }}
                  onMouseMove={(e) => {
                    if (zoomed && touchStartRef.current) {
                      e.preventDefault();
                      const deltaX = e.clientX - touchStartRef.current.x;
                      const deltaY = e.clientY - touchStartRef.current.y;
                      setPanX(panX + deltaX / 2);
                      setPanY(panY + deltaY / 2);
                      touchStartRef.current = { x: e.clientX, y: e.clientY };
                    }
                  }}
                  onMouseUp={() => {
                    touchStartRef.current = null;
                  }}
                  onTouchEnd={() => {
                    touchStartRef.current = null;
                  }}
                  >
                    <div 
                      className={`kosma-card ${flipped ? 'flipped' : ''} ${zoomed ? 'zoomed' : ''}`}
                      style={zoomed ? { 
                        transform: `scale(1.5) ${flipped ? 'rotateY(180deg)' : ''} translate(${panX}px, ${panY}px)` 
                      } : undefined}
                    >
                      <div className="kosma-card-face kosma-front">
                        <div className="kosma-front-content">
                          {cardData.company && (
                            <div className="kosma-brand-header">
                              {cardData.company}<br />
                            </div>
                          )}
                          <div className="kosma-topo-symbol-container">
                            <div className="kosma-topo-k">{cardData.name ? cardData.name.charAt(0).toUpperCase() : "K"}</div>
                          </div>
                          <div className="kosma-logo-text-bottom">
                            {cardData.name && <span>{cardData.name}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="kosma-card-face kosma-back">
                        <div className="kosma-back-content">
                          <div className="kosma-headline-large">
                            {cardData.title || "Your Title"}
                          </div>
                          <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
                            <div style={{ flex: 1, fontSize: 'clamp(6px, 1.4vw, 12px)', lineHeight: '1.6', color: '#FFFFFF', textAlign: 'justify' }}>
                              {cardData.phone && <p><strong>Phone:</strong> {cardData.phone}</p>}
                              {cardData.email && <p><strong>Email:</strong> {cardData.email}</p>}
                              {cardData.website && <p><strong>Website:</strong> {cardData.website}</p>}
                              {cardData.address && <p><strong>Address:</strong> {cardData.address}</p>}
                            </div>
                            <div style={{ flex: 1, fontSize: 'clamp(6px, 1.4vw, 12px)', lineHeight: '1.6', color: '#FFFFFF', textAlign: 'justify' }}>
                              {cardData.socials.length > 0 && (
                                <div>
                                  <p><strong>Social Links:</strong></p>
                                  {cardData.socials.map((social, i) => (
                                    <p key={i}>{social.platform}: {social.handle}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="kosma-info-grid">
                            <div className="kosma-palette-pill">
                              <div className="kosma-swatch kosma-s1"></div>
                              <div className="kosma-swatch kosma-s2"></div>
                              <div className="kosma-swatch kosma-s3"></div>
                              <div className="kosma-swatch kosma-s4"></div>
                            </div>
                            <div className="kosma-contact-details">
                              {cardData.name && <strong>{cardData.name}</strong>}
                              {cardData.company && <div>{cardData.company}</div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="text-white/50 py-4 text-center text-xs mt-4">
            <a href="/impressum" className="hover:text-white/80 transition-colors">
              Impressum
            </a>
          </footer>
        </div>
    </>
  );
}                
