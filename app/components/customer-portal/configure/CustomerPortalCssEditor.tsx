import { useEffect, useRef, useState } from "react";

// Lazy load Monaco Editor to avoid SSR issues
const CustomerPortalCssEditor = ({
  value,
  onChange,
  name = "customerPortalCustomCss",
}: {
  value: string;
  onChange: (val: string) => void;
  name?: string;
}) => {
  const [EditorComponent, setEditorComponent] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // Only load on client side
  useEffect(() => {
    setIsClient(true);

    // Dynamic import to avoid SSR
    const loadEditor = async () => {
      try {
        const { default: Editor } = await import("@monaco-editor/react");
        setEditorComponent(() => Editor);
      } catch (error) {
        console.warn("Monaco Editor failed to load, using fallback");
      }
    };

    loadEditor();
  }, []);

  // ensure the native textarea starts with the same defaultValue
  useEffect(() => {
    if (taRef.current) {
      taRef.current.defaultValue = value ?? "";
      taRef.current.value = value ?? "";
    }
  }, []); // run once on mount

  // helper to sync DOM textarea and notify native listeners
  const syncNativeTextarea = (v: string) => {
    const ta = taRef.current;
    if (!ta) return;
    ta.value = v;
    // dispatch native events so libraries that listen for 'input'/'change' react
    ta.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
    ta.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
  };

  const handleEditorChange = (v?: string) => {
    const val = v ?? "";
    onChange(val);            // keep React state in sync
    syncNativeTextarea(val);  // notify native form listeners (Polaris SaveBar)
  };

  // Don't render anything on server
  if (!isClient) {
    return (
      <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Loading CSS Editor...</div>
      </div>
    );
  }

  // Fallback if Monaco fails to load
  if (!EditorComponent) {
    return (
      <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Failed to load CSS Editor. Please refresh the page.</div>
      </div>
    );
  }

  // Render Monaco Editor
  return (
    <div>
      <EditorComponent
        height="700px"
        defaultLanguage="css"
        value={value}
        theme="light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          padding: { top: 5, bottom: 15 },
        }}
        onChange={handleEditorChange}
      />
      <textarea
        ref={taRef}
        name={name}
        defaultValue={value}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          border: 0,
          padding: 0,
          margin: 0,
        }}
      />
    </div>
  );
};

export default CustomerPortalCssEditor;