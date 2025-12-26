import type { ErrorCode } from "./errors";

/** Entity discriminator used across all models. */
export type EntityType = "song" | "album" | "artist" | "playlist" | "show";

/** Entity discriminator for lightweight previews. */
export type EntityPreviewType =
  | "songPreview"
  | "albumPreview"
  | "artistPreview"
  | "playlistPreview"
  | "radioStationPreview"
  | "channelPreview"
  | "showPreview";

/** Sort method for artist content. */
export type SortBy = "" | "latest" | "alphabetical";

/** Sort direction for artist content. */
export type SortOrder = "asc" | "desc";

/** Token extracted from a JioSaavn share URL. */
export interface ExtractedToken {
  /** Resolved entity type. */
  type: EntityType;
  /** Token captured from the URL path. */
  token: string;
}

/** Paginated wrapper for list responses. */
export interface Paginated<T> {
  /** Items for the current page. */
  results: T[];
  /** Total available items. */
  total: number;
  /** Current page number. */
  page: number;
  /** Items per page. */
  limit: number;
}

/** Discriminated union for all API responses. */
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

/** Successful API response with data payload. */
export interface ApiSuccess<T> {
  /** Always true on success. */
  success: true;
  /** Response data. */
  data: T;
}

/** Failed API response with error details. */
export interface ApiFailure {
  /** Always false on failure. */
  success: false;
  /** Structured error code. */
  code: ErrorCode;
  /** Human-readable error message. */
  message: string;
}

/** Client configuration for the JioSaavn client. */
export interface ClientConfig {
  /** Custom API base URL (defaults to official API). */
  baseUrl?: string;
  /** Custom fetch implementation. */
  fetch?: typeof fetch;
  /** Request timeout in milliseconds. */
  timeoutMs?: number;
}

/** Search configuration for query-driven endpoints. */
export interface SearchOptions {
  /** Search query string. */
  query: string;
  /** Page number (default: 1). */
  page?: number;
  /** Maximum results per page (max 40). */
  limit?: number;
}

/** Options for fetching songs by ID(s). */
export interface GetSongsByIdOptions {
  /** Single song ID or array of song IDs. */
  ids: string | string[];
}

/** Options for resolving a song via share link. */
export interface GetSongByLinkOptions {
  /** JioSaavn song share URL. */
  link: string;
}

/** Options for fetching song recommendations. */
export interface GetSongSuggestionsOptions {
  /** Seed song IDs. */
  ids: string | string[];
  /** Maximum number of suggestions. */
  limit?: number;
}

/** Options for fetching album by ID. */
export interface GetAlbumByIdOptions {
  /** JioSaavn album ID. */
  id: string;
}

/** Options for resolving an album via share link. */
export interface GetAlbumByLinkOptions {
  /** JioSaavn album share URL. */
  link: string;
}

/** Options for fetching artist by ID. */
export interface GetArtistByIdOptions {
  /** JioSaavn artist ID. */
  id: string;
  /** Page number for paginated sections. */
  page?: number;
  /** Songs per page. */
  songCount?: number;
  /** Albums per page. */
  albumCount?: number;
}

/** Options for resolving an artist via share link. */
export interface GetArtistByLinkOptions {
  /** JioSaavn artist share URL. */
  link: string;
  /** Page number for paginated sections. */
  page?: number;
  /** Songs per page. */
  songCount?: number;
  /** Albums per page. */
  albumCount?: number;
}

/** Options for fetching an artist's songs. */
export interface GetArtistSongsOptions {
  /** JioSaavn artist ID. */
  id: string;
  /** Page number. */
  page?: number;
  /** Sort method. */
  sortBy?: SortBy;
  /** Sort direction. */
  sortOrder?: SortOrder;
}

/** Options for fetching an artist's albums. */
export interface GetArtistAlbumsOptions {
  /** JioSaavn artist ID. */
  id: string;
  /** Page number. */
  page?: number;
  /** Sort method. */
  sortBy?: SortBy;
  /** Sort direction. */
  sortOrder?: SortOrder;
}

/** Options for fetching playlist by ID. */
export interface GetPlaylistByIdOptions {
  /** JioSaavn playlist ID. */
  id: string;
  /** Page number for songs. */
  page?: number;
  /** Songs per page. */
  songCount?: number;
}

/** Options for resolving a playlist via share link. */
export interface GetPlaylistByLinkOptions {
  /** JioSaavn playlist share URL. */
  link: string;
  /** Page number for songs. */
  page?: number;
  /** Songs per page. */
  songCount?: number;
}

/** Options for fetching trending content. */
export interface GetTrendingContentOptions {
  /** Entity filter (song, album, playlist). */
  type?: EntityType;
  /** Language filter (e.g., hindi, english). */
  language?: string;
}

/** JioSaavn data models and entities. */
export namespace Models {
  /** Image source with resolution and URL. */
  export interface ImageSource {
    /** Image resolution (e.g., 150x150). */
    resolution: string;
    /** HTTPS image URL. */
    url: string;
  }

