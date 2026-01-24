import axios, { type AxiosInstance, type AxiosError } from "axios";
import Provider, { type Track } from "./Provider";
import type { SpotifyProviderConfig } from "../config";

// ------------------------------------------------------------------

const API_URL = "https://api.spotify.com/v1/";
const ACCOUNT_API_URL = "https://accounts.spotify.com/api/";

// ------------------------------------------------------------------

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyExternalUrls {
  spotify: string;
}

interface SpotifyAlbum {
  id: string;
  images: SpotifyImage[];
}

interface SpotifyTrackData {
  id: string;
  name: string;
  preview_url: string | null;
  external_urls: SpotifyExternalUrls;
  album?: SpotifyAlbum;
  cover?: string;
}

interface SpotifyAlbumResponse {
  tracks: {
    items: SpotifyTrackData[];
  };
  images: SpotifyImage[];
}

interface SpotifyArtistAlbumsResponse {
  items: { id: string }[];
}

interface SpotifyMultipleAlbumsResponse {
  albums: (SpotifyAlbumResponse & { id: string })[];
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrackData[];
  };
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  error?: string;
}

interface SpotifyErrorResponse {
  message: string;
}

// ------------------------------------------------------------------

export default class SpotifyProvider extends Provider {
  private access_token: string | null;
  private key: string;

  constructor({ clientId, clientSecret }: SpotifyProviderConfig) {
    super();
    this.access_token = null;
    this.key = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  }

  async fetchTracks(sourceType: string, sourceId: string): Promise<Track[]> {
    let tracks: SpotifyTrackData[];
    switch (sourceType) {
      case "ALBUM":
        tracks = await this.fetchTracksFromAlbum(sourceId);
        break;
      case "ARTIST":
        tracks = await this.fetchTracksFromArtist(sourceId);
        break;
      case "SEARCH":
        tracks = await this.fetchTracksFromSearch(sourceId);
        break;
      default:
        throw new Error(`Unknown spotify source type "${sourceType}"`);
    }
    return tracks
      .filter((track) => !!track.preview_url)
      .map((track) => ({
        cover: track.cover!,
        id: track.id,
        preview: track.preview_url!,
        title: track.name,
        url: track.external_urls.spotify,
      }));
  }

  private async refreshAuthentication(): Promise<void> {
    try {
      console.log(`Basic ${this.key}`);
      console.log("Refreshing Spotify authentication");

      const fetcher: AxiosInstance = axios.create({
        baseURL: ACCOUNT_API_URL,
        params: {
          grant_type: "client_credentials",
        },
        headers: {
          Authorization: `Basic ${this.key}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const response = await fetcher.post<SpotifyTokenResponse>("token");
      const { data } = response;
      if (data && data.error) throw new Error(data.error);
      this.access_token = data.access_token;
      console.log(
        "Spotify authentication refresh succeeded",
        this.access_token,
      );
    } catch (error) {
      console.log("Spotify authentication refresh failed", error);
    }
  }

  private async fetchAPI<T>(url: string): Promise<T> {
    for (let i = 0; i < 2; ++i) {
      try {
        console.log("Fetching Spotify", this.access_token);
        const fetcher: AxiosInstance = axios.create({
          baseURL: API_URL,
          headers: {
            Authorization: `Bearer ${this.access_token}`,
          },
        });
        const response = await fetcher.get<T & { error?: string }>(url);
        const { data } = response;
        if (data && data.error) throw new Error(data.error);
        return data;
      } catch (error) {
        const axiosError = error as AxiosError<SpotifyErrorResponse>;
        if (axiosError.response) {
          if (axiosError.response.status === 401) {
            await this.refreshAuthentication();
          } else {
            throw new Error(
              axiosError.response.data?.message || "Unknown error",
            );
          }
        } else {
          throw error;
        }
      }
    }
    throw new Error("Failed to fetch from Spotify API after retries");
  }

  private async fetchTracksFromAlbum(
    albumId: string,
  ): Promise<SpotifyTrackData[]> {
    const albums = await this.fetchAPI<SpotifyAlbumResponse>(
      `albums/${albumId}`,
    );
    return albums.tracks.items.map((track) => {
      // In that case we have to enrich each track data with the cover which is available in the album data
      track.cover = albums.images[0].url;
      return track;
    });
  }

  // https://developer.spotify.com/web-api/console/get-several-albums/#complete
  private async fetchTracksFromArtist(
    artistId: string,
  ): Promise<SpotifyTrackData[]> {
    let albumsResponse = await this.fetchAPI<SpotifyArtistAlbumsResponse>(
      `artists/${artistId}/albums`,
    );
    const albums = (
      await this.fetchAPI<SpotifyMultipleAlbumsResponse>(
        `albums?ids=${albumsResponse.items.map((album) => album.id).join(",")}`,
      )
    ).albums;
    return ([] as SpotifyTrackData[]).concat(
      ...albums.map((album) =>
        album.tracks.items.map((track) => {
          // In that case we have to enrich each track data with the cover which is available in the album data
          track.cover = album.images[0].url;
          return track;
        }),
      ),
    );
  }

  private async fetchTracksFromSearch(
    query: string,
  ): Promise<SpotifyTrackData[]> {
    const search = await this.fetchAPI<SpotifySearchResponse>(
      `search?q=${encodeURI(query)}&type=track`,
    );
    return search.tracks.items.map((track) => {
      // In that case we have to enrich each track data with the cover which is available in the album data
      track.cover = track.album!.images[0].url;
      return track;
    });
  }
}
