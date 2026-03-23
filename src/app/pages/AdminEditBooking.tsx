"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MuiButton from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import {
  Save,
  User,
  Mail,
  Calendar,
  Award,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useAuthUser } from "@/hooks/useSession";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateBooking, selectAllBookings } from "@/store/slices/bookingSlice";
import { dentists } from "@/data/dentists";
import { toast } from "sonner";

export default function AdminEditBooking({
  params,
}: {
  params: { id: string };
}) {
  const { isAdmin } = useAuthUser();
  const router = useRouter();
  const bookingId = params.id;
  const dispatch = useAppDispatch();

  const allBookings = useAppSelector(selectAllBookings);
  const booking = allBookings.find((b) => b.id === bookingId) ?? null;

  const [editDate, setEditDate] = useState("");
  const [editDentistId, setEditDentistId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login");
      return;
    }
    if (!booking) {
      toast.error("Booking not found");
      router.push("/admin");
      return;
    }
    setEditDate(booking.date);
    setEditDentistId(booking.dentistId);
  }, [isAdmin, booking, router]);

  const selectedDentist = dentists.find((d) => d.id === editDentistId);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDate || !editDentistId) {
      toast.error("Please fill in all fields");
      return;
    }

    const sel = new Date(editDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (sel < today) {
      toast.error("Please select a future date");
      return;
    }

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400));

    const result = await dispatch(
      updateBooking({
        bookingId: bookingId!,
        dentistId: editDentistId,
        date: editDate,
      }),
    );

    setIsSaving(false);

    if (updateBooking.fulfilled.match(result)) {
      toast.success("Booking updated successfully!");
      router.push("/admin");
    } else {
      toast.error("Failed to update booking");
    }
  };

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin")}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
          <h1
            className="text-slate-900"
            style={{ fontSize: "1.5rem", fontWeight: 700 }}
          >
            Edit Appointment
          </h1>
          <p className="text-slate-400 text-sm">
            Modify booking details for {booking.userName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-3">
            <Paper
              sx={{ p: 3, borderRadius: "16px", border: "1px solid #f1f5f9" }}
            >
              <h2 className="text-slate-800 mb-5" style={{ fontWeight: 600 }}>
                Appointment Details
              </h2>
              <form onSubmit={handleSave} className="space-y-5">
                {/* Read-only Patient Info */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                  <div
                    className="text-xs text-slate-500 mb-1"
                    style={{ fontWeight: 600 }}
                  >
                    PATIENT INFORMATION (READ-ONLY)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      label="Full Name"
                      value={booking.userName}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <User
                            size={14}
                            color="#94a3b8"
                            style={{ marginRight: 6 }}
                          />
                        ),
                      }}
                      InputLabelProps={{ shrink: true }}
                      sx={{ "& .MuiOutlinedInput-root": { bgcolor: "white" } }}
                    />
                    <TextField
                      label="Email"
                      value={booking.userEmail}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <Mail
                            size={14}
                            color="#94a3b8"
                            style={{ marginRight: 6 }}
                          />
                        ),
                      }}
                      InputLabelProps={{ shrink: true }}
                      sx={{ "& .MuiOutlinedInput-root": { bgcolor: "white" } }}
                    />
                  </div>
                </div>

                {/* Dentist */}
                <FormControl fullWidth size="small">
                  <InputLabel>Assigned Dentist</InputLabel>
                  <Select
                    value={editDentistId}
                    onChange={(e) => setEditDentistId(e.target.value)}
                    label="Assigned Dentist"
                    sx={{ borderRadius: "10px" }}
                  >
                    {dentists.map((d) => (
                      <MenuItem key={d.id} value={d.id}>
                        <div className="flex flex-col py-0.5">
                          <span style={{ fontWeight: 500 }}>{d.name}</span>
                          <span className="text-xs text-slate-400">
                            {d.areaOfExpertise}
                          </span>
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Date */}
                <TextField
                  label="Appointment Date"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  inputProps={{ min: new Date().toISOString().split("T")[0] }}
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <div className="flex gap-3 pt-2">
                  <MuiButton
                    type="submit"
                    variant="contained"
                    disabled={isSaving}
                    startIcon={
                      isSaving ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Save size={15} />
                      )
                    }
                    sx={{
                      flex: 1,
                      height: 44,
                      borderRadius: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </MuiButton>
                  <MuiButton
                    variant="outlined"
                    onClick={() => router.push("/admin")}
                    sx={{
                      flex: 1,
                      height: 44,
                      borderRadius: "10px",
                      borderColor: "#e2e8f0",
                      color: "#374151",
                    }}
                  >
                    Cancel
                  </MuiButton>
                </div>
              </form>
            </Paper>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {selectedDentist && (
              <Paper
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid #f1f5f9",
                }}
              >
                <div className="h-40 overflow-hidden bg-slate-100">
                  <img
                    src={selectedDentist.image}
                    alt={selectedDentist.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDentist.name)}&background=dbeafe&color=2563eb&size=200`;
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="text-xs text-slate-400 mb-1">
                    Selected Dentist
                  </div>
                  <h3
                    className="text-slate-800 mb-1"
                    style={{ fontWeight: 600 }}
                  >
                    {selectedDentist.name}
                  </h3>
                  <p className="text-blue-600 text-sm mb-2">
                    {selectedDentist.areaOfExpertise}
                  </p>
                  <p className="text-slate-400 text-xs flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-500" />
                    {selectedDentist.yearsOfExperience} years of experience
                  </p>
                </div>
              </Paper>
            )}

            <Paper
              sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #f1f5f9" }}
            >
              <div
                className="text-xs text-slate-500 mb-3"
                style={{ fontWeight: 600 }}
              >
                BOOKING INFO
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Booking ID</span>
                  <span className="text-slate-600 font-mono text-xs bg-slate-50 px-2 py-0.5 rounded">
                    #{booking.id.slice(-6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Created</span>
                  <span className="text-slate-600 text-xs">
                    {new Date(booking.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {editDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">New Date</span>
                    <span className="text-slate-600 text-xs">
                      {new Date(editDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </Paper>
          </div>
        </div>
      </main>
    </div>
  );
}
