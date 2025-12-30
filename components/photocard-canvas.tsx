'use client';

import type React from 'react';
import { useRef, useEffect, useState } from 'react';
import type { TextLayer } from '@/lib/types';
import { calculateElapsedTime } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface PhotocardCanvasProps {
  image: string;
  textLayers: TextLayer[];
  onLayerUpdate: (id: string, updates: Partial<TextLayer>) => void;
  selectedLayerId: string;
  onLayerSelect: (id: string) => void;
  startDate: Date;
  timeHeader?: string;
}

export function PhotocardCanvas({
  image,
  textLayers,
  onLayerUpdate,
  selectedLayerId,
  onLayerSelect,
  startDate,
  timeHeader = 'শহীদ ওসমান হাদি হত্যার বিচারহীনতার সময়কাল',
}: PhotocardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number } | null>(
    null
  );
  const [elapsedTime, setElapsedTime] = useState(calculateElapsedTime(startDate));
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const CANVAS_SIZE = 1080;
  const IMAGE_HEIGHT = 720; // Top 2/3 for image
  const TIME_HEIGHT = 360; // Bottom 1/3 for elapsed time

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(calculateElapsedTime(startDate));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startDate]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Use full container width (parent already has padding)
        const maxSize = Math.min(containerWidth, 600);
        setScale(maxSize / CANVAS_SIZE);
      }
    };

    // Initial scale update
    updateScale();

    const resizeObserver = new ResizeObserver(() => {
      updateScale();
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setImageLoaded(false);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw image in top 2/3 portion
      const aspectRatio = img.width / img.height;
      let drawWidth = CANVAS_SIZE;
      let drawHeight = IMAGE_HEIGHT;
      let offsetX = 0;
      let offsetY = 0;

      const targetAspect = CANVAS_SIZE / IMAGE_HEIGHT;

      if (aspectRatio > targetAspect) {
        drawWidth = IMAGE_HEIGHT * aspectRatio;
        offsetX = -(drawWidth - CANVAS_SIZE) / 2;
      } else {
        drawHeight = CANVAS_SIZE / aspectRatio;
        offsetY = -(drawHeight - IMAGE_HEIGHT) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // Draw white background for time section
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, IMAGE_HEIGHT, CANVAS_SIZE, TIME_HEIGHT);

      ctx.save();
      ctx.font = '600 48px abu sayed';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '3px';
      ctx.fillText(timeHeader, CANVAS_SIZE / 2, IMAGE_HEIGHT + 90);
      ctx.restore();

      ctx.save();
      ctx.font = 'bold 80px abu sayed';
      ctx.fillStyle = '#ff0000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const timeText = `${toBanglaDigit(elapsedTime.days)} দিন ` +
        `${toBanglaDigit(elapsedTime.hours).toString().padStart(2, '০')} ঘণ্টা ` +
        `${toBanglaDigit(elapsedTime.minutes).toString().padStart(2, '০')} মিনিট`;


      ctx.fillText(timeText, CANVAS_SIZE / 2, IMAGE_HEIGHT + 200);

      // Add #JusticeForHadi text
      ctx.save();
      ctx.font = 'bold 60px abu sayed';
      ctx.fillStyle = '#ff0000'; // Red color for visibility
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('#JusticeForHadi', CANVAS_SIZE / 2, IMAGE_HEIGHT + 300);
      ctx.restore();

      setImageLoaded(true);
      setImageLoaded(true);
    };
    img.src = image;
  }, [image, elapsedTime, timeHeader, fontsLoaded]);

  // Initial font loading check
  // Initial font loading check
  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Explicitly load the custom font to ensure it's available for canvas
        await document.fonts.load('600 48px "abu sayed"');
        await document.fonts.load('bold 80px "abu sayed"');
        await document.fonts.load('bold 60px "abu sayed"');
        console.log('Fonts loaded explicitly');
      } catch (err) {
        console.error('Error loading fonts:', err);
      } finally {
        // Force a re-render even if loading fails
        setFontsLoaded(true);
      }
    };

    loadFonts();
  }, []);


  const handleMouseDown = (e: React.MouseEvent, layerId: string) => {
    e.preventDefault();
    onLayerSelect(layerId);
    const layer = textLayers.find(l => l.id === layerId);
    if (!layer) return;

    setDragging({
      id: layerId,
      startX: e.clientX - layer.x * scale,
      startY: e.clientY - layer.y * scale,
    });
  };

  const handleTouchStart = (e: React.TouchEvent, layerId: string) => {
    e.preventDefault();
    onLayerSelect(layerId);
    const layer = textLayers.find(l => l.id === layerId);
    if (!layer || !e.touches[0]) return;

    setDragging({
      id: layerId,
      startX: e.touches[0].clientX - layer.x * scale,
      startY: e.touches[0].clientY - layer.y * scale,
    });
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = (e.clientX - dragging.startX) / scale;
      const newY = (e.clientY - dragging.startY) / scale;
      const constrainedY = Math.max(0, Math.min(IMAGE_HEIGHT, newY));
      onLayerUpdate(dragging.id, { x: newX, y: constrainedY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const newX = (e.touches[0].clientX - dragging.startX) / scale;
      const newY = (e.touches[0].clientY - dragging.startY) / scale;
      const constrainedY = Math.max(0, Math.min(IMAGE_HEIGHT, newY));
      onLayerUpdate(dragging.id, { x: newX, y: constrainedY });
    };

    const handleEnd = () => setDragging(null);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [dragging, scale, onLayerUpdate]);

  return (
    <div ref={containerRef} className="relative w-full flex items-center justify-center">
      <div
        className="relative bg-white shadow-2xl rounded-lg overflow-hidden max-w-full"
        style={{
          width: CANVAS_SIZE * scale,
          height: CANVAS_SIZE * scale,
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="absolute inset-0 w-full h-full"
        />

        {!imageLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/10 backdrop-blur-[2px] z-50 animate-in fade-in duration-200">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="mt-2 text-sm font-medium text-muted-foreground">Generating Canvas...</p>
          </div>
        )}

        {imageLoaded &&
          textLayers.map(layer => {
            if (!layer.text) return null;
            return (
              <div
                key={layer.id}
                onMouseDown={e => handleMouseDown(e, layer.id)}
                onTouchStart={e => handleTouchStart(e, layer.id)}
                className={`absolute cursor-move select-none transition-all ${selectedLayerId === layer.id ? 'ring-2 ring-primary ring-offset-2' : ''
                  } ${dragging?.id === layer.id ? 'opacity-70' : ''}`}
                style={{
                  left: layer.x * scale,
                  top: layer.y * scale,
                  transform: 'translate(-50%, -50%)',
                  fontSize: layer.fontSize * scale,
                  fontFamily: layer.fontFamily,
                  color: layer.color,
                  opacity: dragging?.id === layer.id ? 0.7 : layer.opacity / 100,
                  textAlign: layer.textAlign,
                  textShadow: `${layer.textShadow * scale}px ${layer.textShadow * scale}px ${layer.textShadow * 2 * scale}px rgba(0,0,0,0.5)`,
                  fontWeight: 700,
                  whiteSpace: 'pre-wrap',
                  maxWidth: '80%',
                  padding: '8px',
                  touchAction: 'none',
                }}
              >
                {layer.text}
              </div>
            );
          })}

        <canvas id="export-canvas" width={CANVAS_SIZE} height={CANVAS_SIZE} className="hidden" />
      </div>
    </div>
  );
}


export function toBanglaDigit(number: number) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const banglaNumber = String(number)
    .split('')
    .map(d => (d >= '0' && d <= '9' ? banglaDigits[Number(d)] : d))
    .join('');

  return banglaNumber;
}
export function exportCanvas(
  image: string,
  textLayers: TextLayer[],
  startDate: Date,
  timeHeader = 'শহীদ ওসমান হাদি হত্যার বিচারহীনতার সময়কাল'
): Promise<Blob | null> {
  return new Promise(resolve => {
    const canvas = document.getElementById('export-canvas') as HTMLCanvasElement;
    if (!canvas) {
      resolve(null);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(null);
      return;
    }

    const CANVAS_SIZE = 1080;
    const IMAGE_HEIGHT = 720;
    const TIME_HEIGHT = 360;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw image in top 2/3
      const aspectRatio = img.width / img.height;
      let drawWidth = CANVAS_SIZE;
      let drawHeight = IMAGE_HEIGHT;
      let offsetX = 0;
      let offsetY = 0;

      const targetAspect = CANVAS_SIZE / IMAGE_HEIGHT;

      if (aspectRatio > targetAspect) {
        drawWidth = IMAGE_HEIGHT * aspectRatio;
        offsetX = -(drawWidth - CANVAS_SIZE) / 2;
      } else {
        drawHeight = CANVAS_SIZE / aspectRatio;
        offsetY = -(drawHeight - IMAGE_HEIGHT) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // Draw text layers
      textLayers.forEach(layer => {
        ctx.save();
        ctx.font = `700 ${layer.fontSize}px ${layer.fontFamily}`;
        ctx.fillStyle = layer.color;
        ctx.globalAlpha = layer.opacity / 100;
        ctx.textAlign = layer.textAlign;
        ctx.textBaseline = 'middle';

        if (layer.textShadow > 0) {
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = layer.textShadow * 2;
          ctx.shadowOffsetX = layer.textShadow;
          ctx.shadowOffsetY = layer.textShadow;
        }

        // Handle multi-line text
        const lines = layer.text.split('\n');
        const lineHeight = layer.fontSize * 1.2;
        const startY = layer.y - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, index) => {
          ctx.fillText(line, layer.x, startY + index * lineHeight);
        });

        ctx.restore();
      });

      // Draw white background for time section
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, IMAGE_HEIGHT, CANVAS_SIZE, TIME_HEIGHT);

      ctx.save();
      ctx.font = '600 48px abu sayed';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(timeHeader, CANVAS_SIZE / 2, IMAGE_HEIGHT + 90);
      ctx.restore();

      // Draw elapsed time
      const elapsed = calculateElapsedTime(startDate);
      ctx.save();
      ctx.font = 'bold 80px abu sayed';
      ctx.fillStyle = '#ff0000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const timeText = `${toBanglaDigit(elapsed.days)} দিন ` +
        `${toBanglaDigit(elapsed.hours).toString().padStart(2, '০')} ঘণ্টা ` +
        `${toBanglaDigit(elapsed.minutes).toString().padStart(2, '০')} মিনিট`;

      ctx.fillText(timeText, CANVAS_SIZE / 2, IMAGE_HEIGHT + 200);
      ctx.restore();

      // Add #JusticeForHadi text
      ctx.save();
      ctx.font = 'bold 60px abu sayed';
      ctx.fillStyle = '#ff0000'; // Red color for visibility
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('#JusticeForHadi', CANVAS_SIZE / 2, IMAGE_HEIGHT + 300);
      ctx.restore();

      canvas.toBlob(blob => resolve(blob), 'image/png', 1.0);
    };
    img.src = image;
  });
}
