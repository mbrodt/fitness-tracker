import { useRouter } from "next/router";
import Profile from "../../components/Profile";
import MuscleGroupBadge from "../../components/MuscleGroupBadge";
import { api } from "../../utils/api";
import type { Prisma, Set } from "@prisma/client";
import SetInputs from "../../components/SetInputs";

type WorkoutExerciseWithExercises = Prisma.WorkoutExerciseGetPayload<{
  include: {
    exercise: true;
    sets: true;
  };
}>;

const Workout = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: workout, refetch } = api.main.workout.useQuery({
    id: (id as string) || "",
  });

  const addSetMutation = api.main.setCreate.useMutation({
    onSettled() {
      void refetch();
    },
  });

  const deleteSetMutation = api.main.setDelete.useMutation({
    onSettled() {
      void refetch();
    },
  });

  const updateSetMutation = api.main.setUpdate.useMutation({
    onSettled() {
      void refetch();
    },
  });
  console.log("workout:", workout);

  if (!workout) return;

  const exercisesByMuscleGroup = workout.exercises.reduce((acc, exercise) => {
    const muscleGroup =
      workout.muscleGroups.find(
        (group) => group.id === exercise.exercise.muscleGroupId
      )?.name || "";
    if (!acc[muscleGroup]) {
      acc[muscleGroup] = [];
    }
    acc[muscleGroup]?.push(exercise);
    return acc;
  }, {} as { [key: string]: WorkoutExerciseWithExercises[] });

  const addSet = (exerciseId: string) => {
    addSetMutation.mutate({
      exerciseId,
    });
  };

  const deleteSet = (setId: string) => {
    deleteSetMutation.mutate({
      id: setId,
    });
  };

  const updateSet = ({
    id,
    reps,
    weight,
  }: {
    id: string;
    reps: number;
    weight: number;
  }) => {
    updateSetMutation.mutate({
      id,
      reps,
      weight,
    });
  };

  const calculateExerciseTotal = (sets: Set[]) => {
    const total = sets.reduce((acc, set) => {
      return acc + set.reps * set.weight;
    }, 0);
    return total;
  };

  return (
    <div className="bg-gray-100 p-4 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold first-letter:uppercase">
          {new Date(workout.date).toLocaleDateString("da-DK", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </h1>
        <Profile />
      </div>
      <div className="flex flex-wrap gap-2">
        {workout?.muscleGroups.map((muscleGroup) => (
          <MuscleGroupBadge
            key={muscleGroup.id}
            id={muscleGroup.id}
            name={muscleGroup.name}
            isActive={false}
          />
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-8">
        {Object.entries(exercisesByMuscleGroup)?.map(
          ([muscleGroup, exercises]) => {
            return (
              <div key={muscleGroup}>
                <p className="text-2xl font-bold">{muscleGroup}</p>
                <div className="flex flex-col gap-8">
                  {exercises.map((exercise) => {
                    return (
                      <div
                        className="grid grid-cols-2  gap-4"
                        key={exercise.id}
                      >
                        <div
                          className={`mt-2 aspect-square w-full rounded-lg  bg-gray-600 p-4 text-white`}
                          key={exercise.id}
                        >
                          <span> {exercise.exercise.name}</span>
                        </div>
                        <div className="pt-1">
                          {exercise.sets.length > 0 && (
                            <div className="mb-1 flex gap-6">
                              <p className="text-xs font-semibold uppercase text-gray-400">
                                Reps
                              </p>
                              <p className="text-xs font-semibold uppercase text-gray-400">
                                Weight
                              </p>
                            </div>
                          )}
                          <div className="flex flex-col gap-1">
                            {exercise.sets.map((set) => (
                              <SetInputs
                                key={set.id}
                                startingReps={set.reps}
                                startingWeight={set.weight}
                                onUpdate={(reps, weight) => {
                                  updateSet({
                                    id: set.id,
                                    reps,
                                    weight,
                                  });
                                }}
                                onDelete={() => deleteSet(set.id)}
                              />
                            ))}
                          </div>
                          <button
                            className="mt-1 flex items-center text-gray-800 underline"
                            onClick={() => addSet(exercise.id)}
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
                            Total weight:{" "}
                            {calculateExerciseTotal(exercise.sets)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-4"></div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Workout;
