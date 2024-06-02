import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {  publicProcedure, createTRPCRouter, withAuthProcedure } from "../trpc";

import { isImage } from "../../helpers/ImageChecker";
import { playlistValidate } from "../../helpers/zodTypes";

export const playlistRouter = createTRPCRouter({
  /* QUERIES */

  //the distinct is because u can add other ppls playlist to ur own, or copy a song from one playlist to another
  // this creates duplicate playlists just witha different playlistname/authorname which ruins the ui.
  getPlaylists: publicProcedure
    .input(z.object({ profileName: z.string(), takeLimit: z.number() }))
    .query(async ({ input, ctx }) => {
      const playlists = await ctx.prisma.playlist.findMany({
        where: {
          authorName: input.profileName,
        },
        orderBy: [{ createdAt: "desc" }],
        take: input.takeLimit,
        distinct: ["name", "genre", "pictureUrl"],
      });

      return playlists;
    }),

  getAllPlaylists: publicProcedure.query(async ({ ctx }) => {
    const playlists = await ctx.prisma.playlist.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 8,
      distinct: ["name", "genre", "pictureUrl"],
    });

    return playlists;
  }),

  getPlaylist: publicProcedure
    .input(
      z.object({
        profileName: z.string(),
        playlistName: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const playlist = await ctx.prisma.playlist.findUnique({
        where: {
          name_authorName: {
            authorName: input.profileName,
            name: input.playlistName,
          },
        },
      });

      return playlist;
    }),

  getPlaylistWithSongs: publicProcedure
    .input(
      z.object({
        profileName: z.string(),
        playlistName: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const playlist = await ctx.prisma.playlist.findUnique({
        where: {
          name_authorName: {
            authorName: input.profileName,
            name: input.playlistName,
          },
        },

        include: {
          songs: true,
        },
      });

      const songs = playlist?.songs;

      return songs;
    }),

  /* MUTATIONS */
  //withAuthProcedure gives the context the username and user info of the logged in user

  createPlaylist: withAuthProcedure
    .input(playlistValidate)
    .mutation(async ({ ctx, input }) => {
      const authorName = ctx.username;
      const isImageValid = isImage(input.picture);

      if (isImageValid === false) {
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: "Please make sure your URL is a picture URL.",
        });
      }

      const playlist = await ctx.prisma.playlist.create({
        data: {
          name: input.name,
          authorName: authorName,
          genre: input.genre,
          pictureUrl: input.picture,
        },
      });

      return playlist;
    }),

  deletePlaylist: withAuthProcedure
    .input(
      z.object({
        playlistName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.playlist.delete({
        where: {
          name_authorName: {
            authorName: ctx.username,
            name: input.playlistName,
          },
        },
      });
    }),

  updatePlaylist: withAuthProcedure
    .input(
      z.object({
        // partial makes it so that all the values are optional,
        // since its update and not create users can leave things they dont want changed undefined.
        newValues: playlistValidate.partial(),
        currentPlaylistName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isImageValid = isImage(
        input.newValues.picture ? input.newValues.picture : ""
      );

      if (isImageValid === false) {
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: "Please make sure your URL is a picture URL.",
        });
      }

      await ctx.prisma.playlist.update({
        where: {
          name_authorName: {
            authorName: ctx.username,
            name: input.currentPlaylistName,
          },
        },
        data: {
          genre: input.newValues.genre,
          name: input.newValues.name,
          pictureUrl: input.newValues.picture,
        },
      });
    }),
});
