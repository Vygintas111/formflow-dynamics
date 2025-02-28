import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET /api/templates/[id] - Get a single template
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  try {
    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        questions: {
          orderBy: {
            order: "asc",
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

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Check if user has access to the template
    if (
      template.access === "RESTRICTED" &&
      template.authorId !== session?.user.id &&
      session?.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "You don't have access to this template" },
        { status: 403 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

// PUT /api/templates/[id] - Update a template
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to update a template" },
      { status: 401 }
    );
  }

  try {
    // Get the template to check ownership
    const existingTemplate = await prisma.template.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Check if user is the author or an admin
    if (
      existingTemplate.authorId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "You don't have permission to update this template" },
        { status: 403 }
      );
    }

    const { title, description, topic, access, tags } = await req.json();

    // Update the template
    const template = await prisma.template.update({
      where: { id },
      data: {
        title,
        description,
        topic,
        access,
        // First delete all existing tag connections
        tags: {
          deleteMany: {},
          // Then create new ones
          create: tags?.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName.trim() },
                create: { name: tagName.trim() },
              },
            },
          })),
        },
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
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }
}

// DELETE /api/templates/[id] - Delete a template
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to delete a template" },
      { status: 401 }
    );
  }

  try {
    // Get the template to check ownership
    const existingTemplate = await prisma.template.findUnique({
      where: { id },
      include: { author: true }, // Include author details to verify
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Check if user is the author or an admin by email (which is more reliable than ID)
    const isAuthor = session.user.email === existingTemplate.author.email;
    const isAdmin = session.user.role === "ADMIN";

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "You don't have permission to delete this template" },
        { status: 403 }
      );
    }

    // Delete the template
    await prisma.template.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
}
