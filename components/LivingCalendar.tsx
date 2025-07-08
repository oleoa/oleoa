"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

type Type = "before_birthday" | "lived" | "to_live";

export default function CalendarComponent() {
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

  const [birthday, setBirthday] = useState<Date>(new Date("2005-12-24"));
  const [yearsToLive, setYearsToLive] = useState<number>(80);

  const [years, setYears] = useState<Type[][]>(
    Array.from({ length: yearsToLive }, () =>
      Array.from({ length: 48 }, () => "to_live")
    )
  );
  useEffect(() => {
    setYears([]);
    const today = new Date();
    Array.from({ length: yearsToLive }, (_, i) => i).forEach((year) => {
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
          if (date < birthday) return "before_birthday";
          if (date > today) return "to_live";
          return "lived";
        }),
      ]);
    });
  }, [birthday, yearsToLive]);

  return (
    <div className="flex flex-row items-start justify-between h-full w-full px-32 py-8">
      <div className="flex flex-col items-center justify-center gap-2 w-1/3">
        <h1 className="text-2xl font-bold text-center">Living Calendar</h1>
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
      </div>
      <div className="w-full">
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
                {index + 1}
              </div>
              {week.map((type, index) => (
                <div
                  key={index}
                  className={
                    "text-center border w-full h-5 " +
                    (type === "before_birthday" || type == "to_live"
                      ? "bg-neutral-400 "
                      : "") +
                    (type === "lived" ? "bg-neutral-600 " : "")
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
