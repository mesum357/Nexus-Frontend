import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { RotateCcw, ZoomIn, ZoomOut, Move, Crop } from 'lucide-react'

interface ImageCropperProps {
  isOpen: boolean
  onClose: () => void
  imageFile: File | null
  imageSrc?: string
  onCropComplete: (croppedFile: File) => void
  aspectRatio?: number
  title?: string
}

export function ImageCropper({ 
  isOpen, 
  onClose, 
  imageFile, 
  imageSrc: propImageSrc,
  onCropComplete, 
  aspectRatio = 1,
  title = "Crop Image"
}: ImageCropperProps) {
  const [imageSrc, setImageSrc] = useState<string>('')
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load image when file changes or when propImageSrc is provided
  React.useEffect(() => {
    if (propImageSrc) {
      setImageSrc(propImageSrc)
    } else if (imageFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string)
      }
      reader.readAsDataURL(imageFile)
    }
  }, [imageFile, propImageSrc])

  // Reset transformations when image changes
  React.useEffect(() => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }, [imageSrc])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }, [position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleCrop = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const image = imageRef.current
    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    
    // Set canvas size to match display size
    canvas.width = rect.width
    canvas.height = rect.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Save context
    ctx.save()

    // Move to center
    ctx.translate(canvas.width / 2, canvas.height / 2)

    // Apply transformations
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(scale, scale)
    ctx.translate(position.x / scale, position.y / scale)

    // Draw image
    ctx.drawImage(
      image,
      -image.width / 2,
      -image.height / 2,
      image.width,
      image.height
    )

    // Restore context
    ctx.restore()

    // Calculate crop area based on aspect ratio
    const containerWidth = rect.width
    const containerHeight = rect.height
    const padding = 32 // 4 * 8px (inset-4)
    
    let cropWidth, cropHeight
    if (aspectRatio > 1) {
      // Landscape
      cropHeight = containerHeight - (padding * 2)
      cropWidth = cropHeight * aspectRatio
    } else {
      // Portrait or square
      cropWidth = containerWidth - (padding * 2)
      cropHeight = cropWidth / aspectRatio
    }
    
    // Create a new canvas for the final cropped image
    const cropCanvas = document.createElement('canvas')
    const cropCtx = cropCanvas.getContext('2d')
    if (!cropCtx) return
    
    cropCanvas.width = cropWidth
    cropCanvas.height = cropHeight
    
    // Calculate crop position (center of the container)
    const cropX = (containerWidth - cropWidth) / 2
    const cropY = (containerHeight - cropHeight) / 2
    
    // Draw the cropped portion
    cropCtx.drawImage(
      canvas,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    )
    
    // Convert to blob and create file
    cropCanvas.toBlob((blob) => {
      if (blob) {
        const fileName = imageFile?.name || 'cropped-image.jpg'
        const croppedFile = new File([blob], fileName, {
          type: 'image/jpeg'
        })
        onCropComplete(croppedFile)
        onClose()
      }
    }, 'image/jpeg', 0.9)
  }, [scale, rotation, position, imageFile, onCropComplete, onClose])

  const resetTransformations = () => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
            {/* Hidden canvas for cropping */}
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Image Container */}
            <div 
              ref={containerRef}
              className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
            {imageSrc && (
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                  transformOrigin: 'center',
                }}
                draggable={false}
              />
            )}
            
            {/* Crop overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-black/50" />
              <div 
                className="absolute inset-4 border-2 border-white border-dashed"
                style={{
                  aspectRatio: aspectRatio,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            {/* Scale Control */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4" />
                <span className="text-sm font-medium">Scale</span>
                <span className="text-sm text-muted-foreground">{Math.round(scale * 100)}%</span>
              </div>
              <Slider
                value={[scale]}
                onValueChange={([value]) => setScale(value)}
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Rotation Control */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                <span className="text-sm font-medium">Rotation</span>
                <span className="text-sm text-muted-foreground">{rotation}°</span>
              </div>
              <Slider
                value={[rotation]}
                onValueChange={([value]) => setRotation(value)}
                min={-180}
                max={180}
                step={1}
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <Button variant="outline" onClick={resetTransformations} size="sm">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button onClick={handleCrop} className="flex-1" size="sm">
                <Crop className="h-4 w-4 mr-1" />
                Apply Crop
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
