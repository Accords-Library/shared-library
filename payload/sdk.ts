import { Collections } from "./constants";
import type {
  EndpointWebsiteConfig,
  EndpointFolder,
  EndpointLanguage,
  EndpointCurrency,
  EndpointWording,
  EndpointPage,
  EndpointCollectible,
  EndpointCollectibleScans,
  EndpointCollectibleScanPage,
  EndpointCollectibleGallery,
  EndpointCollectibleGalleryImage,
  EndpointChronologyEvent,
  EndpointImage,
  EndpointAudio,
  EndpointVideo,
  EndpointFile,
  EndpointRecorder,
} from "./endpoint-types";
import type { EndpointChange } from "./webhooks";

export enum SDKEndpointNames {
  getWebsiteConfig = "getWebsiteConfig",
  getFolder = "getFolder",
  getLanguages = "getLanguages",
  getCurrencies = "getCurrencies",
  getWordings = "getWordings",
  getPage = "getPage",
  getCollectible = "getCollectible",
  getCollectibleScans = "getCollectibleScans",
  getCollectibleScanPage = "getCollectibleScanPage",
  getCollectibleGallery = "getCollectibleGallery",
  getCollectibleGalleryImage = "getCollectibleGalleryImage",
  getChronologyEvents = "getChronologyEvents",
  getChronologyEventByID = "getChronologyEventByID",
  getImageByID = "getImageByID",
  getAudioByID = "getAudioByID",
  getVideoByID = "getVideoByID",
  getFileByID = "getFileByID",
  getRecorderByID = "getRecorderByID",
  getLogin = "getLogin",
  getAll = "getAll",
}

export const getSDKEndpoint = {
  getWebsiteConfig: () => `/globals/${Collections.WebsiteConfig}/config`,
  getFolder: (slug: string) => `/${Collections.Folders}/slug/${slug}`,
  getLanguages: () => `/${Collections.Languages}/all`,
  getCurrencies: () => `/${Collections.Currencies}/all`,
  getWordings: () => `/${Collections.Wordings}/all`,
  getPage: (slug: string) => `/${Collections.Pages}/slug/${slug}`,
  getCollectible: (slug: string) => `/${Collections.Collectibles}/slug/${slug}`,
  getCollectibleScans: (slug: string) => `/${Collections.Collectibles}/slug/${slug}/scans`,
  getCollectibleScanPage: (slug: string, index: string) =>
    `/${Collections.Collectibles}/slug/${slug}/scans/${index}`,
  getCollectibleGallery: (slug: string) => `/${Collections.Collectibles}/slug/${slug}/gallery`,
  getCollectibleGalleryImage: (slug: string, index: string) =>
    `/${Collections.Collectibles}/slug/${slug}/gallery/${index}`,
  getChronologyEvents: () => `/${Collections.ChronologyEvents}/all`,
  getChronologyEventByID: (id: string) => `/${Collections.ChronologyEvents}/id/${id}`,
  getImageByID: (id: string) => `/${Collections.Images}/id/${id}`,
  getAudioByID: (id: string) => `/${Collections.Audios}/id/${id}`,
  getVideoByID: (id: string) => `/${Collections.Videos}/id/${id}`,
  getFileByID: (id: string) => `/${Collections.Files}/id/${id}`,
  getRecorderByID: (id: string) => `/${Collections.Recorders}/id/${id}`,
  getLogin: () => `/${Collections.Recorders}/login`,
  getAll: () => `/all`,
} satisfies Record<SDKEndpointNames, (...params: string[]) => string>;

export type PayloadSDKResponse<T> = {
  data: T;
  endpointCalled: string;
};

type PayloadTokenCache = {
  set: (token: string, expirationTimestamp: number) => void;
  get: () => string | undefined;
};

type PayloadDataCache = {
  set: (url: string, response: any) => void;
  get: (url: string) => any | undefined;
};

export class PayloadSDK {
  private tokenCache: PayloadTokenCache | undefined;
  private dataCache: PayloadDataCache | undefined;

  constructor(
    private readonly apiURL: string,
    private readonly email: string,
    private readonly password: string
  ) {}

  addTokenCache(tokenCache: PayloadTokenCache) {
    this.tokenCache = tokenCache;
  }

  addDataCache(dataCache: PayloadDataCache) {
    this.dataCache = dataCache;
  }

  private logResponse(res: Response) {
    console.log(res.status, res.statusText, res.url);
  }

