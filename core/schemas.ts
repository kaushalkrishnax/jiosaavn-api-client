/**
 * Zod schemas for runtime validation of JioSaavn API responses
 * Provides complete type safety and field documentation
 * @module schemas
 */

import { z, type ZodIssue } from "zod";

/**
 * Image source with resolution and URL
 */
export const ImageSourceSchema = z.object({
  resolution: z
    .string()
    .describe("Image resolution (e.g., '50x50', '150x150', '500x500')"),
  url: z.string().url().describe("HTTPS URL to image"),
});

export type ImageSource = z.infer<typeof ImageSourceSchema>;

/**
 * Audio download link with bitrate and URL
 */
export const DownloadLinkSchema = z.object({
  bitrate: z
    .string()
    .describe("Audio bitrate (e.g., '12kbps', '96kbps', '320kbps')"),
  url: z.string().url().describe("Direct URL to encrypted audio file"),
});

export type DownloadLink = z.infer<typeof DownloadLinkSchema>;

/**
 * Minimal artist reference
 */
export const ArtistRefSchema = z.object({
  id: z.string().min(1).describe("Unique JioSaavn artist ID"),
  name: z.string().min(1).describe("Artist display name"),
});

export type ArtistRef = z.infer<typeof ArtistRefSchema>;

/**
 * Artist summary with images and URL
 */
export const ArtistSummarySchema = ArtistRefSchema.extend({
  images: z
    .array(ImageSourceSchema)
    .describe("Available image resolutions and URLs"),
  url: z.string().describe("JioSaavn artist page URL"),
});

export type ArtistSummary = z.infer<typeof ArtistSummarySchema>;

/**
 * Primary and featured artists group
 */
export const ArtistsGroupSchema = z.object({
  primary: z
    .array(ArtistRefSchema)
    .describe("Primary artists (always present)"),
  featured: z
    .array(ArtistRefSchema)
    .optional()
    .describe("Featured/guest artists (optional)"),
});

export type ArtistsGroup = z.infer<typeof ArtistsGroupSchema>;

/**
 * Complete song entity
 */
export const SongSchema = z.object({
  id: z.string().min(1).describe("Unique song ID, never empty"),
  title: z.string().min(1).describe("Song title, never empty"),
  entityType: z.string().describe("Entity type (always 'song' for songs)"),
  releaseYear: z
    .number()
    .nullable()
    .optional()
    .describe("Release year or null if unknown"),
  releaseDateISO: z
    .string()
    .nullable()
    .optional()
    .describe("ISO 8601 release date or null if unknown"),
  durationSeconds: z
    .number()
    .nullable()
    .optional()
    .describe("Duration in seconds or null if unknown"),
  label: z
    .string()
    .nullable()
    .optional()
    .describe("Record label or null if unknown"),
  isExplicit: z.boolean().describe("Is explicit content (always boolean)"),
  playCount: z
    .number()
    .nullable()
    .optional()
    .describe("Play count or null if not available"),
  language: z.string().describe("Language code or empty string"),
  hasLyrics: z.boolean().describe("Has lyrics available on JioSaavn"),
  lyricsId: z
    .string()
    .nullable()
    .optional()
    .describe("Lyrics ID for lyrics API or null"),
  url: z.string().describe("JioSaavn song page URL"),
  copyright: z
    .string()
    .nullable()
    .optional()
    .describe("Copyright text or null"),
  album: z
    .object({
      id: z.string().nullable().describe("Album ID or null"),
      title: z.string().nullable().describe("Album title or null"),
      url: z.string().nullable().describe("Album URL or null"),
    })
    .describe("Album information (always present, fields may be null)"),
  artists: ArtistsGroupSchema.describe("Primary and featured artists"),
  allArtists: z
    .array(ArtistRefSchema)
    .optional()
    .describe("All credited artists (optional)"),
  images: z.array(ImageSourceSchema).describe("Available image resolutions"),
  downloadLinks: z
    .array(DownloadLinkSchema)
    .describe("Available audio download links (may be empty)"),
});

