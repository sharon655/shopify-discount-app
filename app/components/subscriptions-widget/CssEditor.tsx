import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect, useRef } from "react";

const CssEditor = ({
  value,
  onChange,
  name = "customCss",
}: {
  value: string;
  onChange: (val: string) => void;
  name?: string;
}) => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme("vs-light"); // or "vs-dark"
    }
  }, [monaco]);

   const taRef = useRef<HTMLTextAreaElement | null>(null);

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

  return (
    <div style={{ height: "700px" }}>
      <Editor
        height="100%"
        defaultLanguage="css"
        value={value}
        theme="light" // you can switch to "vs-dark" if needed
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: true,
          wordWrap: "on",
          automaticLayout: true,
        }}
        // onChange={(val) => onChange(val || "")}
        onChange={handleEditorChange}
      />
       <textarea
        ref={taRef}
        name={name}
        defaultValue={value}
        aria-hidden="true"
        // off-screen but still accessible to form scanning
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

export default CssEditor;


// import { useState } from "react";
// import Editor from "@monaco-editor/react";

// const CssEditor = () => {
//   const [code, setCode] = useState("");

//   return (
//     <div style={{ height: "700px"}}>
//       <Editor
//         height="100%"
//         defaultLanguage="css"
//         value={code}
//         // theme="vs-dark" // you can use "light" | "vs-dark" | "hc-black" or custom themes
//         theme="light" // you can use "light" | "vs-dark" | "hc-black" or custom themes
//         options={{
//           minimap: { enabled: true }, // ✅ shows the VS Code-style minimap
//           fontSize: 14,
//           lineNumbers: "on",
//           scrollBeyondLastLine: false,
//           wordWrap: "on",
//           automaticLayout: true,
//         }}
//         onChange={(value) => setCode(value || "")}
//       />
//     </div>
//   );
// };

// export default CssEditor;