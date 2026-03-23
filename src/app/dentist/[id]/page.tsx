import DentistDetail from "@/app/pages/DentistDetail";

export default function DentistDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <DentistDetail params={params} />;
}
