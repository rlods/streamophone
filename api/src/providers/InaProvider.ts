import axios, { type AxiosInstance } from "axios";
import config from "../config";
import Provider, { type Track } from "./Provider";

// ------------------------------------------------------------------

const API_BASE_URL = "http://fresques.ina.fr/jalons/api/";
const API_FETCHER: AxiosInstance = axios.create({ baseURL: API_BASE_URL });

// ------------------------------------------------------------------

interface InaResource {
  id: string;
  title: string;
  url: string;
  html: string;
}

interface InaSearchResponse {
  return: {
    resources: InaResource[];
  };
}

interface InaMediaAssets {
  [key: string]: { url: string }[];
}

interface InaWindowData {
  components: {
    "component.player.video": {
      api: {
        document: {
          mediaAssets: InaMediaAssets;
        };
      };
    };
  };
}

// ------------------------------------------------------------------

const extractVideo = async (url: string): Promise<string> => {
  const { data } = await axios.get<string>(url);
  const match = data.match(/window\[[^\]]*\]\ =\ ([^;]*)/m);
  if (!match) {
    throw new Error("Could not extract video data from INA page");
  }
  const windowData: InaWindowData = JSON.parse(match[1]);
  const assets =
    windowData.components["component.player.video"].api.document.mediaAssets;
  const lastKey = Object.keys(assets).slice(-1)[0];
  return assets[lastKey][0].url.replace(
    "http://fresques.ina.fr/jalons/media/video/lire/",
    `${config.STREAMER.URL}/ina/`,
  );
};

export default class InaProvider extends Provider {
  constructor() {
    super();
    this.tracksCacheExpiration = 60 * 60; // seconds (1h) overrides default value
  }

  private async fetchAPI<T>(url: string): Promise<T> {
    console.log("Fetching INA", url);
    const response = await API_FETCHER.get<T & { error?: string }>(url);
    const { data } = response;
    if (data && data.error) throw new Error(data.error);
    return data;
  }

  async fetchTracks(sourceType: string, sourceId: string): Promise<Track[]> {
    let tracks: InaResource[];
    switch (sourceType) {
      case "SEARCH":
        tracks = await this.fetchTracksFromSearch(sourceId);
        break;
      default:
        throw new Error(`Unknown INA source type "${sourceType}"`);
    }
    return await Promise.all(
      tracks.map(async (resource) => {
        const srcMatch = resource.html.match(/src="([^"]*)/);
        if (!srcMatch) {
          throw new Error("Could not extract src from INA resource");
        }
        return {
          cover:
            "http://fresques.ina.fr/jalons/media/imagette/512x384/" +
            resource.id,
          id: resource.id,
          preview: await extractVideo(srcMatch[1]),
          title: resource.title,
          url: resource.url,
        };
      }),
    );
  }

  private async fetchTracksFromSearch(query: string): Promise<InaResource[]> {
    const search = await this.fetchAPI<InaSearchResponse>(
      `search?query=${encodeURI(query)}`,
    );
    return search.return.resources;
  }
}
