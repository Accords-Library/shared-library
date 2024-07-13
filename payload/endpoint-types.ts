import { AttributeTypes, CollectibleBindingTypes, CollectibleNature, CollectiblePageOrders, Collections } from "./constants";
import { RichTextContent } from "./rich-text";

export interface EndpointCurrency {
  id: string;
}

export interface EndpointLanguage {
  id: string;
  name: string;
  selectable: boolean;
}

export type EndpointFolderPreview = {
    id: string;
    slug: string;
    icon?: string;
    translations: {
      language: string;
      title: string;
    }[];
  };
  
  export type EndpointFolder = Omit<EndpointFolderPreview, "translations"> & {
    translations: (EndpointFolderPreview["translations"][number] & {
      description?: RichTextContent;
    })[];
    sections:
      | { type: "single"; subfolders: EndpointFolderPreview[] }
      | {
          type: "multiple";
          sections: {
            translations: { language: string; name: string }[];
            subfolders: EndpointFolderPreview[];
          }[];
        };
    files: (
      | {
          relationTo: Collections.Collectibles;
          value: EndpointCollectiblePreview;
        }
      | {
          relationTo: Collections.Pages;
          value: EndpointPagePreview;
        }
      | {
          relationTo: Collections.Images;
          value: EndpointImagePreview;
        }
      | {
          relationTo: Collections.Audios;
          value: EndpointAudioPreview;
        }
      | {
          relationTo: Collections.Videos;
          value: EndpointVideoPreview;
        }
      | {
          relationTo: Collections.Files;
          value: EndpointFilePreview;
        }
    )[];
    parentPages: EndpointSource[];
  };
  
  export type EndpointWebsiteConfig = {
    home: {
      backgroundImage?: EndpointPayloadImage;
      folders: (EndpointFolderPreview & {
        lightThumbnail?: EndpointPayloadImage;
        darkThumbnail?: EndpointPayloadImage;
      })[];
    };
    timeline: {
      backgroundImage?: EndpointPayloadImage;
      breaks: number[];
      eventCount: number;
      eras: {
        startingYear: number;
        endingYear: number;
        name: string;
      }[];
    };
    defaultOpenGraphImage?: EndpointPayloadImage;
  };
  
  export type EndpointRecorderPreview = {
    id: string;
    username: string;
  };
  
  export type EndpointRecorder = EndpointRecorderPreview & {
    avatar?: EndpointPayloadImage;
    translations: {
      language: string;
      biography: RichTextContent;
    }[];
    languages: string[];
  };
  
  export type EndpointWording = {
    name: string;
    translations: {
      language: string;
      name: string;
    }[];
  };
  
  export type EndpointTag = {
    id: string;
    slug: string;
    page?: { slug: string };
    translations: {
      language: string;
      name: string;
    }[];
  };
  
  export type EndpointGenericAttribute = {
    id: string;
    slug: string;
    icon: string;
    translations: {
      language: string;
      name: string;
    }[];
  };
  
  export type EndpointNumberAttribute = EndpointGenericAttribute & {
    type: AttributeTypes.Number;
    value: number;
  };
  
  export type EndpointTextAttribute = EndpointGenericAttribute & {
    type: AttributeTypes.Text;
    value: string;
  };
  
  export type EndpointTagsAttribute = EndpointGenericAttribute & {
    type: AttributeTypes.Tags;
    value: EndpointTag[];
  };
  
  export type EndpointAttribute =
    | EndpointNumberAttribute
    | EndpointTextAttribute
    | EndpointTagsAttribute;
  
  export type EndpointRole = {
    id: string;
    icon: string;
    translations: {
      language: string;
      name: string;
    }[];
  };
  
  export type EndpointCredit = {
    role: EndpointRole;
    recorders: EndpointRecorderPreview[];
  };
  
  export type EndpointPagePreview = {
    id: string;
    slug: string;
    thumbnail?: EndpointPayloadImage;
    attributes: EndpointAttribute[];
    translations: {
      language: string;
      pretitle?: string;
      title: string;
      subtitle?: string;
    }[];
    updatedAt: string;
  };
  
  export type EndpointPage = Omit<EndpointPagePreview, "translations"> & {
    backgroundImage?: EndpointPayloadImage;
    translations: (EndpointPagePreview["translations"][number] & {
      sourceLanguage: string;
      summary?: RichTextContent;
      content: RichTextContent;
      credits: EndpointCredit[];
      toc: TableOfContentEntry[];
    })[];
    createdAt: string;
    updatedBy?: EndpointRecorderPreview;
    parentPages: EndpointSource[];
  };
  
  export type EndpointCollectiblePreview = {
    id: string;
    slug: string;
    thumbnail?: EndpointPayloadImage;
    translations: {
      language: string;
      pretitle?: string;
      title: string;
      subtitle?: string;
    }[];
    attributes: EndpointAttribute[];
    releaseDate?: string;
    languages: string[];
    price?: {
      amount: number;
      currency: string;
    };
  };
  
  export type EndpointCollectible = Omit<EndpointCollectiblePreview, "translations"> & {
    translations: (EndpointCollectiblePreview["translations"][number] & {
      description?: RichTextContent;
    })[];
    backgroundImage?: EndpointPayloadImage;
    nature: CollectibleNature;
    gallery?: { count: number; thumbnail: EndpointPayloadImage };
    scans?: { count: number; thumbnail: EndpointPayloadImage };
    urls: { url: string; label: string }[];
    size?: {
      width: number;
      height: number;
      thickness?: number;
    };
    weight?: number;
    pageInfo?: {
      pageCount: number;
      bindingType?: CollectibleBindingTypes;
      pageOrder?: CollectiblePageOrders;
    };
    subitems: EndpointCollectiblePreview[];
    files: EndpointFilePreview[];
    contents: {
      content:
        | {
            relationTo: Collections.Pages;
            value: EndpointPagePreview;
          }
        | {
            relationTo: Collections.Audios;
            value: EndpointAudioPreview;
          }
        | {
            relationTo: Collections.Videos;
            value: EndpointVideoPreview;
          }
        | {
            relationTo: Collections.GenericContents;
            value: {
              translations: {
                language: string;
                name: string;
              }[];
            };
          };
  
      range?:
        | {
            type: "pageRange";
            start: number;
            end: number;
          }
        | {
            type: "timeRange";
            start: string;
            end: string;
          }
        | {
            type: "other";
            translations: {
              language: string;
              note: RichTextContent;
            }[];
          };
    }[];
    createdAt: string;
    updatedAt: string;
    updatedBy?: EndpointRecorderPreview;
    parentPages: EndpointSource[];
  };
  
  export type EndpointCollectibleScans = {
    slug: string;
    thumbnail?: EndpointPayloadImage;
    translations: {
      language: string;
      pretitle?: string;
      title: string;
      subtitle?: string;
      description?: RichTextContent;
    }[];
    credits: EndpointCredit[];
    cover?: {
      front?: EndpointScanImage;
      spine?: EndpointScanImage;
      back?: EndpointScanImage;
      insideFront?: EndpointScanImage;
      insideBack?: EndpointScanImage;
      flapFront?: EndpointScanImage;
      flapBack?: EndpointScanImage;
      insideFlapFront?: EndpointScanImage;
      insideFlapBack?: EndpointScanImage;
    };
    dustjacket?: {
      front?: EndpointScanImage;
      spine?: EndpointScanImage;
      back?: EndpointScanImage;
      insideFront?: EndpointScanImage;
      insideSpine?: EndpointScanImage;
      insideBack?: EndpointScanImage;
      flapFront?: EndpointScanImage;
      flapBack?: EndpointScanImage;
      insideFlapFront?: EndpointScanImage;
      insideFlapBack?: EndpointScanImage;
    };
    obi?: {
      front?: EndpointScanImage;
      spine?: EndpointScanImage;
      back?: EndpointScanImage;
      insideFront?: EndpointScanImage;
      insideSpine?: EndpointScanImage;
      insideBack?: EndpointScanImage;
      flapFront?: EndpointScanImage;
      flapBack?: EndpointScanImage;
      insideFlapFront?: EndpointScanImage;
      insideFlapBack?: EndpointScanImage;
    };
    pages: EndpointScanImage[];
    parentPages: EndpointSource[];
  };
  
  export type EndpointCollectibleGallery = {
    slug: string;
    thumbnail?: EndpointPayloadImage;
    translations: {
      language: string;
      pretitle?: string;
      title: string;
      subtitle?: string;
      description?: RichTextContent;
    }[];
    images: EndpointPayloadImage[];
    parentPages: EndpointSource[];
  };
  
  export type EndpointCollectibleGalleryImage = {
    slug: string;
    translations: {
      language: string;
      pretitle?: string;
      title: string;
      subtitle?: string;
      description?: RichTextContent;
    }[];
    image: EndpointImage;
    previousIndex?: string;
    nextIndex?: string;
    parentPages: EndpointSource[];
  };
  
  export type EndpointCollectibleScanPage = {
    slug: string;
    translations: {
      language: string;
      pretitle?: string;
      title: string;
      subtitle?: string;
      description?: RichTextContent;
    }[];
    image: EndpointScanImage;
    previousIndex?: string;
    nextIndex?: string;
    parentPages: EndpointSource[];
  };
  
  export type EndpointScanImage = PayloadImage & {
    index: string;
    sizes: PayloadImage[];
  };
  
  export type TableOfContentEntry = {
    prefix: string;
    title: string;
    type: "sceneBreak" | "break" | "section";
    index: number;
    children: TableOfContentEntry[];
  };
  
  export type EndpointChronologyEvent = {
    id: string;
    date: {
      year: number;
      month?: number;
      day?: number;
    };
    events: {
      sources: EndpointSource[];
      translations: {
        language: string;
        sourceLanguage: string;
        title?: string;
        description?: RichTextContent;
        notes?: RichTextContent;
        credits: EndpointCredit[];
      }[];
    }[];
  };
  
  export type EndpointSourcePreview = {
    id: string;
    slug: string;
    translations: { language: string; pretitle?: string; title: string; subtitle?: string }[];
  };
  
  export type EndpointSource =
    | { type: "url"; url: string; label: string }
    | {
        type: "collectible";
        collectible: EndpointSourcePreview;
        range?:
          | { type: "page"; page: number }
          | { type: "timestamp"; timestamp: string }
          | { type: "custom"; translations: { language: string; note: string }[] };
      }
    | { type: "page"; page: EndpointSourcePreview }
    | { type: "folder"; folder: EndpointSourcePreview }
    | { type: "scans"; collectible: EndpointSourcePreview }
    | { type: "gallery"; collectible: EndpointSourcePreview };
  
  export type EndpointMediaPreview = {
    id: string;
    url: string;
    filename: string;
    mimeType: string;
    attributes: EndpointAttribute[];
    translations: {
      language: string;
      pretitle?: string;
      title: string;
      subtitle?: string;
    }[];
  };
  
  export type EndpointMedia = Omit<EndpointMediaPreview, "translations"> & {
    filesize: number;
    updatedAt: string;
    createdAt: string;
    translations: (EndpointMediaPreview["translations"][number] & {
      description?: RichTextContent;
    })[];
    credits: EndpointCredit[];
  };
  
  export type EndpointImagePreview = EndpointMediaPreview & {
    width: number;
    height: number;
    sizes: PayloadImage[];
    openGraph?: PayloadImage;
  };
  
  export type EndpointImage = EndpointMedia & {
    width: number;
    height: number;
    sizes: PayloadImage[];
    openGraph?: PayloadImage;
  };
  
  export type EndpointAudioPreview = EndpointMediaPreview & {
    thumbnail?: EndpointPayloadImage;
    duration: number;
  };
  
  export type EndpointAudio = EndpointMedia & {
    thumbnail?: EndpointPayloadImage;
    duration: number;
  };
  
  export type EndpointVideoPreview = EndpointMediaPreview & {
    thumbnail?: EndpointPayloadImage;
    subtitles: {
      language: string;
      url: string;
    }[];
    duration: number;
  };
  
  export type EndpointVideo = EndpointMedia & {
    thumbnail?: EndpointPayloadImage;
    subtitles: {
      language: string;
      url: string;
    }[];
    platform?: {
      channel: {
        url: string;
        title: string;
        subscribers: number;
      };
      views?: number;
      likes?: number;
      dislikes?: number;
      url: string;
      publishedDate: string;
    };
    duration: number;
  };
  
  export type EndpointFilePreview = EndpointMediaPreview & {
    filesize: number;
    thumbnail?: EndpointPayloadImage;
  };
  
  export type EndpointFile = EndpointMedia & {
    filesize: number;
    thumbnail?: EndpointPayloadImage;
  };
  
  export type EndpointPayloadImage = PayloadImage & {
    sizes: PayloadImage[];
    openGraph?: PayloadImage;
  };
  
  export type PayloadMedia = {
    id: string;
    url: string;
    mimeType: string;
    filename: string;
    filesize: number;
  };
  
  export type PayloadImage = PayloadMedia & {
    width: number;
    height: number;
  };
  
  export type EndpointAllSDKUrls = {
    urls: string[];
  };
  
  export type EndpointAllIds = {
    collectibles: { slugs: string[] };
    pages: { slugs: string[] };
    folders: { slugs: string[] };
    videos: { ids: string[] };
    audios: { ids: string[] };
    images: { ids: string[] };
    files: { ids: string[] };
    recorders: { ids: string[] };
    chronologyEvents: { ids: string[] };
  };
  