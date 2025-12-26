import { z } from "zod";

export const SearchResultsSearchAllSchema = z
  .object({
    albums: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              title: z.string(),
              subtitle: z.string(),
              type: z.literal("album"),
              image: z.string(),
              perma_url: z.string(),
              more_info: z
                .object({
                  music: z.string(),
                  ctr: z.number(),
                  year: z.string(),
                  is_movie: z.string(),
                  language: z.string(),
                  song_pids: z.string(),
                })
                .strict(),
              explicit_content: z.string(),
              mini_obj: z.boolean(),
              description: z.string(),
            })
            .strict(),
        ),
        position: z.number(),
      })
      .strict(),
    songs: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              title: z.string(),
              subtitle: z.string(),
              type: z.literal("song"),
              image: z.string(),
              perma_url: z.string(),
              more_info: z
                .object({
                  album: z.string(),
                  album_id: z.string(),
                  ctr: z.number(),
                  score: z.string(),
                  vcode: z.string(),
                  vlink: z.string(),
                  primary_artists: z.string(),
                  singers: z.string(),
                  video_available: z.null(),
                  triller_available: z.boolean(),
                  language: z.string(),
                })
                .strict(),
              explicit_content: z.string(),
              mini_obj: z.boolean(),
              description: z.string(),
            })
            .strict(),
        ),
        position: z.number(),
      })
      .strict(),
    playlists: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              title: z.string(),
              subtitle: z.string(),
              type: z.literal("playlist"),
              image: z.string(),
              perma_url: z.string(),
              more_info: z
                .object({
                  firstname: z.string(),
                  artist_name: z.null(),
                  entity_type: z.string(),
                  entity_sub_type: z.string(),
                  video_available: z.boolean(),
                  is_dolby_content: z.boolean(),
                  sub_types: z.null(),
                  images: z.null(),
                  lastname: z.string(),
                  language: z.string(),
                })
                .strict(),
              explicit_content: z.string(),
              mini_obj: z.boolean(),
              description: z.string(),
            })
            .strict(),
        ),
        position: z.number(),
      })
      .strict(),
    artists: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              title: z.string(),
              image: z.string(),
              extra: z.string(),
              type: z.literal("artist"),
              mini_obj: z.boolean(),
              isRadioPresent: z.boolean(),
              ctr: z.number(),
              entity: z.number(),
              description: z.string(),
              position: z.number(),
            })
            .strict(),
        ),
        position: z.number(),
      })
      .strict(),
    topquery: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              title: z.string(),
              subtitle: z.string(),
              type: z.string(),
              image: z.string(),
              perma_url: z.string(),
              more_info: z
                .object({
                  album: z.string(),
                  album_id: z.string(),
                  ctr: z.number(),
                  score: z.string(),
                  vcode: z.string(),
                  vlink: z.string(),
                  primary_artists: z.string(),
                  singers: z.string(),
                  video_available: z.null(),
                  triller_available: z.boolean(),
                  language: z.string(),
                })
                .strict(),
              explicit_content: z.string(),
              mini_obj: z.boolean(),
              description: z.string(),
            })
            .strict(),
        ),
        position: z.number(),
      })
      .strict(),
    shows: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              title: z.string(),
              subtitle: z.string(),
              type: z.literal("show"),
              image: z.string(),
              perma_url: z.string(),
              more_info: z
                .object({
                  season_number: z.number(),
                })
                .strict(),
              explicit_content: z.string(),
              mini_obj: z.boolean(),
              description: z.string(),
            })
            .strict(),
        ),
        position: z.number(),
      })
      .strict(),
    episodes: z
      .object({
        data: z.array(z.any()),
        position: z.number(),
      })
      .strict(),
  })
  .strict();

export const SearchResultsSearchSongsSchema = z
  .object({
    total: z.number(),
    start: z.number(),
    results: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("song"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              music: z.string(),
              album_id: z.string(),
              album: z.string(),
              label: z.string(),
              label_id: z.null(),
              origin: z.string(),
              is_dolby_content: z.boolean(),
              "320kbps": z.string(),
              encrypted_media_url: z.string(),
              encrypted_cache_url: z.string(),
              encrypted_drm_cache_url: z.string(),
              encrypted_drm_media_url: z.string(),
              album_url: z.string(),
              duration: z.string(),
              rights: z
                .object({
                  code: z.string(),
                  cacheable: z.string(),
                  delete_cached_object: z.string(),
                  reason: z.string(),
                })
                .strict(),
              cache_state: z.string(),
              has_lyrics: z.string(),
              lyrics_snippet: z.string(),
              starred: z.string(),
              copyright_text: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
              release_date: z.null(),
              label_url: z.string(),
              vcode: z.string(),
              vlink: z.string(),
              triller_available: z.boolean(),
              request_jiotune_flag: z.boolean(),
              webp: z.string(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
    ),
  })
  .strict();

export const SearchResultsSearchAlbumsSchema = z
  .object({
    total: z.number(),
    start: z.number(),
    results: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("album"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              query: z.string(),
              text: z.string(),
              music: z.string(),
              song_count: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
    ),
  })
  .strict();

export const SearchResultsSearchArtistsSchema = z
  .object({
    total: z.number(),
    start: z.number(),
    results: z.array(
      z
        .object({
          name: z.string(),
          id: z.string(),
          ctr: z.number(),
          entity: z.number(),
          image: z.string(),
          role: z.string(),
          perma_url: z.string(),
          type: z.literal("artist"),
          mini_obj: z.boolean(),
          isRadioPresent: z.boolean(),
          is_followed: z.boolean(),
        })
        .strict(),
    ),
  })
  .strict();

export const SearchResultsSearchPlaylistsSchema = z
  .object({
    total: z.number(),
    start: z.number(),
    results: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          type: z.literal("playlist"),
          image: z.string(),
          perma_url: z.string(),
          more_info: z
            .object({
              uid: z.string(),
              firstname: z.string(),
              artist_name: z.null(),
              entity_type: z.string(),
              entity_sub_type: z.string(),
              video_available: z.boolean(),
              is_dolby_content: z.null(),
              sub_types: z.null(),
              images: z.null(),
              lastname: z.string(),
              song_count: z.string(),
              language: z.string(),
            })
            .strict(),
          explicit_content: z.string(),
          mini_obj: z.boolean(),
          numsongs: z.null(),
        })
        .strict(),
    ),
  })
  .strict();

