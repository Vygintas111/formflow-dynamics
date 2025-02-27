import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET /api/forms - Get forms submitted by the current user
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to access forms" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const templateId = searchParams.get("templateId");
  const limit = Number(searchParams.get("limit") || "10");
  const offset = Number(searchParams.get("offset") || "0");

  try {
    const forms = await prisma.form.findMany({
      where: {
        // Only return forms that the user created or for templates they created
        OR: [
          // Forms submitted by the user
          { submitterId: session.user.id },
          // Forms for templates created by the user
          { template: { authorId: session.user.id } },
        ],
        // Filter by template if specified
        ...(templateId ? { templateId } : {}),
      },
      include: {
        template: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}

// POST /api/forms - Submit a new form
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to submit a form" },
      { status: 401 }
    );
  }

  try {
    const { templateId, answers } = await req.json();

    // Verify that the template exists and user has access
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Check if template is public or user has access
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

    // Create the form and answers
    const form = await prisma.form.create({
      data: {
        templateId,
        submitterId: session.user.id,
        answers: {
          create: answers.map(
            (answer: { questionId: string; value: string }) => ({
              questionId: answer.questionId,
              value: answer.value,
            })
          ),
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}
