"use client";

import { useState } from "react";
import DatePicker from "./components/DatePicker";
import TimeSlots from "./components/TimeSlots";
import UserForm, { UserFormData } from "./components/UserForm";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleSubmit = async (data: UserFormData) => {
    if (!selectedDate || !selectedTimeSlot) return;

    setIsSubmitting(true);

    try {
      // 调用API创建预约
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: data.user_name,
          phone: data.phone,
          contactInfo: data.contactInfo,
          appointment_date: selectedDate.toISOString().split("T")[0],
          appointment_time: selectedTimeSlot,
          notes: data.notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "预约失败");
      }

      console.log("预约成功:", result.data);
      setBookingSuccess(true);
    } catch (error) {
      console.error("预约失败:", error);
      alert(
        `预约失败: ${error instanceof Error ? error.message : "服务器错误"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setBookingSuccess(false);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="bg-zinc-800 p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-500">
            铁骑话球-球场预约系统
          </h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {bookingSuccess ? (
          <div className="max-w-md mx-auto bg-zinc-800 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">预约成功！</h2>
            <p className="mb-6 text-gray-300">
              您的咨询预约已成功提交，我们将尽快与您联系确认。
            </p>
            <button
              onClick={resetForm}
              className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              返回预约页面
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <DatePicker
                selectedDate={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setSelectedTimeSlot(null);
                }}
              />
              <TimeSlots
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                onSelectTimeSlot={setSelectedTimeSlot}
              />
            </div>
            <div>
              <UserForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-zinc-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} 球场预约系统 | 版权所有 杰维智能Jwisdom
          </p>
        </div>
      </footer>
    </div>
  );
}
