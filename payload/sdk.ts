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
  EndpointAllSDKUrls,
  EndpointAllIds,
} from "./endpoint-types";

export const getSDKEndpoint = {
  getConfigEndpoint: () => `/globals/${Collections.WebsiteConfig}/config`,
  getFolderEndpoint: (slug: string) => `/${Collections.Folders}/slug/${slug}`,
  getLanguagesEndpoint: () => `/${Collections.Languages}/all`,
  getCurrenciesEndpoint: () => `/${Collections.Currencies}/all`,
  getWordingsEndpoint: () => `/${Collections.Wordings}/all`,
  getPageEndpoint: (slug: string) => `/${Collections.Pages}/slug/${slug}`,
  getCollectibleEndpoint: (slug: string) =>
    `/${Collections.Collectibles}/slug/${slug}`,
  getCollectibleScansEndpoint: (slug: string) =>
    `/${Collections.Collectibles}/slug/${slug}/scans`,
  getCollectibleScanPageEndpoint: (slug: string, index: string) =>
    `/${Collections.Collectibles}/slug/${slug}/scans/${index}`,
  getCollectibleGalleryEndpoint: (slug: string) =>
    `/${Collections.Collectibles}/slug/${slug}/gallery`,
  getCollectibleGalleryImageEndpoint: (slug: string, index: string) =>
    `/${Collections.Collectibles}/slug/${slug}/gallery/${index}`,
  getChronologyEventsEndpoint: () => `/${Collections.ChronologyEvents}/all`,
  getChronologyEventByIDEndpoint: (id: string) =>
    `/${Collections.ChronologyEvents}/id/${id}`,
  getImageByIDEndpoint: (id: string) => `/${Collections.Images}/id/${id}`,
  getAudioByIDEndpoint: (id: string) => `/${Collections.Audios}/id/${id}`,
  getVideoByIDEndpoint: (id: string) => `/${Collections.Videos}/id/${id}`,
  getFileByIDEndpoint: (id: string) => `/${Collections.Files}/id/${id}`,
  getRecorderByIDEndpoint: (id: string) => `/${Collections.Recorders}/id/${id}`,
  getAllSDKUrlsEndpoint: () => `/all-sdk-urls`,
  getAllIds: () => `/all-ids`,
  getLoginEndpoint: () => `/${Collections.Recorders}/login`,
};

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
    const loginUrl = `${this.apiURL}${getSDKEndpoint.getLoginEndpoint()}`;
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
        Authorization: `JWT ${
          this.tokenCache?.get() ?? (await this.refreshToken())
        }`,
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

  async getConfig(): Promise<PayloadSDKResponse<EndpointWebsiteConfig>> {
    return await this.request(getSDKEndpoint.getConfigEndpoint());
  }
  async getFolder(slug: string): Promise<PayloadSDKResponse<EndpointFolder>> {
    return await this.request(getSDKEndpoint.getFolderEndpoint(slug));
  }
  async getLanguages(): Promise<PayloadSDKResponse<EndpointLanguage[]>> {
    return await this.request(getSDKEndpoint.getLanguagesEndpoint());
  }
  async getCurrencies(): Promise<PayloadSDKResponse<EndpointCurrency[]>> {
    return await this.request(getSDKEndpoint.getCurrenciesEndpoint());
  }
  async getWordings(): Promise<PayloadSDKResponse<EndpointWording[]>> {
    return await this.request(getSDKEndpoint.getWordingsEndpoint());
  }
  async getPage(slug: string): Promise<PayloadSDKResponse<EndpointPage>> {
    return await this.request(getSDKEndpoint.getPageEndpoint(slug));
  }
  async getCollectible(
    slug: string
  ): Promise<PayloadSDKResponse<EndpointCollectible>> {
    return await this.request(getSDKEndpoint.getCollectibleEndpoint(slug));
  }
  async getCollectibleScans(
    slug: string
  ): Promise<PayloadSDKResponse<EndpointCollectibleScans>> {
    return await this.request(getSDKEndpoint.getCollectibleScansEndpoint(slug));
  }
  async getCollectibleScanPage(
    slug: string,
    index: string
  ): Promise<PayloadSDKResponse<EndpointCollectibleScanPage>> {
    return await this.request(
      getSDKEndpoint.getCollectibleScanPageEndpoint(slug, index)
    );
  }
  async getCollectibleGallery(
    slug: string
  ): Promise<PayloadSDKResponse<EndpointCollectibleGallery>> {
    return await this.request(
      getSDKEndpoint.getCollectibleGalleryEndpoint(slug)
    );
  }
  async getCollectibleGalleryImage(
    slug: string,
    index: string
  ): Promise<PayloadSDKResponse<EndpointCollectibleGalleryImage>> {
    return await this.request(
      getSDKEndpoint.getCollectibleGalleryImageEndpoint(slug, index)
    );
  }
  async getChronologyEvents(): Promise<
    PayloadSDKResponse<EndpointChronologyEvent[]>
  > {
    return await this.request(getSDKEndpoint.getChronologyEventsEndpoint());
  }
  async getChronologyEventByID(
    id: string
  ): Promise<PayloadSDKResponse<EndpointChronologyEvent>> {
    return await this.request(
      getSDKEndpoint.getChronologyEventByIDEndpoint(id)
    );
  }
  async getImageByID(id: string): Promise<PayloadSDKResponse<EndpointImage>> {
    return await this.request(getSDKEndpoint.getImageByIDEndpoint(id));
  }
  async getAudioByID(id: string): Promise<PayloadSDKResponse<EndpointAudio>> {
    return await this.request(getSDKEndpoint.getAudioByIDEndpoint(id));
  }
  async getVideoByID(id: string): Promise<PayloadSDKResponse<EndpointVideo>> {
    return await this.request(getSDKEndpoint.getVideoByIDEndpoint(id));
  }
  async getFileByID(id: string): Promise<PayloadSDKResponse<EndpointFile>> {
    return await this.request(getSDKEndpoint.getFileByIDEndpoint(id));
  }
  async getRecorderByID(
    id: string
  ): Promise<PayloadSDKResponse<EndpointRecorder>> {
    return await this.request(getSDKEndpoint.getRecorderByIDEndpoint(id));
  }
  async getAllSdkUrls(): Promise<PayloadSDKResponse<EndpointAllSDKUrls>> {
    return await this.request(getSDKEndpoint.getAllSDKUrlsEndpoint());
  }
  async getAllIds(): Promise<PayloadSDKResponse<EndpointAllIds>> {
    return await this.request(getSDKEndpoint.getAllIds());
  }
}
