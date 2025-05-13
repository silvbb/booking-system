/**
 * 时间段管理工具
 * 用于获取和验证预约时间段
 */

import { getAppointmentsByDate } from "./db";

// 定义所有可用的时间段（30分钟为单位）
export const ALL_TIME_SLOTS = [
  "09:00-10:30",
  "10:30-12:00",
  "14:00-15:30",
  "15:30-17:00",
  "17:00-18:30",
  "18:30-20:00",
  "20:00-21:30",
];

/**
 * 获取指定日期的已预约时间段
 * @param date 日期对象
 * @returns 已预约的时间段数组
 */
export async function getBookedTimeSlots(date: Date): Promise<string[]> {
  try {
    const appointments = await getAppointmentsByDate(date);
    return appointments.map((appointment) => appointment.appointment_time);
  } catch (error) {
    console.error("获取已预约时间段失败:", error);
    return [];
  }
}

/**
 * 获取指定日期的所有时间段（包括已预约和可用的）
 * @param date 日期对象
 * @returns 所有时间段及其状态
 */
export async function getAllTimeSlotsWithStatus(
  date: Date
): Promise<{ time: string; isBooked: boolean }[]> {
  const bookedSlots = await getBookedTimeSlots(date);
  return ALL_TIME_SLOTS.map((slot) => ({
    time: slot,
    isBooked: bookedSlots.includes(slot),
  }));
}

/**
 * 获取指定日期的可用时间段
 * @param date 日期对象
 * @returns 可用的时间段数组
 */
export async function getAvailableTimeSlots(date: Date): Promise<string[]> {
  const bookedSlots = await getBookedTimeSlots(date);
  return ALL_TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));
}

/**
 * 检查时间段是否可用
 * @param date 日期对象
 * @param timeSlot 时间段
 * @returns 是否可用
 */
export async function isTimeSlotAvailable(
  date: Date,
  timeSlot: string
): Promise<boolean> {
  const bookedSlots = await getBookedTimeSlots(date);
  return !bookedSlots.includes(timeSlot);
}