export type Song = z.infer<typeof SongSchema>;

/**
 * Complete album entity
 */
export const AlbumSchema = z.object({
  id: z.string().min(1).describe("Unique album ID, never empty"),
  title: z.string().min(1).describe("Album title, never empty"),
  description: z
    .string()
    .nullable()
    .optional()
    .describe("Album description or null"),
  releaseYear: z
    .number()
    .nullable()
    .optional()
    .describe("Release year or null if unknown"),
  entityType: z.string().describe("Entity type (always 'album')"),
  playCount: z.number().nullable().optional().describe("Play count or null"),
  language: z.string().describe("Primary language or empty string"),
  isExplicit: z.boolean().describe("Is explicit content (always boolean)"),
  artists: ArtistsGroupSchema.describe("Primary and featured artists"),
  allArtists: z
    .array(ArtistRefSchema)
    .optional()
    .describe("All credited artists (optional)"),
  songCount: z
    .number()
    .nullable()
    .optional()
    .describe("Total song count or null"),
  url: z.string().describe("JioSaavn album page URL"),
  images: z.array(ImageSourceSchema).describe("Available image resolutions"),
  songs: z
    .array(SongSchema)
    .nullable()
    .optional()
    .describe("Full song list or null if not fetched"),
});

export type Album = z.infer<typeof AlbumSchema>;

/**
 * Complete playlist entity
 */
export const PlaylistSchema = z.object({
  id: z.string().min(1).describe("Unique playlist ID, never empty"),
  title: z.string().min(1).describe("Playlist title, never empty"),
  description: z
    .string()
    .nullable()
    .optional()
    .describe("Playlist description or null"),
  releaseYear: z
    .number()
    .nullable()
    .optional()
    .describe("Creation/release year or null"),
  entityType: z.string().describe("Entity type (always 'playlist')"),
  playCount: z.number().nullable().optional().describe("Play count or null"),
  language: z.string().describe("Primary language or empty string"),
  isExplicit: z.boolean().describe("Is explicit content (always boolean)"),
  songCount: z
    .number()
    .nullable()
    .optional()
    .describe("Total song count or null"),
  url: z.string().describe("JioSaavn playlist page URL"),
  images: z.array(ImageSourceSchema).describe("Available image resolutions"),
  songs: z
    .array(SongSchema)
    .nullable()
    .optional()
    .describe("Full song list or null if not fetched"),
  artists: z
    .array(ArtistRefSchema)
    .nullable()
    .optional()
    .describe("Contributing artists (optional)"),
});

export type Playlist = z.infer<typeof PlaylistSchema>;

/**
 * Complete artist entity
 */
