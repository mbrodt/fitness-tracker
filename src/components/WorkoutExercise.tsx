import type { Prisma, Set } from "@prisma/client";

import SetInputs from "./SetInputs";
import { api } from "../utils/api";
import { useState } from "react";
import { createId } from "@paralleldrive/cuid2";

type WorkoutExerciseWithExercises = Prisma.WorkoutExerciseGetPayload<{
  include: {
    exercise: true;
    sets: true;
  };
}>;

const WorkoutExercise = ({
  exercise,
}: {
  exercise: WorkoutExerciseWithExercises;
}) => {
  const [localSets, setLocalSets] = useState<Set[]>(exercise.sets);

  const createOrUpdateSets = api.set.createOrUpdateMany.useMutation({
    onSuccess: (updatedSets) => {
      console.log("updatedSets:", updatedSets);
      setLocalSets(updatedSets);
    },
  });

  const deleteSetMutation = api.set.delete.useMutation({});

  const addLocalSet = () => {
    const tempSet = {
      id: createId(),
      reps: 0,
      weight: 0,
    } as Set;
    setLocalSets([...localSets, tempSet]);
  };

  const deleteSet = (setId: string) => {
    // Remove the set from the local sets
    const newLocalSets = localSets.filter((set) => set.id !== setId);
    setLocalSets(newLocalSets);

    // Delete the set from the database if it exists there and wasn't just created. Prisma will throw if it doesnt exist, but it doesnt really matter
    deleteSetMutation.mutate({
      id: setId,
    });
  };

  const updateLocalSet = ({
    id,
    reps,
    weight,
  }: {
    id: string;
    reps: number;
    weight: number;
  }) => {
    const newLocalSets = localSets.map((localSet) => {
      if (id === localSet.id) {
        return {
          ...localSet,
          reps,
          weight,
        };
      }
      return localSet;
    });
    setLocalSets(newLocalSets);
  };

  const saveSets = () => {
    createOrUpdateSets.mutate({
      exerciseId: exercise.id,
      sets: localSets,
    });
  };

  const calculateExerciseTotal = () => {
    const total = localSets.reduce((acc, set) => {
      return acc + set.reps * set.weight;
    }, 0);
    return total;
  };
  return (
    <div className="rounded-lg bg-gray-200 p-4 " key={exercise.id}>
      <span className="text-lg"> {exercise.exercise.name}</span>
      <div className="pt-1">
        {localSets.length > 0 && (
          <div className="mb-1 grid grid-cols-[1fr_1fr_50px]">
            <p className="text-xs font-medium  text-[#666666]">Reps</p>
            <p className="text-xs font-medium  text-[#666666]">Weight</p>
          </div>
        )}
        <div className="flex flex-col gap-1">
          {localSets.map((set) => (
            <SetInputs
              key={set.id}
              startingReps={set.reps}
              startingWeight={set.weight}
              updateSet={({ reps, weight }) =>
                updateLocalSet({ id: set.id, reps, weight })
              }
              onDelete={() => deleteSet(set.id)}
            />
          ))}
        </div>
        <button
          className="mt-1 flex items-center text-gray-800 underline"
          onClick={() => addLocalSet()}
        >
          Add set
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="ml-1 w-5 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        <p className="mt-2 text-sm font-bold">
          Total weight: {calculateExerciseTotal()}
        </p>
        <button
          onClick={() => saveSets()}
          className="btn w-full py-1 text-base"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default WorkoutExercise;
