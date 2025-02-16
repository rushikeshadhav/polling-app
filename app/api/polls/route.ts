import prisma from "@/lib/prisma";

export async function POST(request) {
    const { question, options } = await request.json();
console.log(question, options)
    const newPoll = await prisma.poll.create({
        data: {
            question,
            options: {
                create: options.map((text) => ({ text })),
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
