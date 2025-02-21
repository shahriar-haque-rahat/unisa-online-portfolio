import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ✅ Store JSON outside `public/` to allow runtime modifications
const dataDir = path.join(process.cwd(), "public/data");
const filePath = path.join(dataDir, "data.json");

// Ensure data directory & file exist
async function ensureFileExists() {
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }

    try {
        await fs.access(filePath);
    } catch {
        await fs.writeFile(filePath, JSON.stringify({}, null, 2));
    }
}

export async function GET(req: Request, { params }: { params: { section: string; id?: string } }) {
    try {
        await ensureFileExists();
        const data = JSON.parse(await fs.readFile(filePath, "utf8"));

        // If an ID is provided, return the single entry
        if (params.id) {
            if (!Array.isArray(data[params.section])) {
                return NextResponse.json({ message: "Invalid data structure" }, { status: 400 });
            }

            const entry = data[params.section].find((item: any) => item.id === params.id);

            if (!entry) {
                return NextResponse.json({ message: "Entry not found" }, { status: 404 });
            }

            return NextResponse.json(entry);
        }

        // Otherwise, return the entire section
        return NextResponse.json(data[params.section] || []);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json(
            { message: "Error reading data", error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function POST(req: Request, { params }: { params: { section: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        await ensureFileExists();
        const body = await req.json();
        const data = JSON.parse(await fs.readFile(filePath, "utf8"));

        let updatedData;
        if (Array.isArray(data[params.section])) {
            // Generate unique ID and append
            const newEntry = { id: `${Date.now()}${Math.floor(100 + Math.random() * 900)}`, ...body };
            updatedData = [...data[params.section], newEntry];
        } else {
            // Replace entire JSON
            updatedData = body;
        }

        data[params.section] = updatedData;
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));

        return NextResponse.json({ message: `Section '${params.section}' updated successfully` });
    } catch (error) {
        console.error("ADD Error:", error);
        return NextResponse.json({ message: "Error updating data", error: (error as Error).message }, { status: 500 });
    }
}

