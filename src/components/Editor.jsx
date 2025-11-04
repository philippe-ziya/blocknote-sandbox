import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

/**
 * Editor Component
 *
 * This wraps the BlockNote editor functionality.
 * It handles the editor instance creation and renders the editor view.
 *
 * Props:
 * - onChange: Callback function that gets called when editor content changes
 * - initialContent: Optional initial content to load into the editor
 */
export default function Editor({ onChange, initialContent }) {
  // Create the BlockNote editor instance
  // This hook manages the editor's lifecycle and configuration
  const editor = useCreateBlockNote({
    initialContent: initialContent,
  });

  // Render the BlockNote editor view
  // The onChange callback passes the editor instance back to the parent
  return (
    <BlockNoteView
      editor={editor}
      onChange={() => onChange?.(editor)}
    />
  );
}
