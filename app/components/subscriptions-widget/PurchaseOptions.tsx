import OptionRow from "./OptionRow";
import { InfoIcon } from "@shopify/polaris-icons";
import { Popover } from "@shopify/polaris";
import { useCallback, useMemo } from "react";
import { data } from "../../utils/subscriptions-widget/data";

function SelectDropdown({
  label,
  frequency,
  setFrequency,
  frequencyOptions,
}: any) {
  return (
    <div className="pl-7">
      <label className="block text-[12px] font-medium mb-1">{label}</label>
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="mt-1 block w-full rounded-md py-2 px-3 border"
      >
        {frequencyOptions.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatLabel(template: string, values: Record<string, any>, currencySymbol: string = '$') {
  if (!template) return "";

  // If the template has an unclosed/malformed placeholder, return empty
  const openBraces = (template.match(/\{\{/g) || []).length;
  const closeBraces = (template.match(/\}\}/g) || []).length;
  if (openBraces !== closeBraces) {
    return ""; // malformed -> hide it
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    let value = values[key];
    if (value == null) return "";

    // Auto-add currency symbol for price-like keys
    if (
      [
        "price",
        "discountedPrice",
        "originalPrice",
        "sellingPlanPrice",
      ].includes(key)
    ) {
      return `${currencySymbol}${value}`;
    }

    // Auto-add % for discount percentage
    if (["selectedDiscountPercentage", "discount"].includes(key)) {
      return `${value}%`;
    }

    return String(value);
  });
}
const { defaultLabels } = data;

const PurchaseOptions = ({
  productPreview,
  settingsData,
  labelsData,
  customizationData,
  infoActive,
  setInfoActive,
  frequency,
  setFrequency,
  frequencyOptions,
  purchase,
  setPurchase,
  sellingPlanVariants = [],
  currentVariant = null,
  customerTags = [],
  showPrepaidPlanSeparately = false,
  currencySymbol = '$',
}: {
  productPreview: any;
  settingsData: any;
  labelsData: any;
  customizationData: any;
  infoActive: any;
  setInfoActive: any;
  purchase: any;
  frequency: any;
  setFrequency: any;
  frequencyOptions: any;
  setPurchase: any;
  sellingPlanVariants?: any[];
  currentVariant?: any;
  customerTags?: string[];
  showPrepaidPlanSeparately?: boolean;
  currencySymbol?: string;
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleInfo = useCallback(() => setInfoActive((s: boolean) => !s), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const closeInfo = useCallback(() => setInfoActive(false), []);

  const calculateDiscountedPrice = (basePrice: number, discount: number) => {
    return (basePrice - basePrice * (discount / 100)).toFixed(2);
  };

  // merge labels with defaults (keeps performance good with memo)
  const labels = useMemo(
    () => ({ ...defaultLabels, ...labelsData }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labelsData]
  );

  // Check for free products and loyalty features
  const hasFreeProduct = useMemo(() => {
    return sellingPlanVariants.some((variant: any) => variant.isFreeTrial);
  }, [sellingPlanVariants]);

  const hasLoyaltyDiscount = useMemo(() => {
    return customerTags.some((tag: string) =>
      tag.includes('loyalty') || tag.includes('vip') || tag.includes('member')
    );
  }, [customerTags]);

  const infoContent = (
    <div
      className="max-w-[300px] rounded-md p-2 font-sans shadow-md text-sm leading-5"
      style={{
        backgroundColor: customizationData?.tooltipBackgroundColor || "black",
        color: customizationData?.tooltipTextColor || "white",
      }}
      dangerouslySetInnerHTML={{
        __html: labels?.defaultTooltipDescription || "",
      }}
    />
  );

  // Enhanced price display with free product and loyalty indicators
  const renderEnhancedPriceDisplay = () => {
    const basePrice = productPreview.options.find((o: any) => o.id === "oneTime")?.price || 0;
    const selectedFreq = frequencyOptions.find((f: any) => f.value === frequency);
    const discount = selectedFreq?.discount || 0;
    const discountedPrice = calculateDiscountedPrice(basePrice, discount);

    return (
      <div className="pt-4">
        {purchase === "subscribe" ? (
          <div className="flex items-center space-x-2">
            {/* Discounted price */}
            <span className="text-lg font-semibold text-black">
              {currencySymbol}{discountedPrice}
            </span>

            {/* Free product indicator */}
            {hasFreeProduct && (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                FREE GIFT INCLUDED
              </span>
            )}

            {/* Loyalty discount indicator */}
            {hasLoyaltyDiscount && (
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                LOYALTY DISCOUNT
              </span>
            )}

            {/* Discount badge - conditionally shown */}
            {!customizationData?.hideDiscountBadge && discount > 0 && (
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                {discount}% OFF
              </span>
            )}

            {/* Original price (strikethrough) */}
            <span className="text-sm text-gray-500 line-through">
              {currencySymbol}{basePrice}
            </span>
          </div>
        ) : (
          <div className="text-lg font-semibold text-black">
            {currencySymbol}{basePrice}
          </div>
        )}
      </div>
    );
  };

  function renderOptions() {
    switch (settingsData?.widgetStyle) {
      case "classic":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: customizationData?.optionSpacing
                ? `${customizationData.optionSpacing}px`
                : "12px",
            }}
            role="radiogroup"
            aria-label="Purchase options"
          >
            {productPreview.options.map((opt: any) => (
              <div
                key={opt.id}
                className="rounded-lg border p-2"
                style={{
                  ...(customizationData?.borderWidth && {
                    borderWidth: `${customizationData.borderWidth}px`,
                  }),
                  ...(customizationData?.borderRadius && {
                    borderRadius: `${customizationData.borderRadius}px`,
                  }),
                  ...(purchase === opt.id &&
                    customizationData?.widgetBackgroundColor && {
                      backgroundColor: customizationData.widgetBackgroundColor,
                    }),
                }}
              >
                <OptionRow
                  checked={purchase === opt.id}
                  onChange={() =>
                    setPurchase(opt.id as "oneTime" | "subscribe")
                  }
                  primary={
                    opt.badge ? (
                      <div className="flex flex-col">
                        <span
                          style={{
                            fontSize: customizationData?.labelTextSize
                              ? `${customizationData.labelTextSize}px`
                              : "14px",
                            color:
                              purchase === opt.id &&
                              customizationData?.textColor
                                ? customizationData.textColor
                                : "black",
                          }}
                        >
                          {labels?.subscriptionPurchaseLabel}
                        </span>
                        {labels?.discountBadgeFormat &&
                          !customizationData?.hideDiscountBadge && (
                            <span
                              className="mt-1 inline-block rounded-full w-fit px-2.5 py-0.5 text-[11px] font-medium"
                              style={{
                                backgroundColor:
                                  customizationData?.discountBadgeColor ||
                                  "rgb(254 240 138)",
                                color:
                                  customizationData?.discountBadgeTextColor ||
                                  "rgb(31 41 55)",
                              }}
                            >
                              {formatLabel(
                                labels?.discountBadgeFormat ||
                                  "SAVE {{selectedDiscountPercentage}}%",
                                { selectedDiscountPercentage: frequency ? (frequencyOptions.find((f: any) => f.value === frequency)?.discount || 10).toString() : "10" },
                                currencySymbol
                              )}
                            </span>
                          )}
                      </div>
                    ) : (
                      <span
                        style={{
                          color:
                            purchase === opt.id && customizationData?.textColor
                              ? customizationData.textColor
                              : "black",
                        }}
                      >
                        {labels?.oneTimePurchaseLabel}
                      </span>
                    )
                  }
                  right={
                    opt.discountedPrice
                      ? {
                          originalPrice: opt.originalPrice,
                          discountedPrice: opt.discountedPrice,
                        }
                      : {
                          normalPrice: formatLabel(labels?.oneTimePriceFormat, {
                            price: opt.price,
                          }),
                        }
                  }
                  helpText={
                    (opt.id === "oneTime" && labels?.oneTimePurchaseSubtext) ||
                    (opt.id === "subscribe" &&
                      labels?.subscriptionPurchaseSubtext)
                  }
                  customizationData={customizationData}
                  currencySymbol={currencySymbol}
                />

                {/* Show frequency radios when subscribe is active or keepFrequencyVisible */}
                {((purchase === "subscribe" && opt.id === "subscribe") ||
                  (customizationData?.keepFrequencyVisible &&
                    opt.id === "subscribe")) && (
                  <div className="mt-1 pl-7">
                    <label className="block text-[12px] font-medium mb-1">
                      {labels?.deliveryFrequencyLabel}
                    </label>
                    <div className="space-y-2">
                      {frequencyOptions.map((freq: any) => (
                        <label
                          key={freq.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="delivery-frequency"
                            value={freq.value}
                            checked={frequency === freq.value}
                            onChange={() => setFrequency(freq.value)}
                            className="h-4 w-4 text-black"
                          />
                          <span className="text-xs">{freq.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "compact":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: customizationData?.optionSpacing
                ? `${customizationData.optionSpacing}px`
                : "0px",
            }}
            role="radiogroup"
            aria-label="Purchase options"
          >
            {productPreview.options.map((opt: any) => (
              <div
                key={opt.id}
                className="border p-2"
                style={{
                  ...(customizationData?.borderWidth && {
                    borderWidth: `${customizationData.borderWidth}px`,
                  }),
                  ...(customizationData?.borderRadius && {
                    borderRadius: `${customizationData.borderRadius}px`,
                  }),
                  ...(purchase === opt.id &&
                    customizationData?.widgetBackgroundColor && {
                      backgroundColor: customizationData.widgetBackgroundColor,
                    }),
                }}
              >
                <OptionRow
                  checked={purchase === opt.id}
                  onChange={() =>
                    setPurchase(opt.id as "oneTime" | "subscribe")
                  }
                  primary={
                    <div className="flex flex-col">
                      <span
                        style={{
                          fontSize:
                            opt.badge && customizationData?.labelTextSize
                              ? `${customizationData.labelTextSize}px`
                              : "14px",
                          color:
                            purchase === opt.id && customizationData?.textColor
                              ? customizationData.textColor
                              : "black",
                        }}
                      >
                        {opt.badge
                          ? labels?.subscriptionPurchaseLabel
                          : labels?.oneTimePurchaseLabel}
                      </span>
                      {opt.badge && !customizationData?.hideDiscountBadge && (
                        <span
                          className="mt-1 w-fit rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                          style={{
                            backgroundColor:
                              customizationData?.discountBadgeColor ||
                              "rgb(220 252 231)",
                            color:
                              customizationData?.discountBadgeTextColor ||
                              "rgb(22 101 52)",
                          }}
                        >
                          {formatLabel(labels?.discountBadgeFormat, {
                            selectedDiscountPercentage: frequency ? (frequencyOptions.find((f: any) => f.value === frequency)?.discount || 10).toString() : "10",
                          }, currencySymbol)}
                        </span>
                      )}
                    </div>
                  }
                  right={
                    opt.id === 'subscribe'
                      ? {
                          originalPrice: opt.originalPrice,
                          discountedPrice: frequency ? calculateDiscountedPrice(opt.originalPrice, frequencyOptions.find((f: any) => f.value === frequency)?.discount || 10) : opt.discountedPrice,
                        }
                      : {
                          normalPrice: formatLabel(labels?.oneTimePriceFormat, {
                            price: opt.price,
                          }, currencySymbol),
                        }
                  }
                  helpText={
                    (opt.id === "oneTime" && labels?.oneTimePurchaseSubtext) ||
                    (opt.id === "subscribe" &&
                      labels?.subscriptionPurchaseSubtext)
                  }
                  customizationData={customizationData}
                  currencySymbol={currencySymbol}
                />

                {/* Show frequency selector when subscribe is active or keepFrequencyVisible */}
                {((purchase === "subscribe" && opt.id === "subscribe") ||
                  (customizationData?.keepFrequencyVisible &&
                    opt.id === "subscribe")) && (
                  <SelectDropdown
                    label={labels?.deliveryFrequencyLabel}
                    frequency={frequency}
                    setFrequency={setFrequency}
                    frequencyOptions={frequencyOptions}
                  />
                )}
              </div>
            ))}
          </div>
        );

      case "grid":
        return (
          <div className="pt-2">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              style={{
                ...(customizationData?.optionSpacing && {
                  gap: `${customizationData.optionSpacing}px`,
                }),
              }}
              role="radiogroup"
              aria-label="Purchase options"
            >
              {/* One-time purchase box */}
              <div
                role="radio"
                aria-checked={purchase === "oneTime"}
                tabIndex={purchase === "oneTime" ? 0 : -1}
                onClick={() => {
                  setPurchase("oneTime");
                  setFrequency("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPurchase("oneTime");
                    setFrequency("");
                  }
                }}
                className={`flex flex-col items-center justify-center rounded-xl border p-3 cursor-pointer ${
                  purchase === "oneTime"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
                style={{
                  ...(customizationData?.borderWidth && {
                    borderWidth: `${customizationData.borderWidth}px`,
                  }),
                  ...(customizationData?.borderRadius && {
                    borderRadius: `${customizationData.borderRadius}px`,
                  }),
                }}
                aria-label={`${labels?.oneTimePurchaseLabel} - ${currencySymbol}${productPreview.options.find((o: any) => o.id === "oneTime")?.price}`}
              >
                <span
                  className="text-sm font-light text-center"
                  style={{
                    color:
                      purchase === "oneTime" && customizationData?.textColor
                        ? customizationData.textColor
                        : "undefined",
                  }}
                >
                  {labels?.oneTimePurchaseLabel}
                </span>
                <span
                  className="text-sm"
                  style={{
                    color:
                      purchase === "oneTime" &&
                      customizationData?.priceTextColor
                        ? customizationData.priceTextColor
                        : "undefined",
                  }}
                >
                  {currencySymbol}
                  {
                    productPreview.options.find((o: any) => o.id === "oneTime")
                      ?.price
                  }
                </span>
              </div>

              {/* Subscription frequencies */}
              {frequencyOptions.map((freq: any) => (
                <div
                  key={freq.value}
                  role="radio"
                  aria-checked={
                    purchase === "subscribe" && frequency === freq.value
                  }
                  tabIndex={
                    purchase === "subscribe" && frequency === freq.value
                      ? 0
                      : -1
                  }
                  onClick={() => {
                    setPurchase("subscribe");
                    setFrequency(freq.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPurchase("subscribe");
                      setFrequency(freq.value);
                    }
                  }}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3 cursor-pointer ${
                    purchase === "subscribe" && frequency === freq.value
                      ? "bg-black text-white border-black"
                      : "bg-white text-black"
                  }`}
                  style={{
                    ...(customizationData?.borderWidth && {
                      borderWidth: `${customizationData.borderWidth}px`,
                    }),
                    ...(customizationData?.borderRadius && {
                      borderRadius: `${customizationData.borderRadius}px`,
                    }),
                  }}
                  aria-label={`${freq.label} subscription - ${currencySymbol}${calculateDiscountedPrice(
                    productPreview.options.find((o: any) => o.id === "oneTime")
                      ?.price || 0,
                    20
                  )} (${freq.discount}% off)`}
                >
                  <span
                    className="text-sm font-light text-center"
                    style={{
                      fontSize: customizationData?.labelTextSize
                        ? `${customizationData.labelTextSize}px`
                        : "14px",
                      color:
                        purchase === "subscribe" &&
                        frequency === freq.value &&
                        customizationData?.textColor
                          ? customizationData.textColor
                          : undefined,
                    }}
                  >
                    {freq.label}
                  </span>
                  <span
                    className="text-sm text-center"
                    style={{
                      color:
                        purchase === "subscribe" &&
                        frequency === freq.value &&
                        customizationData?.priceTextColor
                          ? customizationData.priceTextColor
                          : undefined,
                    }}
                  >
                    {/* calculate discounted price dynamically */}{currencySymbol}
                    {calculateDiscountedPrice(
                      productPreview.options.find(
                        (o: any) => o.id === "oneTime"
                      )?.price || 0,
                      20
                    )}{" "}
                  </span>
                  ({freq.discount}% off)
                </div>
              ))}
            </div>
          </div>
        );

      case "grid-savings":
        return (
          <div className="">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              style={{
                ...(customizationData?.optionSpacing && {
                  gap: `${customizationData.optionSpacing}px`,
                }),
              }}
              role="radiogroup"
              aria-label="Purchase options with savings"
            >
              {/* One-time purchase box */}
              <div
                role="radio"
                aria-checked={purchase === "oneTime"}
                tabIndex={purchase === "oneTime" ? 0 : -1}
                onClick={() => {
                  setPurchase("oneTime");
                  setFrequency("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPurchase("oneTime");
                    setFrequency("");
                  }
                }}
                className={`flex flex-col items-center justify-center rounded-xl border p-2 cursor-pointer ${
                  purchase === "oneTime"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
                style={{
                  ...(customizationData?.borderWidth && {
                    borderWidth: `${customizationData.borderWidth}px`,
                  }),
                  ...(customizationData?.borderRadius && {
                    borderRadius: `${customizationData.borderRadius}px`,
                  }),
                }}
                aria-label={`${labels?.oneTimePurchaseLabel} - ${currencySymbol}${productPreview.options.find((o: any) => o.id === "oneTime")?.price}`}
              >
                <span
                  className="text-sm font-light text-center"
                  style={{
                    color:
                      purchase === "oneTime" && customizationData?.textColor
                        ? customizationData.textColor
                        : "undefined",
                  }}
                >
                  {labels?.oneTimePurchaseLabel}
                </span>
                <span
                  className="text-sm"
                  style={{
                    color:
                      purchase === "oneTime" &&
                      customizationData?.priceTextColor
                        ? customizationData.priceTextColor
                        : "undefined",
                  }}
                >
                  {currencySymbol}
                  {
                    productPreview.options.find((o: any) => o.id === "oneTime")
                      ?.price
                  }
                </span>
              </div>

              {/* Subscription frequencies with savings */}
              {frequencyOptions.map((freq: any) => (
                <div
                  key={freq.value}
                  role="radio"
                  aria-checked={
                    purchase === "subscribe" && frequency === freq.value
                  }
                  tabIndex={
                    purchase === "subscribe" && frequency === freq.value
                      ? 0
                      : -1
                  }
                  onClick={() => {
                    setPurchase("subscribe");
                    setFrequency(freq.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPurchase("subscribe");
                      setFrequency(freq.value);
                    }
                  }}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2 cursor-pointer ${
                    purchase === "subscribe" && frequency === freq.value
                      ? "bg-black text-white border-black"
                      : "bg-white text-black"
                  }`}
                  style={{
                    ...(customizationData?.borderWidth && {
                      borderWidth: `${customizationData.borderWidth}px`,
                    }),
                    ...(customizationData?.borderRadius && {
                      borderRadius: `${customizationData.borderRadius}px`,
                    }),
                  }}
                  aria-label={`${freq.label} subscription with ${freq.discount}% savings - ${currencySymbol}${calculateDiscountedPrice(
                    productPreview.options.find((o: any) => o.id === "oneTime")
                      ?.price || 0,
                    freq.discount
                  )}`}
                >
                  {/* 🔹 Discount badge - conditionally shown */}
                  {!customizationData?.hideDiscountBadge && (
                    <span
                      className="mb-1 inline-block rounded-full px-1.5 text-[11px] font-medium"
                      style={{
                        backgroundColor:
                          customizationData?.discountBadgeColor ||
                          "rgb(219 234 254)",
                        color:
                          customizationData?.discountBadgeTextColor ||
                          "rgb(30 64 175)",
                      }}
                    >
                      {formatLabel(
                        labels?.discountBadgeFormat ||
                          "SAVE {{selectedDiscountPercentage}}%",
                        { selectedDiscountPercentage: freq.discount.toString() },
                        currencySymbol
                      )}
                    </span>
                  )}
                  {/* Label */}
                  <span
                    className="text-sm font-light text-center"
                    style={{
                      fontSize: customizationData?.labelTextSize
                        ? `${customizationData.labelTextSize}px`
                        : "14px",
                    }}
                  >
                    {freq.label}
                  </span>
                  {/* Price with discount */}
                  <span
                    className="text-sm"
                    style={{
                      color:
                        purchase === "subscribe" &&
                        frequency === freq.value &&
                        customizationData?.priceTextColor
                          ? customizationData.priceTextColor
                          : undefined,
                    }}
                  >
                    {currencySymbol}
                    {calculateDiscountedPrice(
                      productPreview.options.find(
                        (o: any) => o.id === "oneTime"
                      )?.price || 0,
                      freq.discount
                    )}
                  </span>
                  ({freq.discount}% off)
                </div>
              ))}
            </div>
          </div>
        );

      case "button":
        return (
          <div className="pt-2">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              style={{
                ...(customizationData?.optionSpacing && {
                  gap: `${customizationData.optionSpacing}px`,
                }),
              }}
              role="radiogroup"
              aria-label="Purchase options"
            >
              {/* One-time purchase */}
              <div
                role="radio"
                aria-checked={purchase === "oneTime"}
                tabIndex={purchase === "oneTime" ? 0 : -1}
                onClick={() => {
                  setPurchase("oneTime");
                  setFrequency("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPurchase("oneTime");
                    setFrequency("");
                  }
                }}
                className={`cursor-pointer rounded-xl border px-4 py-3 text-center font-medium ${
                  purchase === "oneTime"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
                style={{
                  ...(customizationData?.borderWidth && {
                    borderWidth: `${customizationData.borderWidth}px`,
                  }),
                  ...(customizationData?.borderRadius && {
                    borderRadius: `${customizationData.borderRadius}px`,
                  }),
                  ...(purchase === "oneTime" &&
                    customizationData?.widgetBackgroundColor && {
                      backgroundColor: customizationData.widgetBackgroundColor,
                    }),
                  ...(purchase === "oneTime" &&
                    customizationData?.textColor && {
                      color: customizationData.textColor,
                    }),
                }}
                aria-label={`${labels?.oneTimePurchaseLabel}`}
              >
                {labels?.oneTimePurchaseLabel}
              </div>

              {/* Subscription frequencies */}
              {frequencyOptions.map((freq: any) => (
                <div
                  key={freq.value}
                  role="radio"
                  aria-checked={
                    purchase === "subscribe" && frequency === freq.value
                  }
                  tabIndex={
                    purchase === "subscribe" && frequency === freq.value
                      ? 0
                      : -1
                  }
                  onClick={() => {
                    setPurchase("subscribe");
                    setFrequency(freq.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPurchase("subscribe");
                      setFrequency(freq.value);
                    }
                  }}
                  className={`cursor-pointer rounded-xl border px-4 py-5 text-center font-medium ${
                    purchase === "subscribe" && frequency === freq.value
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                  style={{
                    ...(customizationData?.borderWidth && {
                      borderWidth: `${customizationData.borderWidth}px`,
                    }),
                    ...(customizationData?.borderRadius && {
                      borderRadius: `${customizationData.borderRadius}px`,
                    }),
                    ...(purchase === "subscribe" &&
                      frequency === freq.value &&
                      customizationData?.widgetBackgroundColor && {
                        backgroundColor:
                          customizationData.widgetBackgroundColor,
                      }),
                  }}
                  aria-label={`${freq.label} subscription`}
                >
                  <span
                    style={{
                      fontSize: customizationData?.labelTextSize
                        ? `${customizationData.labelTextSize}px`
                        : "14px",
                      color:
                        purchase === "subscribe" &&
                        frequency === freq.value &&
                        customizationData?.textColor
                          ? customizationData.textColor
                          : undefined,
                    }}
                  >
                    {freq.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "stacked":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: customizationData?.optionSpacing
                ? `${customizationData.optionSpacing}px`
                : "8px",
            }}
            role="radiogroup"
            aria-label="Purchase options"
          >
            {/* One-time purchase */}
            <div
              onClick={() => {
                setPurchase("oneTime");
                setFrequency("");
              }}
              className={`cursor-pointer rounded-lg border p-3 text-center ${
                purchase === "oneTime"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black "
              }`}
              style={{
                ...(customizationData?.borderWidth && {
                  borderWidth: `${customizationData.borderWidth}px`,
                }),
                ...(customizationData?.borderRadius && {
                  borderRadius: `${customizationData.borderRadius}px`,
                }),
                ...(purchase === "oneTime" &&
                  customizationData?.widgetBackgroundColor && {
                    backgroundColor: customizationData.widgetBackgroundColor,
                  }),
              }}
            >
              <div className="flex justify-between">
                <span
                  className="text-sm"
                  style={{
                    color:
                      purchase === "oneTime" && customizationData?.textColor
                        ? customizationData.textColor
                        : undefined,
                  }}
                >
                  {labels?.oneTimePurchaseLabel}
                </span>
                <span
                  className="text-sm"
                  style={{
                    color:
                      purchase === "oneTime" &&
                      customizationData?.priceTextColor
                        ? customizationData.priceTextColor
                        : undefined,
                  }}
                >
                  {currencySymbol}
                  {
                    productPreview.options.find((o: any) => o.id === "oneTime")
                      ?.price
                  }
                </span>
              </div>
            </div>

            {/* Subscription frequencies */}
            {frequencyOptions.map((freq: any) => (
              <div
                key={freq.value}
                onClick={() => {
                  setPurchase("subscribe");
                  setFrequency(freq.value);
                }}
                className={`cursor-pointer rounded-lg border p-3 text-center ${
                  purchase === "subscribe" && frequency === freq.value
                    ? "bg-black text-white border-black"
                    : "bg-white text-black"
                }`}
                style={{
                  ...(customizationData?.borderWidth && {
                    borderWidth: `${customizationData.borderWidth}px`,
                  }),
                  ...(customizationData?.borderRadius && {
                    borderRadius: `${customizationData.borderRadius}px`,
                  }),
                  ...(purchase === "subscribe" &&
                    frequency === freq.value &&
                    customizationData?.widgetBackgroundColor && {
                      backgroundColor: customizationData.widgetBackgroundColor,
                    }),
                }}
              >
                <div className="flex justify-between">
                  <span
                    className="text-sm"
                    style={{
                      fontSize: customizationData?.labelTextSize
                        ? `${customizationData.labelTextSize}px`
                        : "14px",
                      color:
                        purchase === "subscribe" &&
                        frequency === freq.value &&
                        customizationData?.textColor
                          ? customizationData.textColor
                          : undefined,
                    }}
                  >
                    {freq.label}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      color:
                        purchase === "subscribe" &&
                        frequency === freq.value &&
                        customizationData?.priceTextColor
                          ? customizationData.priceTextColor
                          : undefined,
                    }}
                  >
                    {!customizationData?.hideDiscountBadge && (
                      <span
                        className="inline-block rounded-full px-2 py-0.5 text-[11px] font-medium"
                        style={{
                          backgroundColor:
                            customizationData?.discountBadgeColor ||
                            "rgb(220 252 231)",
                          color:
                            customizationData?.discountBadgeTextColor ||
                            "rgb(22 101 52)",
                        }}
                      >
                        {freq.discount}% OFF
                      </span>
                    )}{" "}
                    {currencySymbol}
                    {calculateDiscountedPrice(
                      productPreview.options.find(
                        (o: any) => o.id === "oneTime"
                      )?.price || 0,
                      freq.discount
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        // Luminic
        return (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: customizationData?.optionSpacing
                  ? `${customizationData.optionSpacing}px`
                  : "12px",
              }}
              role="radiogroup"
              aria-label="Purchase options"
            >
              {productPreview.options.map((opt: any) => (
                <div
                  key={opt.id}
                  className="rounded-lg border p-2"
                  style={{
                    ...(customizationData?.borderWidth && {
                      borderWidth: `${customizationData.borderWidth}px`,
                    }),
                    ...(customizationData?.borderRadius && {
                      borderRadius: `${customizationData.borderRadius}px`,
                    }),
                    ...(purchase === opt.id &&
                      customizationData?.widgetBackgroundColor && {
                        backgroundColor:
                          customizationData.widgetBackgroundColor,
                      }),
                  }}
                >
                  <OptionRow
                    checked={purchase === opt.id}
                    onChange={() =>
                      setPurchase(opt.id as "oneTime" | "subscribe")
                    }
                    primary={
                      <div className="flex flex-col">
                        <span
                          style={{
                            fontSize:
                              opt.badge && customizationData?.labelTextSize
                                ? `${customizationData.labelTextSize}px`
                                : "14px",
                            color:
                              purchase === opt.id &&
                              customizationData?.textColor
                                ? customizationData.textColor
                                : "black",
                          }}
                        >
                          {opt.badge
                            ? labels?.subscriptionPurchaseLabel
                            : labels?.oneTimePurchaseLabel}
                        </span>
                        {opt.badge && !customizationData?.hideDiscountBadge && (
                          <span
                            className="mt-1 rounded-full w-fit px-2.5 py-0.5 text-[11px] font-medium"
                            style={{
                              backgroundColor:
                                customizationData?.discountBadgeColor ||
                                "rgb(220 252 231)",
                              color:
                                customizationData?.discountBadgeTextColor ||
                                "rgb(22 101 52)",
                            }}
                          >
                            {formatLabel(labels?.discountBadgeFormat, {
                              selectedDiscountPercentage: frequency ? (frequencyOptions.find((f: any) => f.value === frequency)?.discount || 10).toString() : "10",
                            }, currencySymbol)}
                          </span>
                        )}
                      </div>
                    }
                    right={
                      opt.id === 'subscribe'
                        ? {
                            originalPrice: opt.originalPrice,
                            discountedPrice: frequency ? calculateDiscountedPrice(opt.originalPrice, frequencyOptions.find((f: any) => f.value === frequency)?.discount || 10) : opt.discountedPrice,
                          }
                        : {
                            normalPrice: formatLabel(
                              labels?.oneTimePriceFormat,
                              { price: opt.price },
                              currencySymbol
                            ),
                          }
                    }
                    helpText={
                      (opt.id === "oneTime" &&
                        labels?.oneTimePurchaseSubtext) ||
                      (opt.id === "subscribe" &&
                        labels?.subscriptionPurchaseSubtext)
                    }
                    customizationData={customizationData}
                    currencySymbol={currencySymbol}
                  />
 
                  {/* Show frequency selector when subscribe is active or keepFrequencyVisible */}
                  {((purchase === "subscribe" && opt.id === "subscribe") ||
                    (customizationData?.keepFrequencyVisible &&
                      opt.id === "subscribe")) && (
                    <SelectDropdown
                      label={labels?.deliveryFrequencyLabel}
                      frequency={frequency}
                      setFrequency={setFrequency}
                      frequencyOptions={frequencyOptions}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        );
    }
  }

  return (
    <>
      {/* Enhanced price display with free product and loyalty indicators */}
      {renderEnhancedPriceDisplay()}

      {/* Purchase options heading */}
      <div className="pt-2 !text-[14px]">
        {settingsData?.showOnProductPages && (
          <p className="text-base text-black">
            {labels?.purchaseOptionsHeading}
          </p>
        )}
      </div>

      {/* Purchase Options */}
      {settingsData?.showOnProductPages && (
        <div
          className="pt-2"
          style={{
            padding: customizationData?.widgetPadding
              ? `${customizationData.widgetPadding}px`
              : "",
          }}
        >
          {renderOptions()}
        </div>
      )}

      <div className="pt-4">
        {customizationData?.showTooltipsOnlyWhenSelected
          ? // Show tooltip only when subscription is selected or pre-selected
            (purchase === "subscribe" || settingsData?.preselect) && infoContent
          : // Normal behavior
            settingsData?.alwaysShowInfo
            ? // show info inline (hide the button)
              infoContent
            : // click-to-toggle popover (no hover behavior)
              labels?.tooltipTitle && (
                <Popover
                  active={infoActive}
                  activator={
                    // <Button
                    //   onClick={toggleInfo}
                    //   icon={InfoIcon}
                    //   size="medium"
                    //   variant="monochromePlain"
                    // >
                    //   {labels?.tooltipTitle}
                    // </Button>
                    <button
                      onClick={toggleInfo}
                      className="flex items-center text-sm text-gray-600 hover:text-black cursor-pointer"
                      hidden={!settingsData?.tooltipIcon}
                    >
                      <InfoIcon className="mr-1 h-6 w-6 text-gray-600 fill-current" />
                      {labels?.tooltipTitle}
                    </button>
                  }
                  onClose={closeInfo}
                  zIndexOverride={1000}
                  preferredAlignment="left"
                >
                  {infoContent}
                </Popover>
              )}
      </div>
    </>
  );
};

export default PurchaseOptions;
