import type { Collections } from "./constants";

export type AfterOperationWebHookMessage = {
  operation: "update" | "create" | "delete";
  addedDependantIds: string[];
  urls: string[];
} & (
  | {
      collection: Collections.WebsiteConfig;
    }
  | {
      collection: Collections.Pages;
      id: string;
      slug: string;
    }
  | {
      collection: Collections.Collectibles;
      id: string;
      slug: string;
    }
  | {
      collection: Collections.Folders;
      id: string;
      slug: string;
    }
  | {
      collection:
        | Collections.Attributes
        | Collections.Audios
        | Collections.ChronologyEvents
        // | Collections.Collectibles
        | Collections.CreditsRole
        | Collections.Currencies
        | Collections.Files
        // | Collections.Folders
        | Collections.GenericContents
        | Collections.Images
        | Collections.Languages
        | Collections.MediaThumbnails
        // | Collections.Pages
        | Collections.Recorders
        | Collections.Scans
        | Collections.Tags
        | Collections.Videos
        | Collections.VideosChannels
        | Collections.VideosSubtitles
        | Collections.Wordings
        // | Collections.WebsiteConfig;
      id: string;
    }
);
