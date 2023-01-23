import { useState } from "react";

const SetInputs = ({
  startingReps,
  startingWeight,
  onDelete,
  onUpdate,
}: {
  startingReps: number;
  startingWeight: number;
  onDelete: () => void;
  onUpdate: (reps: number, weight: number) => void;
}) => {
  const [weight, setWeight] = useState(startingWeight);
  const [reps, setReps] = useState(startingReps);

  return (
    <div className="flex w-full items-center">
      <div>
        <input
          value={reps || ""}
          onChange={(e) => setReps(Number(e.target.value))}
          className="w-8 rounded-lg border border-gray-800 text-center"
          type="number"
        />
      </div>
      <div>
        <input
          value={weight || ""}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="ml-4 w-12  rounded-lg border border-gray-800 text-center"
          type="number"
        />
      </div>

      <div className="ml-4 flex w-full items-center justify-center gap-4">
        <button onClick={() => onUpdate(reps, weight)}>
          <svg
            className="h-4 w-4 fill-current text-green-400"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="10" fill="currentColor" />
            <path
              d="M5 11.6667L9.70588 15L15 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button onClick={onDelete} className="">
          <svg
            className="h-4 w-4 fill-current text-red-400"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="10" fill="currentColor" />
            <path
              d="M14 6L6 14M6 6L14 14"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SetInputs;
