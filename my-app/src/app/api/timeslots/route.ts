import { NextRequest, NextResponse } from 'next/server';
import { getAllTimeSlotsWithStatus, ALL_TIME_SLOTS } from '@/lib/timeSlots';

/**
 * 获取可用时间段API
 * 根据日期参数返回可用的预约时间段
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    // 验证日期参数
    if (!date) {
      return NextResponse.json(
        { 
          error: '缺少日期参数', 
          available: false,
          timeSlots: ALL_TIME_SLOTS // 返回所有时间段作为默认值
        },
        { status: 400 }
      );
    }
    
    // 解析日期
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { 
          error: '日期格式不正确', 
          available: false,
          timeSlots: ALL_TIME_SLOTS 
        },
        { status: 400 }
      );
    }
    
    // 获取所有时间段及其状态
    const allSlotsWithStatus = await getAllTimeSlotsWithStatus(appointmentDate);
    const availableSlots = allSlotsWithStatus.filter(slot => !slot.isBooked);
    
    return NextResponse.json({ 
      success: true, 
      available: availableSlots.length > 0,
      timeSlots: allSlotsWithStatus 
    });
  } catch (error) {
    console.error('获取可用时间段失败:', error);
    return NextResponse.json(
      { 
        error: '服务器错误，获取可用时间段失败', 
        available: false,
        timeSlots: [] 
      },
      { status: 500 }
    );
  }
}