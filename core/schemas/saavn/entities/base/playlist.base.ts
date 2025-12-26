import { z } from "zod";

export const SaavnPlaylistBase = z.strictObject({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  type: z.literal("playlist"),
  image: z.string(),
  perma_url: z.string(),
  explicit_content: z.string(),
});
