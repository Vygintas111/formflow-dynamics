import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// PUT /api/templates/[id]/questions/reorder - Reorder questions
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: templateId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to reorder questions" },
      { status: 401 }
    );
  }

  try {
    // Get the template to check ownership
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Check if user is the author or an admin
    if (
      template.authorId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "You don't have permission to modify this template" },
        { status: 403 }
      );
    }

    const { orderedIds } = await req.json();

    // Update the order of each question
    const updatePromises = orderedIds.map((id: string, index: number) =>
      prisma.question.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updatePromises);

    // Return the updated questions
    const questions = await prisma.question.findMany({
      where: { templateId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error reordering questions:", error);
    return NextResponse.json(
      { error: "Failed to reorder questions" },
      { status: 500 }
    );
  }
}