  /** Audio download link with bitrate and URL. */
  export interface DownloadLink {
    /** Audio bitrate (e.g., 320kbps). */
    bitrate: string;
    /** Direct audio file URL. */
    url: string;
  }

  /** Primary and featured artists. */
  export interface ArtistsGroup {
    /** Primary artists (always present). */
    primary: ArtistPreview[];
    /** Featured/guest artists. */
    featured?: ArtistPreview[];
    /** All credited artists. */
    all?: ArtistPreview[];
  }

  /** Song entity with metadata and download links. */
  export interface Song {
    /** Unique song ID. */
    id: string;
    /** Entity type discriminator. */
    type: EntityType;
    /** Song title. */
    title: string;
    /** JioSaavn song page URL. */
    url: string;
    /** Language code. */
    language: string;
    /** Release year. */
    releaseYear?: number;
    /** ISO 8601 release date. */
    releaseDateISO?: string;
    /** Duration in seconds. */
    durationSeconds?: number;
    /** Play count. */
    playCount?: number;
    /** Record label. */
    label?: string;
    /** Copyright text. */
    copyright?: string;
    /** Explicit content flag. */
    isExplicit: boolean;
    /** Lyrics availability flag. */
    hasLyrics: boolean;
    /** Lyrics identifier. */
    lyricsId?: string;
    /** Album metadata. */
    album: {
      /** Album ID. */
      id: string;
      /** Album title. */
      title: string;
      /** Album URL. */
      url: string;
    };
    /** Primary and featured artists. */
    artists: ArtistsGroup;
    /** Image sources in multiple resolutions. */
    images: ImageSource[];
    /** Audio download links in multiple bitrates. */
    downloadLinks: DownloadLink[];
  }

  /** Album entity with track listing and metadata. */
  export interface Album {
    /** Unique album ID. */
    id: string;
    /** Entity type discriminator. */
    type: EntityType;
    /** Album title. */
    title: string;
    /** JioSaavn album page URL. */
    url: string;
    /** Primary language code. */
    language: string;
    /** Album description. */
    description?: string;
    /** Release year. */
    releaseYear?: number;
    /** Total number of songs. */
    songCount?: number;
    /** Copyright text. */
    copyright?: string;
    /** Explicit content flag. */
    isExplicit: boolean;
    /** Primary and featured artists. */
    artists: ArtistsGroup;
    /** Image sources in multiple resolutions. */
    images: ImageSource[];
    /** Complete list of songs in the album. */
    songs?: SongPreview[];
  }

  /** Artist entity with profile and content. */
  export interface Artist {
    /** Unique artist ID. */
    id: string;
    /** Entity type discriminator. */
    type: EntityType;
    /** Artist name. */
    name: string;
    /** JioSaavn artist page URL. */
    url?: string;
    /** Primary language code. */
    primaryLanguage?: string;
    /** Primary content type. */
    primaryContentType?: string;
    /** Available content languages. */
    availableLanguages: string[];
    /** Follower count. */
    followerCount?: number;
    /** Fan count as numeric value. */
    fanCount?: number;
    /** Verification badge status. */
    isVerified?: boolean;
    /** JioSaavn radio availability. */
    hasRadio?: boolean;
    /** Bio text content. */
    bio?: string;
    /** Date of birth in ISO 8601 format. */
    dateOfBirthISO?: string;
    /** Facebook profile URL. */
    facebookUrl?: string;
    /** Twitter handle. */
    twitterHandle?: string;
    /** Wikipedia page URL. */
    wikipediaUrl?: string;
    /** JioSaavn navigation routes. */
    routes?: {
      /** Overview route. */
      overview?: string;
      /** Songs route. */
      songs?: string;
      /** Albums route. */
      albums?: string;
      /** Bio route. */
      bio?: string;
      /** Comments route. */
      comments?: string;
    };
    /** Image sources in multiple resolutions. */
    images: ImageSource[];
    /** Most popular songs. */
    topSongs?: SongPreview[];
    /** Most popular albums. */
    topAlbums?: AlbumPreview[];
    /** Recently released singles. */
    singles?: AlbumPreview[];
    /** Similar recommended artists. */
    similarArtists?: ArtistPreview[];
  }

  /** Playlist entity with track listing and metadata. */
  export interface Playlist {
    /** Unique playlist ID. */
    id: string;
    /** Entity type discriminator. */
    type: EntityType;
    /** Playlist title. */
    title: string;
    /** JioSaavn playlist page URL. */
    url: string;
    /** Playlist image source. */
    image: string;
    /** Playlist description. */
    description?: string;
    /** Total number of songs. */
    songCount?: number;
    /** Followers count. */
    followerCount?: number;
    /** Explicit content flag. */
    isExplicit: boolean;
    /** List of songs in the playlist. */
    songs?: SongPreview[];
    /** Contributing artists. */
    artists?: ArtistPreview[];
  }

