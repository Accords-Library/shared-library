import type { RichTextContent } from "./rich-text";

export interface TranscriptBlock extends GenericBlock {
  lines: (LineBlock | CueBlock)[];
  blockType: "transcriptBlock";
}

export interface BreakBlock extends GenericBlock {
  type: "Scene break" | "Empty space" | "Solid line" | "Dotted line";
  blockType: "breakBlock";
}

export interface SectionBlock extends GenericBlock {
  content: RichTextContent;
  blockType: "sectionBlock";
}

export interface CueBlock extends GenericBlock {
  content: RichTextContent;
  blockType: "cueBlock";
}

export interface LineBlock extends GenericBlock {
  content: RichTextContent;
  blockType: "lineBlock";
}

export interface GenericBlock {
  id?: string | null;
  blockName?: string | null;
  blockType: string;
}

export const isBlockTranscriptBlock = (block: GenericBlock): block is TranscriptBlock =>
  block.blockType === "transcriptBlock";

export const isBlockBreakBlock = (block: GenericBlock): block is BreakBlock =>
  block.blockType === "breakBlock";

export const isBlockSectionBlock = (block: GenericBlock): block is SectionBlock =>
  block.blockType === "sectionBlock";

export const isBlockCueBlock = (block: GenericBlock): block is CueBlock =>
  block.blockType === "cueBlock";

export const isBlockLineBlock = (block: GenericBlock): block is LineBlock =>
  block.blockType === "lineBlock";
