export type EndpointChange = {
  url: string;
} & (
  | { type: "getConfig" }
  | { type: "getFolder"; slug: string }
  | { type: "getLanguages" }
  | { type: "getCurrencies" }
  | { type: "getWordings" }
  | { type: "getPage"; slug: string }
  | { type: "getCollectible"; slug: string }
  | { type: "getCollectibleScans"; slug: string }
  | { type: "getCollectibleScanPage"; slug: string; index: string }
  | { type: "getCollectibleGallery"; slug: string }
  | { type: "getCollectibleGalleryImage"; slug: string; index: string }
  | { type: "getChronologyEvents" }
  | { type: "getChronologyEventByID"; id: string }
  | { type: "getImageByID"; id: string }
  | { type: "getAudioByID"; id: string }
  | { type: "getVideoByID"; id: string }
  | { type: "getFileByID"; id: string }
  | { type: "getRecorderByID"; id: string }
  | { type: "getAllSdkUrls" }
  | { type: "getAllIds" }
);