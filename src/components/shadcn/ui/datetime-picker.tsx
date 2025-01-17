"use client";

import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  X,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type AriaDatePickerProps,
  type AriaTimeFieldProps,
  type CalendarProps,
  type DateValue,
  type TimeValue,
  useButton,
  useCalendar,
  useCalendarCell,
  useCalendarGrid,
  useDateField,
  useDatePicker,
  useDateSegment,
  useLocale,
  useTimeField,
} from "react-aria";
import {
  type CalendarState,
  type DateFieldState,
  type DatePickerState,
  type DatePickerStateOptions,
  type TimeFieldStateOptions,
  useCalendarState,
  useDateFieldState,
  useDatePickerState,
  useTimeFieldState,
} from "react-stately";
import { Button } from "~/components/shadcn/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/ui/popover";
import {
  type CalendarDate,
  createCalendar,
  getLocalTimeZone,
  getWeeksInMonth,
  parseDateTime,
  fromDate,
  toCalendarDateTime,
  isToday as _isToday,
  toCalendarDate,
} from "@internationalized/date";
import { type DateSegment as IDateSegment } from "@react-stately/datepicker";
import { cn } from "~/utils/shadcn";

function Calendar(props: CalendarProps<DateValue>) {
  const prevButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  });
  const {
    calendarProps,
    prevButtonProps: _prevButtonProps,
    nextButtonProps: _nextButtonProps,
    title,
  } = useCalendar(props, state);
  const { buttonProps: prevButtonProps } = useButton(
    _prevButtonProps,
    prevButtonRef,
  );
  const { buttonProps: nextButtonProps } = useButton(
    _nextButtonProps,
    nextButtonRef,
  );

  return (
    <div {...calendarProps} className="space-y-4">
      <div className="relative flex items-center justify-center pt-1">
        <Button
          {...prevButtonProps}
          ref={prevButtonRef}
          variant="outline"
          className={cn(
            "absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          )}
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">{title}</div>
        <Button
          {...nextButtonProps}
          ref={nextButtonRef}
          variant="outline"
          className={cn(
            "absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          )}
          aria-label="Next month"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <CalendarGrid state={state} />
    </div>
  );
}

interface CalendarGridProps {
  state: CalendarState;
}

function CalendarGrid({ state, ...props }: CalendarGridProps) {
  const { locale } = useLocale();
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

  return (
    <table
      {...gridProps}
      className={cn(gridProps.className, "w-full border-collapse space-y-1")}
    >
      <thead {...headerProps}>
        <tr className="flex">
          {weekDays.map((day, index) => (
            <th
              className="text-muted-foreground w-9 rounded-md text-[0.8rem] font-normal"
              key={index}
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr className="mt-2 flex w-full" key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell key={i} state={state} date={date} />
                ) : (
                  <td key={i} />
                ),
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface CalendarCellProps {
  state: CalendarState;
  date: CalendarDate;
}

function CalendarCell({ state, date }: CalendarCellProps) {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);

  const isToday = useMemo(() => {
    const timezone = getLocalTimeZone();
    return _isToday(date, timezone);
  }, [date]);

  return (
    <td
      {...cellProps}
      className={cn(
        cellProps.className,
        "[&:has([aria-selected])]:bg-accent relative p-0 text-center text-sm focus-within:relative focus-within:z-20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
      )}
    >
      <Button
        {...buttonProps}
        type="button"
        variant="ghost"
        ref={ref}
        className={cn(
          buttonProps.className,
          "h-9 w-9",
          isToday && "bg-accent text-accent-foreground",
          isSelected &&
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          isOutsideVisibleRange && "text-muted-foreground opacity-50",
          isDisabled && "text-muted-foreground opacity-50",
        )}
        aria-label="Select date"
      >
        {formattedDate}
      </Button>
    </td>
  );
}

interface DateSegmentProps {
  segment: IDateSegment;
  state: DateFieldState;
}

function DateSegment({ segment, state }: DateSegmentProps) {
  const ref = useRef(null);

  const {
    segmentProps: { ...segmentProps },
  } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground border border-transparent focus:rounded-[2px] focus:border-gray-300 focus:outline-none",
        segment.type !== "literal" && "px-1",
        segment.isPlaceholder && "text-muted-foreground",
      )}
      aria-label="Date segment"
    >
      {segment.text}
    </div>
  );
}

function DateField(props: AriaDatePickerProps<DateValue>) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { locale } = useLocale();
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  });
  const { fieldProps } = useDateField(props, state, ref);

  return (
    <div
      {...fieldProps}
      ref={ref}
      className={cn(
        "border-input ring-offset-background focus-visible:ring-ring inline-flex h-10 flex-1 items-center rounded-l-md bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        props.isDisabled && "cursor-not-allowed opacity-50",
      )}
      aria-labelledby="date-field-label"
    >
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
      {state.isInvalid && <span aria-hidden="true">🚫</span>}
    </div>
  );
}

