import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const caseId = formData.get("caseId") as string;
    const documentType = formData.get("documentType") as string;
    const category = formData.get("category") as string;

    if (!file || !caseId || !documentType) {
      return NextResponse.json({ error: "Missing required fields: file, caseId, documentType" }, { status: 400 });
    }

    // Verify case belongs to user
    const visaCase = await prisma.visaCase.findFirst({
      where: { id: caseId, userId: user.id },
    });

    if (!visaCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads", caseId);

    await mkdir(uploadDir, { recursive: true });
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${caseId}/${fileName}`;

    // Create document record
    const document = await prisma.document.create({
      data: {
        caseId,
        type: documentType,
        category: category || "identity",
        fileName: file.name,
        fileUrl,
        status: "uploaded",
      },
    });

    // Update case status if draft
    if (visaCase.status === "draft") {
      await prisma.visaCase.update({
        where: { id: caseId },
        data: { status: "in_progress" },
      });
    }

    return NextResponse.json({ document }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}