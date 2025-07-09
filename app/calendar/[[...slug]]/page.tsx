import LivingCalendar from "@/components/LivingCalendar";

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const isBirthday =
    slug &&
    slug[0] &&
    slug[0].split("-").length === 3 &&
    slug[0].split("-")[0].length === 4 &&
    slug[0].split("-")[1].length === 2 &&
    Number(slug[0].split("-")[1]) > 0 &&
    Number(slug[0].split("-")[1]) <= 12 &&
    slug[0].split("-")[2].length === 2 &&
    Number(slug[0].split("-")[2]) > 0 &&
    Number(slug[0].split("-")[2]) <= 31;
  const birthday = isBirthday ? slug[0] : "";
  return <LivingCalendar birthday={birthday} />;
}