function TimeField(props: AriaTimeFieldProps<TimeValue>) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { locale } = useLocale();
  const state = useTimeFieldState({
    ...props,
    locale,
  });
  const {
    fieldProps: { ...fieldProps },
  } = useTimeField(props, state, ref);

  return (
    <div
      {...fieldProps}
      ref={ref}
      className={cn(
        "border-input ring-offset-background inline-flex h-10 w-full flex-1 justify-end rounded-md border bg-transparent px-3 py-2  text-sm focus-within:border-summit-700 hover:border-summit-300 focus:border-summit-700 hover:focus:border-summit-700 focus-visible:outline-none",
        props.isDisabled && "cursor-not-allowed opacity-50",
      )}
      aria-labelledby="time-field-label"
    >
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  );
}

const TimePicker = React.forwardRef<
  HTMLDivElement,
  Omit<TimeFieldStateOptions<TimeValue>, "locale">
>((props) => {
  return <TimeField {...props} aria-label="Time Picker" />;
});

TimePicker.displayName = "TimePicker";

export type DateTimePickerRef = {
  divRef: HTMLDivElement | null;
  buttonRef: HTMLButtonElement | null;
  contentRef: HTMLDivElement | null;
  jsDate: Date | null;
  state: DatePickerState;
};

const DateTimePicker = React.forwardRef<
  DateTimePickerRef,
  DatePickerStateOptions<DateValue> & {
    jsDate?: Date | null;
    onJsDateChange?: (date: Date) => void;
    showClearButton?: boolean;
  }
>(({ jsDate, onJsDateChange, showClearButton = true, ...props }, ref) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [jsDatetime, setJsDatetime] = useState(jsDate ?? null);

  const state = useDatePickerState(props);

  useImperativeHandle(ref, () => ({
    divRef: divRef.current,
    buttonRef: buttonRef.current,
    contentRef: contentRef.current,
    jsDate: jsDatetime,
    state,
  }));
  const {
    groupProps,
    fieldProps,
    buttonProps: _buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker(props, state, divRef);
  const { buttonProps } = useButton(_buttonProps, buttonRef);

  const currentValue = useCallback(() => {
    if (!jsDatetime) {
      return null;
    }

    const parsed = fromDate(jsDatetime, getLocalTimeZone());

    if (state.hasTime) {
      return toCalendarDateTime(parsed);
    }

    return toCalendarDate(parsed);
  }, [jsDatetime, state.hasTime]);

  useEffect(() => {
    /**
     * If user types datetime, it will be a null value until we get the correct datetime.
     * This is controlled by react-aria.
     **/
    if (state.value) {
      const date = parseDateTime(state.value.toString()).toDate(
        getLocalTimeZone(),
      );
      setJsDatetime(date);
      onJsDateChange?.(date);
    }
  }, [state.value, onJsDateChange]);
  return (
    <div
      {...groupProps}
      ref={divRef}
      className={cn(
        groupProps.className,
        "ring-offset-background focus-within:ring-ring flex items-center rounded-md border focus-within:ring-2 focus-within:ring-offset-2",
      )}
    >
      <Popover open={props.isOpen} onOpenChange={props.onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            {...buttonProps}
            variant="ghost"
            className="border-r"
            disabled={props.isDisabled}
            onClick={() => {
              state.setOpen(true);
            }}
            aria-label="Open date picker"
          >
            <CalendarIcon className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent ref={contentRef} className="w-full">
          <div {...dialogProps} className="space-y-3">
            <Calendar {...calendarProps} />
            {state.hasTime && (
              <TimeField
                value={state.timeValue}
                onChange={(value) => state.setTimeValue(value)}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
      <DateField {...fieldProps} value={currentValue()} />
      <div className={cn("-ml-2 mr-2 h-5 w-5", !showClearButton && "hidden")}>
        <X
          className={cn(
            "text-primary/30 h-5 w-5 cursor-pointer",
            !jsDatetime && "hidden",
          )}
          onClick={() => setJsDatetime(null)}
          aria-label="Clear date"
        />
      </div>
    </div>
  );
});

DateTimePicker.displayName = "DateTimePicker";

export { DateTimePicker, TimePicker };
