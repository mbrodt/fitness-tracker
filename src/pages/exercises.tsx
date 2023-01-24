import { useEffect, useState } from "react";
import MuscleGroupBadge from "../components/MuscleGroupBadge";
import Profile from "../components/Profile";
import { api } from "../utils/api";
import { useRouter } from "next/router";

const Exercises = () => {
  const router = useRouter();

  const { data: muscleGroups, isFetched } = api.main.muscleGroups.useQuery();
  const mutation = api.main.workoutCreate.useMutation({
    async onSuccess(data) {
      if (data) {
        await router.push(`/workouts/${data.id}`);
      }
    },
  });

  useEffect(() => {
    // Mark all groups as active on initial fetch. Preference could be saved in local storage?
    setActiveGroups(muscleGroups?.map((muscleGroup) => muscleGroup.id) || []);
  }, [isFetched]);

  const [activeGroups, setActiveGroups] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const toggleGroup = (id: string) => {
    if (activeGroups.includes(id)) {
      removeFromActive(id);
    } else {
      markAsActive(id);
    }
  };

  const markAsActive = (id: string) => {
    setActiveGroups([...activeGroups, id]);
  };

  const removeFromActive = (id: string) => {
    setActiveGroups(activeGroups.filter((groupId) => groupId !== id));
  };

  const toggleExercise = (id: string) => {
    if (selectedExercises.includes(id)) {
      removeFromSelected(id);
    } else {
      markAsSelected(id);
    }
  };

  const markAsSelected = (id: string) => {
    setSelectedExercises([...selectedExercises, id]);
  };

  const removeFromSelected = (id: string) => {
    setSelectedExercises(
      selectedExercises.filter((exerciseId) => exerciseId !== id)
    );
  };

  const createWorkout = () => {
    const exerciseGroups =
      muscleGroups
        ?.filter((muscleGroup) => {
          return muscleGroup.exercises.some((exercise) => {
            return selectedExercises.includes(exercise.id);
          });
        })
        .map((muscleGroup) => muscleGroup.id) || [];
    mutation.mutate({
      exercises: selectedExercises,
      muscleGroups: exerciseGroups,
    });
  };

  return (
    <>
      <div className="bg-gray-100 p-4 pb-16">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Exercise overview</h1>
          <Profile />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {muscleGroups?.map((muscleGroup) => (
            <MuscleGroupBadge
              key={muscleGroup.id}
              id={muscleGroup.id}
              name={muscleGroup.name}
              isActive={activeGroups.includes(muscleGroup.id)}
              toggleActive={toggleGroup}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-8">
          {muscleGroups?.map((muscleGroup) => {
            return (
              activeGroups.includes(muscleGroup.id) && (
                <div key={muscleGroup.id}>
                  <p className="text-2xl font-bold">{muscleGroup.name}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {muscleGroup.exercises.map((exercise) => (
                      <div
                        className={`mt-2 aspect-square w-full rounded-lg  p-4 text-white ${
                          selectedExercises.includes(exercise.id)
                            ? "bg-green-400"
                            : "bg-gray-600"
                        }`}
                        key={exercise.id}
                        onClick={() => toggleExercise(exercise.id)}
                      >
                        <span> {exercise.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
      <button
        onClick={createWorkout}
        className={`btn fixed bottom-16 left-4  right-4 transition-all duration-300 ${
          selectedExercises.length > 0
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        } `}
      >
        Add to workout
      </button>
    </>
  );
};

export default Exercises;
