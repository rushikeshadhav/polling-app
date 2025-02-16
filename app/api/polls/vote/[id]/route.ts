import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Define type for votes
type Votes = Record<number, number>;

export async function POST(request: Request,
    { params }: { params: Promise<{ id: string }> }

) {
    try {
        const id = Number((await params).id)
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid poll ID" }, { status: 400 });
        }

        const { option }: { option: number } = await request.json();

        const poll = await prisma.poll.findUnique({ where: { id } });

        if (!poll || typeof poll.votes !== "object") {
            return NextResponse.json({ error: "Poll not found or invalid votes structure" }, { status: 404 });
        }

        const votes: Votes = poll.votes as Votes; // Cast votes to correct type
        const updatedVotes: Votes = { ...votes, [option]: (votes[option] || 0) + 1 };

        const updatedPoll = await prisma.poll.update({
            where: { id },
            data: { votes: updatedVotes },
        });

        return NextResponse.json(updatedPoll);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
