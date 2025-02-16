"use client";
import { useState, useEffect } from "react";

interface Option {
  id: number;
  text: string;
}

interface Poll {
  id: number;
  question: string;
  options: Option[];
  votes: Record<number, number>;
}

const PollingApp = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  console.log(selectedOption);
  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      const res = await fetch("/api/polls");
      const data: Poll[] = await res.json();
      setPolls(data);
      setLoading(false);
    };

    fetchPolls();
    const interval = setInterval(fetchPolls, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = async (pollId: number, optionId: number | null) => {
    if (!optionId) return;
    setLoading(true);
    await fetch(`/api/polls/vote/${pollId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId }),
    });
    setSelectedOption(null);
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Quick Polling App</h1>
      <button
        onClick={async () => {
          const question = prompt("Enter poll question:");
          const options = prompt("Enter options separated by commas:")
            ?.split(",")
            .map((text) => text.trim());
          if (!question || !options || options.length === 0) return;
          setLoading(true);
          const res = await fetch("/api/polls", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, options }),
          });
          if (res.ok) {
            const newPoll: Poll = await res.json();
            setPolls((prev) => [...prev, newPoll]);
          }
          setLoading(false);
        }}
        className="bg-green-500 text-white px-2 py-1 rounded mb-4"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Poll"}
      </button>
      {loading && <p className="text-gray-500">Loading...</p>}
      <ul>
        {polls.map((poll) => (
          <li key={poll.id} className="border p-2 my-2">
            <h2 className="font-semibold">{poll.question}</h2>
            {poll.options.map((option) => (
              <label key={option.id} className="block">
                <input
                  type="radio"
                  name={poll.id.toString()}
                  value={option.id}
                  onChange={() => setSelectedOption(option.id)}
                />
                {option.text}
              </label>
            ))}
            <button
              onClick={() => handleVote(poll.id, selectedOption)}
              className={`mt-2 bg-blue-500 text-white px-2 py-1 rounded ${
                selectedOption === null || loading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={selectedOption === null || loading}
            >
              {loading ? "Voting..." : "Vote"}
            </button>
            <p className="mt-2 text-sm">
              Votes:{" "}
              {Object.entries(poll.votes)
                .map(([optionId, count]) => {
                  const optionText =
                    poll.options.find((opt) => opt.id === Number(optionId))
                      ?.text || "Unknown";
                  return `${optionText}: ${count}`;
                })
                .join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollingApp;
