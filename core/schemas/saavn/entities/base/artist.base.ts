import { z } from "zod";

export const SaavnArtistBase = z.strictObject({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.string(),
  type: z.literal("artist"),
  perma_url: z.string(),
});

export const SaavnArtistMap = z.strictObject({
  primary_artists: z.array(SaavnArtistBase),
  featured_artists: z.array(SaavnArtistBase),
  artists: z.array(SaavnArtistBase),
});