  /** Home / browse modules response. */
  export interface BrowseModules {
    /** Featured radio stations. */
    radioStations?: RadioStationPreview[];
    /** Discover / browse channels. */
    browseDiscover?: ChannelPreview[];
    /** Newly released albums. */
    newAlbums?: AlbumPreview[];
    /** Newly trending albums. */
    newTrending?: AlbumPreview[];
    /** Chart playlists. */
    charts?: PlaylistPreview[];
    /** Top playlists. */
    topPlaylists?: PlaylistPreview[];
    /** Top shows / podcasts. */
    topShows?: ShowPreview[];
  }

  /** Trending content response. */
  export interface TrendingContent {
    /** Trending songs. */
    songs?: SongPreview[];
    /** Trending albums. */
    albums?: AlbumPreview[];
    /** Trending playlists. */
    playlists?: PlaylistPreview[];
  }

  /** Song preview used in lists and search results. */
  export interface SongPreview {
    /** Unique song ID. */
    id: string;
    /** Preview type discriminator. */
    type: EntityPreviewType;
    /** Song title. */
    title: string;
    /** JioSaavn song URL. */
    url: string;
    /** Artist names. */
    artistNames: string[];
    /** Album name. */
    albumName: string;
    /** Language code. */
    language?: string;
    /** Duration in seconds. */
    durationSeconds?: number;
    /** Play count. */
    playCount?: number;
    /** Image sources in multiple resolutions. */
    images: ImageSource[];
  }

  /** Album preview used in lists and search results. */
  export interface AlbumPreview {
    /** Unique album ID. */
    id: string;
    /** Preview type discriminator. */
    type: EntityPreviewType;
    /** Album title. */
    title: string;
    /** JioSaavn album URL. */
    url: string;
    /** Artist names. */
    artistNames: string[];
    /** Language code. */
    language?: string;
    /** Release year. */
    releaseYear?: number;
    /** Image sources in multiple resolutions. */
    images: ImageSource[];
  }

  /** Artist preview used in lists and search results. */
  export interface ArtistPreview {
    /** Unique artist ID. */
    id: string;
    /** Preview type discriminator. */
    type: EntityPreviewType;
    /** Artist name. */
    name: string;
    /** JioSaavn artist URL. */
    url: string;
    /** Image sources in multiple resolutions. */
    images: ImageSource[];
  }

  /** Playlist preview used in lists and search results. */
  export interface PlaylistPreview {
    /** Unique playlist ID. */
    id: string;
    /** Preview type discriminator. */
    type: EntityPreviewType;
    /** Playlist title. */
    title: string;
    /** JioSaavn playlist URL. */
    url: string;
    /** Language code. */
    language?: string;
    /** Image sources in multiple resolutions. */
    images: ImageSource[];
  }

  /** Radio station preview used in browse modules. */
  export interface RadioStationPreview {
    /** Unique station ID. */
    id: string;
    /** Preview type discriminator. */
    type: EntityPreviewType;
    /** Display title. */
    title: string;
    /** Station page URL. */
    url?: string;
    /** Primary language. */
    language?: string;
    /** Short description. */
    description?: string;
    /** UI accent color. */
    color?: string;
    /** Explicit content flag. */
    isExplicit?: boolean;
    /** Station images. */
    images: ImageSource[];
  }

  /** Discover channel (mood, genre, situation, etc.). */
  export interface ChannelPreview {
    /** Unique channel ID. */
    id: string;
    /** Preview type discriminator. */
    type: EntityPreviewType;
    /** Channel title. */
    title: string;
    /** Channel URL. */
    url?: string;
    /** Channel subtype (mood, genre, situation, etc.). */
    subType?: string;
    /** Featured flag. */
    isFeatured?: boolean;
    /** Availability flag. */
    available?: boolean;
    /** Categorization tags. */
    tags?: Record<string, string[]>;
    /** Background video URL. */
    videoUrl?: string;
    /** Video thumbnail. */
    videoThumbnail?: string;
    /** Channel images. */
    images: ImageSource[];
  }

  /** Podcast / show preview. */
  export interface ShowPreview {
    /** Unique show ID. */
    id: string;
    /** Preview type discriminator. */
    type: EntityPreviewType;
    /** Show title. */
    title: string;
    /** Show page URL. */
    url?: string;
    /** Season number. */
    seasonNumber?: number;
    /** ISO 8601 release date. */
    releaseDateISO?: string;
    /** Square artwork image. */
    squareImage?: string;
    /** Explicit content flag. */
    isExplicit?: boolean;
    /** Show images. */
    images: ImageSource[];
  }

  /** Aggregated search results across entities. */
  export interface SearchAllResult {
    /** Top song results. */
    songs: SongPreview[];
    /** Top album results. */
    albums: AlbumPreview[];
    /** Top artist results. */
    artists: ArtistPreview[];
    /** Top playlist results. */
    playlists: PlaylistPreview[];
  }
}

/** Paginated artist songs result. */
export type ArtistSongs = Paginated<Models.SongPreview>;

/** Paginated artist albums result. */
export type ArtistAlbums = Paginated<Models.AlbumPreview>;
