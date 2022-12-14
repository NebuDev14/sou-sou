import axios from "axios";
import { z } from "zod";
import { createRouter } from "../create-router";

const NodeGeocoder = require("node-geocoder");

export const geocoder = NodeGeocoder({
  apiKey: process.env.REACT_APP_GOOGLE_KEY,
});

export const locationRouter = createRouter()
  .mutation("create", {
    input: z.object({
      groupId: z.string(),
      address: z.string(),
      lat: z.number(),
      lng: z.number(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.location.create({
        data: {
          groupId: input.groupId,
          address: input.address,
          lat: input.lat,
          lng: input.lng,
        },
      });
    },
  })
  .query("get-nearby", {
    input: z.object({
      address: z.string(),
    }),
    async resolve({ input, ctx }) {
      const geocoded = await geocoder.geocode(input.address);
      const link = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${
        process.env.REACT_APP_GOOGLE_KEY
      }&location=${geocoded.at(0).latitude},${
        geocoded.at(0).longitude
      }&radius=90`;
      return (await axios(link)).data.results;
    },
  });
