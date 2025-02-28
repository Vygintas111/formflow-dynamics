// src/app/api/templates/[id]/questions/[questionId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { QuestionType } from "@prisma/client";

// GET /api/templates/[id]/questions/[questionId] - Get a specific question
export async function GET(
  req: Request,
  { params }: { params: { id: string; questionId: string } }
) {
  const { id: templateId, questionId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to view a question" },
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

    // Get the question
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question || question.templateId !== templateId) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}

// PUT /api/templates/[id]/questions/[questionId] - Update a question
export async function PUT(
  req: Request,
  { params }: { params: { id: string; questionId: string } }
) {
  const { id: templateId, questionId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to update a question" },
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

    // Get the question
    const existingQuestion = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!existingQuestion || existingQuestion.templateId !== templateId) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const { title, description, required, showInSummary, visible } =
      await req.json();

    // Update the question
    const question = await prisma.question.update({
      where: { id: questionId },
      data: {
        title,
        description,
        required: required !== undefined ? required : existingQuestion.required,
        showInSummary:
          showInSummary !== undefined
            ? showInSummary
            : existingQuestion.showInSummary,
        visible: visible !== undefined ? visible : existingQuestion.visible,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

// DELETE /api/templates/[id]/questions/[questionId] - Delete a question
export async function DELETE(
  req: Request,
  { params }: { params: { id: string; questionId: string } }
) {
  const { id: templateId, questionId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to delete a question" },
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

    // Get the question
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question || question.templateId !== templateId) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Delete the question
    await prisma.question.delete({
      where: { id: questionId },
    });

    // Reorder the remaining questions to maintain sequential order
    const remainingQuestions = await prisma.question.findMany({
      where: { templateId },
      orderBy: { order: "asc" },
    });

    const updatePromises = remainingQuestions.map((q, index) =>
      prisma.question.update({
        where: { id: q.id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
