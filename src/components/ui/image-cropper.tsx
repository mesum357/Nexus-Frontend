import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile?: File | null;
  imageSrc?: string;
  onCropComplete: (croppedFile: File) => void;
  aspectRatio?: number;
  title?: string;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageCropper({ 
  isOpen,
  onClose,
  imageFile,
  imageSrc,
  onCropComplete,
  aspectRatio = 16/9, 
  title = "Crop Image" 
}: ImageCropperProps) {
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 200, height: 200 / aspectRatio });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropRef = useRef<HTMLDivElement>(null);

  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    if (imageFile) {
      try {
        const url = URL.createObjectURL(imageFile);
        setImageUrl(url);
        return () => URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error creating object URL:', error);
        setImageUrl('');
      }
    } else if (imageSrc) {
      setImageUrl(imageSrc);
    } else {
      setImageUrl('');
    }
  }, [imageFile, imageSrc, isOpen]);

  useEffect(() => {
    if (!isOpen || !imageRef.current || !imageUrl) return;

    const img = imageRef.current;
    img.onload = () => {
      const container = containerRef.current;
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        const imgAspectRatio = img.naturalWidth / img.naturalHeight;
        const containerAspectRatio = containerWidth / containerHeight;
        
        let newWidth, newHeight;
        
        if (imgAspectRatio > containerAspectRatio) {
          newWidth = containerWidth;
          newHeight = containerWidth / imgAspectRatio;
        } else {
          newHeight = containerHeight;
          newWidth = containerHeight * imgAspectRatio;
        }
        
        setImageSize({ width: newWidth, height: newHeight });
        
        // Calculate image position (centered in container)
        const imageX = (containerWidth - newWidth) / 2;
        const imageY = (containerHeight - newHeight) / 2;
        setImagePosition({ x: imageX, y: imageY });
        
        // Initialize crop area in the center of the image
        const maxCropWidth = newWidth * 0.7;
        const maxCropHeight = newHeight * 0.7;
        
        let cropWidth, cropHeight;
        
        if (aspectRatio >= 1) {
          // Landscape or square
          cropWidth = Math.min(maxCropWidth, 250);
          cropHeight = cropWidth / aspectRatio;
        } else {
          // Portrait
          cropHeight = Math.min(maxCropHeight, 250);
          cropWidth = cropHeight * aspectRatio;
        }
        
        // Ensure crop area fits within image bounds
        cropWidth = Math.min(cropWidth, newWidth);
        cropHeight = Math.min(cropHeight, newHeight);
        
        const cropX = (newWidth - cropWidth) / 2;
        const cropY = (newHeight - cropHeight) / 2;
        
        setCropArea({
          x: cropX,
          y: cropY,
          width: cropWidth,
          height: cropHeight
        });
      }
    };
  }, [imageUrl, aspectRatio, isOpen]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (cropRef.current) {
      setIsDragging(true);
      const rect = cropRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - container.left - dragStart.x;
    const newY = e.clientY - container.top - dragStart.y;
    
    // Convert container coordinates to image coordinates
    const imageX = newX - imagePosition.x;
    const imageY = newY - imagePosition.y;
    
    setCropArea(prev => {
      const constrainedX = Math.max(0, Math.min(imageX, imageSize.width - prev.width));
      const constrainedY = Math.max(0, Math.min(imageY, imageSize.height - prev.height));
      
      return {
        ...prev,
        x: constrainedX,
        y: constrainedY
      };
    });
  }, [isDragging, dragStart, imagePosition, imageSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch event handlers for mobile/tablet support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (cropRef.current && e.touches.length === 1) {
      setIsDragging(true);
      const rect = cropRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      setDragStart({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging || !containerRef.current || e.touches.length !== 1) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const newX = touch.clientX - container.left - dragStart.x;
    const newY = touch.clientY - container.top - dragStart.y;
    
    // Convert container coordinates to image coordinates
    const imageX = newX - imagePosition.x;
    const imageY = newY - imagePosition.y;
    
    setCropArea(prev => {
      const constrainedX = Math.max(0, Math.min(imageX, imageSize.width - prev.width));
      const constrainedY = Math.max(0, Math.min(imageY, imageSize.height - prev.height));
      
      return {
        ...prev,
        x: constrainedX,
        y: constrainedY
      };
    });
  }, [isDragging, dragStart, imagePosition, imageSize]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleResize = useCallback((direction: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    
    let startX: number, startY: number;
    
    if ('touches' in e) {
      // Touch event
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    } else {
      // Mouse event
      startX = e.clientX;
      startY = e.clientY;
    }
    
    const startCrop = { ...cropArea };
    
    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      let moveX: number, moveY: number;
      
      if ('touches' in moveEvent) {
        // Touch event
        if (moveEvent.touches.length !== 1) return;
        moveX = moveEvent.touches[0].clientX;
        moveY = moveEvent.touches[0].clientY;
      } else {
        // Mouse event
        moveX = moveEvent.clientX;
        moveY = moveEvent.clientY;
      }
      
      const deltaX = moveX - startX;
      const deltaY = moveY - startY;
      
      let newWidth = startCrop.width;
      let newHeight = startCrop.height;
      let newX = startCrop.x;
      let newY = startCrop.y;
      
      if (direction.includes('e')) {
        newWidth = Math.max(50, startCrop.width + deltaX);
        newHeight = newWidth / aspectRatio;
      }
      if (direction.includes('w')) {
        newWidth = Math.max(50, startCrop.width - deltaX);
        newHeight = newWidth / aspectRatio;
        newX = startCrop.x + startCrop.width - newWidth;
      }
      if (direction.includes('s')) {
        newHeight = Math.max(50, startCrop.height + deltaY);
        newWidth = newHeight * aspectRatio;
      }
      if (direction.includes('n')) {
        newHeight = Math.max(50, startCrop.height - deltaY);
        newWidth = newHeight * aspectRatio;
        newY = startCrop.y + startCrop.height - newHeight;
      }
      
      // Constrain to image bounds
      newWidth = Math.min(newWidth, imageSize.width);
      newHeight = Math.min(newHeight, imageSize.height);
      newX = Math.max(0, Math.min(newX, imageSize.width - newWidth));
      newY = Math.max(0, Math.min(newY, imageSize.height - newHeight));
      
      setCropArea({ x: newX, y: newY, width: newWidth, height: newHeight });
    };
    
    const handleEnd = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  }, [cropArea, aspectRatio, imageSize]);

  const handleCrop = () => {
    if (!imageRef.current || !imageUrl) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = imageRef.current;
    const scaleX = img.naturalWidth / imageSize.width;
    const scaleY = img.naturalHeight / imageSize.height;
    
    canvas.width = cropArea.width * scaleX;
    canvas.height = cropArea.height * scaleY;
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.drawImage(
      img,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      -canvas.width / (2 * scale),
      -canvas.height / (2 * scale),
      canvas.width / scale,
      canvas.height / scale
    );
    ctx.restore();
    
    canvas.toBlob((blob) => {
      if (blob) {
        // Convert blob to File
        const fileName = imageFile?.name || 'cropped-image.jpg';
        const croppedFile = new File([blob], fileName, { type: blob.type });
        onCropComplete(croppedFile);
        onClose();
      }
    }, 'image/jpeg', 0.9);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[95vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[calc(95vh-120px)] overflow-y-auto">
          {!imageUrl ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No image to crop</p>
            </div>
          ) : (
            <>
              {/* Controls */}
              <div className="flex items-center gap-4 justify-center flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                >
                  <ZoomOut className="h-4 w-4 mr-2" />
                  Zoom Out
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScale(prev => Math.min(3, prev + 0.1))}
                >
                  <ZoomIn className="h-4 w-4 mr-2" />
                  Zoom In
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation(prev => prev + 90)}
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Rotate
                </Button>
              </div>
              
              {/* Image Container */}
              <div 
                ref={containerRef}
                className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden mx-auto touch-none"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Crop preview"
                  className="absolute pointer-events-none"
                  style={{
                    left: imagePosition.x,
                    top: imagePosition.y,
                    width: imageSize.width * scale,
                    height: imageSize.height * scale,
                    transform: `rotate(${rotation}deg) scale(${scale})`
                  }}
                />
                
                {/* Crop Overlay */}
                <div
                  ref={cropRef}
                  className="absolute border-2 border-white shadow-lg cursor-move touch-manipulation"
                  style={{
                    left: imagePosition.x + cropArea.x * scale,
                    top: imagePosition.y + cropArea.y * scale,
                    width: cropArea.width * scale,
                    height: cropArea.height * scale,
                    transform: `rotate(${rotation}deg)`
                  }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                >
                  {/* Resize Handles */}
                  <div
                    className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-gray-400 cursor-nw-resize touch-manipulation"
                    onMouseDown={(e) => handleResize('nw', e)}
                    onTouchStart={(e) => handleResize('nw', e)}
                  />
                  <div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-gray-400 cursor-ne-resize touch-manipulation"
                    onMouseDown={(e) => handleResize('ne', e)}
                    onTouchStart={(e) => handleResize('ne', e)}
                  />
                  <div
                    className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-gray-400 cursor-sw-resize touch-manipulation"
                    onMouseDown={(e) => handleResize('sw', e)}
                    onTouchStart={(e) => handleResize('sw', e)}
                  />
                  <div
                    className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-gray-400 cursor-se-resize touch-manipulation"
                    onMouseDown={(e) => handleResize('se', e)}
                    onTouchStart={(e) => handleResize('se', e)}
                  />
                </div>
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                <div
                  className="absolute bg-transparent pointer-events-none"
                  style={{
                    left: imagePosition.x + cropArea.x * scale,
                    top: imagePosition.y + cropArea.y * scale,
                    width: cropArea.width * scale,
                    height: cropArea.height * scale,
                    transform: `rotate(${rotation}deg)`
                  }}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleCrop}>
                  Crop Image
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
