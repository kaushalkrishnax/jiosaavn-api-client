export const SongEndpoints = {
  /** Get song details by song ID */
  id: "song.getDetails",
  /** Get song details via song token */
  token: "webapi.get",
  /** Get song suggestions based on a song ID */
  suggestions: "webradio.getSong",
  /** Get lyrics for a song by song ID */
  lyrics: "lyrics.getLyrics",
  /** Create a radio station based on a song ID */
  station: "webradio.createEntityStation",
} as const;

export type SongEndpoint = (typeof SongEndpoints)[keyof typeof SongEndpoints];
