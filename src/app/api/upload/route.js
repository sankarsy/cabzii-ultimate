import { mkdir, writeFile } from "fs/promises";
import path from "path";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return Response.json({ success: false, message: "Image file is required." }, { status: 400 });
    }

    if (!allowedMimeTypes.has(file.type)) {
      return Response.json(
        { success: false, message: "Only jpg, png, webp, and gif files are allowed." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const safeName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
    const fileName = `${Date.now()}-${safeName || "upload-image"}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    return Response.json({
      success: true,
      data: {
        fileName,
        url: `/uploads/${fileName}`
      }
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to upload image.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
