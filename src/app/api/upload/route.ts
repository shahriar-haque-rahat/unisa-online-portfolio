import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Define Upload Directory
const uploadDir = path.join(process.cwd(), "public/uploads");

// Ensure Upload Directory Exists
async function ensureUploadDirExists() {
    try {
        await fs.access(uploadDir);
    } catch {
        await fs.mkdir(uploadDir, { recursive: true });
    }
}

// ✅ Handle Image Upload
export async function POST(req: NextRequest) {
    try {
        await ensureUploadDirExists();

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
        }

        // Validate File Type
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ message: "Invalid file type. Only images are allowed." }, { status: 400 });
        }

        // Convert File to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        // Save File to Server
        await fs.writeFile(filePath, buffer);

        return NextResponse.json({ imageUrl: `/uploads/${fileName}` }); // ✅ Return Correct Image URL
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ message: "Upload failed." }, { status: 500 });
    }
}
