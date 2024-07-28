import { Collections } from "../payload/constants";
import type {
  EndpointCollectible,
  EndpointPage,
  EndpointFolder,
  EndpointVideo,
  EndpointAudio,
  EndpointImage,
  EndpointFile,
  EndpointRecorder,
  EndpointChronologyEvent,
} from "../payload/endpoint-types";

export type MeiliDocument = {
  docId: string;
  distinctId: string;
  languages: string[];
  title?: string;
  content?: string;
  updatedAt?: number;
  endpointCalled: string;
} & (
  | {
      type: Collections.Collectibles;
      data: EndpointCollectible;
    }
  | {
      type: Collections.Pages;
      data: EndpointPage;
    }
  | {
      type: Collections.Folders;
      data: EndpointFolder;
    }
  | {
      type: Collections.Videos;
      data: EndpointVideo;
    }
  | {
      type: Collections.Audios;
      data: EndpointAudio;
    }
  | {
      type: Collections.Images;
      data: EndpointImage;
    }
  | {
      type: Collections.Files;
      data: EndpointFile;
    }
  | {
      type: Collections.Recorders;
      data: EndpointRecorder;
    }
  | {
      type: Collections.ChronologyEvents;
      data: {
        date: EndpointChronologyEvent["date"];
        event: EndpointChronologyEvent["events"][number];
      };
    }
);

export type SearchResponse<T> = {
  hits: T[];
  query: string;
  processingTimeMs: number;
  hitsPerPage: number;
  page: number;
  totalPages: number;
  totalHits: number;
  facetDistribution: Record<"type" | "languages", Record<string, number>>;
};

export type SearchRequest = {
  q: string;
  page: number;
  types?: string[] | string | undefined;
};
