import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, Check, GripVertical, ImageIcon, Images, Loader2, Plus, Trash2, X, Upload, Cloud } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface GalleryImage {
    id: number;
    image: string;
}

interface ProfileGalleryProps {
    profile: { gallery: GalleryImage[] } | null;
    maxSlots?: number;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    onDeleteImage: (id: number) => void;
    dataGallery: File[];
    setDataGallery: (files: File[]) => void;
    processing?: boolean;
    errors?: Record<string, string>;
    onRetry?: () => void;
}

export function ProfileGallery({
    profile,
    maxSlots = 10,
    title = 'Gallery',
    description = 'Upload photos to showcase your profile',
    icon,
    onDeleteImage,
    dataGallery,
    setDataGallery,
    processing = false,
    errors,
    onRetry,
}: ProfileGalleryProps) {
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const existingCount = profile?.gallery?.length || 0;
    const totalCount = existingCount + dataGallery.length;
    const remainingSlots = maxSlots - totalCount;

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const LARGE_FILE_THRESHOLD = MAX_FILE_SIZE * 0.75; // 1.5MB — warn when a file exceeds 75% of the limit
    const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml'];

    const MAX_DIMENSION = 1920;
    const COMPRESSION_QUALITY = 0.8;

    const compressImage = (file: File): Promise<File | null> => {
        return new Promise((resolve) => {
            // Skip compression for GIFs and SVGs
            if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
                resolve(null);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Calculate new dimensions, capping the longest side
                    let { width, height } = img;
                    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
                        width = Math.round(width * ratio);
                        height = Math.round(height * ratio);
                    }

                    // If the image is small enough already, skip compression
                    if (width >= img.naturalWidth && height >= img.naturalHeight && file.size < MAX_FILE_SIZE * 0.5) {
                        resolve(null);
                        return;
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d')!;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Output as JPEG (smaller files) with the configured quality
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const name = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
                            const compressedFile = new File([blob], name, { type: 'image/jpeg' });
                            resolve(compressedFile);
                        } else {
                            resolve(null);
                        }
                    }, 'image/jpeg', COMPRESSION_QUALITY);
                };
                img.onerror = () => resolve(null);
                img.src = e.target?.result as string;
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
        });
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(0) + ' KB';
        }
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileType = (mime: string): string => {
        const map: Record<string, string> = {
            'image/jpeg': 'JPEG',
            'image/png': 'PNG',
            'image/webp': 'WebP',
            'image/gif': 'GIF',
            'image/bmp': 'BMP',
            'image/svg+xml': 'SVG',
        };
        return map[mime] || mime.replace(/^image\//, '').toUpperCase();
    };

    const totalUploadSize = dataGallery.reduce((sum, file) => sum + file.size, 0);
    const totalSizeWarning = totalUploadSize > MAX_FILE_SIZE;

    const validateFile = (file: File): string | null => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            return `"${file.name}" is not a supported image format. Please use JPEG, PNG, WebP, or GIF.`;
        }
        if (file.size > MAX_FILE_SIZE) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            return `"${file.name}" (${sizeMB}MB) exceeds the 2MB size limit.`;
        }
        return null;
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (galleryInputRef.current) galleryInputRef.current.value = '';
        processFiles(files);
    };

    const clearAllNewImages = () => {
        setDataGallery([]);
        setGalleryPreviews([]);
        setUploadFailed(false);
    };

    const handleReorder = (reorderedPreviews: string[]) => {
        const reorderedFiles = reorderedPreviews.map(
            (preview) => dataGallery[galleryPreviews.indexOf(preview)],
        );
        setDataGallery(reorderedFiles);
        setGalleryPreviews(reorderedPreviews);
    };

    const removeNewImage = (index: number) => {
        const newGallery = [...dataGallery];
        newGallery.splice(index, 1);
        setDataGallery(newGallery);
        const newPreviews = [...galleryPreviews];
        newPreviews.splice(index, 1);
        setGalleryPreviews(newPreviews);
        if (newGallery.length === 0) setUploadFailed(false);
    };

    const [uploadComplete, setUploadComplete] = useState(false);
    const prevProcessingRef = useRef(processing);

    const dataGalleryRef = useRef(dataGallery);
    dataGalleryRef.current = dataGallery;

    const [uploadFailed, setUploadFailed] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [compressingIndices, setCompressingIndices] = useState<number[]>([]);

    const processFiles = (files: File[]) => {
        if (files.length === 0) return;

        const validFiles: File[] = [];
        let validCount = 0;
        for (const file of files) {
            const error = validateFile(file);
            if (error) {
                toast.error(error);
            } else {
                validCount++;
                if (validFiles.length < remainingSlots) {
                    validFiles.push(file);
                }
            }
        }

        const slotRejectedCount = validCount - validFiles.length;
        if (slotRejectedCount > 0) {
            const label = (n: number) => `file${n !== 1 ? 's' : ''}`;
            toast.warning(
                `Could only add ${validFiles.length} of ${validCount} ${label(validCount)} — ${remainingSlots} slot${remainingSlots !== 1 ? 's' : ''} available.`,
            );
        }

        if (validFiles.length === 0) return;

        // Add original files immediately so previews show up right away
        const baseIndex = dataGallery.length;
        setDataGallery([...dataGallery, ...validFiles]);

        // Generate previews from originals instantly
        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGalleryPreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        // Compress each file in the background
        validFiles.forEach(async (file, i) => {
            const idx = baseIndex + i;
            setCompressingIndices((prev) => [...prev, idx]);

            try {
                const compressed = await compressImage(file);
                if (compressed) {
                    // Replace the original with the compressed version
                    const updated = [...dataGalleryRef.current];
                    updated[idx] = compressed;
                    setDataGallery(updated);
                }
            } catch {
                // Compression failed — keep the original file
            } finally {
                setCompressingIndices((prev) => prev.filter((n) => n !== idx));
            }
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        if (remainingSlots <= 0 || processing) return;
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        // Only set false if we're actually leaving the container (not entering a child)
        if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (remainingSlots <= 0 || processing) return;
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length === 0) return;
        processFiles(files);
    };

    const playUploadSound = () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const gain = ctx.createGain();
            gain.connect(ctx.destination);
            gain.gain.value = 0.12;

            // First note — C5 (523Hz), 150ms
            const osc1 = ctx.createOscillator();
            osc1.type = 'sine';
            osc1.frequency.value = 523;
            osc1.connect(gain);
            osc1.start(ctx.currentTime);
            osc1.stop(ctx.currentTime + 0.15);

            // Second note — E5 (659Hz), 200ms, with slight delay
            const gain2 = ctx.createGain();
            gain2.connect(ctx.destination);
            gain2.gain.value = 0.10;
            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = 659;
            osc2.connect(gain2);
            osc2.start(ctx.currentTime + 0.12);
            osc2.stop(ctx.currentTime + 0.32);

            // Close the context after the sound finishes
            setTimeout(() => ctx.close(), 400);
        } catch {
            // Audio not available — silently ignore
        }
    };

    useEffect(() => {
        // Processing just started (e.g. retry) — reset failure state
        if (!prevProcessingRef.current && processing) {
            setUploadFailed(false);
        }
        if (!prevProcessingRef.current || processing) {
            prevProcessingRef.current = processing;
            return;
        }

        // Upload just finished (processing transitioned true → false)
        if (galleryPreviews.length > 0) {
            if (dataGallery.length === 0) {
                // Success — gallery files were accepted by the server
                setUploadComplete(true);
                playUploadSound();
                toast.success('Upload complete!', { duration: 2000 });
                const timer = setTimeout(() => {
                    setUploadComplete(false);
                    setGalleryPreviews([]);
                }, 1800);
                return () => clearTimeout(timer);
            } else if (errors?.gallery) {
                // Server returned a validation error for the gallery
                setUploadFailed(true);
                toast.error(errors.gallery, { duration: 4000 });
            } else {
                // Generic upload failure
                setUploadFailed(true);
                toast.error('Gallery upload failed. Please try again.', { duration: 4000 });
            }
        }

        prevProcessingRef.current = processing;
    }, [processing]);

    return (
        <div className="rounded-3xl border border-[#e8ded1] bg-white shadow-xs transition-all duration-300">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 border-b border-[#e8ded1] p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
                <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold">
                        {icon || <Images className="h-5 w-5 text-woof-gold" />}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base font-bold text-woof-charcoal">{title}</h3>
                        <p className="mt-0.5 text-xs text-woof-charcoal/60">{description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Image count badge */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-woof-charcoal/50">
                            {totalCount}/{maxSlots}
                        </span>
                        {dataGallery.length > 0 && !uploadComplete && (
                            <div className="flex flex-col items-end gap-0.5">
                                <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 shadow-2xs cursor-pointer">
                                                <Upload className="h-3 w-3" />
                                                +{dataGallery.length}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="rounded-2xl border border-[#e8ded1] bg-white px-3 py-2 text-woof-charcoal shadow-md text-xs" side="bottom" align="start">
                                            <div className="flex flex-col gap-1.5">
                                                {dataGallery.map((file, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <span className="max-w-[140px] truncate text-xs font-medium text-woof-charcoal sm:max-w-[180px]">
                                                            {file.name.replace(/\.[^/.]+$/, '')}
                                                        </span>
                                                        <span className={`shrink-0 text-[10px] font-bold ${
                                                            file.size > LARGE_FILE_THRESHOLD
                                                                ? ' text-amber-600'
                                                                : ' text-woof-charcoal/50'
                                                        }`}>
                                                            {formatFileSize(file.size)}
                                                        </span>
                                                        {file.size > LARGE_FILE_THRESHOLD && (
                                                            <AlertTriangle className="h-3 w-3 shrink-0 text-amber-500" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <span className="text-[10px] text-woof-charcoal/40 font-medium">
                                    ~{formatFileSize(totalUploadSize)}
                                </span>
                                {totalSizeWarning && (
                                    <span className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[9px] font-bold text-amber-800 shadow-2xs">
                                        <AlertTriangle className="h-3 w-3" />
                                        Large upload
                                    </span>
                                )}
                            </div>
                        )}
                        {dataGallery.length > 0 && !processing && !uploadComplete && !uploadFailed && (
                            <button
                                type="button"
                                onClick={clearAllNewImages}
                                className="flex h-8 items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-600 shadow-2xs transition-all hover:bg-rose-100 cursor-pointer"
                            >
                                <X className="h-3 w-3" />
                                Clear all
                            </button>
                        )}
                    </div>
                    <Button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={remainingSlots <= 0 || processing}
                        className={`flex h-10 items-center gap-2 bg-woof-charcoal text-white rounded-full px-5 text-xs font-bold shadow-xs transition-all hover:bg-woof-gold hover:text-woof-charcoal cursor-pointer ${processing ? ' cursor-not-allowed opacity-55' : ''}`}
                    >
                        {processing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Plus className="h-3.5 w-3.5" />
                        )} Add Photos
                    </Button>
                </div>

                <input ref={galleryInputRef} type="file" multiple className="hidden" accept="image/*" onChange={handleGalleryChange} />
            </div>

            {/* Drop zone content area */}
            <div
                className="relative p-6 sm:p-8"
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Drag-over overlay */}
                {isDragging && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-woof-gold/60 bg-amber-50/50 backdrop-blur-2xs p-6 sm:p-8 rounded-3xl"
                        onDragEnter={(e) => { e.preventDefault(); }}
                        onDragOver={(e) => { e.preventDefault(); }}
                        onDragLeave={handleDragLeave}
                    >
                        <Cloud className="h-10 w-10 text-woof-gold" />
                        <span className="text-sm font-bold text-woof-charcoal">
                            Drop images here
                        </span>
                        <span className="text-xs text-woof-charcoal/50">
                            {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} available
                        </span>
                    </div>
                )}
                {totalCount === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[#e8ded1] bg-[#fcfbf9] py-14 rounded-2xl text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#e8ded1] text-woof-gold">
                            <ImageIcon className="h-6 w-6 text-woof-gold/50" />
                        </div>
                        <p className="text-xs text-woof-charcoal/50 font-medium">
                            No photos yet — tap "Add Photos" to get started
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
                        {/* Existing images */}
                        {profile?.gallery?.map((img) => (
                            <div
                                key={img.id}
                                className="group relative aspect-square overflow-hidden rounded-2xl border border-[#e8ded1] bg-white shadow-2xs transition-all duration-300 hover:shadow-md"
                            >
                                <img
                                    src={img.image}
                                    alt="Gallery"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-woof-charcoal/50 opacity-0 backdrop-blur-2xs transition-opacity duration-300 group-hover:opacity-100">
                                    <button
                                        type="button"
                                        onClick={() => onDeleteImage(img.id)}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 text-white shadow-md transition-transform hover:scale-110 cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* New previews — reorderable via drag-and-drop */}
                        {galleryPreviews.length > 0 && (
                            <div className="contents">
                                {galleryPreviews.map((preview, idx) => (
                                    <div
                                        key={preview}
                                        className={`group relative aspect-square overflow-hidden rounded-2xl border bg-white shadow-2xs transition-all duration-300 ${
                                            processing
                                                ? ' border-woof-gold/40 ring-2 ring-woof-gold/20'
                                                : uploadComplete
                                                    ? ' border-emerald-400/40 ring-2 ring-emerald-400/20'
                                                    : uploadFailed
                                                        ? ' border-rose-400/40 ring-2 ring-rose-400/20'
                                                        : ' border-[#e8ded1] hover:border-woof-gold hover:shadow-md'
                                        }`}
                                    >
                                        {/* Preview image */}
                                        <img
                                            src={preview}
                                            alt="New upload"
                                            className={`h-full w-full object-cover transition-transform duration-500${
                                                processing ? ' scale-105 opacity-60 blur-[1px]' : uploadComplete ? ' scale-105 opacity-40 blur-[2px]' : ' group-hover:scale-105'
                                            }`}
                                        />

                                        {/* Upload progress overlay */}
                                        {processing && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-woof-charcoal/40 backdrop-blur-2xs">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/30 bg-white/10">
                                                        <Cloud className="h-4 w-4 animate-bounce text-white" />
                                                    </div>
                                                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/90">Uploading</span>
                                                </div>

                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                                    <div
                                                        className="h-full w-1/2 rounded-full bg-woof-gold"
                                                        style={{
                                                            animation: 'gallery-progress 1.2s ease-in-out infinite',
                                                            animationDelay: `${idx * 0.15}s`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Success overlay */}
                                        {uploadComplete && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-900/30 backdrop-blur-2xs">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div
                                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 shadow-md text-white"
                                                    >
                                                        <Check className="h-5 w-5" />
                                                    </div>
                                                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-100">
                                                        Uploaded!
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Compressing overlay */}
                                        {!processing && !uploadComplete && compressingIndices.includes(idx) && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-woof-charcoal/50 backdrop-blur-2xs">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <Loader2 className="h-5 w-5 animate-spin text-woof-gold" />
                                                    <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                                                        Optimizing
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Hover remove overlay (only when idle and not compressing) */}
                                        {!processing && !uploadComplete && !compressingIndices.includes(idx) && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-woof-charcoal/50 opacity-0 backdrop-blur-2xs transition-opacity duration-300 group-hover:opacity-100">
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(idx)}
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 text-white shadow-md transition-transform hover:scale-110 cursor-pointer"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}

                                        {/* File size badge */}
                                        {!compressingIndices.includes(idx) && (
                                            <div className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[8px] font-bold text-white/90 bg-woof-charcoal/70 backdrop-blur-2xs">
                                                <span className="uppercase">{getFileType(dataGallery[idx].type)}</span>
                                                <span className="mx-1 opacity-40">|</span>
                                                {formatFileSize(dataGallery[idx].size)}
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className={`absolute left-2 top-2 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider text-white shadow-xs ${
                                            processing
                                                ? ' flex items-center gap-1 bg-amber-600'
                                                : uploadComplete
                                                    ? ' flex items-center gap-1 bg-emerald-600'
                                                    : uploadFailed
                                                        ? ' flex items-center gap-1 bg-rose-600'
                                                        : ' bg-woof-gold text-woof-charcoal'
                                        }`}>
                                            {processing ? 'Uploading' : uploadComplete ? 'Done' : uploadFailed ? 'Failed' : 'New'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Failure banner */}
                        {uploadFailed && !processing && (
                            <div className="col-span-full mt-2 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-rose-800">
                                        Upload Failed
                                    </p>
                                    <p className="text-[10px] text-rose-700/80">
                                        {dataGallery.length} image{dataGallery.length !== 1 ? 's' : ''} not saved. Please try again or re-select files.
                                    </p>
                                </div>
                                {onRetry && (
                                    <button
                                        type="button"
                                        onClick={onRetry}
                                        className="flex shrink-0 items-center gap-1.5 rounded-full border border-rose-300 bg-white px-3.5 py-1.5 text-xs font-bold text-rose-700 shadow-2xs hover:bg-rose-50 transition-all cursor-pointer"
                                    >
                                        <Upload className="h-3 w-3" />
                                        Retry Upload
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Empty slots */}
                        {Array.from({ length: Math.max(0, remainingSlots) }).map((_, i) => (
                            <div
                                key={`empty-${i}`}
                                className={`group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal/40 transition-all duration-300 ${processing ? ' cursor-default opacity-30' : ' cursor-pointer hover:border-woof-gold hover:bg-[#f4ebe1]/30 hover:text-woof-gold'}`}
                                onClick={() => !processing && galleryInputRef.current?.click()}
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#e8ded1] transition-transform duration-300 group-hover:scale-110">
                                    <Plus className="h-4 w-4 text-woof-gold" />
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-woof-charcoal/40">Slot {totalCount + i + 1}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload progress bar */}
            {processing && dataGallery.length > 0 && (
                <>
                    <div className="h-1 overflow-hidden bg-woof-gold/10">
                        <div
                            className="h-full w-1/2 rounded-full bg-gradient-to-r from-woof-gold/60 via-woof-gold to-woof-gold/60"
                            style={{ animation: 'gallery-progress 1.5s ease-in-out infinite' }}
                        />
                    </div>
                    <style>{`@keyframes gallery-progress{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}@keyframes gallery-success-pop{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}@keyframes gallery-success-fade{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}@keyframes gallery-sparkle-0{0%{opacity:0;transform:translate(-50%,-50%) scale(0)}30%{opacity:1;transform:translate(calc(-50% + 18px),calc(-50% - 28px)) scale(1)}100%{opacity:0;transform:translate(calc(-50% + 38px),calc(-50% - 50px)) scale(0.2)}}@keyframes gallery-sparkle-1{0%{opacity:0;transform:translate(-50%,-50%) scale(0)}30%{opacity:1;transform:translate(calc(-50% - 22px),calc(-50% - 22px)) scale(1)}100%{opacity:0;transform:translate(calc(-50% - 42px),calc(-50% - 42px)) scale(0.2)}}@keyframes gallery-sparkle-2{0%{opacity:0;transform:translate(-50%,-50%) scale(0)}30%{opacity:1;transform:translate(calc(-50% - 10px),calc(-50% - 32px)) scale(1)}100%{opacity:0;transform:translate(calc(-50% + 10px),calc(-50% - 55px)) scale(0.2)}}`}</style>
                </>
            )}
        </div>
    );
}