  private async refreshToken() {
    const loginUrl = `${this.apiURL}${getSDKEndpoint.getLogin()}`;
    const loginResult = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: this.email, password: this.password }),
    });
    this.logResponse(loginResult);

    if (loginResult.status !== 200) {
      throw new Error("Unable to login");
    }

    const { token, exp } = (await loginResult.json()) as {
      token: string;
      exp: number;
    };
    this.tokenCache?.set(token, exp);
    return token;
  }

  async request<T>(endpoint: string): Promise<PayloadSDKResponse<T>> {
    const cachedResponse = this.dataCache?.get(endpoint);
    if (cachedResponse) {
      return cachedResponse;
    }

    const result = await fetch(`${this.apiURL}${endpoint}`, {
      headers: {
        Authorization: `JWT ${this.tokenCache?.get() ?? (await this.refreshToken())}`,
      },
    });
    this.logResponse(result);

    if (!result.ok) {
      throw new Error("Unhandled fetch error");
    }

    const response = { data: await result.json(), endpointCalled: endpoint };
    this.dataCache?.set(endpoint, response);
    return response;
  }

  async getWebsiteConfig(): Promise<PayloadSDKResponse<EndpointWebsiteConfig>> {
    return await this.request(getSDKEndpoint.getWebsiteConfig());
  }
  async getFolder(slug: string): Promise<PayloadSDKResponse<EndpointFolder>> {
    return await this.request(getSDKEndpoint.getFolder(slug));
  }
  async getLanguages(): Promise<PayloadSDKResponse<EndpointLanguage[]>> {
    return await this.request(getSDKEndpoint.getLanguages());
  }
  async getCurrencies(): Promise<PayloadSDKResponse<EndpointCurrency[]>> {
    return await this.request(getSDKEndpoint.getCurrencies());
  }
  async getWordings(): Promise<PayloadSDKResponse<EndpointWording[]>> {
    return await this.request(getSDKEndpoint.getWordings());
  }
  async getPage(slug: string): Promise<PayloadSDKResponse<EndpointPage>> {
    return await this.request(getSDKEndpoint.getPage(slug));
  }
  async getCollectible(slug: string): Promise<PayloadSDKResponse<EndpointCollectible>> {
    return await this.request(getSDKEndpoint.getCollectible(slug));
  }
  async getCollectibleScans(slug: string): Promise<PayloadSDKResponse<EndpointCollectibleScans>> {
    return await this.request(getSDKEndpoint.getCollectibleScans(slug));
  }
  async getCollectibleScanPage(
    slug: string,
    index: string
  ): Promise<PayloadSDKResponse<EndpointCollectibleScanPage>> {
    return await this.request(getSDKEndpoint.getCollectibleScanPage(slug, index));
  }
  async getCollectibleGallery(
    slug: string
  ): Promise<PayloadSDKResponse<EndpointCollectibleGallery>> {
    return await this.request(getSDKEndpoint.getCollectibleGallery(slug));
  }
  async getCollectibleGalleryImage(
    slug: string,
    index: string
  ): Promise<PayloadSDKResponse<EndpointCollectibleGalleryImage>> {
    return await this.request(getSDKEndpoint.getCollectibleGalleryImage(slug, index));
  }
  async getChronologyEvents(): Promise<PayloadSDKResponse<EndpointChronologyEvent[]>> {
    return await this.request(getSDKEndpoint.getChronologyEvents());
  }
  async getChronologyEventByID(id: string): Promise<PayloadSDKResponse<EndpointChronologyEvent>> {
    return await this.request(getSDKEndpoint.getChronologyEventByID(id));
  }
  async getImageByID(id: string): Promise<PayloadSDKResponse<EndpointImage>> {
    return await this.request(getSDKEndpoint.getImageByID(id));
  }
  async getAudioByID(id: string): Promise<PayloadSDKResponse<EndpointAudio>> {
    return await this.request(getSDKEndpoint.getAudioByID(id));
  }
  async getVideoByID(id: string): Promise<PayloadSDKResponse<EndpointVideo>> {
    return await this.request(getSDKEndpoint.getVideoByID(id));
  }
  async getFileByID(id: string): Promise<PayloadSDKResponse<EndpointFile>> {
    return await this.request(getSDKEndpoint.getFileByID(id));
  }
  async getRecorderByID(id: string): Promise<PayloadSDKResponse<EndpointRecorder>> {
    return await this.request(getSDKEndpoint.getRecorderByID(id));
  }
  async getAll(): Promise<PayloadSDKResponse<EndpointChange[]>> {
    return await this.request(getSDKEndpoint.getAll());
  }
}
