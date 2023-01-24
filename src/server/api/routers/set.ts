import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const setRouter = createTRPCRouter({
  create: protectedProcedure
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
  delete: protectedProcedure
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
  createOrUpdateMany: protectedProcedure
    .input(
      z.object({
        exerciseId: z.string(),
        sets: z.array(
          z.object({
            id: z.string(),
            reps: z.number(),
            weight: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sets = await Promise.all(
        input.sets.map(async (set) => {
          return await ctx.prisma.set.upsert({
            where: {
              id: set.id,
            },
            create: {
              reps: set.reps,
              weight: set.weight,
              workoutExerciseId: input.exerciseId,
            },
            update: {
              reps: set.reps,
              weight: set.weight,
            },
          });
        })
      );
      return sets;
    }),
  // setUpdate: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //       reps: z.number(),
  //       weight: z.number(),
  //     })
  //   )
  //   .mutation(({ ctx, input }) => {
  //     console.log("input:", input);
  //     const set = ctx.prisma.set.update({
  //       where: {
  //         id: input.id,
  //       },
  //       data: {
  //         reps: input.reps,
  //         weight: input.weight,
  //       },
  //     });
  //     return set;
  //   }),
});