export const SearchResultsSearchTopAlbumsoftheYearSchema = z.array(
  z
    .object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      header_desc: z.string(),
      type: z.literal("album"),
      perma_url: z.string(),
      image: z.string(),
      language: z.string(),
      year: z.string(),
      play_count: z.string(),
      explicit_content: z.string(),
      list_count: z.string(),
      list_type: z.string(),
      list: z.union([
        z.string(),
        z.array(
          z
            .object({
              id: z.string(),
              title: z.string(),
              subtitle: z.string(),
              header_desc: z.string(),
              type: z.literal("song"),
              perma_url: z.string(),
              image: z.string(),
              language: z.string(),
              year: z.string(),
              play_count: z.string(),
              explicit_content: z.string(),
              list_count: z.string(),
              list_type: z.string(),
              list: z.string(),
              more_info: z
                .object({
                  music: z.string(),
                  album_id: z.string(),
                  album: z.string(),
                  label: z.string(),
                  label_id: z.string(),
                  origin: z.string(),
                  is_dolby_content: z.boolean(),
                  "320kbps": z.string(),
                  encrypted_media_url: z.string(),
                  encrypted_cache_url: z.string(),
                  encrypted_drm_cache_url: z.string(),
                  encrypted_drm_media_url: z.string(),
                  album_url: z.string(),
                  duration: z.string(),
                  rights: z
                    .object({
                      code: z.string(),
                      cacheable: z.string(),
                      delete_cached_object: z.string(),
                      reason: z.string(),
                    })
                    .strict(),
                  cache_state: z.string(),
                  has_lyrics: z.string(),
                  lyrics_snippet: z.string(),
                  starred: z.string(),
                  copyright_text: z.string(),
                  artistMap: z
                    .object({
                      primary_artists: z.array(
                        z
                          .object({
                            id: z.string(),
                            name: z.string(),
                            role: z.string(),
                            image: z.string(),
                            type: z.string(),
                            perma_url: z.string(),
                          })
                          .strict(),
                      ),
                      featured_artists: z.array(z.any()),
                      artists: z.array(
                        z
                          .object({
                            id: z.string(),
                            name: z.string(),
                            role: z.string(),
                            image: z.string(),
                            type: z.string(),
                            perma_url: z.string(),
                          })
                          .strict(),
                      ),
                    })
                    .strict(),
                  release_date: z.string(),
                  label_url: z.string(),
                  vcode: z.string(),
                  vlink: z.string(),
                  triller_available: z.boolean(),
                  request_jiotune_flag: z.boolean(),
                  webp: z.string(),
                  lyrics_id: z.string().optional(),
                })
                .strict(),
              button_tooltip_info: z.array(z.any()),
            })
            .strict(),
        ),
      ]),
      more_info: z
        .object({
          artistMap: z
            .object({
              primary_artists: z.array(
                z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    role: z.string(),
                    image: z.string(),
                    type: z.string(),
                    perma_url: z.string(),
                  })
                  .strict(),
              ),
              featured_artists: z.array(z.any()),
              artists: z.array(
                z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    role: z.string(),
                    image: z.string(),
                    type: z.string(),
                    perma_url: z.string(),
                  })
                  .strict(),
              ),
            })
            .strict(),
          song_count: z.string(),
          copyright_text: z.string(),
          is_dolby_content: z.boolean(),
          label_url: z.string(),
        })
        .strict(),
      button_tooltip_info: z.array(z.any()),
    })
    .strict(),
);

export const SearchResultsGetTopSearchesSchema = z.array(
  z
    .object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      type: z.string(),
      image: z.string(),
      perma_url: z.string(),
      more_info: z
        .object({
          artistMap: z.array(z.any()),
          album: z.string(),
          is_jiotune_available: z.string().optional(),
        })
        .strict(),
      explicit_content: z.string(),
      mini_obj: z.boolean(),
    })
    .strict(),
);

