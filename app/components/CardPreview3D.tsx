'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SocialLink {
  platform: string;
  handle: string;
}

interface CardData {
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  imageData?: string; // matches create page
  image_data?: string; // matches API response
  background_color?: string;
  text_color?: string;
  socials?: SocialLink[];
}

interface CardPreview3DProps {
  cardData: CardData;
  compact?: boolean;
  fullscreen?: boolean;
}

export default function CardPreview3D({ cardData, compact = false, fullscreen = false }: CardPreview3DProps) {
  const [isClient, setIsClient] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    mesh?: THREE.Mesh;
    animationId?: number;
    isVisible?: boolean;
  }>({});
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  console.log('CardPreview3D rendering with:', { cardData, compact });
  
  useEffect(() => {
    console.log('CardPreview3D useEffect running with cardData:', cardData);
  }, [cardData]);
  
  useEffect(() => {
    if (!isClient) return;
    
    // Initialize Three.js scene when client-side is ready
    if (!mountRef.current) return;

    const mountElement = mountRef.current; // Copy ref for cleanup

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, // Always enable antialiasing for quality
      alpha: true,
      powerPreference: "high-performance"
    });
    
    const width = compact ? 300 : (fullscreen ? window.innerWidth : 400);
    const height = compact ? 160 : (fullscreen ? window.innerHeight : 200);
    
    console.log('CardPreview3D: Canvas dimensions:', { width, height, fullscreen });
    
    const camera = new THREE.PerspectiveCamera(
      50,
      width / height, // Use actual aspect ratio
      0.1,
      1000
    );
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 2 : 4)); // Max quality pixel ratio
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Better color accuracy

    // Set canvas style to ensure it's visible and interactive
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.position = 'relative';
    renderer.domElement.style.zIndex = '1';

    console.log('CardPreview3D: Appending renderer to DOM');
    mountElement.appendChild(renderer.domElement);

    // Event listeners should be attached to the canvas, not the container
    const canvasElement = renderer.domElement;

    // Create card geometry - thin box with kosmo aspect ratio (1.75:1)
    const geometry = new THREE.BoxGeometry(1.75, 1, 0.02);
    
    // Create front face texture - ultra high resolution for quality
    const frontCanvas = document.createElement('canvas');
    const frontCtx = frontCanvas.getContext('2d')!;
    frontCanvas.width = 4096; // Ultra high resolution (4K)
    frontCanvas.height = 2340; // 4096 * (1/1.75) aspect ratio

    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    frontTexture.colorSpace = THREE.SRGBColorSpace; // Ensure proper color space
    frontTexture.flipY = true; // Flip for correct orientation
    frontTexture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Max anisotropic filtering
    frontTexture.minFilter = THREE.LinearMipmapLinearFilter;
    frontTexture.magFilter = THREE.LinearFilter;
    frontTexture.generateMipmaps = true;

    // Create back face texture - ultra high resolution
    const backCanvas = document.createElement('canvas');
    const backCtx = backCanvas.getContext('2d')!;
    backCanvas.width = 4096;
    backCanvas.height = 2340;

    const backTexture = new THREE.CanvasTexture(backCanvas);
    backTexture.colorSpace = THREE.SRGBColorSpace; // Ensure proper color space
    backTexture.flipY = true; // Flip for correct orientation
    backTexture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Max anisotropic filtering
    backTexture.minFilter = THREE.LinearMipmapLinearFilter;
    backTexture.magFilter = THREE.LinearFilter;
    backTexture.generateMipmaps = true;

    // Draw front face
    frontCtx.fillStyle = '#000000';
    frontCtx.fillRect(0, 0, frontCanvas.width, frontCanvas.height);

    // Draw company header (top) with embossed credit card effect
    if (cardData.company) {
      frontCtx.font = 'bold 96px Arial, sans-serif';
      frontCtx.textAlign = 'left';
      
      // Deep shadow layer (bottom-right for depth)
      frontCtx.fillStyle = '#000000';
      frontCtx.globalAlpha = 0.8;
      frontCtx.fillText(cardData.company, 252, 172);
      
      // Mid shadow layer
      frontCtx.fillStyle = '#1a1a1a';
      frontCtx.globalAlpha = 0.6;
      frontCtx.fillText(cardData.company, 248, 168);
      
      // Light shadow
      frontCtx.fillStyle = '#333333';
      frontCtx.globalAlpha = 0.5;
      frontCtx.fillText(cardData.company, 244, 164);
      
      // Main text layer
      frontCtx.globalAlpha = 1.0;
      frontCtx.fillStyle = '#666666';
      frontCtx.fillText(cardData.company, 240, 160);
      
      // Inner highlight
      frontCtx.fillStyle = '#888888';
      frontCtx.globalAlpha = 0.7;
      frontCtx.fillText(cardData.company, 236, 156);
      
      // Outer highlight layer (top-left for raised effect)
      frontCtx.fillStyle = '#aaaaaa';
      frontCtx.globalAlpha = 0.5;
      frontCtx.fillText(cardData.company, 232, 152);
      frontCtx.globalAlpha = 1.0;
    }

    // Draw profile image or initial (center)
    const centerX = frontCanvas.width / 2;
    const centerY = frontCanvas.height / 2;
    const imageSize = 800; // Reduced size for smaller photo

    function drawFrontInitial() {
      const initial = cardData.name ? cardData.name.charAt(0).toUpperCase() : "K";
      frontCtx.fillStyle = '#333';
      frontCtx.font = 'bold 1360px Arial, sans-serif';
      frontCtx.textAlign = 'center';
      frontCtx.textBaseline = 'middle';

      // Create topo pattern background
      const patternCanvas = document.createElement('canvas');
      const patternCtx = patternCanvas.getContext('2d')!;
      patternCanvas.width = 40;
      patternCanvas.height = 40;

      patternCtx.fillStyle = '#333';
      patternCtx.fillRect(0, 0, 40, 40);
      patternCtx.fillStyle = 'transparent';
      patternCtx.fillRect(2, 2, 12, 12);

      const pattern = frontCtx.createPattern(patternCanvas, 'repeat');
      if (pattern) {
        frontCtx.fillStyle = pattern;
        frontCtx.fillText(initial, centerX, centerY);
      }

      // Add subtle glow effect
      frontCtx.shadowColor = 'transparent';
      frontCtx.shadowBlur = 0;
      frontCtx.fillStyle = 'rgba(204,204,204,0.8)'; // Softer gray instead of bright white
      frontCtx.fillText(initial, centerX, centerY);
    }

    const imageSource = cardData.imageData || cardData.image_data;
    if (imageSource) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Prevent CORS issues
        img.onload = () => {
          frontCtx.save();
          
          // Reset any global composite operations to ensure proper color rendering
          frontCtx.globalCompositeOperation = 'source-over';
          frontCtx.globalAlpha = 1.0;
          
          // Disable any filtering that might alter colors
          frontCtx.imageSmoothingEnabled = true;
          frontCtx.imageSmoothingQuality = 'high';
          
          frontCtx.beginPath();
          frontCtx.arc(centerX, centerY, imageSize / 2, 0, Math.PI * 2);
          frontCtx.closePath();
          frontCtx.clip();
          
          // Calculate dimensions to fill the circular area while maintaining aspect ratio
          const imgAspect = img.width / img.height;
          const maxSize = imageSize; // Circle diameter
          
          let drawWidth, drawHeight;
          
          if (imgAspect > 1) {
            // Image is wider than tall - fit height to circle diameter, crop width
            drawHeight = maxSize;
            drawWidth = maxSize * imgAspect;
          } else {
            // Image is taller than wide - fit width to circle diameter, crop height
            drawWidth = maxSize;
            drawHeight = maxSize / imgAspect;
          }
          
          // Center the image so it fills the circle completely
          const drawX = centerX - drawWidth / 2;
          const drawY = centerY - drawHeight / 2;
          
          // Draw image with original aspect ratio and colors
          frontCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          frontCtx.restore();
          
          // Draw light grey 2px frame around the photo
          frontCtx.strokeStyle = '#cccccc';
          frontCtx.lineWidth = 8; // 4K scaled (2px visible)
          frontCtx.beginPath();
          frontCtx.arc(centerX, centerY, imageSize / 2, 0, Math.PI * 2);
          frontCtx.stroke();
          
          frontTexture.needsUpdate = true;
        };
        img.src = imageSource;
      } catch (e) {
        console.warn('Failed to load image:', e);
        // Draw initial as fallback
        drawFrontInitial();
      }
    } else {
      drawFrontInitial();
    }

    // Draw name at bottom left with embossed credit card effect
    if (cardData.name) {
      frontCtx.font = 'bold 100px Arial, sans-serif';
      frontCtx.textAlign = 'left';
      frontCtx.textBaseline = 'bottom';
      
      const nameY = frontCanvas.height - 140;
      
      // Deep shadow layer (bottom-right for depth)
      frontCtx.fillStyle = '#000000';
      frontCtx.globalAlpha = 0.9;
      frontCtx.fillText(cardData.name.toUpperCase(), 256, nameY + 16);
      
      // Mid-deep shadow
      frontCtx.fillStyle = '#0d0d0d';
      frontCtx.globalAlpha = 0.7;
      frontCtx.fillText(cardData.name.toUpperCase(), 252, nameY + 12);
      
      // Mid shadow layer
      frontCtx.fillStyle = '#1a1a1a';
      frontCtx.globalAlpha = 0.6;
      frontCtx.fillText(cardData.name.toUpperCase(), 248, nameY + 8);
      
      // Light shadow
      frontCtx.fillStyle = '#404040';
      frontCtx.globalAlpha = 0.4;
      frontCtx.fillText(cardData.name.toUpperCase(), 244, nameY + 4);
      
      // Main text layer
      frontCtx.globalAlpha = 1.0;
      frontCtx.fillStyle = '#CCCCCC';
      frontCtx.fillText(cardData.name.toUpperCase(), 240, nameY);
      
      // Inner highlight
      frontCtx.fillStyle = '#e6e6e6';
      frontCtx.globalAlpha = 0.8;
      frontCtx.fillText(cardData.name.toUpperCase(), 236, nameY - 4);
      
      // Mid highlight
      frontCtx.fillStyle = '#ffffff';
      frontCtx.globalAlpha = 0.7;
      frontCtx.fillText(cardData.name.toUpperCase(), 232, nameY - 8);
      
      // Outer highlight layer (top-left for embossed/raised effect)
      frontCtx.fillStyle = '#ffffff';
      frontCtx.globalAlpha = 0.4;
      frontCtx.fillText(cardData.name.toUpperCase(), 228, nameY - 12);
      frontCtx.globalAlpha = 1.0;
    }

    // Mark front texture as needing update after drawing
    frontTexture.needsUpdate = true;

    // Draw back face with aesthetic elements
    backCtx.fillStyle = '#000000';
    backCtx.fillRect(0, 0, backCanvas.width, backCanvas.height);

    // Add radial gradient overlay for depth
    const backGradient = backCtx.createRadialGradient(
      backCanvas.width / 2, backCanvas.height / 2, 0,
      backCanvas.width / 2, backCanvas.height / 2, Math.max(backCanvas.width, backCanvas.height) / 1.5
    );
    backGradient.addColorStop(0, 'rgba(20,20,20,0.3)');
    backGradient.addColorStop(0.5, 'rgba(0,0,0,0.1)');
    backGradient.addColorStop(1, 'rgba(0,0,0,0.6)');
    backCtx.fillStyle = backGradient;
    backCtx.fillRect(0, 0, backCanvas.width, backCanvas.height);

    // Draw title at top with embossed effect
    if (cardData.title) {
      backCtx.font = 'bold 260px Arial, sans-serif';
      backCtx.textAlign = 'left';
      backCtx.textBaseline = 'top';
      
      // Deep shadow layer (bottom-right)
      backCtx.fillStyle = '#000000';
      backCtx.globalAlpha = 0.9;
      backCtx.fillText(cardData.title, 260, 320);
      
      // Mid-deep shadow
      backCtx.fillStyle = '#0d0d0d';
      backCtx.globalAlpha = 0.7;
      backCtx.fillText(cardData.title, 254, 314);
      
      // Mid-tone shadow
      backCtx.fillStyle = '#1a1a1a';
      backCtx.globalAlpha = 0.6;
      backCtx.fillText(cardData.title, 248, 308);
      
      // Light shadow
      backCtx.fillStyle = '#404040';
      backCtx.globalAlpha = 0.4;
      backCtx.fillText(cardData.title, 244, 304);
      
      // Main text
      backCtx.globalAlpha = 1.0;
      backCtx.fillStyle = '#CCCCCC';
      backCtx.fillText(cardData.title, 240, 300);
      
      // Inner highlight
      backCtx.fillStyle = '#e6e6e6';
      backCtx.globalAlpha = 0.8;
      backCtx.fillText(cardData.title, 236, 296);
      
      // Mid highlight
      backCtx.fillStyle = '#ffffff';
      backCtx.globalAlpha = 0.7;
      backCtx.fillText(cardData.title, 232, 292);
      
      // Outer highlight (top-left)
      backCtx.fillStyle = '#ffffff';
      backCtx.globalAlpha = 0.4;
      backCtx.fillText(cardData.title, 228, 288);
      backCtx.globalAlpha = 1.0;
    }

    // Draw contact info in two columns
    backCtx.font = '80px Arial, sans-serif';
    backCtx.shadowColor = 'transparent';
    backCtx.shadowBlur = 0;
    backCtx.fillStyle = '#CCCCCC'; // Softer white for contact info
    backCtx.textAlign = 'left';

    const leftColumnX = 240; // 4K scaled
    const rightColumnX = backCanvas.width / 2 + 140; // 4K scaled
    let leftY = 800; // 4K scaled
    let rightY = 800; // 4K scaled

    // Left column: phone, email, website, address
    if (cardData.phone) {
      backCtx.fillText(`Phone: ${cardData.phone}`, leftColumnX, leftY);
      leftY += 100;
    }
    if (cardData.email) {
      backCtx.fillText(`Email: ${cardData.email}`, leftColumnX, leftY);
      leftY += 100;
    }
    if (cardData.website) {
      backCtx.fillText(`Website: ${cardData.website}`, leftColumnX, leftY);
      leftY += 100;
    }
    if (cardData.address) {
      backCtx.fillText(`Address: ${cardData.address}`, leftColumnX, leftY);
      leftY += 100;
    }

    // Right column: social links
    if (cardData.socials && cardData.socials.length > 0) {
      backCtx.fillText('Social Links:', rightColumnX, rightY);
      rightY += 100;
      cardData.socials.forEach((social: SocialLink) => {
        backCtx.fillText(`${social.platform}: ${social.handle}`, rightColumnX, rightY);
        rightY += 100;
      });
    }

    // Draw contact details on right
    backCtx.fillStyle = '#1F1F1F';
    backCtx.font = 'bold 96px Arial, sans-serif';
    backCtx.textAlign = 'right';
    if (cardData.name) {
      backCtx.fillText(cardData.name, backCanvas.width - 240, backCanvas.height - 240); // 4K scaled
    }
    if (cardData.company) {
      backCtx.font = '80px Arial, sans-serif';
      backCtx.fillText(cardData.company, backCanvas.width - 240, backCanvas.height - 140); // 4K scaled
    }

    // Mark back texture as needing update after drawing
    backTexture.needsUpdate = true;

    // Create materials array for cube faces (unlit, with dark textures for details)
    // BoxGeometry face order: right, left, top, bottom, front, back
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x000000 }), // right - pure black
      new THREE.MeshBasicMaterial({ color: 0x000000 }), // left
      new THREE.MeshBasicMaterial({ color: 0x000000 }), // top
      new THREE.MeshBasicMaterial({ color: 0x000000 }), // bottom
      new THREE.MeshBasicMaterial({
        map: frontTexture,
        transparent: false,
        toneMapped: false, // Disable tone mapping to preserve original colors
      }), // front - black background with details
      new THREE.MeshBasicMaterial({
        map: backTexture,
        transparent: false,
        toneMapped: false, // Disable tone mapping to preserve original colors
      })  // back - with vivid, original colors
    ];

    const mesh = new THREE.Mesh(geometry, materials);
    scene.add(mesh);

    // Add realistic beveled edges for a physical card appearance
    const edgesGeom = new THREE.EdgesGeometry(geometry);

    // Main edge lines - thicker and more visible
    const mainEdgesMaterial = new THREE.LineBasicMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0.4,
      linewidth: 2
    });
    const mainEdgeLines = new THREE.LineSegments(edgesGeom, mainEdgesMaterial);
    mainEdgeLines.renderOrder = 999;
    mesh.add(mainEdgeLines);

    // Inner edge highlight for depth
    const innerEdgesMaterial = new THREE.LineBasicMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0.2,
      linewidth: 1
    });
    const innerEdgeLines = new THREE.LineSegments(edgesGeom, innerEdgesMaterial);
    innerEdgeLines.scale.setScalar(0.995); // Slightly smaller for inset effect
    innerEdgeLines.renderOrder = 998;
    mesh.add(innerEdgeLines);

    // Outer edge shadow for realism
    const outerEdgesMaterial = new THREE.LineBasicMaterial({
      color: 0x222222,
      transparent: true,
      opacity: 0.3,
      linewidth: 1
    });
    const outerEdgeLines = new THREE.LineSegments(edgesGeom, outerEdgesMaterial);
    outerEdgeLines.scale.setScalar(1.002); // Slightly larger for outset effect
    outerEdgeLines.renderOrder = 997;
    mesh.add(outerEdgeLines);

    // Add soft ambient lighting for the glow effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Brighter ambient for glow visibility
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Softer directional light
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    // Position camera
    camera.position.set(0, 0, 2.5);
    camera.lookAt(0, 0, 0);

    console.log('CardPreview3D: Creating mesh and adding to scene');
    // Store refs
    sceneRef.current = { scene, camera, renderer, mesh, isVisible: true };

    // Animation variables
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let targetPositionX = 0; // New: for dragging card around
    let targetPositionY = 0; // New: for dragging card around
    let currentPositionX = 0; // New: for dragging card around
    let currentPositionY = 0; // New: for dragging card around
    let autoRotate = true;
    const autoRotateSpeed = 0.002; // Much slower for showroom effect
    let showroomTime = 0;
    let zoom = fullscreen ? 5.0 : 3.0; // Initial zoom distance (further back for fullscreen)
    let targetZoom = fullscreen ? 5.0 : 3.0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastTouchDistance = 0;
    let initialZoom = zoom;

    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchClickCount = 0;
    let touchClickTimer: number | null = null;

    // Touch event handlers for mobile
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        // Record touch start for tap vs drag detection
        touchStartTime = Date.now();
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        
        // Start potential drag after a short delay
        setTimeout(() => {
          if (event.touches.length === 1) { // Still touching
            isDragging = true;
            autoRotate = false;
            lastMouseX = event.touches[0].clientX;
            lastMouseY = event.touches[0].clientY;
            canvasElement.style.cursor = 'grabbing';
          }
        }, 150); // Short delay for tap vs drag distinction
      } else if (event.touches.length === 2) {
        // Two touches - start pinch zoom
        isDragging = false;
        autoRotate = false;
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        lastTouchDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        initialZoom = zoom;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      
      if (event.touches.length === 1 && isDragging) {
        // Single touch drag - move card position
        const touch = event.touches[0];
        const deltaX = touch.clientX - lastMouseX;
        const deltaY = touch.clientY - lastMouseY;
        
        targetPositionX += deltaX * 0.01;
        targetPositionY -= deltaY * 0.01; // Invert Y for natural feel
        
        lastMouseX = touch.clientX;
        lastMouseY = touch.clientY;
      } else if (event.touches.length === 2) {
        // Two touch pinch zoom
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        if (lastTouchDistance > 0) {
          const scale = currentDistance / lastTouchDistance;
          targetZoom = Math.max(0.5, Math.min(8, initialZoom / scale));
        }
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (event.changedTouches.length === 1) {
        const endTime = Date.now();
        const duration = endTime - touchStartTime;
        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;
        const distance = Math.sqrt(Math.pow(endX - touchStartX, 2) + Math.pow(endY - touchStartY, 2));
        
        // If it's a quick tap (not a drag), count for double-tap
        if (duration < 300 && distance < 10 && !isDragging) {
          const target = event.target as HTMLElement;
          if (target.tagName !== 'BUTTON' && target.tagName !== 'A' && !target.closest('button') && !target.closest('a')) {
            touchClickCount++;
            
            if (touchClickCount === 1) {
              touchClickTimer = window.setTimeout(() => {
                touchClickCount = 0;
              }, 300); // 300ms window for double-tap
            } else if (touchClickCount === 2) {
              if (touchClickTimer) {
                clearTimeout(touchClickTimer);
                touchClickTimer = null;
              }
              touchClickCount = 0;
              
              console.log('Double tap - flipping card');
              // Stop auto-rotate during flip
              autoRotate = false;
              
              // Calculate the nearest flat surface (front or back)
              const currentY = currentRotationY % (Math.PI * 2);
              const normalizedY = currentY < 0 ? currentY + Math.PI * 2 : currentY;
              
              // Find nearest multiple of π and add π to flip
              const nearestFlat = Math.round(normalizedY / Math.PI) * Math.PI;
              const flipTarget = nearestFlat + Math.PI;
              
              // Set target rotation to flip to opposite side
              targetRotationY = currentRotationY + (flipTarget - normalizedY);
              
              console.log('Touch flip: currentY=', currentRotationY, 'targetY=', targetRotationY);
              
              // Resume auto-rotate after flip completes
              setTimeout(() => {
                autoRotate = true;
              }, 1000);
            }
          }
        }
      }
      
      // Handle remaining touches for pinch zoom
      if (event.touches.length === 0) {
        // All touches ended
        isDragging = false;
        canvasElement.style.cursor = 'grab';
        setTimeout(() => autoRotate = true, 1000); // Resume auto-rotation after 1 second
      } else if (event.touches.length === 1) {
        // Back to single touch
        lastMouseX = event.touches[0].clientX;
        lastMouseY = event.touches[0].clientY;
      }
    };

    // Mouse interaction - simplified click and drag
    let mouseDownTime = 0;
    let mouseDownX = 0;
    let mouseDownY = 0;
    
    const handleMouseDown = (event: MouseEvent) => {
      console.log('Mouse down - preparing for potential drag');
      mouseDownTime = Date.now();
      mouseDownX = event.clientX;
      mouseDownY = event.clientY;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      // Don't set isDragging yet - wait for actual movement
    };

    const handleMouseMove = (event: MouseEvent) => {
      // Only start dragging if mouse button is held and has moved significantly
      if (mouseDownTime > 0) {
        const deltaX = event.clientX - mouseDownX;
        const deltaY = event.clientY - mouseDownY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Start dragging after moving more than 5 pixels
        if (distance > 5 && !isDragging) {
          isDragging = true;
          autoRotate = false;
          canvasElement.style.cursor = 'grabbing';
          console.log('Started dragging');
        }
      }
      
      if (!isDragging) return;
      
      const deltaX = event.clientX - lastMouseX;
      const deltaY = event.clientY - lastMouseY;
      
      // Move the card position instead of rotating
      targetPositionX += deltaX * 0.01;
      targetPositionY -= deltaY * 0.01; // Invert Y for natural feel
      
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      
      console.log('Dragging - moving card position:', targetPositionX, targetPositionY);
    };

    const handleMouseUp = () => {
      console.log('Mouse up - stopping drag');
      mouseDownTime = 0;
      isDragging = false;
      canvasElement.style.cursor = 'grab';
    };

    const handleMouseLeave = () => {
      console.log('Mouse leave - stopping drag and returning to showroom');
      mouseDownTime = 0;
      isDragging = false;
      autoRotate = true;
      canvasElement.style.cursor = 'grab';
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      // Zoom in/out with mouse wheel - wider range, less sensitive
      const zoomSpeed = 0.05;
      targetZoom = Math.max(0.5, Math.min(8, targetZoom + (event.deltaY > 0 ? zoomSpeed : -zoomSpeed)));
      console.log('Zoom target:', targetZoom);
    };

    const handleDblClick = (event: MouseEvent) => {
      // Only flip on double-click if not on interactive elements
      const target = event.target as HTMLElement;
      console.log('dblclick event fired, target:', target.tagName);
      if (target.tagName !== 'BUTTON' && target.tagName !== 'A' && !target.closest('button') && !target.closest('a')) {
        console.log('Double click - flipping card');
        // Reset drag state to ensure flip works
        isDragging = false;
        mouseDownTime = 0;
        autoRotate = false;
        
        // Calculate the nearest flat surface (front or back)
        // Normalize current rotation to 0-2π range
        const currentY = currentRotationY % (Math.PI * 2);
        const normalizedY = currentY < 0 ? currentY + Math.PI * 2 : currentY;
        
        // Determine which face is currently showing and flip to the opposite
        // Front face: 0, Back face: π
        // Find nearest multiple of π and add π to flip
        const nearestFlat = Math.round(normalizedY / Math.PI) * Math.PI;
        const flipTarget = nearestFlat + Math.PI;
        
        // Set target rotation to flip to opposite side
        targetRotationY = currentRotationY + (flipTarget - normalizedY);
        
        console.log('Flip: currentY=', currentRotationY, 'targetY=', targetRotationY);
        
        // Resume auto-rotate after flip completes
        setTimeout(() => {
          autoRotate = true;
        }, 1000);
      }
    };

    canvasElement.addEventListener('mousedown', handleMouseDown);
    canvasElement.addEventListener('mousemove', handleMouseMove);
    canvasElement.addEventListener('mouseup', handleMouseUp);
    canvasElement.addEventListener('mouseleave', handleMouseLeave);
    canvasElement.addEventListener('wheel', handleWheel);
    canvasElement.addEventListener('dblclick', handleDblClick);
    
    // Touch events for mobile
    canvasElement.addEventListener('touchstart', handleTouchStart);
    canvasElement.addEventListener('touchmove', handleTouchMove);
    canvasElement.addEventListener('touchend', handleTouchEnd);

    // Render loop
    const animate = () => {
      if (!sceneRef.current.isVisible) return;

      // Showroom-style auto-rotation (only when not dragging)
      if (autoRotate && !isDragging) {
        showroomTime += 0.005; // Very slow time increment
        targetRotationY += autoRotateSpeed;
        targetRotationX = Math.sin(showroomTime * 0.3) * 0.1; // Subtle X-axis wobble
      }

      // Smooth rotation interpolation
      const lerp = compact ? 0.1 : 0.05;
      currentRotationX += (targetRotationX - currentRotationX) * lerp;
      currentRotationY += (targetRotationY - currentRotationY) * lerp;
      
      // Smooth position interpolation
      currentPositionX += (targetPositionX - currentPositionX) * lerp;
      currentPositionY += (targetPositionY - currentPositionY) * lerp;

      // Smooth zoom interpolation
      zoom += (targetZoom - zoom) * 0.1;

      if (mesh) {
        mesh.rotation.x = currentRotationX; // Remove the Math.PI flip to fix upside-down
        mesh.rotation.y = currentRotationY;
        mesh.position.x = currentPositionX; // Apply position changes
        mesh.position.y = currentPositionY; // Apply position changes
      }

      // Update camera position for zoom
      if (camera) {
        camera.position.set(0, 0, zoom);
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize for responsive design
    const handleResize = () => {
      if (fullscreen && renderer && camera) {
        // Fullscreen mode: use window dimensions
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        renderer.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        console.log('Resized canvas (fullscreen):', { newWidth, newHeight });
      } else if (!compact && renderer && camera) {
        // Non-compact, non-fullscreen mode: use fixed dimensions
        const width = 400;
        const height = 200;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        console.log('Resized canvas (fixed):', { width, height });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (canvasElement) {
        canvasElement.removeEventListener('mousedown', handleMouseDown);
        canvasElement.removeEventListener('mousemove', handleMouseMove);
        canvasElement.removeEventListener('mouseup', handleMouseUp);
        canvasElement.removeEventListener('mouseleave', handleMouseLeave);
        canvasElement.removeEventListener('wheel', handleWheel);
        canvasElement.removeEventListener('dblclick', handleDblClick);
        canvasElement.removeEventListener('touchstart', handleTouchStart);
        canvasElement.removeEventListener('touchmove', handleTouchMove);
        canvasElement.removeEventListener('touchend', handleTouchEnd);
        
        if (mountElement && mountElement.contains(canvasElement)) {
          mountElement.removeChild(canvasElement);
        }
      }

      // Dispose of Three.js objects
      geometry.dispose();
      materials.forEach(material => material.dispose());
      frontTexture.dispose();
      backTexture.dispose();
      renderer.dispose();
    };
  }, [cardData, compact, fullscreen, isClient]);

  return (
    <div 
      ref={mountRef} 
      className={`${fullscreen ? "w-screen h-screen flex items-center justify-center" : "w-full"}`}
      style={{ height: fullscreen ? '100vh' : (compact ? '160px' : '200px') }}
    />
  );
}