import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import { useTranslation } from "@repo/ui/i18n";
import { CodeHighlightNode, CodeNode, registerCodeHighlighting } from "@lexical/code";
import { AutoLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@lexical/list";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import {
  HorizontalRuleNode,
  INSERT_HORIZONTAL_RULE_COMMAND,
} from "@lexical/react/LexicalHorizontalRuleNode";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingNode,
  type HeadingTagType,
  QuoteNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent } from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  type EditorState,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  Bold,
  Check,
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Sparkles,
  Strikethrough,
  Undo,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ProjectBriefEditorProps {
  description?: string | null;
  onSave: (content: string) => void;
}

const theme = {
  paragraph: "mb-3 leading-relaxed text-muted-foreground last:mb-0",
  heading: {
    h1: "text-2xl font-bold tracking-tight text-foreground mt-4 mb-2 first:mt-0",
    h2: "text-xl font-semibold tracking-tight text-foreground mt-3 mb-2 first:mt-0",
    h3: "text-base font-semibold text-foreground mt-2 mb-1 first:mt-0",
  },
  list: {
    ul: "list-disc ml-5 mb-3 space-y-1 text-muted-foreground",
    ol: "list-decimal ml-5 mb-3 space-y-1 text-muted-foreground",
    listitem: "leading-relaxed",
    checklist: "list-none ml-0 mb-3 space-y-1.5",
    listitemChecked: "line-through text-muted-foreground/60 select-none",
    listitemUnchecked: "text-foreground select-none",
  },
  quote: "border-l-2 border-primary/60 pl-4 italic text-muted-foreground my-3",
  code: "bg-muted/70 rounded-md p-3 font-mono text-xs text-foreground block overflow-x-auto my-3",
  codeHighlight: {
    atrule: "text-blue-500",
    attr: "text-amber-500",
    boolean: "text-purple-500",
    builtin: "text-cyan-500",
    cdata: "text-muted-foreground",
    char: "text-green-500",
    class: "text-yellow-500",
    comment: "text-muted-foreground italic",
    constant: "text-purple-500",
    deleted: "text-red-500",
    doctype: "text-muted-foreground",
    entity: "text-amber-500",
    function: "text-blue-500",
    important: "text-red-500 font-bold",
    inserted: "text-green-500",
    keyword: "text-purple-500 font-semibold",
    number: "text-orange-500",
    operator: "text-muted-foreground",
    prolog: "text-muted-foreground",
    property: "text-cyan-500",
    punctuation: "text-muted-foreground",
    regex: "text-red-500",
    selector: "text-green-500",
    string: "text-emerald-500",
    symbol: "text-purple-500",
    tag: "text-red-500",
    url: "text-blue-500 underline",
    variable: "text-amber-500",
  },
  text: {
    bold: "font-bold text-foreground",
    italic: "italic",
    strikethrough: "line-through text-muted-foreground",
    underline: "underline underline-offset-4",
    code: "font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground",
  },
  link: "text-primary underline underline-offset-4 cursor-pointer hover:opacity-80",
};

export function ProjectBriefEditor({ description, onSave }: ProjectBriefEditorProps) {
  const { t } = useTranslation();
  const [isDirty, setIsDirty] = useState(false);
  const [currentMarkdown, setCurrentMarkdown] = useState(description || "");

  const initialConfig = {
    namespace: "ProjectBriefEditor",
    theme,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
      HorizontalRuleNode,
    ],
    editorState: () => {
      $convertFromMarkdownString(description || t("project.overview.noBrief"), TRANSFORMERS);
    },
    onError: (error: Error) => {
      console.error(error);
    },
  };

  const handleSave = () => {
    onSave(currentMarkdown);
    setIsDirty(false);
    toast.success(t("project.editor.saved"));
  };

  return (
    <div className="group/notion-editor relative space-y-3">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/30 pb-2">
          <ToolbarPlugin />

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 font-mono text-[10px]">
              <Sparkles className="size-3 text-primary" />
              Lexical
            </Badge>
            {isDirty ? (
              <Button type="button" size="xs" onClick={handleSave} className="gap-1.5">
                <Check className="size-3" />
                {t("project.editor.save")}
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground opacity-60">
                {t("project.editor.saved")}
              </span>
            )}
          </div>
        </div>

        <div className="relative min-h-[140px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[140px] leading-relaxed text-foreground"
                aria-label={t("project.editor.label")}
              />
            }
            placeholder={
              <div className="pointer-events-none absolute top-0 left-0 text-sm text-muted-foreground/50">
                {t("project.editor.placeholder")}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <CodeHighlightPlugin />
          <OnChangePlugin
            onChange={(editorState: EditorState) => {
              editorState.read(() => {
                const markdown = $convertToMarkdownString(TRANSFORMERS);
                setCurrentMarkdown(markdown);
                setIsDirty(true);
              });
            }}
          />
        </div>
      </LexicalComposer>
    </div>
  );
}

