import type { SDKEndpointNames } from "./sdk";

export type EndpointChange = {
  url: string;
} & (
  | { type: SDKEndpointNames.getWebsiteConfig }
  | { type: SDKEndpointNames.getFolder; slug: string }
  | { type: SDKEndpointNames.getLanguages }
  | { type: SDKEndpointNames.getCurrencies }
  | { type: SDKEndpointNames.getWordings }
  | { type: SDKEndpointNames.getPage; slug: string }
  | { type: SDKEndpointNames.getCollectible; slug: string }
  | { type: SDKEndpointNames.getCollectibleScans; slug: string }
  | { type: SDKEndpointNames.getCollectibleScanPage; slug: string; index: string }
  | { type: SDKEndpointNames.getCollectibleGallery; slug: string }
  | { type: SDKEndpointNames.getCollectibleGalleryImage; slug: string; index: string }
  | { type: SDKEndpointNames.getChronologyEvents }
  | { type: SDKEndpointNames.getChronologyEventByID; id: string }
  | { type: SDKEndpointNames.getImageByID; id: string }
  | { type: SDKEndpointNames.getAudioByID; id: string }
  | { type: SDKEndpointNames.getVideoByID; id: string }
  | { type: SDKEndpointNames.getFileByID; id: string }
  | { type: SDKEndpointNames.getRecorderByID; id: string }
);

