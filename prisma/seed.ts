import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const muscleGroups = [
  {
    name: "Chest",
    exercises: [
      "Bench Press",
      "Incline Bench Press",
      "Dumbbell Fly",
      "Incline Dumbbell",
      "Cable Pec Fly",
      "Vertical Press Machine",
    ],
  },
  {
    name: "Back",
    exercises: [
      "Pull Up",
      "Deadlift",
      "Seated Row",
      "One Arm Dumbbell Row",
      "Lat Pull Down",
      "Cable Arm Pull",
    ],
  },
  {
    name: "Shoulders",
    exercises: [
      "Dumbbell Shoulder Press",
      "Elbow Kisses",
      "Arm raises",
      "Lat Raise Machine",
      "Military Press",
    ],
  },
  {
    name: "Biceps",
    exercises: [
      "Barbell Curls",
      "Standing Cable Curls",
      "Incline Dumbbell Curls",
      "Hammer Curls",
    ],
  },
  {
    name: "Triceps",
    exercises: [
      "Bench Dips",
      "Dumbbell Extension",
      "Skull Crusher",
      "Rope Pushdown",
      "Reverse Grip Pushdown",
      "Single Hand Cable Pushdown",
    ],
  },
  {
    name: "Legs",
    exercises: [
      "Barbell Squat",
      "Bulgarian Split Squat",
      "Dumbbell Lunges",
      "Leg Press",
      "Seated Leg Curl Machine",
    ],
  },
  {
    name: "Abs",
    exercises: [
      "Leg Raises",
      "Stomach Bend / Turtle",
      "Cable Rope Roll",
      "Barbell Turn",
    ],
  },
];

async function main() {
  await prisma.exercise.deleteMany();
  await prisma.muscleGroup.deleteMany();
  muscleGroups.forEach(async (muscleGroup) => {
    const group = await prisma.muscleGroup.create({
      data: {
        name: muscleGroup.name,
      },
    });
    muscleGroup.exercises.forEach(async (exercise) => {
      const createdExercise = await prisma.exercise.create({
        data: {
          name: exercise,
          muscleGroupId: group.id,
        },
      });
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