export const GetDetailsGetSongDetailsSchema = z
  .object({
    songs: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("song"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              music: z.string(),
              album_id: z.string(),
              album: z.string(),
              label: z.string(),
              label_id: z.string(),
              origin: z.string(),
              is_dolby_content: z.boolean(),
              "320kbps": z.string(),
              encrypted_media_url: z.string(),
              encrypted_cache_url: z.string(),
              encrypted_drm_cache_url: z.string(),
              encrypted_drm_media_url: z.string(),
              album_url: z.string(),
              duration: z.string(),
              rights: z
                .object({
                  code: z.string(),
                  cacheable: z.string(),
                  delete_cached_object: z.string(),
                  reason: z.string(),
                })
                .strict(),
              cache_state: z.string(),
              has_lyrics: z.string(),
              lyrics_snippet: z.string(),
              starred: z.string(),
              copyright_text: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
              release_date: z.string(),
              label_url: z.string(),
              vcode: z.string(),
              vlink: z.string(),
              triller_available: z.boolean(),
              request_jiotune_flag: z.boolean(),
              webp: z.string(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
    ),
  })
  .strict();

export const GetDetailsGetAlbumDetailsSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string(),
    header_desc: z.string(),
    type: z.literal("album"),
    perma_url: z.string(),
    image: z.string(),
    language: z.string(),
    year: z.string(),
    play_count: z.string(),
    explicit_content: z.string(),
    list_count: z.string(),
    list_type: z.string(),
    list: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("song"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              music: z.string(),
              album_id: z.string(),
              album: z.string(),
              label: z.string(),
              label_id: z.string(),
              origin: z.string(),
              is_dolby_content: z.boolean(),
              "320kbps": z.string(),
              encrypted_media_url: z.string(),
              encrypted_cache_url: z.string(),
              encrypted_drm_cache_url: z.string(),
              encrypted_drm_media_url: z.string(),
              album_url: z.string(),
              duration: z.string(),
              rights: z
                .object({
                  code: z.string(),
                  cacheable: z.string(),
                  delete_cached_object: z.string(),
                  reason: z.string(),
                })
                .strict(),
              cache_state: z.string(),
              has_lyrics: z.string(),
              lyrics_snippet: z.string(),
              starred: z.string(),
              copyright_text: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
              release_date: z.string(),
              label_url: z.string(),
              vcode: z.string(),
              vlink: z.string(),
              triller_available: z.boolean(),
              request_jiotune_flag: z.boolean(),
              webp: z.string(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
    ),
    more_info: z
      .object({
        artistMap: z
          .object({
            primary_artists: z.array(
              z
                .object({
                  id: z.string(),
                  name: z.string(),
                  role: z.string(),
                  image: z.string(),
                  type: z.string(),
                  perma_url: z.string(),
                })
                .strict(),
            ),
            featured_artists: z.array(z.any()),
            artists: z.array(
              z
                .object({
                  id: z.string(),
                  name: z.string(),
                  role: z.string(),
                  image: z.string(),
                  type: z.string(),
                  perma_url: z.string(),
                })
                .strict(),
            ),
          })
          .strict(),
        song_count: z.string(),
        copyright_text: z.string(),
        is_dolby_content: z.boolean(),
        label_url: z.string(),
      })
      .strict(),
    button_tooltip_info: z.array(z.any()),
    modules: z
      .object({
        list: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        reco: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            source_api: z.boolean(),
            source_params: z
              .object({
                albumid: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        currentlyTrending: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            source_api: z.boolean(),
            source_params: z
              .object({
                entity_type: z.string(),
                entity_language: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        topAlbumsFromSameYear: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            source_api: z.boolean(),
            source_params: z
              .object({
                album_year: z.string(),
                album_lang: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        artists: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();

export const GetDetailsGetArtistDetailsSchema = z
  .object({
    artistId: z.string(),
    name: z.string(),
    subtitle: z.string(),
    image: z.string(),
    follower_count: z.string(),
    type: z.literal("artist"),
    isVerified: z.boolean(),
    dominantLanguage: z.string(),
    dominantType: z.string(),
    topSongs: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("song"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              music: z.string(),
              album_id: z.string(),
              album: z.string(),
              label: z.string(),
              label_id: z.null(),
              origin: z.string(),
              is_dolby_content: z.boolean(),
              "320kbps": z.string(),
              encrypted_media_url: z.string(),
              encrypted_cache_url: z.string(),
              encrypted_drm_cache_url: z.string(),
              encrypted_drm_media_url: z.string(),
              album_url: z.string(),
              duration: z.string(),
              rights: z
                .object({
                  code: z.string(),
                  cacheable: z.string(),
                  delete_cached_object: z.string(),
                  reason: z.string(),
                })
                .strict(),
              cache_state: z.string(),
              has_lyrics: z.string(),
              lyrics_snippet: z.string(),
              starred: z.string(),
              copyright_text: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
              release_date: z.null(),
              label_url: z.string(),
              vcode: z.string(),
              vlink: z.string(),
              triller_available: z.boolean(),
              request_jiotune_flag: z.boolean(),
              webp: z.string(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
    ),
    topAlbums: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("album"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              query: z.string(),
              text: z.string(),
              music: z.string(),
              song_count: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
    ),
    dedicated_artist_playlist: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          type: z.literal("playlist"),
          image: z.string(),
          perma_url: z.string(),
          more_info: z
            .object({
              uid: z.string(),
              firstname: z.string(),
              artist_name: z.array(z.string()),
              entity_type: z.string(),
              entity_sub_type: z.string(),
              video_available: z.boolean(),
              is_dolby_content: z.null(),
              sub_types: z.null(),
              images: z.null(),
              lastname: z.string(),
              song_count: z.string(),
              language: z.string(),
            })
            .strict(),
          explicit_content: z.string(),
          mini_obj: z.boolean(),
          numsongs: z.null(),
        })
        .strict(),
    ),
    featured_artist_playlist: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          type: z.literal("playlist"),
          image: z.string(),
          perma_url: z.string(),
          more_info: z
            .object({
              uid: z.string(),
              firstname: z.string(),
              artist_name: z.null(),
              entity_type: z.string(),
              entity_sub_type: z.string(),
              video_available: z.boolean(),
              is_dolby_content: z.null(),
              sub_types: z.null(),
              images: z.null(),
              lastname: z.string(),
              song_count: z.string(),
              language: z.string(),
            })
            .strict(),
          explicit_content: z.string(),
          mini_obj: z.boolean(),
          numsongs: z.null(),
        })
        .strict(),
    ),
    singles: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("album"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              query: z.string(),
              text: z.string(),
              music: z.string(),
              song_count: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
    ),
    latest_release: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("album"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              query: z.string(),
              text: z.string(),
              music: z.string(),
              song_count: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
          description: z.string(),
        })
        .strict(),
    ),
    similarArtists: z.array(z.any()),
    isRadioPresent: z.boolean(),
    bio: z.string(),
    dob: z.string(),
    fb: z.string(),
    twitter: z.string(),
    wiki: z.string(),
    urls: z
      .object({
        albums: z.string(),
        bio: z.string(),
        comments: z.string(),
        songs: z.string(),
        overview: z.string(),
      })
      .strict(),
    availableLanguages: z.array(z.string()),
    fan_count: z.string(),
    topEpisodes: z.array(z.any()),
    modules: z
      .object({
        topSongs: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            showMore: z
              .object({
                type: z.string(),
                source: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        latest_release: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        topAlbums: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            showMore: z
              .object({
                type: z.string(),
                source: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        dedicated_artist_playlist: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        featured_artist_playlist: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        singles: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
      })
      .strict(),
    is_followed: z.boolean(),
  })
  .strict();

export const GetDetailsGetPlaylistDetailsSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string(),
    header_desc: z.string(),
    type: z.literal("playlist"),
    perma_url: z.string(),
    image: z.string(),
    language: z.string(),
    year: z.string(),
    play_count: z.string(),
    explicit_content: z.string(),
    list_count: z.string(),
    list_type: z.string(),
    list: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("song"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              music: z.string(),
              album_id: z.string(),
              album: z.string(),
              label: z.string(),
              label_id: z.string(),
              origin: z.string(),
              is_dolby_content: z.boolean(),
              "320kbps": z.string(),
              encrypted_media_url: z.string(),
              encrypted_cache_url: z.string(),
              encrypted_drm_cache_url: z.string(),
              encrypted_drm_media_url: z.string(),
              album_url: z.string(),
              duration: z.string(),
              rights: z
                .object({
                  code: z.string(),
                  cacheable: z.string(),
                  delete_cached_object: z.string(),
                  reason: z.string(),
                })
                .strict(),
              cache_state: z.string(),
              has_lyrics: z.string(),
              lyrics_snippet: z.string(),
              starred: z.string(),
              copyright_text: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
              release_date: z.string(),
              label_url: z.string(),
              vcode: z.string(),
              vlink: z.string(),
              triller_available: z.boolean(),
              request_jiotune_flag: z.boolean(),
              webp: z.string(),
              lyrics_id: z.string(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
    ),
    more_info: z
      .object({
        uid: z.string(),
        contents: z.string(),
        is_dolby_content: z.boolean(),
        subtype: z.array(z.any()),
        last_updated: z.string(),
        username: z.string(),
        firstname: z.string(),
        lastname: z.string(),
        is_followed: z.string(),
        isFY: z.boolean(),
        follower_count: z.string(),
        fan_count: z.string(),
        playlist_type: z.string(),
        share: z.string(),
        sub_types: z.array(z.any()),
        images: z.array(z.any()),
        H2: z.null(),
        subheading: z.null(),
        user_image: z.string(),
        initials: z.string(),
        custom_username: z.string(),
        video_count: z.string(),
        artists: z.array(
          z
            .object({
              id: z.string(),
              name: z.string(),
              role: z.string(),
              image: z.string(),
              type: z.string(),
              perma_url: z.string(),
            })
            .strict(),
        ),
        subtitle_desc: z.array(z.string()),
      })
      .strict(),
    modules: z
      .object({
        list: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        relatedPlaylist: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            source_api: z.boolean(),
            source_params: z
              .object({
                listid: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        currentlyTrendingPlaylists: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            source_api: z.boolean(),
            source_params: z
              .object({
                entity_type: z.string(),
                entity_language: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        artists: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
      })
      .strict(),
    button_tooltip_info: z.array(z.any()),
  })
  .strict();

export const GetRecoGetSongRecoSchema = z.array(
  z
    .object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      header_desc: z.string(),
      type: z.literal("song"),
      perma_url: z.string(),
      image: z.string(),
      language: z.string(),
      year: z.string(),
      play_count: z.string(),
      explicit_content: z.string(),
      list_count: z.string(),
      list_type: z.string(),
      list: z.string(),
      more_info: z
        .object({
          music: z.string(),
          album_id: z.string(),
          album: z.string(),
          label: z.string(),
          label_id: z.string(),
          origin: z.string(),
          is_dolby_content: z.boolean(),
          "320kbps": z.string(),
          encrypted_media_url: z.string(),
          encrypted_cache_url: z.string(),
          encrypted_drm_cache_url: z.string(),
          encrypted_drm_media_url: z.string(),
          album_url: z.string(),
          duration: z.string(),
          rights: z
            .object({
              code: z.string(),
              cacheable: z.string(),
              delete_cached_object: z.string(),
              reason: z.string(),
            })
            .strict(),
          cache_state: z.string(),
          has_lyrics: z.string(),
          lyrics_snippet: z.string(),
          starred: z.string(),
          copyright_text: z.string(),
          artistMap: z
            .object({
              primary_artists: z.array(
                z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    role: z.string(),
                    image: z.string(),
                    type: z.string(),
                    perma_url: z.string(),
                  })
                  .strict(),
              ),
              featured_artists: z.array(z.any()),
              artists: z.array(
                z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    role: z.string(),
                    image: z.string(),
                    type: z.string(),
                    perma_url: z.string(),
                  })
                  .strict(),
              ),
            })
            .strict(),
          release_date: z.string(),
          label_url: z.string(),
          vcode: z.string().optional(),
          vlink: z.string().optional(),
          triller_available: z.boolean(),
          request_jiotune_flag: z.boolean(),
          webp: z.string(),
          lyrics_id: z.string().optional(),
        })
        .strict(),
      button_tooltip_info: z.array(z.any()),
    })
    .strict(),
);

export const GetRecoGetAlbumRecoSchema = z.array(
  z
    .object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      header_desc: z.string(),
      type: z.literal("album"),
      perma_url: z.string(),
      image: z.string(),
      language: z.string(),
      year: z.string(),
      play_count: z.string(),
      explicit_content: z.string(),
      list_count: z.string(),
      list_type: z.string(),
      list: z.string(),
      more_info: z
        .object({
          mini_obj: z.string(),
        })
        .strict(),
      button_tooltip_info: z.array(z.any()),
    })
    .strict(),
);

export const GetRecoGetPlaylistRecoSchema = z.array(
  z
    .object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      type: z.literal("playlist"),
      image: z.string(),
      perma_url: z.string(),
      more_info: z
        .object({
          firstname: z.string(),
        })
        .strict(),
      explicit_content: z.string(),
      mini_obj: z.boolean(),
    })
    .strict(),
);

