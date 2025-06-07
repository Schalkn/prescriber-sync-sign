
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pen, Upload, X } from "lucide-react";

interface SignatureCaptureProps {
  onSignatureChange: (signature: string | null) => void;
}

const SignatureCapture = ({ onSignatureChange }: SignatureCaptureProps) => {
  const [drawnSignature, setDrawnSignature] = useState<string | null>(null);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL();
    setDrawnSignature(dataURL);
    onSignatureChange(dataURL);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnSignature(null);
    onSignatureChange(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedSignature(result);
      onSignatureChange(result);
    };
    reader.readAsDataURL(file);
  };

  const removeUploadedSignature = () => {
    setUploadedSignature(null);
    onSignatureChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Pen className="h-5 w-5 mr-2" />
          Electronic Signature
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="draw" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw">Draw Signature</TabsTrigger>
            <TabsTrigger value="upload">Upload Signature</TabsTrigger>
          </TabsList>
          
          <TabsContent value="draw" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                width={300}
                height={150}
                className="border border-gray-200 rounded w-full cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{ touchAction: 'none' }}
              />
              <div className="flex justify-between mt-2">
                <p className="text-sm text-gray-600">Draw your signature above</p>
                <Button onClick={clearCanvas} size="sm" variant="outline">
                  Clear
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div>
              <Label htmlFor="signature-upload">Upload Signature Image</Label>
              <Input
                id="signature-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="mt-1"
              />
            </div>
            
            {uploadedSignature && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium">Uploaded Signature:</p>
                  <Button onClick={removeUploadedSignature} size="sm" variant="ghost">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <img 
                  src={uploadedSignature} 
                  alt="Uploaded signature" 
                  className="max-h-32 border border-gray-200 rounded"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {(drawnSignature || uploadedSignature) && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700 font-medium">✓ Signature captured successfully</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SignatureCapture;
