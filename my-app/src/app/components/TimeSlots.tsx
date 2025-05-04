'use client';

import React, { useState, useEffect } from 'react';

interface TimeSlot {
  id: string;
  time: string;
  isBooked?: boolean;
}

interface TimeSlotsProps {
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  onSelectTimeSlot: (timeSlot: string) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  selectedDate,
  selectedTimeSlot,
  onSelectTimeSlot,
}) => {
  // 状态管理
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 当选择日期变化时，获取可用时间段
  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }
    
    const fetchAvailableTimeSlots = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const dateString = selectedDate.toISOString().split('T')[0];
        const response = await fetch(`/api/timeslots?date=${dateString}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || '获取时间段失败');
        }
        
        // 使用API返回的时间段及其预约状态
        const formattedTimeSlots = (data.timeSlots || []).map((slot: {time: string, isBooked: boolean}) => ({
          id: slot.time,
          time: slot.time,
          isBooked: slot.isBooked // 使用API返回的预约状态
        }));
        
        setTimeSlots(formattedTimeSlots);
      } catch (err) {
        console.error('获取可用时间段失败:', err);
        setError(err instanceof Error ? err.message : '获取时间段失败');
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableTimeSlots();
  }, [selectedDate]);

  if (!selectedDate) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">选择咨询时间</h2>
        <div className="bg-zinc-800 rounded-lg p-6 text-center text-gray-400">
          请先选择日期
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">选择咨询时间</h2>
      <div className="bg-zinc-800 rounded-lg p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              className={`
                py-2 px-3 rounded-md text-sm font-medium transition-colors
                ${slot.isBooked ? 
                  'bg-gray-800 text-gray-600 cursor-not-allowed' : 
                  selectedTimeSlot === slot.id ?
                    'bg-red-600 text-white' :
                    'bg-zinc-700 text-white hover:bg-red-600'
                }
              `}
              onClick={() => !slot.isBooked && onSelectTimeSlot(slot.id)}
              disabled={slot.isBooked}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeSlots;