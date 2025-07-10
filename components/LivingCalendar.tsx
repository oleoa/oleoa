"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

export default function CalendarComponent({
  birthday: default_birthday,
  yearsToLive: default_yearsToLive,
  isNotion,
}: {
  birthday: string;
  yearsToLive: number;
  isNotion: boolean;
}) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [birthday, setBirthday] = useState<Date>(
    new Date(default_birthday || "2005-12-24")
  );

  const [yearsToLive, setYearsToLive] = useState<number>(
    default_yearsToLive || 80
  );

  const [years, setYears] = useState<boolean[][]>(
    Array.from({ length: yearsToLive + 1 }, () =>
      Array.from({ length: 48 }, () => false)
    )
  );

  useEffect(() => {
    setYears([]);
    const today = new Date();
    Array.from({ length: yearsToLive + 1 }, (_, i) => i).forEach((year) => {
      setYears((prev) => [
        ...prev,
        Array.from({ length: 48 }, (_, week) => {
          const date = new Date(
            birthday.getFullYear() +
              year +
              "-" +
              Math.ceil((week + 1) / 4)
                .toString()
                .padStart(2, "0") +
              "-" +
              (((week % 4) + 1) * 7).toString().padStart(2, "0")
          );
          return date >= birthday && date <= today;
        }),
      ]);
    });
  }, [birthday, yearsToLive]);

  return (
    <div
      className={
        "flex flex-row items-start justify-between h-full w-full bg-transparent " +
        (!isNotion ? "px-32 py-8" : "")
      }
    >
      {!default_birthday && !default_yearsToLive && (
        <div className="flex flex-col items-center justify-center gap-2 w-1/3">
          <h1 className="text-2xl font-bold text-center">Living Calendar</h1>
          {!default_birthday && (
            <>
              <h2 className="text-sm text-start">Select Your Birthday</h2>
              <Calendar
                mode="single"
                selected={birthday}
                onSelect={setBirthday}
                className="rounded-lg border"
                captionLayout="dropdown"
                defaultMonth={birthday}
                required
              />
            </>
          )}
          {!default_yearsToLive && (
            <>
              <h2 className="text-sm text-start">
                How many years do you expect to live?
              </h2>
              <Input
                type="number"
                name="years"
                min={0}
                max={120}
                defaultValue={yearsToLive}
                onChange={(e) => setYearsToLive(Number(e.target.value))}
                className="w-fit"
              />
            </>
          )}
        </div>
      )}
      <div className={"w-full " + (isNotion ? "text-white" : "")}>
        <div className="grid grid-cols-12 w-full">
          {months.map((month) => (
            <div key={month} className="text-center w-full border">
              <h1>{month}</h1>
            </div>
          ))}
        </div>
        <div className="flex flex-col w-full">
          {years.map((week, index) => (
            <div key={index} className="grid grid-cols-48 w-full relative">
              <div className="absolute -left-5 text-right border w-5 h-5">
                {index}
              </div>
              {week.map((lived, index) => (
                <div
                  key={index}
                  className={
                    "text-center border w-full h-5 " +
                    (lived ? "bg-neutral-600" : "bg-neutral-400")
                  }
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
