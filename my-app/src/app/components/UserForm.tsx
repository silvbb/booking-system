"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Resolver } from "react-hook-form";

const schema = yup.object().shape({
  user_name: yup.string().required("请输入姓名"),
  phone: yup
    .string()
    .required("请输入手机号码")
    .matches(/^1[3-9]\d{9}$/, "请输入有效的手机号码"),
  contactInfo: yup.string().notRequired(),
  notes: yup.string().notRequired(),
});

export const userFormSchema = schema;

interface UserFormProps {
  onSubmit: (data: yup.InferType<typeof schema>) => void;
  isSubmitting: boolean;
}

// 使用 yup.InferType<typeof schema> 作为表单类型，确保类型推断与 schema 一致
const UserForm: React.FC<UserFormProps> = ({ onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema) as Resolver<yup.InferType<typeof schema>>,
  });

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">填写预约信息</h2>
      <div className="bg-zinc-800 rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="user_name"
              className="block text-sm font-medium mb-1"
            >
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              id="user_name"
              type="text"
              {...register("user_name")}
              className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.user_name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.user_name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              手机号码 <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contactInfo"
              className="block text-sm font-medium mb-1"
            >
              其他联系方式（选填）
            </label>
            <input
              id="contactInfo"
              type="text"
              {...register("contactInfo")}
              placeholder="微信、邮箱等"
              className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">
              备注信息（选填）
            </label>
            <textarea
              id="notes"
              {...register("notes")}
              placeholder="请填写要预约的球场和球场类型,例如：云顶室内足球场-全场或者技师学院足球场-8人制场"
              rows={3}
              className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "提交中..." : "提交预约"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
