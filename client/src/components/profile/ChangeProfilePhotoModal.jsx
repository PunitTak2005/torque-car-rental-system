import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Link as LinkIcon, Trash2, Camera, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import Button from '../common/Button';

const ChangeProfilePhotoModal = ({ isOpen, onClose, currentPhoto, onSavePhoto, onRemovePhoto }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url'
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentPhoto || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(currentPhoto || '');
      setImageUrl(currentPhoto && currentPhoto.startsWith('http') ? currentPhoto : '');
      setError('');
      setSelectedFile(null);
      setActiveTab('upload');
    }
  }, [isOpen, currentPhoto]);

  if (!isOpen) return null;

  // Validate and handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Client-side file type validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file format. Please select a JPG, PNG, or WEBP image.');
      return;
    }

    // Client-side file size validation (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File is too large. Maximum allowed size is 5MB.');
      return;
    }

    setSelectedFile(file);

    // Generate local preview using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.onerror = () => {
      setError('Unable to read selected image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Validate image URL by loading it into an Image element
  const validateAndPreviewUrl = (urlToTest) => {
    const targetUrl = urlToTest || imageUrl;
    setError('');

    if (!targetUrl || !targetUrl.trim()) {
      setError('Please enter an image URL.');
      return;
    }

    const trimmedUrl = targetUrl.trim();

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://') && !trimmedUrl.startsWith('data:image/')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsValidatingUrl(true);

    const img = new Image();
    img.onload = () => {
      setIsValidatingUrl(false);
      setPreviewUrl(trimmedUrl);
      setError('');
    };
    img.onerror = () => {
      setIsValidatingUrl(false);
      setError('Unable to load this image. Please check the URL and try again.');
    };
    img.src = trimmedUrl;
  };

  const handleSave = async () => {
    if (!previewUrl) {
      setError('Please upload an image or enter a valid image URL before saving.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await onSavePhoto(previewUrl);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Unable to update profile photo. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    setError('');
    try {
      await onRemovePhoto();
      setPreviewUrl('');
      setImageUrl('');
      onClose();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Unable to remove profile photo. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-asphalt/85 backdrop-blur-lg animate-page-enter">
      <div 
        className="bg-graphite border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-chalk flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="px-6 py-4 border-b border-white/10 bg-asphalt/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-neon-accent" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-chalk">Change Profile Photo</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-silver hover:text-chalk hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Content Body */}
        <main className="p-6 space-y-6">
          
          {/* Avatar Preview Section */}
          <div className="flex flex-col items-center justify-center gap-3 bg-asphalt/60 border border-white/10 p-5 rounded-2xl">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-neon-accent/50 bg-graphite shadow-xl group flex items-center justify-center shrink-0">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile Avatar Preview"
                  className="w-full h-full object-cover"
                  onError={() => {
                    setError('Preview image failed to load. Please try a different photo.');
                    setPreviewUrl('');
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-silver">
                  <Camera className="w-8 h-8 text-silver/60" />
                  <span className="text-[8px] font-extrabold uppercase tracking-widest mt-1">NO PHOTO</span>
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-silver uppercase tracking-widest">
              {previewUrl ? 'AVATAR PREVIEW' : 'DEFAULT SYSTEM AVATAR'}
            </span>
          </div>

          {/* Method Selection Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-asphalt/80 p-1.5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => { setActiveTab('upload'); setError(''); }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-neon-accent text-asphalt font-extrabold shadow-md'
                  : 'text-silver hover:text-chalk hover:bg-white/5'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload File</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('url'); setError(''); }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-neon-accent text-asphalt font-extrabold shadow-md'
                  : 'text-silver hover:text-chalk hover:bg-white/5'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Use Image URL</span>
            </button>
          </div>

          {/* Tab 1: Device File Picker */}
          {activeTab === 'upload' && (
            <div className="space-y-4 animate-page-enter">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="profile-file-input"
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/15 hover:border-neon-accent/60 bg-asphalt/40 hover:bg-asphalt/80 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:border-neon-accent/40 flex items-center justify-center mx-auto text-silver group-hover:text-neon-accent transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-chalk uppercase tracking-wider">
                    {selectedFile ? selectedFile.name : 'Click to Browse Device Files'}
                  </p>
                  <p className="text-[10px] text-silver/60 uppercase tracking-widest mt-1">
                    Supports JPG, PNG, WEBP (Max 5MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Image URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-3 animate-page-enter">
              <label className="text-[10px] font-bold text-silver uppercase tracking-widest block">
                Direct Web Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-asphalt border border-white/15 rounded-xl text-xs text-chalk focus:outline-none focus:border-neon-accent font-sans transition-colors"
                />
                <button
                  type="button"
                  onClick={() => validateAndPreviewUrl()}
                  disabled={isValidatingUrl || !imageUrl.trim()}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-chalk text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer disabled:opacity-40 transition-all shrink-0"
                >
                  {isValidatingUrl ? 'Testing...' : 'Preview'}
                </button>
              </div>
              <p className="text-[9px] text-silver/50 uppercase tracking-widest">
                Paste a public image web link and click Preview before saving.
              </p>
            </div>
          )}

          {/* Error Alert Box */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-400 text-xs font-semibold animate-page-enter">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

        </main>

        {/* Modal Footer Actions */}
        <footer className="px-6 py-4 border-t border-white/10 bg-asphalt/90 flex flex-wrap items-center justify-between gap-3">
          <div>
            {currentPhoto && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isRemoving || isSaving}
                className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-600 border border-rose-500/30 text-rose-400 hover:text-chalk text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isRemoving ? 'Removing...' : 'Remove Photo'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-chalk text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all"
              disabled={isSaving || isRemoving}
            >
              Cancel
            </button>

            <Button
              type="button"
              onClick={handleSave}
              loading={isSaving}
              disabled={!previewUrl || isSaving || isRemoving}
              className="px-5 py-2 text-xs uppercase tracking-wider font-extrabold"
            >
              <span>{isSaving ? 'Saving...' : 'Save Photo'}</span>
            </Button>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default ChangeProfilePhotoModal;
