import DemoPageClient from "./DemoPageClient";

export const dynamic = "force-dynamic";

export default function DemoPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const step =
    typeof searchParams?.step === "string" ? searchParams.step : undefined;
  const google =
    typeof searchParams?.google === "string" ? searchParams.google : undefined;
  const reason =
    typeof searchParams?.reason === "string" ? searchParams.reason : undefined;

  return <DemoPageClient step={step} google={google} reason={reason} />;
}
