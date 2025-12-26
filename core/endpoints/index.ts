import { SearchEndpoints } from "./search";
import { SongEndpoints } from "./songs";
import { RecoEndpoints } from "./reco";
import { WebRadioEndpoints } from "./webradio";
import { AlbumEndpoints } from "./albums";
import { ArtistEndpoints } from "./artists";
import { PlaylistEndpoints } from "./playlists";
import { LabelEndpoints } from "./labels";
import { ModuleEndpoints, TrendingEndpoints } from "./misc";

export const Endpoints = {
  search: SearchEndpoints,
  songs: SongEndpoints,
  reco: RecoEndpoints,
  webradio: WebRadioEndpoints,
  albums: AlbumEndpoints,
  artists: ArtistEndpoints,
  playlists: PlaylistEndpoints,
  labels: LabelEndpoints,
  modules: ModuleEndpoints,
  trending: TrendingEndpoints,
} as const;

type EndpointOf<T extends Record<string, any>> = T[keyof T];
type EndpointGroups = typeof Endpoints;

export type EndpointValue = {
  [K in keyof EndpointGroups]: EndpointOf<EndpointGroups[K]>;
}[keyof EndpointGroups];

export const AllEndpoints = Object.values(Endpoints).flatMap(
  Object.values,
) as readonly EndpointValue[];
