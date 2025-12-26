import { z } from "zod";

export const SaavnShowEntity = z.strictObject({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  type: z.literal("show"),
  image: z.string(),
  perma_url: z.string(),
  more_info: z.strictObject({
    season_number: z.number(),
  }),
  explicit_content: z.string(),
  mini_obj: z.boolean(),
  description: z.string(),
});