function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);
  return null;
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      const node = selection.anchor.getNode();
      const parent = node.getParent();
      setIsLink(parent instanceof LinkNode || node instanceof LinkNode);

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const p = e.getParent();
              return p !== null && p.getKey() === "root";
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      if ($isHeadingNode(element)) {
        setBlockType(element.getTag());
      } else if ($isListNode(element)) {
        const parentList = $findMatchingParent(anchorNode, $isListNode);
        const listType = parentList ? parentList.getListType() : element.getListType();
        setBlockType(listType);
      } else {
        setBlockType(element.getType());
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  useEffect(() => {
    const unregisterUndo = editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload);
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
    const unregisterRedo = editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload);
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
    return () => {
      unregisterUndo();
      unregisterRedo();
    };
  }, [editor]);

  const formatHeading = (headingTag: HeadingTagType) => {
    if (blockType !== headingTag) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingTag));
        }
      });
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const insertLink = useCallback(() => {
    if (!isLink) {
      const url = prompt("Enter URL", "https://");
      if (!url) return;
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div className="flex flex-wrap items-center gap-1">
      <ToolbarBtn
        onClick={() => formatHeading("h1")}
        active={blockType === "h1"}
        icon={Heading1}
        label="H1"
      />
      <ToolbarBtn
        onClick={() => formatHeading("h2")}
        active={blockType === "h2"}
        icon={Heading2}
        label="H2"
      />
      <ToolbarBtn
        onClick={() => formatHeading("h3")}
        active={blockType === "h3"}
        icon={Heading3}
        label="H3"
      />
      <div className="mx-1 h-4 w-px bg-border/50" />
      <ToolbarBtn
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        active={isBold}
        icon={Bold}
        label="Bold"
      />
      <ToolbarBtn
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        active={isItalic}
        icon={Italic}
        label="Italic"
      />
      <ToolbarBtn
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
        active={isStrikethrough}
        icon={Strikethrough}
        label="Strike"
      />
      <ToolbarBtn
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
        active={isCode}
        icon={Code}
        label="Code"
      />
      <div className="mx-1 h-4 w-px bg-border/50" />
      <ToolbarBtn
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        active={blockType === "bullet"}
        icon={List}
        label="Bullets"
      />
      <ToolbarBtn
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        active={blockType === "number"}
        icon={ListOrdered}
        label="1."
      />
      <ToolbarBtn
        onClick={() => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)}
        active={blockType === "check"}
        icon={CheckSquare}
        label="Tasks"
      />
      <ToolbarBtn onClick={formatQuote} active={blockType === "quote"} icon={Quote} label="Quote" />
      <ToolbarBtn
        onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}
        icon={Minus}
        label="Rule"
      />
      <ToolbarBtn onClick={insertLink} active={isLink} icon={Link2} label="Link" />
      <div className="mx-1 h-4 w-px bg-border/50" />
      <ToolbarBtn
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        disabled={!canUndo}
        icon={Undo}
        label="Undo"
      />
      <ToolbarBtn
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        disabled={!canRedo}
        icon={Redo}
        label="Redo"
      />
    </div>
  );
}

function ToolbarBtn({
  icon: Icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`inline-flex size-7 items-center justify-center rounded-md text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      } disabled:pointer-events-none disabled:opacity-30`}
    >
      <Icon className="size-3.5" />
    </button>
  );
}
