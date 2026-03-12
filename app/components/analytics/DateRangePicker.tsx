import React, { useRef, useEffect } from "react";
import {
  Popover,
  Button,
  InlineGrid,
  Box,
  Select,
  Scrollable,
  TextField,
  Icon,
  DatePicker,
  OptionList,
  BlockStack,
  InlineStack,
} from "@shopify/polaris";
import {
  ArrowRightIcon,
  CalendarIcon,
  FilterIcon,
} from "@shopify/polaris-icons";

interface DateRangePickerProps {
  ranges: any[];
  popoverActive: boolean;
  setPopoverActive: (active: boolean) => void;
  activeDateRange: any;
  setActiveDateRange: (range: any) => void;
  inputValues: { since?: string; until?: string };
  setInputValues: React.Dispatch<
    React.SetStateAction<{ since?: string; until?: string }>
  >;
  month: number;
  year: number;
  setDate: React.Dispatch<
    React.SetStateAction<{ month: number; year: number }>
  >;
  mdDown: boolean;
  lgUp: boolean;
  activator?: React.ReactElement;
}

function DateRangePicker({
  ranges,
  popoverActive,
  setPopoverActive,
  activeDateRange,
  setActiveDateRange,
  inputValues,
  setInputValues,
  month,
  year,
  setDate,
  mdDown,
  lgUp,
  activator,
}: DateRangePickerProps) {
  const shouldShowMultiMonth = lgUp;
  const datePickerRef = useRef(null);
  const formatDateShort = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const VALID_YYYY_MM_DD_DATE_REGEX = /^\d{4}-\d{1,2}-\d{1,2}/;
  function isDate(date: any) {
    return !isNaN(new Date(date).getDate());
  }
  function isValidYearMonthDayDateString(date: any) {
    return VALID_YYYY_MM_DD_DATE_REGEX.test(date) && isDate(date);
  }
  function isValidDate(date: any) {
    return date.length === 10 && isValidYearMonthDayDateString(date);
  }
  function parseYearMonthDayDateString(input: any) {
    // Date-only strings (e.g. "1970-01-01") are treated as UTC, not local time
    // when using new Date()
    // Date-only strings (e.g. "1970-01-01") are treated as UTC, not local time
    // when using new Date()
    // We need to split year, month, day to pass into new Date() separately
    // to get a localized Date
    const [year, month, day] = input.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  function formatDateToYearMonthDayDateString(date: any) {
    const year = String(date.getFullYear());
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    if (month.length < 2) {
      month = String(month).padStart(2, "0");
    }
    if (day.length < 2) {
      day = String(day).padStart(2, "0");
    }
    return [year, month, day].join("-");
  }
  function formatDate(date: any) {
    return formatDateToYearMonthDayDateString(date);
  }
  function nodeContainsDescendant(rootNode: any, descendant: any) {
    if (rootNode === descendant) {
      return true;
    }
    let parent = descendant.parentNode;
    while (parent != null) {
      if (parent === rootNode) {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  }
  function isNodeWithinPopover(node: any) {
    return datePickerRef?.current
      ? nodeContainsDescendant(datePickerRef.current, node)
      : false;
  }
  function handleStartInputValueChange(value: any) {
    setInputValues((prevState) => {
      return { ...prevState, since: value };
    });
    console.log("handleStartInputValueChange, validDate", value);
    if (isValidDate(value)) {
      const newSince = parseYearMonthDayDateString(value);
      setActiveDateRange((prevState: any) => {
        const newPeriod =
          prevState.period && newSince <= prevState.period.until
            ? { since: newSince, until: prevState.period.until }
            : { since: newSince, until: newSince };
        return {
          ...prevState,
          period: newPeriod,
        };
      });
    }
  }
  function handleEndInputValueChange(value: any) {
    setInputValues((prevState) => ({ ...prevState, until: value }));
    if (isValidDate(value)) {
      const newUntil = parseYearMonthDayDateString(value);
      setActiveDateRange((prevState: any) => {
        const newPeriod =
          prevState.period && newUntil >= prevState.period.since
            ? { since: prevState.period.since, until: newUntil }
            : { since: newUntil, until: newUntil };
        return {
          ...prevState,
          period: newPeriod,
        };
      });
    }
  }
  function handleInputBlur({ relatedTarget }: any) {
    const isRelatedTargetWithinPopover =
      relatedTarget != null && isNodeWithinPopover(relatedTarget);
    // If focus moves from the TextField to the Popover
    // we don't want to close the popover
    if (isRelatedTargetWithinPopover) {
      return;
    }
    setPopoverActive(false);
  }
  function handleMonthChange(month: any, year: any) {
    setDate({ month, year });
  }
  function handleCalendarChange({ start, end }: any) {
    const newDateRange = ranges.find((range) => {
      return (
        range.period.since.valueOf() === start.valueOf() &&
        range.period.until.valueOf() === end.valueOf()
      );
    }) || {
      alias: "custom",
      title: `Custom (${formatDateShort(start)} - ${formatDateShort(end)})`,
      period: {
        since: start,
        until: end,
      },
    };
    setActiveDateRange(newDateRange);
  }
  function apply() {
    setPopoverActive(false);
  }
  function cancel() {
    setPopoverActive(false);
  }
  useEffect(() => {
    if (activeDateRange) {
      setInputValues({
        since: formatDate(activeDateRange.period.since),
        until: formatDate(activeDateRange.period.until),
      });
      function monthDiff(referenceDate: any, newDate: any) {
        return (
          newDate.month -
          referenceDate.month +
          12 * (referenceDate.year - newDate.year)
        );
      }
      const monthDifference = monthDiff(
        { year, month },
        {
          year: activeDateRange.period.until.getFullYear(),
          month: activeDateRange.period.until.getMonth(),
        }
      );
      if (monthDifference > 1 || monthDifference < 0) {
        setDate({
          month: activeDateRange.period.until.getMonth(),
          year: activeDateRange.period.until.getFullYear(),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDateRange]);

  const buttonValue =
    activeDateRange.period.since.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " - " +
    activeDateRange.period.until.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const defaultActivator = (
    <Button
      size="slim"
      icon={FilterIcon}
      onClick={() => setPopoverActive(!popoverActive)}
    >
      {buttonValue}
    </Button>
  );

  return (
    <Popover
      active={popoverActive}
      autofocusTarget="none"
      preferredAlignment="left"
      preferredPosition="below"
      fluidContent
      sectioned={false}
      fullHeight
      activator={activator || defaultActivator}
      onClose={() => setPopoverActive(false)}
    >
      <Popover.Pane fixed>
        <InlineGrid
          columns={{
            xs: "1fr",
            md: "max-content max-content",
          }}
          gap={{ sm: "200", md: "400" }}
        >
          <Box
            maxWidth={mdDown ? "500px" : "240px"}
            width={mdDown ? "100%" : "240px"}
          >
            {mdDown ? (
              <Box padding={"400"}>
                <Select
                  label="dateRangeLabel"
                  labelHidden
                  onChange={(value) => {
                    const result = ranges.find(
                      (range) => range.title === value
                    );
                    if (result) setActiveDateRange(result);
                  }}
                  value={activeDateRange?.title || ""}
                  options={ranges.map((range) => {
                    const titleMatch = range.title.match(/^(.+?)\s*\((.+)\)$/);
                    const name = titleMatch ? titleMatch[1] : range.title;
                    return { label: name, value: range.title };
                  })}
                />
              </Box>
            ) : (
              <Scrollable style={{ height: "334px" }}>
                <OptionList
                  options={ranges.map((range) => {
                    const titleMatch = range.title.match(/^(.+?)\s*\((.+)\)$/);
                    const name = titleMatch ? titleMatch[1] : range.title;
                    const dateRange = titleMatch ? titleMatch[2] : "";
                    return {
                      value: range.alias,
                      label: (
                        <div>
                          <div style={{ fontWeight: "medium" }}>{name}</div>
                          {dateRange && (
                            <div
                              style={{
                                fontWeight: "normal",
                                fontSize: "0.8rem",
                                color: "var(--p-color-text-subdued)",
                                paddingTop: "2px",
                              }}
                            >
                              {dateRange}
                            </div>
                          )}
                        </div>
                      ),
                    };
                  })}
                  selected={[activeDateRange.alias]}
                  onChange={(selected: string[]) => {
                    const range = ranges.find((r) => r.alias === selected[0]);
                    if (range) setActiveDateRange(range);
                  }}
                />
              </Scrollable>
            )}
          </Box>
          <Box
            maxWidth={mdDown ? "320px" : "516px"}
            padding={{ xs: "400", md: "200" }}
            paddingInlineEnd={{ xs: "400", md: "400" }}
          >
            <BlockStack gap="400">
              {lgUp ? (
                <InlineStack gap="200">
                  <div style={{ flexGrow: 1, padding: "8px 0" }}>
                    <TextField
                      role="combobox"
                      label={"Since"}
                      labelHidden
                      prefix={<Icon source={CalendarIcon} />}
                      value={inputValues.since}
                      onChange={handleStartInputValueChange}
                      onBlur={handleInputBlur}
                      autoComplete="off"
                    />
                  </div>
                  <Icon source={ArrowRightIcon} />
                  <div style={{ flexGrow: 1, padding: "8px 0" }}>
                    <TextField
                      role="combobox"
                      label={"Until"}
                      labelHidden
                      prefix={<Icon source={CalendarIcon} />}
                      value={inputValues.until}
                      onChange={handleEndInputValueChange}
                      onBlur={handleInputBlur}
                      autoComplete="off"
                    />
                  </div>
                </InlineStack>
              ) : (
                <BlockStack gap="100">
                  <TextField
                    role="combobox"
                    label={"Since"}
                    labelHidden
                    prefix={<Icon source={CalendarIcon} />}
                    value={inputValues.since}
                    onChange={handleStartInputValueChange}
                    onBlur={handleInputBlur}
                    autoComplete="off"
                  />

                  <InlineStack align="center">
                    <Icon source={ArrowRightIcon} />
                  </InlineStack>

                  <TextField
                    role="combobox"
                    label={"Until"}
                    labelHidden
                    prefix={<Icon source={CalendarIcon} />}
                    value={inputValues.until}
                    onChange={handleEndInputValueChange}
                    onBlur={handleInputBlur}
                    autoComplete="off"
                  />
                </BlockStack>
              )}
              <div>
                <DatePicker
                  month={month}
                  year={year}
                  selected={{
                    start: activeDateRange.period.since,
                    end: activeDateRange.period.until,
                  }}
                  onMonthChange={handleMonthChange}
                  onChange={handleCalendarChange}
                  multiMonth={shouldShowMultiMonth}
                  allowRange
                />
              </div>
            </BlockStack>
          </Box>
        </InlineGrid>
      </Popover.Pane>
      <Popover.Pane fixed>
        <Popover.Section>
          <InlineStack align="end" gap="200">
            <Button onClick={cancel}>Cancel</Button>
            <Button variant="primary" onClick={apply}>
              Apply
            </Button>
          </InlineStack>
        </Popover.Section>
      </Popover.Pane>
    </Popover>
  );
}

export default DateRangePicker;