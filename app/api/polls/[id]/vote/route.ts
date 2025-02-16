import prisma from "@/lib/prisma";

export async function POST(request, { params }) {
    const { id } = await params;
    const { option } = await request.json();

    const poll = await prisma.poll.findUnique({ where: { id: Number(id) } });
    if (!poll) {
        return Response.json({ error: "Poll not found" }, { status: 404 });
    }

    const updatedVotes = { ...poll.votes, [option]: (poll.votes[option] || 0) + 1 };
    const updatedPoll = await prisma.poll.update({
        where: { id: Number(id) },
        data: { votes: updatedVotes },
    });

    return Response.json(updatedPoll);
}
