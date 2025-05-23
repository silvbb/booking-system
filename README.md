# 预约系统网站需求文档

## 项目概述

由于工作繁忙，需要一个自动化的预约系统来管理咨询预约，减少人工对接安排时间的工作量。本系统旨在提供一个简洁、高效的在线预约平台，让用户能够自助完成咨询时间的预约。

## 功能需求

### 1. 用户预约界面

- 提供日期选择器，允许用户选择咨询日期（从当天开始的未来日期）
- 时间选择以90分钟为单位划分时间区块（如：9:00-10:30, 10:30-12:00等）
- 用户选取日期以后，必须侦测到这个日期，读取数据库中，查找当前日子已被预约的时间段，并在前端需明显标识为"已预约"状态且不可选择
- 可用时间段允许用户点击选择

### 2. 用户信息收集

- 用户必填信息：姓名、手机号码
- 用户选填信息：其他联系方式（如微信、邮箱）、咨询内容备注
- 表单需包含数据验证功能（如手机号格式验证）

### 3. 数据存储

成功预约后，系统需将以下信息保存到数据库：
- 用户姓名
- 手机号码
- 其他联系方式
- 预约日期
- 预约时间段
- 球场
- 
- 备注信息（可选）

### 4. 用户体验

- 预约成功后显示明确的成功提示
- 预约失败时提供错误反馈
- 整体流程简洁明了，操作步骤不超过3步

## 设计要求
- 已预约时间段使用深灰色标识，字体颜色为深灰色。
- 被选中的时间段使用突出的主题色标识
- 页面需要响应式设计，适配移动设备和桌面设备

## 技术要求

- 使用NextJS开发前端，使用Neon的数据库服务处理用户输入数据
- 界面需保持简洁易用，加载迅速
- 代码需要包含适当的注释，便于后期维护

## 数据库结构设计

预约系统将需要存储以下数据：

### 预约表 (Appointments)

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | UUID | 预约记录唯一标识符 |
| user_name | VARCHAR | 用户姓名 |
| phone | VARCHAR | 手机号码 |
| contact_info | VARCHAR | 其他联系方式（可选） |
| appointment_date | DATE | 预约日期 |
| appointment_time | VARCHAR | 预约时间段 |
| notes | TEXT | 备注信息（可选） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 系统流程

1. 用户访问预约系统网站
2. 用户选择希望预约的日期
3. 系统显示该日期可用的时间段
4. 用户选择希望预约的时间段
5. 用户填写个人信息（姓名、手机号等）
6. 用户提交预约请求
7. 系统验证信息并保存预约记录
8. 系统向用户显示预约成功信息

## 开发计划

1. 前端界面设计与实现
   - 实现日期选择器组件
   - 实现时间段选择组件
   - 实现用户信息表单
   - 实现响应式布局

2. 后端功能实现
   - 设计并创建数据库结构
   - 实现预约信息的存储与查询功能
   - 实现数据验证功能

3. 系统测试与优化
   - 功能测试
   - 用户体验测试
   - 性能优化

4. 部署上线
   - 系统部署
   - 监控与维护