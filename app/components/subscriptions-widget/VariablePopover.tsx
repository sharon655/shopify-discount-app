import { ActionList, Button, Popover } from "@shopify/polaris";
import { useState } from "react";

function VariablePopover({
  variables,
  onInsert,
  buttonText = "Add Variable",
}: {
  variables: string[];
  onInsert: (v: string) => void;
  buttonText?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      active={open}
      activator={
        <Button
          variant="plain"
          size="medium"
          onClick={() => setOpen((o) => !o)}
        >
          {buttonText}
        </Button>
      }
      onClose={() => setOpen(false)}
    >
      <ActionList
        items={variables.map((v) => ({
          content: v,
          onAction: () => {
            onInsert(v);
            setOpen(false);
          },
        }))}
      />
    </Popover>
  );
}

export default VariablePopover;