export const ArtistSchema = z.object({
  id: z.string().min(1).describe("Unique artist ID, never empty"),
  name: z.string().min(1).describe("Artist name, never empty"),
  url: z.string().describe("JioSaavn artist page URL"),
  entityType: z.string().describe("Entity type (always 'artist')"),
  images: z.array(ImageSourceSchema).describe("Available image resolutions"),
  followerCount: z
    .number()
    .nullable()
    .optional()
    .describe("Follower count or null"),
  fanCount: z
    .number()
    .nullable()
    .optional()
    .describe("Fan count as number or null"),
  fanCountText: z
    .string()
    .nullable()
    .optional()
    .describe("Fan count as formatted string or null"),
  isVerified: z
    .boolean()
    .nullable()
    .optional()
    .describe("Artist verification status or null"),
  primaryLanguage: z
    .string()
    .nullable()
    .optional()
    .describe("Primary language or null"),
  primaryContentType: z
    .string()
    .nullable()
    .optional()
    .describe("Primary content type or null"),
  bio: z
    .array(
      z.object({
        text: z.string().nullable().optional().describe("Biography text"),
        title: z
          .string()
          .nullable()
          .optional()
          .describe("Biography section title"),
        sequence: z.number().nullable().optional().describe("Section ordering"),
      })
    )
    .nullable()
    .optional()
    .describe("Biography sections or null"),
  dateOfBirthISO: z
    .string()
    .nullable()
    .optional()
    .describe("Date of birth (ISO format) or null"),
  facebookUrl: z
    .string()
    .nullable()
    .optional()
    .describe("Facebook profile URL or null"),
  twitterHandle: z
    .string()
    .nullable()
    .optional()
    .describe("Twitter handle or null"),
  wikipediaUrl: z
    .string()
    .nullable()
    .optional()
    .describe("Wikipedia URL or null"),
  availableLanguages: z
    .array(z.string())
    .optional()
    .describe("Languages artist works in"),
  hasRadio: z
    .boolean()
    .nullable()
    .optional()
    .describe("Has JioSaavn radio for artist"),
  topSongs: z
    .array(SongSchema)
    .nullable()
    .optional()
    .describe("Top songs (if fetched) or null"),
  topAlbums: z
    .array(AlbumSchema)
    .nullable()
    .optional()
    .describe("Top albums (if fetched) or null"),
  singles: z
    .array(SongSchema)
    .nullable()
    .optional()
    .describe("Recent singles (if fetched) or null"),
  similarArtists: z
    .array(ArtistSummarySchema)
    .nullable()
    .optional()
    .describe("Similar artists (if fetched) or null"),
});

export type Artist = z.infer<typeof ArtistSchema>;

/**
 * Lightweight song preview for search results
 */
export const SongPreviewSchema = z.object({
  id: z.string().describe("Unique song ID"),
  title: z.string().describe("Song title"),
  artistNames: z.array(z.string()).describe("Artist names as simple strings"),
  images: z.array(ImageSourceSchema).describe("Available image resolutions"),
  url: z.string().describe("JioSaavn song URL"),
  language: z.string().optional().describe("Language code or undefined"),
});

export type SongPreview = z.infer<typeof SongPreviewSchema>;

/**
 * Lightweight album preview for search results
 */
export const AlbumPreviewSchema = z.object({
  id: z.string().describe("Unique album ID"),
  title: z.string().describe("Album title"),
  artistNames: z.array(z.string()).describe("Artist names as simple strings"),
  images: z.array(ImageSourceSchema).describe("Available image resolutions"),
  releaseYear: z
    .number()
    .nullable()
    .optional()
    .describe("Release year or null"),
  url: z.string().describe("JioSaavn album URL"),
  language: z.string().optional().describe("Language code or undefined"),
});

export type AlbumPreview = z.infer<typeof AlbumPreviewSchema>;

/**
 * Lightweight artist preview for search results
 */
export const ArtistPreviewSchema = z.object({
  id: z.string().describe("Unique artist ID"),
  name: z.string().describe("Artist name"),
  images: z.array(ImageSourceSchema).describe("Available image resolutions"),
  url: z.string().describe("JioSaavn artist URL"),
});

export type ArtistPreview = z.infer<typeof ArtistPreviewSchema>;

/**
 * Lightweight playlist preview for search results
 */
export const PlaylistPreviewSchema = z.object({
  id: z.string().describe("Unique playlist ID"),
  title: z.string().describe("Playlist title"),
  images: z.array(ImageSourceSchema).describe("Available image resolutions"),
  language: z.string().optional().describe("Language code or undefined"),
  url: z.string().describe("JioSaavn playlist URL"),
});

export type PlaylistPreview = z.infer<typeof PlaylistPreviewSchema>;

/**
 * Helper to validate with detailed errors
 */
export function validateWithDetails<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: boolean; data?: T; errors?: Record<string, string> } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue: z.ZodIssue) => {
    const path = issue.path.join(".");
    errors[path || "root"] = issue.message;
  });
  return { success: false, errors };
}