export const GetTrendingGetTrendingContentSchema = z.array(
  z.union([
    z
      .object({
        id: z.string(),
        title: z.string(),
        subtitle: z.string(),
        header_desc: z.string(),
        type: z.literal("album"),
        perma_url: z.string(),
        image: z.string(),
        language: z.string(),
        year: z.string(),
        play_count: z.string(),
        explicit_content: z.string(),
        list_count: z.string(),
        list_type: z.string(),
        list: z.string(),
        more_info: z
          .object({
            release_date: z.string(),
            song_count: z.string(),
            artistMap: z
              .object({
                primary_artists: z.array(z.any()),
                featured_artists: z.array(z.any()),
                artists: z.array(
                  z
                    .object({
                      id: z.string(),
                      name: z.string(),
                      role: z.string(),
                      image: z.string(),
                      type: z.string(),
                      perma_url: z.string(),
                    })
                    .strict(),
                ),
              })
              .strict(),
          })
          .strict(),
        button_tooltip_info: z.array(z.any()),
      })
      .strict(),
    z
      .object({
        id: z.string(),
        title: z.string(),
        subtitle: z.string(),
        header_desc: z.string(),
        type: z.literal("song"),
        perma_url: z.string(),
        image: z.string(),
        language: z.string(),
        year: z.string(),
        play_count: z.string(),
        explicit_content: z.string(),
        list_count: z.string(),
        list_type: z.string(),
        list: z.string(),
        more_info: z
          .object({
            music: z.string(),
            album_id: z.string(),
            album: z.string(),
            label: z.string(),
            label_id: z.string(),
            origin: z.string(),
            is_dolby_content: z.boolean(),
            "320kbps": z.string(),
            encrypted_media_url: z.string(),
            encrypted_cache_url: z.string(),
            encrypted_drm_cache_url: z.string(),
            encrypted_drm_media_url: z.string(),
            album_url: z.string(),
            duration: z.string(),
            rights: z
              .object({
                code: z.string(),
                cacheable: z.boolean(),
              })
              .strict(),
            cache_state: z.string(),
            has_lyrics: z.string(),
            lyrics_snippet: z.string(),
            starred: z.string(),
            copyright_text: z.string(),
            artistMap: z
              .object({
                primary_artists: z.array(
                  z
                    .object({
                      id: z.string(),
                      name: z.string(),
                      role: z.string(),
                      image: z.string(),
                      type: z.string(),
                      perma_url: z.string(),
                    })
                    .strict(),
                ),
                featured_artists: z.array(z.any()),
                artists: z.array(
                  z
                    .object({
                      id: z.string(),
                      name: z.string(),
                      role: z.string(),
                      image: z.string(),
                      type: z.string(),
                      perma_url: z.string(),
                    })
                    .strict(),
                ),
              })
              .strict(),
            release_date: z.string(),
            triller_available: z.boolean(),
            request_jiotune_flag: z.boolean(),
            webp: z.string(),
          })
          .strict(),
        button_tooltip_info: z.array(z.any()),
      })
      .strict(),
    z
      .object({
        id: z.string(),
        title: z.string(),
        subtitle: z.string(),
        header_desc: z.string(),
        type: z.literal("playlist"),
        perma_url: z.string(),
        image: z.string(),
        language: z.string(),
        year: z.string(),
        play_count: z.string(),
        explicit_content: z.string(),
        list_count: z.string(),
        list_type: z.string(),
        list: z.string(),
        more_info: z
          .object({
            listid: z.string(),
            isWeekly: z.string(),
            listname: z.string(),
            firstname: z.string(),
            song_count: z.string(),
            follower_count: z.string(),
            fan_count: z.string(),
          })
          .strict(),
        button_tooltip_info: z.array(z.any()),
      })
      .strict(),
  ]),
);

