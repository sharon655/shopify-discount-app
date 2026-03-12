import {
  BlockStack,
  Box,
  Card,
  Collapsible,
  Icon,
  InlineStack,
  Text,
} from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";

export default function Accordion({
  title,
  open,
  onToggle,
  children,
  hasTopSpacing = true,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  hasTopSpacing?: boolean;
}) {
  return (
    <Box paddingBlockEnd="200">
      {hasTopSpacing && <div style={{ height: "10px" }} />}
      <Box background="bg-surface-secondary" borderRadius="200">
        <Card>
          <div
            style={{
              cursor: "default",
              userSelect: "none",
              paddingTop: "4px",
              paddingBottom: "4px",
            }}
            onClick={onToggle}
          >
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h3" variant="headingMd">
                {title}
              </Text>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  transform: "scale(1.5)",
                  marginRight: "6px",
                }}
              >
                <Icon
                  source={open ? ChevronUpIcon : ChevronDownIcon}
                  tone="base"
                />
              </div>
              {/* <Button
                accessibilityLabel={open ? "Collapse" : "Expand"}
                variant="tertiary"
                icon={open ? ChevronUpIcon : ChevronDownIcon}
                size="large"
              /> */}
            </InlineStack>
          </div>
          <Collapsible
            open={open}
            id={`${title.replace(/\s+/g, "-").toLowerCase()}-collapse`}
            transition={{ duration: "300ms", timingFunction: "ease-in-out" }}
          >
            <Box>
              <BlockStack gap="300">{children}</BlockStack>
            </Box>
          </Collapsible>
        </Card>
      </Box>
    </Box>
  );
}
