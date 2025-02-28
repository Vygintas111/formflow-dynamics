// src/app/api/templates/[id]/questions/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { QuestionType } from "@prisma/client";

// GET /api/templates/[id]/questions - Get all questions for a template
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to view questions" },
      { status: 401 }
    );
  }

  try {
    // Get the template to check ownership or access rights
    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: {
            order: "asc",
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

    // Check if user has permission to view this template
    if (
      template.access === "RESTRICTED" &&
      template.authorId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "You don't have access to this template" },
        { status: 403 }
      );
    }

    return NextResponse.json(template.questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// POST /api/templates/[id]/questions - Add a new question to the template
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: templateId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to add questions" },
      { status: 401 }
    );
  }

  try {
    // Get the template to check ownership
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        questions: {
          where: {
            visible: true,
          },
          select: {
            type: true,
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

    const { title, description, type, required, showInSummary, visible } =
      await req.json();

    // Check if adding this question would exceed the limit of 4 per type
    const typeCount = template.questions.filter((q) => q.type === type).length;

    if (typeCount >= 4) {
      return NextResponse.json(
        { error: `You can only have up to 4 questions of type ${type}` },
        { status: 400 }
      );
    }

    // Get the highest order number to place this new question at the end
    const maxOrderQuestion = await prisma.question.findFirst({
      where: { templateId },
      orderBy: { order: "desc" },
    });

    const newOrder = maxOrderQuestion ? maxOrderQuestion.order + 1 : 0;

    // Create the new question
    const question = await prisma.question.create({
      data: {
        title,
        description,
        type: type as QuestionType,
        required: required || false,
        showInSummary: showInSummary !== undefined ? showInSummary : true,
        visible: visible !== undefined ? visible : true,
        order: newOrder,
        templateId,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}

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
