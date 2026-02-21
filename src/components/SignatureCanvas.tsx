'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface SignatureCanvasProps {
  label: string;
  tamilLabel?: string;
  value?: string;
  onChange: (dataUrl: string) => void;
  required?: boolean;
}

export default function SignatureCanvas({ label, tamilLabel, value, onChange, required }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const getCanvas = useCallback(() => canvasRef.current, []);
  const getCtx = useCallback(() => {
    const canvas = getCanvas();
    return canvas?.getContext('2d') || null;
  }, [getCanvas]);

  useEffect(() => {
    const canvas = getCanvas();
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#1e293b';
      }
    };

    resizeCanvas();

    // Load existing signature if provided
    if (value) {
      const img = new Image();
      img.onload = () => {
        const ctx = getCtx();
        if (ctx && canvas) {
          const rect = canvas.getBoundingClientRect();
          ctx.drawImage(img, 0, 0, rect.width, rect.height);
          setHasSignature(true);
        }
      };
      img.src = value;
    }

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [getCanvas, getCtx, value]);

  const getPosition = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = getCanvas();
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = getCanvas();
      if (canvas) {
        onChange(canvas.toDataURL('image/png'));
      }
    }
  };

  const clearSignature = () => {
    const canvas = getCanvas();
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasSignature(false);
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="label-field">
        {label}
        {tamilLabel && <span className="tamil text-gray-500 ml-1">({tamilLabel})</span>}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="signature-canvas w-full"
          style={{ height: '150px' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400">
            <span>Draw your signature here</span>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={clearSignature}
        className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors min-h-[36px]"
      >
        Clear Signature
      </button>
    </div>
  );
}