export const GetTrendingGetTrendingSongsSchema = z.array(
  z
    .object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      header_desc: z.string(),
      type: z.literal("song"),
      perma_url: z.string(),
      image: z.string(),
      language: z.string(),
      year: z.string(),
      play_count: z.string(),
      explicit_content: z.string(),
      list_count: z.string(),
      list_type: z.string(),
      list: z.string(),
      more_info: z
        .object({
          music: z.string(),
          album_id: z.string(),
          album: z.string(),
          label: z.string(),
          label_id: z.string().nullable(),
          origin: z.string(),
          is_dolby_content: z.boolean(),
          "320kbps": z.string(),
          encrypted_media_url: z.string(),
          encrypted_cache_url: z.string(),
          encrypted_drm_cache_url: z.string(),
          encrypted_drm_media_url: z.string(),
          album_url: z.string(),
          duration: z.string(),
          rights: z
            .object({
              code: z.string(),
              cacheable: z.string(),
              delete_cached_object: z.string(),
              reason: z.string(),
            })
            .strict(),
          cache_state: z.string(),
          has_lyrics: z.string(),
          lyrics_snippet: z.string(),
          starred: z.string(),
          copyright_text: z.string(),
          artistMap: z
            .object({
              primary_artists: z.array(
                z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    role: z.string().optional(),
                    image: z.string(),
                    type: z.string(),
                    perma_url: z.string(),
                  })
                  .strict(),
              ),
              featured_artists: z.array(z.any()),
              artists: z.array(
                z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    role: z.string().optional(),
                    image: z.string(),
                    type: z.string(),
                    perma_url: z.string(),
                  })
                  .strict(),
              ),
            })
            .strict(),
          release_date: z.string().nullable(),
          label_url: z.string(),
          vcode: z.string(),
          vlink: z.string(),
          triller_available: z.boolean(),
          request_jiotune_flag: z.boolean(),
          webp: z.string(),
          lyrics_id: z.string().optional(),
        })
        .strict(),
      button_tooltip_info: z.array(z.any()),
    })
    .strict(),
);

export const GetTrendingGetTrendingAlbumsSchema = z.array(
  z
    .object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      header_desc: z.string(),
      type: z.literal("album"),
      perma_url: z.string(),
      image: z.string(),
      language: z.string(),
      year: z.string(),
      play_count: z.string(),
      explicit_content: z.string(),
      list_count: z.string(),
      list_type: z.string(),
      list: z.string(),
      more_info: z
        .object({
          release_date: z.string(),
          song_count: z.string(),
          artistMap: z
            .object({
              primary_artists: z.array(z.any()),
              featured_artists: z.array(z.any()),
              artists: z.array(
                z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    role: z.string(),
                    image: z.string(),
                    type: z.string(),
                    perma_url: z.string(),
                  })
                  .strict(),
              ),
            })
            .strict(),
        })
        .strict(),
      button_tooltip_info: z.array(z.any()),
    })
    .strict(),
);

export const GetTrendingGetTrendingPlaylistsSchema = z.array(
  z
    .object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      header_desc: z.string(),
      type: z.literal("playlist"),
      perma_url: z.string(),
      image: z.string(),
      language: z.string(),
      year: z.string(),
      play_count: z.string(),
      explicit_content: z.string(),
      list_count: z.string(),
      list_type: z.string(),
      list: z.string(),
      more_info: z
        .object({
          listid: z.string(),
          isWeekly: z.string(),
          listname: z.string(),
          firstname: z.string(),
          song_count: z.string(),
          follower_count: z.string(),
          fan_count: z.string(),
        })
        .strict(),
      button_tooltip_info: z.array(z.any()),
    })
    .strict(),
);

export const WebRadioCreateFeaturedStationSchema = z
  .object({
    stationid: z.string(),
  })
  .strict();

export const WebRadioCreateEntityStationSchema = z
  .object({
    stationid: z.string(),
  })
  .strict();

