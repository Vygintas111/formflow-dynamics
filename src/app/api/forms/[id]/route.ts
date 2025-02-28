import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET /api/forms/[id] - Get a single form
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to view a form" },
      { status: 401 }
    );
  }

  try {
    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        template: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Check if user has access (form submitter, template author, or admin)
    const isFormSubmitter = form.submitter.id === session.user.id;
    const isTemplateAuthor = form.template.authorId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isFormSubmitter && !isTemplateAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "You don't have permission to view this form" },
        { status: 403 }
      );
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { error: "Failed to fetch form" },
      { status: 500 }
    );
  }
}
