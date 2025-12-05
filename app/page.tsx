"use client";

import { useState } from "react";
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import FluidBackground from "./FluidBackground";
import { useUser } from '@auth0/nextjs-auth0/client';

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
  socials: SocialLink[];
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
  "socials",
  "preview",
];

const styles = ["techno", "kosma", "classic"] as const;

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
    socials: [],
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [styleIndex, setStyleIndex] = useState(0);
  const [gradientStart, setGradientStart] = useState("#3b82f6");
  const [gradientEnd, setGradientEnd] = useState("#1e40af");
  const [startX, setStartX] = useState<number | null>(null);

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
    // Create a temporary div for the mobile-friendly 2K image
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '1440px';
    tempDiv.style.height = '2560px';
    tempDiv.style.background = 'linear-gradient(180deg, #000000 0%, #1a1a1a 100%)';
    tempDiv.style.display = 'flex';
    tempDiv.style.flexDirection = 'column';
    tempDiv.style.alignItems = 'center';
    tempDiv.style.justifyContent = 'center';
    tempDiv.style.padding = '60px';
    tempDiv.style.boxSizing = 'border-box';

    // Add logo at top
    const logoImg = document.createElement('img');
    logoImg.src = '/endless.webp?v=2';
    logoImg.style.width = '250px';
    logoImg.style.height = 'auto';
    logoImg.style.marginBottom = '20px';
    tempDiv.appendChild(logoImg);

    // Create front and back cards stacked
    const cardWrapper = document.createElement('div');
    cardWrapper.style.display = 'flex';
    cardWrapper.style.flexDirection = 'column';
    cardWrapper.style.gap = '30px';
    cardWrapper.style.alignItems = 'center';

    // Find current card faces
    const frontFace = document.querySelector('.techno-front, .kosma-front, .classic-front') as HTMLElement;
    const backFace = document.querySelector('.techno-back, .kosma-back, .classic-back') as HTMLElement;

    if (frontFace && backFace) {
      // Clone front
      const frontClone = frontFace.cloneNode(true) as HTMLElement;
      frontClone.style.position = 'static';
      frontClone.style.transform = 'none';
      frontClone.style.width = '1000px';
      frontClone.style.height = '600px';
      frontClone.style.margin = '0';
      frontClone.style.overflow = 'hidden';
      frontClone.style.padding = '35px';
      frontClone.style.boxSizing = 'border-box';
      frontClone.style.display = 'flex';
      frontClone.style.flexDirection = 'column';
      frontClone.style.justifyContent = 'space-between';
      frontClone.style.fontFamily = 'monospace';

      // Ensure Kosma card colors are preserved
      if (frontFace.classList.contains('kosma-front')) {
        frontClone.style.backgroundColor = '#050505';
        frontClone.style.color = '#FFFFFF';
        // Add the large K symbol background
        const kElement = frontClone.querySelector('.kosma-topo-k') as HTMLElement;
        if (kElement) {
          kElement.style.background = 'repeating-radial-gradient(circle at 30% 30%, #333 0px, #333 1px, transparent 2px, transparent 6px)';
          kElement.style.webkitBackgroundClip = 'text';
          kElement.style.backgroundClip = 'text';
          kElement.style.color = 'transparent';
          kElement.style.opacity = '0.6';
          kElement.style.filter = 'drop-shadow(0 0 1px rgba(255,255,255,0.1))';
          kElement.style.fontSize = '140px';
        }
        // Style front content container
        const frontContent = frontClone.querySelector('.kosma-front-content') as HTMLElement;
        if (frontContent) {
          frontContent.style.position = 'relative';
          frontContent.style.zIndex = '1';
          frontContent.style.height = '100%';
          frontContent.style.display = 'flex';
          frontContent.style.flexDirection = 'column';
          frontContent.style.justifyContent = 'space-between';
        }
      } else if (frontFace.classList.contains('techno-front')) {
        frontClone.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        frontClone.style.color = '#FFFFFF';
      } else if (frontFace.classList.contains('classic-front')) {
        frontClone.style.backgroundColor = '#ffffff';
        frontClone.style.color = '#000000';
      }

      // Clone back
      const backClone = backFace.cloneNode(true) as HTMLElement;
      backClone.style.position = 'static';
      backClone.style.transform = 'none';
      backClone.style.width = '1000px';
      backClone.style.height = '600px';
      backClone.style.margin = '0';
      backClone.style.overflow = 'hidden';
      backClone.style.padding = '35px';
      backClone.style.boxSizing = 'border-box';
      backClone.style.display = 'flex';
      backClone.style.flexDirection = 'column';
      backClone.style.justifyContent = 'space-between';
      backClone.style.fontFamily = 'monospace';

      // Ensure back card colors are preserved
      if (backFace.classList.contains('kosma-back')) {
        backClone.style.backgroundColor = '#EAEAEA';
        backClone.style.color = '#050505';
        // Add the radial gradient overlay
        backClone.style.position = 'relative';
        const overlay = document.createElement('div');
        overlay.style.content = '';
        overlay.style.position = 'absolute';
        overlay.style.top = '-50%';
        overlay.style.left = '-50%';
        overlay.style.width = '200%';
        overlay.style.height = '200%';
        overlay.style.background = 'radial-gradient(circle at center, #ffffff 0%, transparent 60%)';
        overlay.style.opacity = '0.6';
        overlay.style.pointerEvents = 'none';
        backClone.insertBefore(overlay, backClone.firstChild);
        
        // Update kosma back content to show all contact info
        const backContent = backClone.querySelector('.kosma-back-content') as HTMLElement;
        if (backContent) {
          backContent.style.position = 'relative';
          backContent.style.zIndex = '1';
          backContent.innerHTML = `
            <div style="font-size: 96px; line-height: 1.1; font-weight: 600; letter-spacing: -1px; word-break: break-word;">
              ${cardData.title || "Your Title"}
            </div>
            <div style="font-size: 39px; line-height: 1.8; color: #1F1F1F; margin-top: 8px;">
              <p style="margin: 6px 0;"><strong>Phone:</strong> ${cardData.phone || "Not provided"}</p>
              <p style="margin: 6px 0;"><strong>Email:</strong> ${cardData.email || "Not provided"}</p>
              <p style="margin: 6px 0;"><strong>Website:</strong> ${cardData.website || "Not provided"}</p>
              <p style="margin: 6px 0;"><strong>Address:</strong> ${cardData.address || "Not provided"}</p>
              ${cardData.socials.length > 0 ? `
                <p style="margin: 8px 0 4px 0;"><strong>Social Links:</strong></p>
                ${cardData.socials.map((social) => `<p style="margin: 4px 0; font-size: 36px;">${social.platform}: ${social.handle}</p>`).join('')}
              ` : ''}
            </div>
          `;
        }
      } else if (backFace.classList.contains('techno-back')) {
        backClone.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        backClone.style.color = '#FFFFFF';
        // Update techno back content
        const backContent = backClone.querySelector('.center-content') as HTMLElement;
        if (backContent) {
          backContent.style.textAlign = 'center';
          backContent.style.flexGrow = '1';
          backContent.style.display = 'flex';
          backContent.style.flexDirection = 'column';
          backContent.style.justifyContent = 'center';
          backContent.innerHTML = `
            <h2 style="font-size: 84px; margin-bottom: 16px; font-weight: 600;">Contact Information</h2>
            <div style="font-family: 'Space Mono', monospace; font-size: 39px; line-height: 1.8;">
              <p style="margin: 6px 0;"><strong>Phone:</strong> ${cardData.phone || "Not provided"}</p>
              <p style="margin: 6px 0;"><strong>Email:</strong> ${cardData.email || "Not provided"}</p>
              <p style="margin: 6px 0;"><strong>Website:</strong> ${cardData.website || "Not provided"}</p>
              <p style="margin: 6px 0;"><strong>Address:</strong> ${cardData.address || "Not provided"}</p>
              ${cardData.socials.length > 0 ? `
                <div style="margin-top: 10px;">
                  <strong style="display: block; margin-bottom: 6px;">Social:</strong>
                  ${cardData.socials.map((social) => `<p style="margin: 4px 0; font-size: 36px;">${social.platform}: ${social.handle}</p>`).join('')}
                </div>
              ` : ''}
            </div>
          `;
        }
      } else if (backFace.classList.contains('classic-back')) {
        backClone.style.backgroundColor = '#ffffff';
        backClone.style.color = '#000000';
        backClone.style.padding = '35px';
        backClone.style.boxSizing = 'border-box';
        backClone.style.display = 'flex';
        backClone.style.flexDirection = 'column';
        backClone.style.justifyContent = 'space-between';
        // Update classic back content
        const backContent = backClone.querySelector('.classic-contact-item') as HTMLElement;
        if (backContent && backContent.parentElement) {
          const parent = backContent.parentElement;
          parent.innerHTML = `
            <div style="font-size: 39px; line-height: 1.8; color: #000000;">
              <div style="margin-bottom: 8px;">
                <span style="font-weight: 600;">Phone:</span> ${cardData.phone || "Not provided"}
              </div>
              <div style="margin-bottom: 8px;">
                <span style="font-weight: 600;">Email:</span> ${cardData.email || "Not provided"}
              </div>
              <div style="margin-bottom: 8px;">
                <span style="font-weight: 600;">Website:</span> ${cardData.website || "Not provided"}
              </div>
              <div style="margin-bottom: 8px;">
                <span style="font-weight: 600;">Address:</span> ${cardData.address || "Not provided"}
              </div>
              ${cardData.socials.length > 0 ? `
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e0e0e0;">
                  <div style="font-weight: 600; margin-bottom: 6px;">Social Links:</div>
                  ${cardData.socials.map((social) => `<div style="margin-bottom: 4px; font-size: 36px;">${social.platform}: ${social.handle}</div>`).join('')}
                </div>
              ` : ''}
            </div>
          `;
        }
        // Add company name at bottom
        const footer = document.createElement('div');
        footer.style.fontSize = '32px';
        footer.style.fontWeight = '500';
        footer.style.color = '#666666';
        footer.style.marginTop = 'auto';
        footer.textContent = cardData.company || "Your Company";
        backClone.appendChild(footer);
      }

      cardWrapper.appendChild(frontClone);
      cardWrapper.appendChild(backClone);
    }

    tempDiv.appendChild(cardWrapper);    // Generate QR codes for links
    const qrPromises: Promise<string>[] = [];
    const links: { label: string; url: string }[] = [];

    if (cardData.website) {
      links.push({ label: 'Website', url: cardData.website.startsWith('http') ? cardData.website : 'https://' + cardData.website });
    }
    if (cardData.email) {
      links.push({ label: 'Email', url: 'mailto:' + cardData.email });
    }
    if (cardData.phone) {
      links.push({ label: 'Phone', url: 'tel:' + cardData.phone });
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
      if (url) links.push({ label: social.platform, url });
    });

    // Limit to 4 QRs
    const selectedLinks = links.slice(0, 4);

    for (const link of selectedLinks) {
      qrPromises.push(QRCode.toDataURL(link.url, { width: 200, margin: 1, errorCorrectionLevel: 'M' }));
    }

    // Wait for all QRs
    const qrDataURLs = await Promise.all(qrPromises);

    // Add QR codes below the cards
    const qrContainer = document.createElement('div');
    qrContainer.style.display = 'grid';
    qrContainer.style.gridTemplateColumns = selectedLinks.length > 2 ? '1fr 1fr' : '1fr';
    qrContainer.style.gap = '40px';
    qrContainer.style.width = '100%';
    qrContainer.style.maxWidth = '1000px';
    qrContainer.style.marginTop = '80px';
    qrContainer.style.padding = '0 60px';
    qrContainer.style.boxSizing = 'border-box';

    selectedLinks.forEach((link, index) => {
      const qrItem = document.createElement('div');
      qrItem.style.display = 'flex';
      qrItem.style.flexDirection = 'column';
      qrItem.style.alignItems = 'center';
      qrItem.style.gap = '16px';
      qrItem.style.background = '#ffffff';
      qrItem.style.padding = '35px';
      qrItem.style.borderRadius = '0';
      qrItem.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';

      const qrImg = document.createElement('img');
      qrImg.src = qrDataURLs[index];
      qrImg.style.width = '180px';
      qrImg.style.height = '180px';
      qrImg.style.display = 'block';

      const label = document.createElement('div');
      label.textContent = link.label;
      label.style.fontSize = '24px';
      label.style.textAlign = 'center';
      label.style.color = '#000000';
      label.style.fontWeight = 'bold';

      const urlText = document.createElement('div');
      urlText.textContent = link.url.length > 40 ? link.url.substring(0, 37) + '...' : link.url;
      urlText.style.fontSize = '18px';
      urlText.style.textAlign = 'center';
      urlText.style.color = '#666666';
      urlText.style.wordBreak = 'break-word';
      urlText.style.maxWidth = '100%';

      qrItem.appendChild(qrImg);
      qrItem.appendChild(label);
      qrItem.appendChild(urlText);
      qrContainer.appendChild(qrItem);
    });

    tempDiv.appendChild(qrContainer);

    document.body.appendChild(tempDiv);

    try {
      const canvas = await html2canvas(tempDiv, {
        width: 1440,
        height: 2560,
        backgroundColor: '#000000',
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 5000,
        windowHeight: 2560
      });

      // Convert canvas to blob for better mobile compatibility
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${cardData.name || 'business-card'}.png`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 0.95);
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Failed to generate PNG. Please try again.');
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  const totalSteps = STEP_KEYS.length;

  const goNext = () => {
    setCurrentStep(s => Math.min(s + 1, totalSteps - 1));
  };

  const goBack = () => {
    setCurrentStep(s => Math.max(s - 1, 0));
  };

  const addSocial = (platform = 'Instagram', handle = '', label = '') => {
    const autoLabel = label || platform;
    setCardData(prev => ({ ...prev, socials: [...prev.socials, { platform, handle, label: autoLabel }] }));
  };

  const updateSocial = (index: number, key: keyof SocialLink, value: string) => {
    const newSocials = [...cardData.socials];
    newSocials[index] = { ...newSocials[index], [key]: value };
    // Auto-update label when platform changes
    if (key === 'platform') {
      newSocials[index].label = value;
    }
    setCardData(prev => ({ ...prev, socials: newSocials }));
  };

  const removeSocial = (index: number) => {
    const newSocials = cardData.socials.filter((_, i) => i !== index);
    setCardData(prev => ({ ...prev, socials: newSocials }));
  };

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

  const nextStyle = () => setStyleIndex((i) => (i + 1) % styles.length);
  const prevStyle = () => setStyleIndex((i) => (i - 1 + styles.length) % styles.length);

  const { user, isLoading } = useUser();

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

        .interface-line {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #ccc;
          z-index: 0;
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
        .h-\\[30vh\\]::-webkit-scrollbar {
          width: 8px;
        }
        
        .h-\\[30vh\\]::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        
        .h-\\[30vh\\]::-webkit-scrollbar-thumb {
          background: rgba(255, 140, 0, 0.6);
          border-radius: 4px;
        }
        
        .h-\\[30vh\\]::-webkit-scrollbar-thumb:hover {
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
          background-color: #EAEAEA;
          color: #050505;
          transform: rotateY(180deg);
        }

        .kosma-back::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle at center, #ffffff 0%, transparent 60%);
          opacity: 0.6;
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
        }

        .kosma-contact-details strong {
          display: block;
          font-size: clamp(7px, 1.7vw, 14px);
          color: #050505;
          font-weight: 600;
          margin-bottom: clamp(2px, 0.5vw, 4px);
        }

        /* Techno Card Flip */
        .techno-card-wrapper {
          width: clamp(300px, 80vw, 600px);
          aspect-ratio: 1.75;
          position: relative;
          perspective: 1500px;
          cursor: pointer;
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

        .techno-card:hover, .techno-card.flipped {
          transform: rotateY(180deg);
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

        /* Classic Card Styles */
        .classic-card-wrapper {
          width: clamp(300px, 80vw, 600px);
          aspect-ratio: 1.75;
          position: relative;
          perspective: 1500px;
          cursor: pointer;
        }

        .classic-card {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border-radius: 0;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }

        .classic-card:hover {
          transform: rotateY(180deg);
        }

        .classic-card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 0;
          overflow: hidden;
          padding: clamp(12px, 3vw, 35px);
          box-sizing: border-box;
          font-family: sans-serif;
        }

        .classic-front {
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #000000;
        }

        .classic-back {
          background: #ffffff;
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #000000;
        }

        .classic-name {
          font-size: clamp(14px, 3.5vw, 32px);
          font-weight: 700;
          margin-bottom: clamp(4px, 1vw, 8px);
          color: #000000;
        }

        .classic-title {
          font-size: clamp(8px, 1.8vw, 16px);
          font-weight: 400;
          color: #333333;
          margin-bottom: clamp(8px, 2vw, 20px);
        }

        .classic-company {
          font-size: clamp(7px, 1.5vw, 14px);
          font-weight: 500;
          color: #666666;
          margin-top: auto;
        }

        .classic-contact-item {
          font-size: clamp(6px, 1.4vw, 12px);
          margin-bottom: clamp(4px, 1vw, 8px);
          color: #000000;
          line-height: 1.6;
        }

        .classic-contact-label {
          font-weight: 600;
          color: #000000;
          margin-right: clamp(4px, 0.8vw, 8px);
        }

        .classic-social-section {
          margin-top: clamp(8px, 2vw, 16px);
          padding-top: clamp(8px, 2vw, 16px);
          border-top: 1px solid #e0e0e0;
        }

        .glass-arrow {
          background: rgba(255, 140, 0, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 140, 0, 0.2);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff8c00;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: pulseArrow 5s ease-in-out infinite;
        }

        @keyframes pulseArrow {
          0%, 100% {
            background: rgba(255, 140, 0, 0.05);
          }
          50% {
            background: rgba(255, 140, 0, 0.2);
          }
        }

        .glass-arrow:hover {
          background: rgba(255, 140, 0, 0.3);
          transform: scale(1.1);
        }
      `}</style>

      <div className="max-w-4xl mx-auto flex flex-col h-full gap-4">
        
        <div className="flex justify-start h-[20vh] items-center">
          <img src="/endless.webp?v=2" alt="Endless Logo" className="w-24 h-auto sm:w-32 md:w-36 lg:w-40" />
        </div>
        
        {/* Questions / Form area - 30% height */}
        <div className="h-[30vh] overflow-y-auto">
            <div className="question-card h-full">
              <div className="progress" aria-hidden>
                <i style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }} />
              </div>

              {STEP_KEYS[currentStep] !== 'socials' && STEP_KEYS[currentStep] !== 'preview' && STEP_KEYS[currentStep] !== 'photo' && (
                <div>
                  <h1 className="text-2xl font-bold mb-3">{(() => {
                    const k = STEP_KEYS[currentStep];
                    switch(k) {
                      case 'name': return 'What is your full name?';
                      case 'title': return "What's your role/title?";
                      case 'company': return 'Company name';
                      case 'phone': return 'Phone number';
                      case 'email': return 'Email address';
                      case 'website': return 'Company Website';
                      case 'address': return 'Address';
                      default: return '';
                    }
                  })()}</h1>
                  <div className="large-input-wrapper">
                    <input
                      className="large-input"
                      value={cardData[STEP_KEYS[currentStep] as keyof CardData] as string}
                      onChange={(e) => handleInputChange(STEP_KEYS[currentStep] as keyof CardData, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && STEP_KEYS[currentStep] !== 'preview') goNext(); }}
                      placeholder="Type here..."
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {STEP_KEYS[currentStep] === 'photo' && (
                <div>
                  <div className="question">Upload a profile photo (optional)</div>
                  <div className="small">Select an image file to include in your contact card.</div>
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

              {STEP_KEYS[currentStep] === 'socials' && (
                <div>
                  <div className="question">Add social links (optional)</div>
                  <div className="mt-4 space-y-3">
                    {cardData.socials.length === 0 && (
                      <div className="text-sm text-gray-300 mb-4">Choose a platform to get started.</div>
                    )}

                    {cardData.socials.map((social, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-white">{social.platform}</div>
                          <button onClick={() => removeSocial(index)} className="btn-back text-xs">Remove</button>
                        </div>
                        <input 
                          className="input" 
                          value={social.handle} 
                          onChange={(e) => updateSocial(index, 'handle', e.target.value)} 
                          placeholder={`Enter your ${social.platform} URL or username`}
                        />
                      </div>
                    ))}

                    <div className="mt-4">
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => addSocial('Instagram')} className="btn-next text-sm">Instagram</button>
                        <button onClick={() => addSocial('LinkedIn')} className="btn-next text-sm">LinkedIn</button>
                        <button onClick={() => addSocial('X')} className="btn-next text-sm">X</button>
                        <button onClick={() => addSocial('GitHub')} className="btn-next text-sm">GitHub</button>
                        <button onClick={() => addSocial('Facebook')} className="btn-next text-sm">Facebook</button>
                        <button onClick={() => addSocial('TikTok')} className="btn-next text-sm">TikTok</button>
                        <button onClick={() => addSocial('YouTube')} className="btn-next text-sm">YouTube</button>
                        <button onClick={() => addSocial('Other')} className="btn-next text-sm">Other</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {STEP_KEYS[currentStep] === 'preview' && (
                <div>
                  <div className="question">✨ Done!</div>
                  <div className="small">This is the final preview of your digital business card. Export when ready.</div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <button onClick={exportAsVCard} className=" hover:bg-orange-400 text-white font-bold py-2 px-4 rounded">Export as Contact</button>
                    <button onClick={exportAsPNG} className=" hover:bg-orange-400 text-white font-bold py-2 px-4 rounded">Save as PNG</button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-5 mt-4">
                <button onClick={goBack} disabled={currentStep === 0} className="btn-back">Back</button>
                {STEP_KEYS[currentStep] !== 'preview' ? (
                  <button onClick={goNext} className="btn-next">Next</button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Preview below - 40% height */}
          <div className="h-[40vh] flex flex-col justify-center">

              <div className="relative flex justify-center">
                <button 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 glass-arrow z-10"
                  onClick={prevStyle}
                  onTouchStart={(e) => e.stopPropagation()}
                  aria-label="Previous style"
                >
                  ‹
                </button>
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
                  {cardStyle === "techno" ? (
                    <div className="techno-card-wrapper" style={{ transform: 'scale(1)', transformOrigin: 'center' }}>
                    <div className="techno-card">
                      <div className="techno-card-face techno-front">
                        <div className="top-label">{cardData.company || "Your Company"}</div>
                        <div className="center-content">
                          <h1 className="name">{cardData.name || "Your Name"}</h1>
                          <p className="role">[ <span>{cardData.title || "Your Title"}</span> ]</p>
                          <div className="social">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            @{cardData.socials[0]?.handle || cardData.name?.toLowerCase().replace(' ', '.') || 'your.handle'}
                          </div>
                        </div>
                        <div className="interface-area">
                          <div className="corner-text corner-left">{cardData.email || "your@email.com"}</div>
                          <div className="knob-group">
                            <div className="knob"></div>
                            <div className="knob"></div>
                            <div className="knob"></div>
                          </div>
                          <div className="corner-text corner-right">{cardData.website || "www.yoursite.com"}</div>
                        </div>
                        <svg className="wave-line">
                          <path d="M0,60 L20,60 Q40,60 40,40 L40,30 Q40,10 60,10 L540,10 Q560,10 560,30 L560,40 Q560,60 580,60 L600,60" fill="none" stroke="#CCC" strokeWidth="1" />
                        </svg>
                      </div>
                      <div className="techno-card-face techno-back">
                        <div className="center-content" style={{ textAlign: 'center' }}>
                          <h2>Contact Information</h2>
                          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: '1.6' }}>
                            <p><strong>Phone:</strong> {cardData.phone || "Not provided"}</p>
                            <p><strong>Email:</strong> {cardData.email || "Not provided"}</p>
                            <p><strong>Website:</strong> {cardData.website || "Not provided"}</p>
                            <p><strong>Address:</strong> {cardData.address || "Not provided"}</p>
                            {cardData.socials.length > 0 && (
                              <div>
                                <strong>Social:</strong>
                                {cardData.socials.map((social, i) => (
                                  <div key={i}>{social.platform}: {social.handle}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : cardStyle === "kosma" ? (
                    <div className="kosma-card-wrapper" style={{ transform: 'scale(1)', transformOrigin: 'center' }}>
                    <div className="kosma-card">
                      <div className="kosma-card-face kosma-front">
                        <div className="kosma-front-content">
                          <div className="kosma-brand-header">
                            {cardData.company || "Your Company"}<br />
                          </div>
                          <div className="kosma-topo-symbol-container">
                            <div className="kosma-topo-k">{cardData.name ? cardData.name.charAt(0).toUpperCase() : "K"}</div>
                          </div>
                          <div className="kosma-logo-text-bottom">
                            <span>{cardData.name || "Your Name"}</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                              <path d="M12 2L2 22H22L12 2Z" fill="white"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="kosma-card-face kosma-back">
                        <div className="kosma-back-content">
                          <div className="kosma-headline-large">
                            {cardData.title || "Your Title"}
                          </div>
                          <div style={{ fontSize: 'clamp(6px, 1.4vw, 12px)', lineHeight: '1.6', color: '#1F1F1F' }}>
                            <p><strong>Phone:</strong> {cardData.phone || "Not provided"}</p>
                            <p><strong>Email:</strong> {cardData.email || "Not provided"}</p>
                            <p><strong>Website:</strong> {cardData.website || "Not provided"}</p>
                            <p><strong>Address:</strong> {cardData.address || "Not provided"}</p>
                            {cardData.socials.length > 0 && (
                              <div>
                                <p><strong>Social Links:</strong></p>
                                {cardData.socials.map((social, i) => (
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
                              <strong>{cardData.name || "Your Name"}</strong>
                              {cardData.company || "Your Company"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="classic-card-wrapper" style={{ transform: 'scale(1)', transformOrigin: 'center' }}>
                    <div className="classic-card">
                      <div className="classic-card-face classic-front">
                        <div>
                          <div className="classic-name">{cardData.name || "Your Name"}</div>
                          <div className="classic-title">{cardData.title || "Your Title"}</div>
                        </div>
                        <div className="classic-company">{cardData.company || "Your Company"}</div>
                      </div>
                      <div className="classic-card-face classic-back">
                        <div>
                          <div className="classic-contact-item">
                            <span className="classic-contact-label">Phone:</span>
                            {cardData.phone || "Not provided"}
                          </div>
                          <div className="classic-contact-item">
                            <span className="classic-contact-label">Email:</span>
                            {cardData.email || "Not provided"}
                          </div>
                          <div className="classic-contact-item">
                            <span className="classic-contact-label">Website:</span>
                            {cardData.website || "Not provided"}
                          </div>
                          <div className="classic-contact-item">
                            <span className="classic-contact-label">Address:</span>
                            {cardData.address || "Not provided"}
                          </div>
                          {cardData.socials.length > 0 && (
                            <div className="classic-social-section">
                              <div className="classic-contact-label" style={{ marginBottom: 'clamp(4px, 1vw, 8px)' }}>Social Links:</div>
                              {cardData.socials.map((social, i) => (
                                <div key={i} className="classic-contact-item">
                                  {social.platform}: {social.handle}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="classic-company">{cardData.company || "Your Company"}</div>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
                <button 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 glass-arrow z-10"
                  onClick={nextStyle}
                  onTouchStart={(e) => e.stopPropagation()}
                  aria-label="Next style"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}                
