import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const mainRouter = createTRPCRouter({
  muscleGroups: publicProcedure.query(({ ctx }) => {
    const muscleGroups = ctx.prisma.muscleGroup.findMany({
      include: {
        exercises: true,
      },
    });
    return muscleGroups;
  }),
  setCreate: protectedProcedure
    .input(
      z.object({
        exerciseId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const set = ctx.prisma.set.create({
        data: {
          workoutExerciseId: input.exerciseId,
          weight: 0,
          reps: 0,
        },
      });
      return set;
    }),
  setDelete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const set = ctx.prisma.set.delete({
        where: {
          id: input.id,
        },
      });
      return set;
    }),
  setUpdate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        reps: z.number(),
        weight: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      console.log("input:", input);
      const set = ctx.prisma.set.update({
        where: {
          id: input.id,
        },
        data: {
          reps: input.reps,
          weight: input.weight,
        },
      });
      return set;
    }),

  workout: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      const workout = ctx.prisma.workout.findUnique({
        where: {
          id: input.id,
        },
        include: {
          exercises: {
            include: {
              exercise: true,
              sets: true,
            },
          },
          muscleGroups: true,
        },
      });
      return workout;
    }),
  workoutsList: protectedProcedure.query(({ ctx }) => {
    const workouts = ctx.prisma.workout.findMany({
      orderBy: {
        date: "desc",
      },
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        muscleGroups: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return workouts;
  }),
  workoutCreate: protectedProcedure
    .input(
      z.object({
        exercises: z.array(z.string()),
        muscleGroups: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const today = new Date();
      const userId = ctx.session.user.id;
      const workout = await ctx.prisma.workout.create({
        data: {
          date: today,
          muscleGroups: {
            connect: input.muscleGroups.map((id) => ({ id })),
          },
          userId,
        },
      });

      await Promise.all(
        input.exercises.map(async (exerciseId) => {
          const workoutExercise = await ctx.prisma.workoutExercise.create({
            data: {
              workoutId: workout.id,
              exerciseId,
            },
          });
          return workoutExercise;
        })
      );

      const getWorkout = await ctx.prisma.workout.findUnique({
        where: {
          id: workout.id,
        },
        include: {
          muscleGroups: {
            select: {
              id: true,
              name: true,
            },
          },
          exercises: {
            include: {
              exercise: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return getWorkout;
    }),
});