export const WebRadioGetStationSongsSchema = z.union([
  z
    .object({
      stationid: z.string(),
    })
    .catchall(
      z
        .object({
          song: z
            .object({
              id: z.string(),
              title: z.string(),
              subtitle: z.string(),
              header_desc: z.string(),
              type: z.literal("song"),
              perma_url: z.string(),
              image: z.string(),
              language: z.string(),
              year: z.string(),
              play_count: z.number(),
              explicit_content: z.string(),
              list_count: z.string(),
              list_type: z.string(),
              list: z.string(),
              more_info: z
                .object({
                  music: z.string(),
                  album_id: z.string(),
                  album: z.string(),
                  label: z.string(),
                  label_id: z.string(),
                  origin: z.string(),
                  is_dolby_content: z.boolean(),
                  "320kbps": z.string(),
                  encrypted_media_url: z.string(),
                  encrypted_cache_url: z.string(),
                  encrypted_drm_cache_url: z.string(),
                  encrypted_drm_media_url: z.string(),
                  album_url: z.string(),
                  duration: z.string(),
                  rights: z
                    .object({
                      code: z.string(),
                      reason: z.string(),
                      cacheable: z.string(),
                      delete_cached_object: z.string(),
                    })
                    .strict(),
                  cache_state: z.string(),
                  has_lyrics: z.string(),
                  lyrics_snippet: z.string(),
                  starred: z.string(),
                  copyright_text: z.string(),
                  artistMap: z
                    .object({
                      primary_artists: z.array(
                        z
                          .object({
                            id: z.string(),
                            name: z.string(),
                            role: z.string(),
                            image: z.string(),
                            type: z.string(),
                            perma_url: z.string(),
                          })
                          .strict(),
                      ),
                      featured_artists: z.array(z.any()),
                      artists: z.array(
                        z
                          .object({
                            id: z.string(),
                            name: z.string(),
                            role: z.string(),
                            image: z.string(),
                            type: z.string(),
                            perma_url: z.string(),
                          })
                          .strict(),
                      ),
                    })
                    .strict(),
                  release_date: z.string(),
                  vcode: z.string(),
                  vlink: z.string(),
                  triller_available: z.boolean(),
                  request_jiotune_flag: z.boolean(),
                  webp: z.string(),
                })
                .strict(),
              button_tooltip_info: z.array(z.any()),
            })
            .strict(),
        })
        .strict(),
    ),
  z
    .object({
      song: z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("song"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.number(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              music: z.string(),
              album_id: z.string(),
              album: z.string(),
              label: z.string(),
              label_id: z.string(),
              origin: z.string(),
              is_dolby_content: z.boolean(),
              "320kbps": z.string(),
              encrypted_media_url: z.string(),
              encrypted_cache_url: z.string(),
              encrypted_drm_cache_url: z.string(),
              encrypted_drm_media_url: z.string(),
              album_url: z.string(),
              duration: z.string(),
              rights: z
                .object({
                  code: z.string(),
                  reason: z.string(),
                  cacheable: z.string(),
                  delete_cached_object: z.string(),
                })
                .strict(),
              cache_state: z.string(),
              has_lyrics: z.string(),
              lyrics_snippet: z.string(),
              starred: z.string(),
              copyright_text: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
              release_date: z.string(),
              vcode: z.string(),
              vlink: z.string(),
              triller_available: z.boolean(),
              request_jiotune_flag: z.boolean(),
              webp: z.string(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
      stationid: z.string(),
    })
    .strict(),
]);

export const WebAPIURLBasedGetSongDetailsSchema = z
  .object({
    songs: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("song"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              music: z.string(),
              album_id: z.string(),
              album: z.string(),
              label: z.string(),
              label_id: z.string(),
              origin: z.string(),
              is_dolby_content: z.boolean(),
              "320kbps": z.string(),
              encrypted_media_url: z.string(),
              encrypted_cache_url: z.string(),
              encrypted_drm_cache_url: z.string(),
              encrypted_drm_media_url: z.string(),
              album_url: z.string(),
              duration: z.string(),
              rights: z
                .object({
                  code: z.string(),
                  cacheable: z.string(),
                  delete_cached_object: z.string(),
                  reason: z.string(),
                })
                .strict(),
              cache_state: z.string(),
              has_lyrics: z.string(),
              lyrics_snippet: z.string(),
              starred: z.string(),
              copyright_text: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
              release_date: z.string(),
              label_url: z.string(),
              vcode: z.string(),
              vlink: z.string(),
              triller_available: z.boolean(),
              request_jiotune_flag: z.boolean(),
              webp: z.string(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
    ),
    modules: z
      .object({
        reco: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            source_api: z.boolean(),
            source_params: z
              .object({
                pid: z.string(),
                language: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        currentlyTrending: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            source_api: z.boolean(),
            source_params: z
              .object({
                entity_type: z.string(),
                entity_language: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        songsBysameArtists: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            source_api: z.boolean(),
            source_params: z
              .object({
                artist_ids: z.string(),
                song_id: z.string(),
                language: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        songsBysameActors: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            source_api: z.boolean(),
            source_params: z
              .object({
                actor_ids: z.string(),
                song_id: z.string(),
                language: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        artists: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();

export const WebAPIURLBasedGetAlbumDetailsSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string(),
    header_desc: z.string(),
    type: z.literal("album"),
    perma_url: z.string(),
    image: z.string(),
    language: z.string(),
    year: z.string(),
    play_count: z.string(),
    explicit_content: z.string(),
    list_count: z.string(),
    list_type: z.string(),
    list: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("song"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              music: z.string(),
              album_id: z.string(),
              album: z.string(),
              label: z.string(),
              label_id: z.string(),
              origin: z.string(),
              is_dolby_content: z.boolean(),
              "320kbps": z.string(),
              encrypted_media_url: z.string(),
              encrypted_cache_url: z.string(),
              encrypted_drm_cache_url: z.string(),
              encrypted_drm_media_url: z.string(),
              album_url: z.string(),
              duration: z.string(),
              rights: z
                .object({
                  code: z.string(),
                  cacheable: z.string(),
                  delete_cached_object: z.string(),
                  reason: z.string(),
                })
                .strict(),
              cache_state: z.string(),
              has_lyrics: z.string(),
              lyrics_snippet: z.string(),
              starred: z.string(),
              copyright_text: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
              release_date: z.string(),
              label_url: z.string(),
              vcode: z.string(),
              vlink: z.string(),
              triller_available: z.boolean(),
              request_jiotune_flag: z.boolean(),
              webp: z.string(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
    ),
    more_info: z
      .object({
        artistMap: z
          .object({
            primary_artists: z.array(
              z
                .object({
                  id: z.string(),
                  name: z.string(),
                  role: z.string(),
                  image: z.string(),
                  type: z.string(),
                  perma_url: z.string(),
                })
                .strict(),
            ),
            featured_artists: z.array(z.any()),
            artists: z.array(
              z
                .object({
                  id: z.string(),
                  name: z.string(),
                  role: z.string(),
                  image: z.string(),
                  type: z.string(),
                  perma_url: z.string(),
                })
                .strict(),
            ),
          })
          .strict(),
        song_count: z.string(),
        copyright_text: z.string(),
        is_dolby_content: z.boolean(),
        label_url: z.string(),
      })
      .strict(),
    button_tooltip_info: z.array(z.any()),
    modules: z
      .object({
        list: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        reco: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            source_api: z.boolean(),
            source_params: z
              .object({
                albumid: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        currentlyTrending: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            source_api: z.boolean(),
            source_params: z
              .object({
                entity_type: z.string(),
                entity_language: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        topAlbumsFromSameYear: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            source_api: z.boolean(),
            source_params: z
              .object({
                album_year: z.string(),
                album_lang: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        artists: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();

export const WebAPIURLBasedGetArtistDetailsSchema = z
  .object({
    artistId: z.string(),
    name: z.string(),
    subtitle: z.string(),
    image: z.string(),
    follower_count: z.string(),
    type: z.literal("artist"),
    isVerified: z.boolean(),
    dominantLanguage: z.string(),
    dominantType: z.string(),
    topSongs: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("song"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              music: z.string(),
              album_id: z.string(),
              album: z.string(),
              label: z.string(),
              label_id: z.null(),
              origin: z.string(),
              is_dolby_content: z.boolean(),
              "320kbps": z.string(),
              encrypted_media_url: z.string(),
              encrypted_cache_url: z.string(),
              encrypted_drm_cache_url: z.string(),
              encrypted_drm_media_url: z.string(),
              album_url: z.string(),
              duration: z.string(),
              rights: z
                .object({
                  code: z.string(),
                  cacheable: z.string(),
                  delete_cached_object: z.string(),
                  reason: z.string(),
                })
                .strict(),
              cache_state: z.string(),
              has_lyrics: z.string(),
              lyrics_snippet: z.string(),
              starred: z.string(),
              copyright_text: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
              release_date: z.null(),
              label_url: z.string(),
              vcode: z.string(),
              vlink: z.string(),
              triller_available: z.boolean(),
              request_jiotune_flag: z.boolean(),
              webp: z.string(),
              lyrics_id: z.string().optional(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
    ),
    topAlbums: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("album"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              query: z.string(),
              text: z.string(),
              music: z.string(),
              song_count: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
    ),
    dedicated_artist_playlist: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          type: z.literal("playlist"),
          image: z.string(),
          perma_url: z.string(),
          more_info: z
            .object({
              uid: z.string(),
              firstname: z.string(),
              artist_name: z.array(z.string()),
              entity_type: z.string(),
              entity_sub_type: z.string(),
              video_available: z.boolean(),
              is_dolby_content: z.null(),
              sub_types: z.null(),
              images: z.null(),
              lastname: z.string(),
              song_count: z.string(),
              language: z.string(),
            })
            .strict(),
          explicit_content: z.string(),
          mini_obj: z.boolean(),
          numsongs: z.null(),
        })
        .strict(),
    ),
    featured_artist_playlist: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          type: z.literal("playlist"),
          image: z.string(),
          perma_url: z.string(),
          more_info: z
            .object({
              uid: z.string(),
              firstname: z.string(),
              artist_name: z.null(),
              entity_type: z.string(),
              entity_sub_type: z.string(),
              video_available: z.boolean(),
              is_dolby_content: z.null(),
              sub_types: z.null(),
              images: z.null(),
              lastname: z.string(),
              song_count: z.string(),
              language: z.string(),
            })
            .strict(),
          explicit_content: z.string(),
          mini_obj: z.boolean(),
          numsongs: z.null(),
        })
        .strict(),
    ),
    singles: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("album"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              query: z.string(),
              text: z.string(),
              music: z.string(),
              song_count: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
    ),
    latest_release: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("album"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.string(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              query: z.string(),
              text: z.string(),
              music: z.string(),
              song_count: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
          description: z.string(),
        })
        .strict(),
    ),
    similarArtists: z.array(z.any()),
    isRadioPresent: z.boolean(),
    bio: z.string(),
    dob: z.string(),
    fb: z.string(),
    twitter: z.string(),
    wiki: z.string(),
    urls: z
      .object({
        albums: z.string(),
        bio: z.string(),
        comments: z.string(),
        songs: z.string(),
        overview: z.string(),
      })
      .strict(),
    availableLanguages: z.array(z.string()),
    fan_count: z.string(),
    topEpisodes: z.array(z.any()),
    modules: z
      .object({
        topSongs: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            showMore: z
              .object({
                type: z.string(),
                source: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        latest_release: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        topAlbums: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            showMore: z
              .object({
                type: z.string(),
                source: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        dedicated_artist_playlist: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        featured_artist_playlist: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        singles: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
      })
      .strict(),
    is_followed: z.boolean(),
  })
  .strict();

export const WebAPIURLBasedGetLabelDetailsSchema = z
  .object({
    labelId: z.string(),
    name: z.string(),
    image: z.string(),
    topSongs: z
      .object({
        songs: z.array(
          z
            .object({
              id: z.string(),
              title: z.string(),
              subtitle: z.string(),
              header_desc: z.string(),
              type: z.literal("song"),
              perma_url: z.string(),
              image: z.string(),
              language: z.string(),
              year: z.string(),
              play_count: z.string(),
              explicit_content: z.string(),
              list_count: z.string(),
              list_type: z.string(),
              list: z.string(),
              more_info: z
                .object({
                  music: z.string(),
                  album_id: z.string(),
                  album: z.string(),
                  label: z.string(),
                  label_id: z.null(),
                  origin: z.string(),
                  is_dolby_content: z.boolean(),
                  "320kbps": z.string(),
                  encrypted_media_url: z.string(),
                  encrypted_cache_url: z.string(),
                  encrypted_drm_cache_url: z.string(),
                  encrypted_drm_media_url: z.string(),
                  album_url: z.string(),
                  duration: z.string(),
                  rights: z
                    .object({
                      code: z.string(),
                      cacheable: z.string(),
                      delete_cached_object: z.string(),
                      reason: z.string(),
                    })
                    .strict(),
                  cache_state: z.string(),
                  has_lyrics: z.string(),
                  lyrics_snippet: z.string(),
                  starred: z.string(),
                  copyright_text: z.string(),
                  artistMap: z
                    .object({
                      primary_artists: z.array(
                        z
                          .object({
                            id: z.string(),
                            name: z.string(),
                            role: z.string(),
                            image: z.string(),
                            type: z.string(),
                            perma_url: z.string(),
                          })
                          .strict(),
                      ),
                      featured_artists: z.array(z.any()),
                      artists: z.array(
                        z
                          .object({
                            id: z.string(),
                            name: z.string(),
                            role: z.string(),
                            image: z.string(),
                            type: z.string(),
                            perma_url: z.string(),
                          })
                          .strict(),
                      ),
                    })
                    .strict(),
                  release_date: z.null(),
                  label_url: z.string(),
                  triller_available: z.boolean(),
                  request_jiotune_flag: z.boolean(),
                  webp: z.string(),
                })
                .strict(),
              button_tooltip_info: z.array(z.any()),
            })
            .strict(),
        ),
        total: z.number(),
      })
      .strict(),
    topAlbums: z
      .object({
        albums: z.array(
          z
            .object({
              id: z.string(),
              title: z.string(),
              subtitle: z.string(),
              header_desc: z.string(),
              type: z.literal("album"),
              perma_url: z.string(),
              image: z.string(),
              language: z.string(),
              year: z.string(),
              play_count: z.string(),
              explicit_content: z.string(),
              list_count: z.string(),
              list_type: z.string(),
              list: z.string(),
              more_info: z
                .object({
                  query: z.string(),
                  text: z.string(),
                  music: z.string(),
                  song_count: z.string(),
                  artistMap: z
                    .object({
                      primary_artists: z.array(
                        z
                          .object({
                            id: z.string(),
                            name: z.string(),
                            role: z.string(),
                            image: z.string(),
                            type: z.string(),
                            perma_url: z.string(),
                          })
                          .strict(),
                      ),
                      featured_artists: z.array(z.any()),
                      artists: z.array(
                        z
                          .object({
                            id: z.string(),
                            name: z.string(),
                            role: z.string(),
                            image: z.string(),
                            type: z.string(),
                            perma_url: z.string(),
                          })
                          .strict(),
                      ),
                    })
                    .strict(),
                })
                .strict(),
              button_tooltip_info: z.array(z.any()),
            })
            .strict(),
        ),
        total: z.number(),
      })
      .strict(),
    urls: z
      .object({
        albums: z.string(),
        songs: z.string(),
      })
      .strict(),
    availableLanguages: z.array(z.string()),
  })
  .strict();

export const WebAPIURLBasedGetPlaylistDetailsSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string(),
    header_desc: z.string(),
    type: z.literal("playlist"),
    perma_url: z.string(),
    image: z.string(),
    language: z.string(),
    year: z.string(),
    play_count: z.string(),
    explicit_content: z.string(),
    list_count: z.string(),
    list_type: z.string(),
    list: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          subtitle: z.string(),
          header_desc: z.string(),
          type: z.literal("song"),
          perma_url: z.string(),
          image: z.string(),
          language: z.string(),
          year: z.string(),
          play_count: z.number(),
          explicit_content: z.string(),
          list_count: z.string(),
          list_type: z.string(),
          list: z.string(),
          more_info: z
            .object({
              music: z.string(),
              album_id: z.string(),
              album: z.string(),
              label: z.string(),
              label_id: z.string(),
              origin: z.string(),
              is_dolby_content: z.boolean(),
              "320kbps": z.string(),
              encrypted_media_url: z.string(),
              encrypted_cache_url: z.string(),
              encrypted_drm_cache_url: z.string(),
              encrypted_drm_media_url: z.string(),
              album_url: z.string(),
              duration: z.string(),
              rights: z
                .object({
                  code: z.number(),
                  cacheable: z.boolean(),
                  delete_cached_object: z.boolean(),
                  reason: z.string(),
                })
                .strict(),
              cache_state: z.string(),
              has_lyrics: z.string(),
              lyrics_snippet: z.string(),
              starred: z.string(),
              copyright_text: z.string(),
              artistMap: z
                .object({
                  primary_artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                  featured_artists: z.array(z.any()),
                  artists: z.array(
                    z
                      .object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        image: z.string(),
                        type: z.string(),
                        perma_url: z.string(),
                      })
                      .strict(),
                  ),
                })
                .strict(),
              release_date: z.string(),
              label_url: z.string(),
              vcode: z.string(),
              vlink: z.string(),
              triller_available: z.boolean(),
              request_jiotune_flag: z.boolean(),
              webp: z.boolean(),
            })
            .strict(),
          button_tooltip_info: z.array(z.any()),
        })
        .strict(),
    ),
    more_info: z
      .object({
        uid: z.string(),
        contents: z.string(),
        is_dolby_content: z.boolean(),
        subtype: z.array(z.any()),
        last_updated: z.string(),
        username: z.string(),
        firstname: z.string(),
        lastname: z.string(),
        is_followed: z.string(),
        isFY: z.boolean(),
        follower_count: z.string(),
        fan_count: z.string(),
        playlist_type: z.string(),
        share: z.string(),
        sub_types: z.array(z.any()),
        images: z.array(z.any()),
        H2: z.string(),
        subheading: z.null(),
        user_image: z.string(),
        initials: z.string(),
        custom_username: z.string(),
        video_count: z.number(),
        artists: z.array(
          z
            .object({
              id: z.string(),
              name: z.string(),
              role: z.string(),
              image: z.string(),
              type: z.string(),
              perma_url: z.string(),
            })
            .strict(),
        ),
        subtitle_desc: z.array(z.string()),
      })
      .strict(),
    modules: z
      .object({
        list: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        relatedPlaylist: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            source_api: z.boolean(),
            source_params: z
              .object({
                listid: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        currentlyTrendingPlaylists: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            source_api: z.boolean(),
            source_params: z
              .object({
                entity_type: z.string(),
                entity_language: z.string(),
              })
              .strict(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
        artists: z
          .object({
            source: z.string(),
            position: z.number(),
            score: z.string(),
            bucket: z.string(),
            scroll_type: z.string(),
            title: z.string(),
            subtitle: z.string(),
            highlight: z.string(),
            simpleHeader: z.boolean(),
            noHeader: z.boolean(),
            view_more: z.array(z.any()),
            is_JT_module: z.boolean(),
          })
          .strict(),
      })
      .strict(),
    button_tooltip_info: z.array(z.any()),
  })
  .strict();
