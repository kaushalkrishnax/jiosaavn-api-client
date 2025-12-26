import { z } from "zod";

export const SaavnSongCore = z.strictObject({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  type: z.literal("song"),
  perma_url: z.string(),
  image: z.string(),
  explicit_content: z.string(),
});

export const SaavnSongBase = SaavnSongCore.extend({
  header_desc: z.string(),
  language: z.string(),
  year: z.string(),
  play_count: z.union([z.string(), z.number()]),
  list_count: z.string(),
  list_type: z.string(),
  list: z.string(),
  button_tooltip_info: z.array(z.any()),
});
