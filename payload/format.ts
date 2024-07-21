import { isBlockLineBlock, isBlockCueBlock } from "./blocks";
import { BreakBlockType } from "./constants";
import {
  type RichTextListNode,
  type RichTextBlockNode,
  isBlockNodeSectionBlock,
  isBlockNodeTranscriptBlock,
  isBlockNodeBreakBlock,
  type RichTextNode,
  isNodeParagraphNode,
  isNodeListNode,
  isNodeTextNode,
  isNodeLinkNode,
  isNodeBlockNode,
  isNodeTabNode,
  type RichTextContent,
} from "./rich-text";

const formatList = (node: RichTextListNode) => {
  return node.children.map(formatNode).join("\n");
};

const formatBlock = (node: RichTextBlockNode) => {
  if (isBlockNodeSectionBlock(node)) {
    return `\n\n${node.fields.blockName}\n` + formatRichTextContentToString(node.fields.content);
  } else if (isBlockNodeTranscriptBlock(node)) {
    return node.fields.lines
      .map((block) => {
        if (isBlockLineBlock(block)) {
          return `${block.blockName} | ${formatRichTextContentToString(block.content)}`;
        } else if (isBlockCueBlock(block)) {
          return formatRichTextContentToString(block.content);
        }
        return "";
      })
      .join("");
  } else if (isBlockNodeBreakBlock(node)) {
    switch (node.fields.type) {
      case BreakBlockType.space:
        return "\n\n\n\n\n";
      case BreakBlockType.dottedLine:
        return "\n\n\n--------------------\n\n\n";
      case BreakBlockType.solidLine:
        return "\n\n\n____________________\n\n\n";
      case BreakBlockType.sceneBreak:
        return "\n\n\n     * * *      \n\n\n";
    }
  }
  return "";
};

const formatNode = (node: RichTextNode): string => {
  if (isNodeParagraphNode(node)) {
    return node.children.map(formatNode).join("");
  } else if (isNodeListNode(node)) {
    return formatList(node);
  } else if (isNodeTextNode(node)) {
    return node.text;
  } else if (isNodeLinkNode(node)) {
    return node.children.map(formatNode).join("");
  } else if (isNodeBlockNode(node)) {
    return formatBlock(node);
  } else if (isNodeTabNode(node)) {
    return "\t";
  }
  return "";
};

export const formatRichTextContentToString = (content: RichTextContent): string =>
  content.root.children.map(formatNode).join("\n\n");

export const formatInlineTitle = ({
  pretitle,
  title,
  subtitle,
}: {
  pretitle?: string | undefined;
  title: string;
  subtitle?: string | undefined;
}): string => {
  let result = "";
  if (pretitle) {
    result += `${pretitle}: `;
  }
  result += title;
  if (subtitle) {
    result += ` — ${subtitle}`;
  }
  return result;
};
