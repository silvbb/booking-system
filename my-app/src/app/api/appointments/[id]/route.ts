import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
// 获取单个预约
// 仅接收 request 参数，并通过 URL 解析 id
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "无效的预约ID" }, { status: 400 });
    }
    const result = await sql`
      SELECT * FROM appointments WHERE id = ${Number(id)};
    `;
    if (!result || result.length === 0) {
      return NextResponse.json({ error: "未找到该预约" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("获取预约详情失败:", error);
    return NextResponse.json(
      { error: "服务器错误，获取预约详情失败" },
      { status: 500 }
    );
  }
}
// 更新预约
// 仅接收 request 参数，并通过 URL 解析 id
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const data = await request.json();
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "无效的预约ID" }, { status: 400 });
    }
    // 验证必填字段
    if (
      !data.name ||
      !data.phone ||
      !data.appointment_date ||
      !data.appointment_time
    ) {
      return NextResponse.json({ error: "缺少必要字段" }, { status: 400 });
    }
    // 手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(data.phone)) {
      return NextResponse.json({ error: "手机号格式不正确" }, { status: 400 });
    }
    // 转换日期格式
    const appointmentDate = new Date(data.appointment_date);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { error: "预约日期格式不正确" },
        { status: 400 }
      );
    }
    // 更新预约
    const result = await sql`
      UPDATE appointments
      SET 
        name = ${data.name},
        phone = ${data.phone},
        contact_info = ${data.contactInfo || null},
        appointment_date = ${appointmentDate},
        appointment_time = ${data.appointment_time},
        notes = ${data.notes || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number(id)}
      RETURNING *;
    `;
    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "未找到该预约或更新失败" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("更新预约失败:", error);
    return NextResponse.json(
      { error: "服务器错误，更新预约失败" },
      { status: 500 }
    );
  }
}
// 删除预约
// 仅接收 request 参数，并通过 URL 解析 id
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "无效的预约ID" }, { status: 400 });
    }
    const result = await sql`
      DELETE FROM appointments WHERE id = ${Number(id)} RETURNING id;
    `;
    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "未找到该预约或删除失败" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "预约已成功删除" });
  } catch (error) {
    console.error("删除预约失败:", error);
    return NextResponse.json(
      { error: "服务器错误，删除预约失败" },
      { status: 500 }
    );
  }
}
