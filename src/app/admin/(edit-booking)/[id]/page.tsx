import AdminEditBooking from "@/app/pages/AdminEditBooking";

export default function AdminEditBookingPage({
  params,
}: {
  params: { id: string };
}) {
  return <AdminEditBooking params={params} />;
}
