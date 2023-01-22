import Profile from "../../components/Profile";
import MuscleGroupBadge from "../../components/MuscleGroupBadge";
import { api } from "../../utils/api";
import Link from "next/link";

const Workouts = () => {
  const { data: workouts } = api.main.workoutsList.useQuery();
  console.log("workouts:", workouts);
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-bold">Workouts</h1>
        <Profile />
      </div>
      <div className="flex flex-col ">
        {workouts?.map((workout) => (
          <Link
            href={`/workouts/${workout.id}`}
            key={workout.id}
            className="flex items-center justify-between p-4 py-6 odd:bg-gray-200 "
          >
            <div>
              <div className="flex flex-wrap gap-2">
                {workout.muscleGroups.map((muscleGroup) => (
                  <MuscleGroupBadge
                    key={muscleGroup.id}
                    id={muscleGroup.id}
                    name={muscleGroup.name}
                    isActive={false}
                  />
                ))}
              </div>
              <p className="text-lg font-bold first-letter:uppercase">
                {new Date(workout.date).toLocaleDateString("da-DK", {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <svg
              className="w-4"
              viewBox="0 0 27 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M26.0607 13.0607C26.6464 12.4749 26.6464 11.5251 26.0607 10.9393L16.5147 1.3934C15.9289 0.80761 14.9792 0.807611 14.3934 1.3934C13.8076 1.97918 13.8076 2.92893 14.3934 3.51472L22.8787 12L14.3934 20.4853C13.8076 21.0711 13.8076 22.0208 14.3934 22.6066C14.9792 23.1924 15.9289 23.1924 16.5147 22.6066L26.0607 13.0607ZM1.31134e-07 13.5L25 13.5L25 10.5L-1.31134e-07 10.5L1.31134e-07 13.5Z"
                fill="black"
              />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Workouts;
