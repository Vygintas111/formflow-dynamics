import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET /api/templates - Get all templates

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") || "10");
  const offset = Number(searchParams.get("offset") || "0");
  const author = searchParams.get("author");
  const query = searchParams.get("query") || "";
  const tag = searchParams.get("tag");
  const sortBy = searchParams.get("sortBy");

  try {
    let orderBy: any = { createdAt: "desc" };

    if (sortBy === "forms") {
      orderBy = { forms: { _count: "desc" } };
    } else if (sortBy === "likes") {
      orderBy = { likes: { _count: "desc" } };
    }

    let whereClause: any = {};

    if (author) {
      whereClause.authorId = author;
    } else {
      whereClause.access = "PUBLIC";
    }

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (tag) {
      whereClause.tags = {
        some: {
          tag: {
            name: tag,
          },
        },
      };
    }

    const templates = await prisma.template.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            forms: true,
            likes: true,
            comments: true,
          },
        },
      },
      orderBy,
      take: limit,
      skip: offset,
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
// POST /api/templates - Create a new template
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to create a template" },
      { status: 401 }
    );
  }

  try {
    const { title, description, topic, access, tags } = await req.json();

    const template = await prisma.template.create({
      data: {
        title,
        description,
        topic: topic || "Other",
        access: access || "PUBLIC",
        authorId: session.user.id,
        tags: tags?.length
          ? {
              create: tags.map((tagName: string) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName.trim() },
                    create: { name: tagName.trim() },
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            forms: true,
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
