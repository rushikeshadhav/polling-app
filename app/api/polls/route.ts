import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    const { question, options } = await request.json();
    const newPoll = await prisma.poll.create({
        data: {
            question,
            options: {
                create: options.map((text: string) => ({ text })),
            },
        },
        include: { options: true },
    });

    return Response.json(newPoll);
}

export async function GET() {
    const polls = await prisma.poll.findMany({
        include: { options: true },
    });
    return Response.json(polls);
}
