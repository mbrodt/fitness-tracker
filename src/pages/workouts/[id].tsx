import { useRouter } from "next/router";
import Profile from "../../components/Profile";
import MuscleGroupBadge from "../../components/MuscleGroupBadge";
import { api } from "../../utils/api";
import type { Prisma, Set } from "@prisma/client";
import WorkoutExercise from "../../components/WorkoutExercise";

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
                      <WorkoutExercise exercise={exercise} key={exercise.id} />
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
