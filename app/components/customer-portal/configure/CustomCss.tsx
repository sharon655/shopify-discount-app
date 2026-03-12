import { Box, Spinner, InlineStack } from "@shopify/polaris";
import { useEffect, useState } from "react";
import CustomerPortalCssEditor from "./CustomerPortalCssEditor";
// import "./customer-portal-editor.css";

function CustomCss({ data, onChange }: any) {
  // Get the CSS value from data, defaulting to an empty string
  const cssValue = data?.customerPortalCustomCss || "";
  const [editorKey, setEditorKey] = useState<number>(1);
  const [isEditorLoading, setIsEditorLoading] = useState(true);

  // This effect ensures the editor reloads if it doesn't appear correctly
  useEffect(() => {
    // Force a re-render of the editor after a short delay to ensure it loads properly
    const timer = setTimeout(() => {
      setEditorKey((prev) => prev + 1);
      setIsEditorLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleCssChange = (value: string) => {
    // Update the form data with the new CSS value
    onChange({
      ...data,
      customerPortalCustomCss: value,
    });
  };

  return (
    <Box>
      <div
        className="customer-portal-css-editor"
        style={{
          border: "1px solid #dfe3e8",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#fafbfc",
        }}
      >
        {isEditorLoading ? (
          <Box padding="400">
            <InlineStack align="center">
              <Spinner accessibilityLabel="Loading CSS editor" size="large" />
            </InlineStack>
          </Box>
        ) : (
          <CustomerPortalCssEditor
            key={editorKey}
            value={cssValue}
            onChange={handleCssChange}
            name="customerPortalCustomCss"
          />
        )}
      </div>

      <div style={{ height: "20px" }} />
    </Box>
  );
}

export default CustomCss;
