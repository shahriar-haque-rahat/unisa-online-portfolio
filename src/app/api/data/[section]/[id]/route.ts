import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const dataDir = path.join(process.cwd(), "public/data");
const filePath = path.join(dataDir, "data.json");
const uploadsDir = path.join(process.cwd(), "public/uploads"); // Ensure this directory exists

async function deleteImage(imageUrl: string) {
    if (!imageUrl.startsWith("/uploads/")) return; // Only delete images in uploads folder

    const imagePath = path.join(process.cwd(), "public", imageUrl);
    try {
        await fs.unlink(imagePath);
    } catch (error) {
        console.error("Failed to delete old image:", error);
    }
}

export async function PATCH(req: Request, { params }: { params: { section: string; id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const data = JSON.parse(await fs.readFile(filePath, "utf8"));

        if (!data.hasOwnProperty(params.section)) {
            return NextResponse.json({ message: `Section "${params.section}" not found` }, { status: 404 });
        }

        const index = data[params.section].findIndex((item: any) => String(item.id) === params.id);
        if (index === -1) {
            return NextResponse.json({ message: `Entry with ID "${params.id}" not found` }, { status: 404 });
        }

        // Check if image is updated, delete old image if it exists
        if (body.image && body.image !== data[params.section][index].image) {
            await deleteImage(data[params.section][index].image);
        }

        // Update the data
        data[params.section][index] = { ...data[params.section][index], ...body };

        await fs.writeFile(filePath, JSON.stringify(data, null, 2));

        return NextResponse.json({ message: `Entry ${params.id} updated successfully`, updatedData: data[params.section][index] });
    } catch (error) {
        console.error("PATCH Error:", error);
        return NextResponse.json({ message: "Error updating data", error }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { section: string; id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const data = JSON.parse(await fs.readFile(filePath, "utf8"));

        if (!data.hasOwnProperty(params.section)) {
            return NextResponse.json(
                { message: `Section "${params.section}" not found` },
                { status: 404 }
            );
        }

        const index = data[params.section].findIndex(
            (item: any) => String(item.id) === params.id
        );
        if (index === -1) {
            return NextResponse.json(
                { message: `Entry with ID "${params.id}" not found` },
                { status: 404 }
            );
        }

        const entry = data[params.section][index];
        // Delete associated image if one exists
        if (entry.image) {
            await deleteImage(entry.image);
        }

        // Remove entry from the array
        data[params.section] = data[params.section].filter(
            (item: any) => String(item.id) !== params.id
        );

        await fs.writeFile(filePath, JSON.stringify(data, null, 2));

        return NextResponse.json({
            message: `Entry ${params.id} deleted successfully`,
        });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json(
            { message: "Error deleting data", error },
            { status: 500 }
        );
    }
}
