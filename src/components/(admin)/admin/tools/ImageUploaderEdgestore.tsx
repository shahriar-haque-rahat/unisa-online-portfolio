"use client";
import { useEdgeStore } from "@/edgestore/edgestore";
import React, {
    useState,
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";

const ImageUploaderEdgestore = forwardRef<
    { uploadImage: () => Promise<string | null> },
    { onUpload?: (url: string) => void; resetTrigger?: number }
>(({ onUpload, resetTrigger }, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Destructure edgestore from the hook.
    const { edgestore } = useEdgeStore();

    // Reset state when resetTrigger changes.
    useEffect(() => {
        setUploadedImageUrl("");
        setSelectedFile(null);
        setPreviewImage(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [resetTrigger]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("❌ Please upload a valid image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("❌ File size too large. Max limit is 5MB.");
            return;
        }

        // Generate a preview of the image.
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result as string);
        reader.readAsDataURL(file);

        setSelectedFile(file);
        setError(null);
    };

    // Expose the uploadImage method via the ref.
    const uploadImage = async (): Promise<string | null> => {
        if (!selectedFile) return null;
        setLoading(true);
        setError(null);

        try {
            // Use the publicFiles bucket's upload method.
            const response = await edgestore.publicFiles.upload({ file: selectedFile });
            if (response.url) {
                setUploadedImageUrl(response.url);
                if (onUpload) onUpload(response.url);
                return response.url;
            } else {
                setError("❌ Image upload failed. No image URL returned.");
                throw new Error("No image URL returned");
            }
        } catch (err) {
            setError("❌ Image upload failed. Please try again.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        uploadImage,
    }));

    return (
        <div className="p-4 bg-white shadow-md rounded-md max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Upload an Image
            </h2>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="mb-3 block w-full border p-2 rounded-md"
            />

            {!uploadedImageUrl && previewImage && (
                <img
                    src={previewImage}
                    alt="Preview"
                    className="mb-3 w-full rounded-md border border-gray-300"
                />
            )}

            {loading && <p>Uploading...</p>}
            {error && (
                <p className="mt-2 text-cancelPrimary text-sm text-center">{error}</p>
            )}

            {uploadedImageUrl && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">✅ Upload Successful!</p>
                    <img
                        src={uploadedImageUrl}
                        alt="Uploaded"
                        className="mt-2 w-full rounded-md border border-gray-300"
                    />
                </div>
            )}
        </div>
    );
});

export default ImageUploaderEdgestore;
