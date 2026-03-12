export default function OptionRow({
  checked,
  onChange,
  primary,
  right,
  helpText,
  customizationData,
  currencySymbol = '$',
}: {
  checked: boolean;
  onChange: () => void;
  primary: React.ReactNode;
  right?: {
    originalPrice?: number | string;
    discountedPrice?: number | string;
    normalPrice?: number | string;
  };
  helpText?: string;
  customizationData?: any;
  currencySymbol?: string;
}) {
  return (
    <div className="rounded-md py-2">
      <label className="flex items-center justify-between w-full cursor-pointer">
        {/* LEFT SIDE */}
        <div className="flex items-start space-x-3">
          <input
            type="radio"
            name="purchase-option"
            checked={checked}
            onChange={onChange}
            className="mt-[2px] h-4 w-4"
            style={{
              accentColor: customizationData?.radioButtonColor || 'black',
            }}
          />
          <div className="flex flex-col">
            {/* Label */}
            <span
              className="text-sm font-medium"
              style={{
                color: customizationData?.textColor || 'black',
              }}
            >
              {primary}
            </span>

            {/* Help text */}
            {helpText && (
              <span className="text-xs mt-0.5 text-gray-500 truncate">
                {helpText}
              </span>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        {right && (
          <div className="ml-4 flex flex-col items-end">
            {right.originalPrice && (
              <span
                className="text-sm line-through"
                style={{
                  color: customizationData?.comparePriceColor || 'rgb(107 114 128)',
                }}
              >
                {currencySymbol}{right.originalPrice}
              </span>
            )}
            {right.discountedPrice ? (
              <span
                className="text-sm font-semibold"
                style={{
                  color: customizationData?.priceTextColor || 'black',
                }}
              >
                {currencySymbol}{right.discountedPrice}
              </span>
            ) : (
              right.normalPrice && (
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: customizationData?.priceTextColor || 'black',
                  }}
                >
                  {right.normalPrice}
                </span>
              )
            )}
          </div>
        )}
      </label>
    </div>
  );
}



// import { Box, InlineStack, RadioButton } from "@shopify/polaris";

// export default function OptionRow({
//   checked,
//   onChange,
//   primary,
//   right,
//   helpText,
// }: {
//   checked: boolean;
//   onChange: () => void;
//   primary: React.ReactNode;
//   right?: React.ReactNode;
//   helpText?: string;
// }) {
//   return (
//     <Box borderRadius="200" paddingBlockEnd={"200"}>
//       <InlineStack align="space-between" blockAlign="center">
//         <RadioButton
//           label={primary}
//           checked={checked}
//           id={String(primary)}
//           name="purchase-option"
//           onChange={onChange}
//           helpText={helpText}
//         />
//         {right}
//       </InlineStack>
//     </Box>
//   );
// }
