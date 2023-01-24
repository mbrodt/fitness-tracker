import { useEffect, useState } from "react";

const SetInputs = ({
  startingReps,
  startingWeight,
  updateSet,
  onDelete,
}: {
  startingReps: number;
  startingWeight: number;
  updateSet: (set: { reps: number; weight: number }) => void;
  onDelete: () => void;
}) => {
  const [weight, setWeight] = useState(startingWeight);
  const [reps, setReps] = useState(startingReps);

  useEffect(() => {
    updateSet({ reps, weight });
  }, [reps, weight]);

  return (
    <div className="grid grid-cols-[1fr_1fr_40px] gap-2">
      <div>
        <input
          value={reps || ""}
          onChange={(e) => setReps(Number(e.target.value))}
          className="w-full  rounded border border-gray-400 text-center text-lg"
          type="number"
        />
      </div>
      <div>
        <input
          value={weight || ""}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="w-full  rounded border border-gray-400 text-center text-lg"
          type="number"
        />
      </div>

      <button
        onClick={onDelete}
        className="flex w-full items-center justify-center"
      >
        <svg
          className="h-4 w-4 text-[#666666]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="16"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12h8"></path>
        </svg>
      </button>
    </div>
  );
};

export default SetInputs;
