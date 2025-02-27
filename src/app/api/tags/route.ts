import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tags - Get all tags with counts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") || "20");

  try {
    // Get all tags with counts of templates they are used in
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            templates: true,
          },
        },
      },
      orderBy: {
        templates: {
          _count: "desc",
        },
      },
      take: limit,
    });

    // Format the tags with counts for the frontend
    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      count: tag._count.templates,
    }));

    return NextResponse.json(formattedTags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
