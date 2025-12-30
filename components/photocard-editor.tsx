'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Download,
  Share2,
  ImageIcon,
  Type,
  Settings,
  Sparkles,
  Upload,
  Calendar,
  Facebook,
  Twitter,
} from 'lucide-react';
import { PhotocardCanvas, exportCanvas } from '@/components/photocard-canvas';
import { PRESET_IMAGES, PRESET_QUOTES, FONT_FAMILIES } from '@/lib/constants';
import { getAssetPath } from '@/lib/utils';
import type { TextLayer } from '@/lib/types';

export function PhotocardEditor() {
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_IMAGES[0].url);
  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    {
      id: '1',
      text: '',
      x: 540,
      y: 200,
      fontSize: 56,
      fontFamily: 'Inter',
      color: '#ffffff',
      opacity: 100,
      textShadow: 3,
      textAlign: 'center',
    },
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('1');
  const [startDate, setStartDate] = useState<Date>(new Date(2025, 11, 12, 14, 0, 0)); // December 12, 2025, 2:00:00 PM
  const [timeHeader, setTimeHeader] = useState<string>(
    'শহীদ ওসমান হাদি হত্যার বিচারহীনতার সময়কাল'
  );
  const [showShareMenu, setShowShareMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedLayer = textLayers.find(layer => layer.id === selectedLayerId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetQuote = (quote: string) => {
    if (selectedLayer) {
      updateLayer(selectedLayerId, { text: quote });
    }
  };

  const updateLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers(prev => prev.map(layer => (layer.id === id ? { ...layer, ...updates } : layer)));
  };

  const handleExport = async () => {
    const blob = await exportCanvas(selectedImage, textLayers, startDate, timeHeader);
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `justice-for-hadi-photocard-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const blob = await exportCanvas(selectedImage, textLayers, startDate, timeHeader);
    if (!blob) return;

    const file = new File([blob], 'justice-for-hadi-photocard.png', { type: 'image/png' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Justice For Hadi Photocard',
          text: timeHeader,
        });
        setShowShareMenu(false);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      setShowShareMenu(true);
    }
  };

  const handleFacebookShare = async () => {
    const blob = await exportCanvas(selectedImage, textLayers, startDate, timeHeader);
    if (!blob) return;

    // Download the image first
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'justice-for-hadi-photocard.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Open Facebook with a slight delay
    setTimeout(() => {
      window.open('https://www.facebook.com/', '_blank');
      alert('Image downloaded! Please upload it to Facebook from your downloads folder.');
    }, 500);

    setShowShareMenu(false);
  };

  const handleTwitterShare = async () => {
    const blob = await exportCanvas(selectedImage, textLayers, startDate, timeHeader);
    if (!blob) return;

    // Download the image first
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'justice-for-hadi-photocard.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Open Twitter with a slight delay
    const text = encodeURIComponent(`${timeHeader}\n\n#JusticeForHadi`);
    setTimeout(() => {
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
      alert('Image downloaded! Please upload it to Twitter/X from your downloads folder.');
    }, 500);

    setShowShareMenu(false);
  };

  const handleWhatsAppShare = async () => {
    const blob = await exportCanvas(selectedImage, textLayers, startDate, timeHeader);
    if (!blob) return;

    const file = new File([blob], 'justice-for-hadi-photocard.png', { type: 'image/png' });

    // Try native share first (works on mobile)
    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Justice For Hadi Photocard',
          text: timeHeader,
        });
        setShowShareMenu(false);
        return;
      } catch (err) {
        console.log('Share cancelled');
      }
    }

    // Fallback: download and open WhatsApp
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'justice-for-hadi-photocard.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    const text = encodeURIComponent(timeHeader);
    setTimeout(() => {
      window.open(`https://web.whatsapp.com/`, '_blank');
      alert('Image downloaded! Please upload it to WhatsApp from your downloads folder.');
    }, 500);

    setShowShareMenu(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center bg-muted/30 p-4 lg:p-8 pb-32 lg:pb-8">
        <div className="relative">
          <PhotocardCanvas
            image={selectedImage}
            textLayers={textLayers}
            onLayerUpdate={updateLayer}
            selectedLayerId={selectedLayerId}
            onLayerSelect={setSelectedLayerId}
            startDate={startDate}
            timeHeader={timeHeader}
          />
        </div>
      </div>

      {/* Desktop Control Panel */}
      <div className="hidden lg:block w-96 border-l bg-card overflow-y-auto">
        <ControlPanel
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          selectedLayer={selectedLayer}
          updateLayer={updateLayer}
          selectedLayerId={selectedLayerId}
          handleImageUpload={handleImageUpload}
          handlePresetQuote={handlePresetQuote}
          handleExport={handleExport}
          handleShare={handleShare}
          handleFacebookShare={handleFacebookShare}
          handleTwitterShare={handleTwitterShare}
          handleWhatsAppShare={handleWhatsAppShare}
          fileInputRef={fileInputRef}
          startDate={startDate}
          setStartDate={setStartDate}
          timeHeader={timeHeader}
          setTimeHeader={setTimeHeader}
          showShareMenu={showShareMenu}
          setShowShareMenu={setShowShareMenu}
        />
      </div>

      {/* Mobile Action Buttons - Fixed at bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-40">
        <div className="p-4 space-y-3">
          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleExport} size="lg" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="lg"
              className="w-full bg-transparent"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {showShareMenu && (
            <div className="bg-card border rounded-lg shadow-lg p-2 space-y-1">
              <Button
                onClick={handleFacebookShare}
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Share on Facebook
              </Button>
              <Button
                onClick={handleTwitterShare}
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Share on Twitter/X
              </Button>
              <Button
                onClick={handleWhatsAppShare}
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Share on WhatsApp
              </Button>
              <Button
                onClick={() => setShowShareMenu(false)}
                variant="ghost"
                className="w-full mt-1"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Edit Settings Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" className="w-full" size="lg">
                <Settings className="w-4 h-4 mr-2" />
                Edit Settings
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Edit Photocard</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <ControlPanel
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                  selectedLayer={selectedLayer}
                  updateLayer={updateLayer}
                  selectedLayerId={selectedLayerId}
                  handleImageUpload={handleImageUpload}
                  handlePresetQuote={handlePresetQuote}
                  handleExport={handleExport}
                  handleShare={handleShare}
                  handleFacebookShare={handleFacebookShare}
                  handleTwitterShare={handleTwitterShare}
                  handleWhatsAppShare={handleWhatsAppShare}
                  fileInputRef={fileInputRef}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  timeHeader={timeHeader}
                  setTimeHeader={setTimeHeader}
                  showShareMenu={showShareMenu}
                  setShowShareMenu={setShowShareMenu}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

interface ControlPanelProps {
  selectedImage: string;
  setSelectedImage: (url: string) => void;
  selectedLayer: TextLayer | undefined;
  updateLayer: (id: string, updates: Partial<TextLayer>) => void;
  selectedLayerId: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePresetQuote: (quote: string) => void;
  handleExport: () => void;
  handleShare: () => void;
  handleFacebookShare: () => void;
  handleTwitterShare: () => void;
  handleWhatsAppShare: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  startDate: Date;
  setStartDate: (date: Date) => void;
  timeHeader: string;
  setTimeHeader: (header: string) => void;
  showShareMenu: boolean;
  setShowShareMenu: (show: boolean) => void;
}

function ControlPanel({
  selectedImage,
  setSelectedImage,
  selectedLayer,
  updateLayer,
  selectedLayerId,
  handleImageUpload,
  handlePresetQuote,
  handleExport,
  handleShare,
  handleFacebookShare,
  handleTwitterShare,
  handleWhatsAppShare,
  fileInputRef,
  startDate,
  setStartDate,
  timeHeader,
  setTimeHeader,
  showShareMenu,
  setShowShareMenu,
}: ControlPanelProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ textAlign: 'center' }}>Justice for <span style={{ color: '#ff0000' }}>Shahid Hadi</span></h1>
        <p className="text-sm text-muted-foreground" style={{ textAlign: 'center' }}>Stand for Justice
          Time Is Passing. Justice Is Due</p>
      </div>

      {/* Action Buttons (Desktop) */}
      <div className="hidden lg:block space-y-2">
        <Button onClick={handleExport} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download PNG
        </Button>
        <div className="relative">
          <Button onClick={handleShare} variant="outline" className="w-full bg-transparent">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {showShareMenu && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-background border rounded-lg shadow-lg p-2 z-50 text-foreground">
              <Button
                onClick={handleFacebookShare}
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button
                onClick={handleTwitterShare}
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter/X
              </Button>
              <Button
                onClick={handleWhatsAppShare}
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </Button>
              <Button
                onClick={() => setShowShareMenu(false)}
                variant="ghost"
                className="w-full mt-1"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="image">
            <ImageIcon className="w-4 h-4 mr-2" />
            Image
          </TabsTrigger>
          <TabsTrigger value="text">
            <Type className="w-4 h-4 mr-2" />
            Quote
          </TabsTrigger>
        </TabsList>
        <TabsContent value="image" className="space-y-4">
          {/* Upload Image */}
          <div>
            <Label>Upload Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full mt-2"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload from Device
            </Button>
          </div>

          {/* Preset Images */}
          <div>
            <Label>Preset Images</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {PRESET_IMAGES.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedImage(preset.url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${selectedImage === preset.url ? 'border-primary' : 'border-border'
                    }`}
                >
                  <img
                    src={preset.url || getAssetPath('/placeholder.svg')}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          {/* Preset Quotes */}
          <div>
            <Label className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Preset Quotes
            </Label>
            <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
              {PRESET_QUOTES.map(quote => (
                <Button
                  key={quote.id}
                  onClick={() => handlePresetQuote(quote.text)}
                  variant="outline"
                  className="w-full text-left h-auto py-3 px-4 whitespace-normal justify-start"
                >
                  <span className="text-sm line-clamp-2">{quote.text}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Text */}
          {selectedLayer && (
            <>
              <div>
                <Label>Custom Quote</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Quote will appear on top of the image. Use Shift+Enter for line breaks.
                </p>
                <textarea
                  value={selectedLayer.text}
                  onChange={e => updateLayer(selectedLayerId, { text: e.target.value })}
                  placeholder="Enter your quote..."
                  className="mt-2 w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                  rows={4}
                />
              </div>

              {/* Font Family */}
              <div>
                <Label>Font</Label>
                <Select
                  value={selectedLayer.fontFamily}
                  onValueChange={value => updateLayer(selectedLayerId, { fontFamily: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50">
                    {FONT_FAMILIES.map(font => (
                      <SelectItem key={font} value={font}>
                        <span style={{ fontFamily: font }}>{font}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div>
                <Label>Font Size: {selectedLayer.fontSize}px</Label>
                <Slider
                  value={[selectedLayer.fontSize]}
                  onValueChange={([value]) => updateLayer(selectedLayerId, { fontSize: value })}
                  min={24}
                  max={120}
                  step={2}
                  className="mt-2 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-gray-200 [&_[data-slot=slider-track]]:dark:bg-gray-700 [&_[data-slot=slider-track]]:rounded-full [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-range]]:h-full [&_[data-slot=slider-thumb]]:h-5 [&_[data-slot=slider-thumb]]:w-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-thumb]]:ring-2 [&_[data-slot=slider-thumb]]:ring-primary/50 [&_[data-slot=slider-thumb]]:ring-offset-2 [&_[data-slot=slider-thumb]]:shadow-lg [&_[data-slot=slider-thumb]]:transition-all [&_[data-slot=slider-thumb]]:duration-200 [&_[data-slot=slider-thumb]:hover]:scale-110 [&_[data-slot=slider-thumb]:focus]:ring-4"
                />
              </div>

              {/* Color */}
              <div>
                <Label>Text Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={selectedLayer.color}
                    onChange={e => updateLayer(selectedLayerId, { color: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={selectedLayer.color}
                    onChange={e => updateLayer(selectedLayerId, { color: e.target.value })}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Opacity */}
              <div>
                <Label>Opacity: {selectedLayer.opacity}%</Label>
                <Slider
                  value={[selectedLayer.opacity]}
                  onValueChange={([value]) => updateLayer(selectedLayerId, { opacity: value })}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-gray-200 [&_[data-slot=slider-track]]:dark:bg-gray-700 [&_[data-slot=slider-track]]:rounded-full [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-range]]:h-full [&_[data-slot=slider-thumb]]:h-5 [&_[data-slot=slider-thumb]]:w-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-thumb]]:ring-2 [&_[data-slot=slider-thumb]]:ring-primary/50 [&_[data-slot=slider-thumb]]:ring-offset-2 [&_[data-slot=slider-thumb]]:shadow-lg [&_[data-slot=slider-thumb]]:transition-all [&_[data-slot=slider-thumb]]:duration-200 [&_[data-slot=slider-thumb]:hover]:scale-110 [&_[data-slot=slider-thumb]:focus]:ring-4"
                />
              </div>

              {/* Text Shadow */}
              <div>
                <Label>Shadow: {selectedLayer.textShadow}px</Label>
                <Slider
                  value={[selectedLayer.textShadow]}
                  onValueChange={([value]) => updateLayer(selectedLayerId, { textShadow: value })}
                  min={0}
                  max={20}
                  step={1}
                  className="mt-2 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-gray-200 [&_[data-slot=slider-track]]:dark:bg-gray-700 [&_[data-slot=slider-track]]:rounded-full [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-range]]:h-full [&_[data-slot=slider-thumb]]:h-5 [&_[data-slot=slider-thumb]]:w-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-thumb]]:ring-2 [&_[data-slot=slider-thumb]]:ring-primary/50 [&_[data-slot=slider-thumb]]:ring-offset-2 [&_[data-slot=slider-thumb]]:shadow-lg [&_[data-slot=slider-thumb]]:transition-all [&_[data-slot=slider-thumb]]:duration-200 [&_[data-slot=slider-thumb]:hover]:scale-110 [&_[data-slot=slider-thumb]:focus]:ring-4"
                />
              </div>

              {/* Text Align */}
              <div>
                <Label>Alignment</Label>
                <Select
                  value={selectedLayer.textAlign}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    updateLayer(selectedLayerId, { textAlign: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50">
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
