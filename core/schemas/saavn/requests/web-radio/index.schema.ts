import { z } from "zod";
import { SaavnSongEntity } from "../../entities";

const WebRadioSingleSong = z.strictObject({
  song: SaavnSongEntity,
  stationid: z.string(),
});

const WebRadioMultipleSongs = z
  .object({
    stationid: z.string(),
  })
  .catchall(
    z.strictObject({
      song: SaavnSongEntity,
    }),
  )
  .refine(
    (obj) =>
      Object.keys(obj).some(
        (key) => key !== "stationid" && !Number.isNaN(Number(key)),
      ),
    {
      message: "Expected numeric song keys (0,1,2,...)",
    },
  );

export const SaavnWebRadioCreateFeaturedStationSchema = z.strictObject({
  stationid: z.string(),
});

export const SaavnWebRadioCreateEntityStationSchema = z.strictObject({
  stationid: z.string(),
});

export const SaavnWebRadioGetStationSongsSchema = z.union([
  WebRadioSingleSong,
  WebRadioMultipleSongs,
]);
