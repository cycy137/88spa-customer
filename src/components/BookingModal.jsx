// src/components/BookingModal.jsx
import React, { useState, useEffect } from 'react';
import { transformServiceData } from '../utils/serviceMapper';

/**
 * 官网高联动在线预约弹窗
 * 规则：电话核心必填，姓名/邮箱可选，过滤兼职技师，移除房间选择，支持多选 Add-ons 金额累加
 */

// 当天日期（本地时区，格式 YYYY-MM-DD），用于预约日期默认值
const todayStr = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

export default function BookingModal({ isOpen, onClose, servicesList = [], staffList = [], selectedService, onSubmitAppointment }) {
  
  // 1. 初始化表单状态
  const [formData, setFormData] = useState({
    customerPhone: '',     // 🌟 唯一核心必填
    customerName: '',      // Optional
    customerEmail: '',     // Optional
    serviceId: '',         // 动态主项目联动
    staffId: '',           // 🌟 动态技师联动 (Optional)
    appointmentDate: todayStr(), // 🌟 默认当天
    appointmentTime: '',
    notes: ''              // 备注
  });

  // 2. 初始化选中的加购项状态（存储选中的 Add-on 服务的 ID 数组）
  const [selectedAddons, setSelectedAddons] = useState([]);

  // 从共享的全量服务列表中，精准剥离出“升级加购项（isAddon === 1）”
  const addonServices = servicesList.filter(item => item.isAddon === 1);
  // 剥离出常规主项目（用于下拉菜单联动选择）
  const mainServices = servicesList.filter(item => item.isAddon !== 1);

  // 🌟 核心过滤：从后台捞过来的技师列表中，过滤掉所有 Part-time（兼职）人员，只把 Full-time（全职）展现给前台客户
  // 假设您的 staff 表中有一个 status、type 或者 role 字段来区分；如果字段名不同，您可以对应修改下面这个 filter 条件
  const availableStaff = staffList.filter(member => 
    member.role !== 'Part-time' && 
    member.status !== 'Part-time' && 
    member.type !== 'Part-time' &&
    member.name !== 'PartTime'
  );

  // 当客户点击卡片直达预约时，自动锁定制定的服务
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({ ...prev, serviceId: selectedService.id.toString() }));
    } else if (mainServices.length > 0) {
      setFormData(prev => ({ ...prev, serviceId: mainServices[0].id.toString() }));
    }
  }, [selectedService, servicesList, isOpen]);

  // 🌟 预约日期默认当天：每次打开弹窗都重置为今天
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, appointmentDate: todayStr() }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 处理输入框变更
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理加购项的多选/取消勾选切换
  const handleAddonToggle = (addonId) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId) // 已存在则移除
        : [...prev, addonId]                // 不存在则加入
    );
  };

  // 3. 动态价格实时计算（主项目实时价 + 所有勾选的加购特价）
  const currentMainService = servicesList.find(s => s.id.toString() === formData.serviceId);
  const mainPrice = currentMainService ? (currentMainService.salePrice ?? currentMainService.price) : 0;
  
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = addonServices.find(a => a.id === id);
    return sum + (addon ? (addon.salePrice ?? addon.price) : 0);
  }, 0);

  const finalEstimatedTotal = mainPrice + addonsTotal;

  // 4. 提交预约申请，打通 D1 数据链
// src/components/BookingModal.jsx 内部的 handleSubmit 核心修正段落

    const handleSubmit = (e) => {
    e.preventDefault();

    // 1. 强力格式校验：确保手机号不为空（对应您的核心必填项诉求）
    if (!formData.customerPhone.trim()) {
        alert("Phone Number is strictly required to secure your appointment.");
        return;
    }
    if (!formData.appointmentDate || !formData.appointmentTime) {
        alert("Please select a valid Date and Time.");
        return;
    }

    // 2. 匹配当前指派的技师对象（从 B 端共享过来的 staffList 中检索）
    let assignedStaffName = "Auto Assign"; 
    let assignedStaffId = formData.staffId ? parseInt(formData.staffId) : null;

    if (formData.staffId) {
        const selectedStaffObj = staffList.find(s => s.id.toString() === formData.staffId);
        if (selectedStaffObj) {
        assignedStaffName = selectedStaffObj.name;
        }
    } else {
        // 🌟 细节保底：如果客户选了默认的 Auto Assign 盲选，为了不让 staffId 写入 null 导致后台崩盘，
        // 我们强制默认绑定到系统 1 号技师或特定公共池（这里根据您的格式对齐保留，或者传给后端处理）
        assignedStaffId = 1; 
        assignedStaffName = "House Staff";
    }

    // 3. 完美适配您提供的 API Body 规范，将 ISO 时间戳以及全量字段格式化封装
    // 结合所选日期与时间，转换成符合标准 UTC 的 ISO8601 字符串（例如: "2026-09-22T11:05:00.000Z"）
    const combinedDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}:00`);
    const isoTimeStr = combinedDateTime.toISOString();

    // 把选中的加购项追加进备注里
    const addonText = selectedAddons.length > 0 
        ? `[Add-ons: ${selectedAddons.map(id => addonServices.find(a => a.id === id)?.name).join(', ')}]`
        : '';
    const finalRemark = formData.notes.trim() 
        ? `${formData.notes.trim()} ${addonText}`.trim() 
        : addonText;

    // 🌟【这就是发给 https://88spa.cycy1357.workers.dev/api/appointments 的完美 Payload】
    const finalPayload = {
        customerName: formData.customerName.trim() || "Guest Client", // 姓名可选
        customerPhone: formData.customerPhone.trim(),                  // 电话主体
        staffId: assignedStaffId,                                      // 整数 (e.g. 2)
        staffName: assignedStaffName,                                  // 字符串 (e.g. "Shanny")
        serviceId: parseInt(formData.serviceId),                       // 整数 (e.g. 2)
        serviceName: currentMainService ? currentMainService.name : "未知项目", // 字符串 (e.g. "脚60")
        appointmentTime: isoTimeStr,                                   // UTC ISO 时间戳字符串
        duration: currentMainService ? currentMainService.duration : 60,// 整数 (e.g. 60)
        serviceFee: finalEstimatedTotal,                               // 包含 Add-on 的总价格数 (e.g. 60)
        tip: 0,                                                        // 默认小费 0
        status: "booked",                                              // 官网预定，状态锁死为 "booked"
        remark: finalRemark                                            // 整合手写备注与加购
    };

    // 4. 正式触发 App.jsx 传下来的异步 fetch 发送动作
    onSubmitAppointment(finalPayload);
    };


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex p-4 bg-spa-textDark/60 backdrop-blur-sm animate-fade-in">
      <div className="relative m-auto bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-spa-accent/50 p-6 sm:p-8 text-spa-textDark max-h-[90vh] overflow-y-auto">
        
        {/* 右上角关闭按钮 */}
        <button onClick={onClose} className="absolute top-5 right-5 text-spa-textMuted hover:text-spa-brand transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* 头部标题 */}
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-serif font-light tracking-wide text-spa-brand">Schedule Your Session</h3>
          <p className="text-xs text-spa-textMuted mt-1">Real-time dynamic integration with 88spa database</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          
          {/* 1. 唯一核心必填：手机号 */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-spa-textMuted mb-1">Phone Number * (Required)</label>
            <input
              type="tel" name="customerPhone" required value={formData.customerPhone} onChange={handleChange} placeholder="(425) 867-1867"
              className="w-full bg-spa-lightBg border border-spa-accent rounded-xl px-4 py-3 focus:outline-none focus:border-spa-brand transition-colors text-base font-medium tracking-wide"
            />
          </div>

          {/* 2. 全量可选字段组（姓名与邮箱） */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-spa-textMuted mb-1">Your Name (Optional)</label>
              <input
                type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="e.g. Sarah J."
                className="w-full bg-spa-lightBg border border-spa-accent rounded-xl px-4 py-3 focus:outline-none focus:border-spa-brand transition-colors text-base"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-spa-textMuted mb-1">Email (Optional)</label>
              <input
                type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="sarah@example.com"
                className="w-full bg-spa-lightBg border border-spa-accent rounded-xl px-4 py-3 focus:outline-none focus:border-spa-brand transition-colors text-base"
              />
            </div>
          </div>

          {/* 3. 动态联动：选择主服务项目 */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-spa-textMuted mb-1">Select Treatment *</label>
             <select
                name="serviceId" 
                value={formData.serviceId} 
                onChange={handleChange}
                className="w-full bg-spa-lightBg border border-spa-accent rounded-xl px-4 py-3 focus:outline-none focus:border-spa-brand transition-colors text-spa-textDark font-medium"
            >
                {mainServices.map(service => {
                
                // 🌟【核心修复点】：在这里直接拦截并将下拉列表中的“头40”转化为专业英文名称
                const { displayName } = transformServiceData(service);

                return (
                    <option key={service.id} value={service.id}>
                    {displayName} ({service.duration} mins) — \${service.salePrice || service.price}
                    {service.salePrice ? ' [🔥 SPECIAL OFFER]' : ''}
                    </option>
                );
                })}
            </select>
          </div>

          {/* 4. 动态数据共享：选特定的全职技师 (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-spa-textMuted mb-1">Preferred Therapist (Optional)</label>
            <select
              name="staffId" value={formData.staffId} onChange={handleChange}
              className="w-full bg-spa-lightBg border border-spa-accent rounded-xl px-4 py-3 focus:outline-none focus:border-spa-brand transition-colors font-medium text-spa-textDark"
            >
              <option value="">Auto Assign (Best Available Therapist)</option>
              {availableStaff.map(staff => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>

          {/* 5. 极简时间调度排班组（移除了 roomNumber） */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-spa-textMuted mb-1">Date *</label>
              <input
                type="date" name="appointmentDate" required value={formData.appointmentDate} onChange={handleChange}
                className="w-full bg-spa-lightBg border border-spa-accent rounded-xl px-4 py-3 focus:outline-none focus:border-spa-brand transition-colors text-base font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-spa-textMuted mb-1">Time *</label>
              <input
                type="time" name="appointmentTime" required value={formData.appointmentTime} onChange={handleChange}
                className="w-full bg-spa-lightBg border border-spa-accent rounded-xl px-4 py-3 focus:outline-none focus:border-spa-brand transition-colors text-base font-medium"
              />
            </div>
          </div>

          {/* 6. 🌟 高光视觉：升级加购项目区（Add-ons Checkboxes） */}
          {addonServices.length > 0 && (
            <div className="bg-spa-accent/20 p-4 rounded-2xl border border-spa-accent/60 space-y-3 animate-fade-in">
              <span className="block text-xs font-bold uppercase tracking-widest text-spa-gold">
                Enhance Your Experience (Optional Add-ons)
              </span>
              <div className="space-y-2">
                {addonServices.map(addon => {
                  const isChecked = selectedAddons.includes(addon.id);
                  const promoPrice = addon.salePrice ?? addon.price;
                  return (
                    <label 
                      key={addon.id} 
                      className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 cursor-pointer select-none border ${
                        isChecked 
                          ? 'bg-white border-spa-gold/50 shadow-sm' 
                          : 'bg-transparent border-transparent hover:bg-white/40'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={() => handleAddonToggle(addon.id)}
                          className="h-4 w-4 rounded border-spa-accent text-spa-brand focus:ring-spa-brand cursor-pointer"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-spa-textDark">{addon.name}</span>
                          <span className="text-[11px] text-spa-textMuted font-light">
                            {addon.id === 23 ? 'Pure therapeutic plant oils.' : 'Targeted localized deep-heat relief.'}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-spa-brand flex-shrink-0">
                        {promoPrice === 0 ? 'FREE' : `+\$${promoPrice}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7. 到店备注 */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-spa-textMuted mb-1">
              Special Requests / Notes (Optional)
            </label>
            <textarea
              name="notes" 
              rows="2" 
              value={formData.notes} 
              onChange={handleChange} 
              placeholder="Any specific skin allergies, sensitivities, or areas of high muscle tension we should know about?"
              className="w-full bg-spa-lightBg border border-spa-accent rounded-xl px-4 py-3 focus:outline-none focus:border-spa-brand transition-colors resize-none text-base leading-relaxed"
            />
          </div>

          {/* 8. 实时总价动态换算与一键拦截提交流水线 */}
          <div className="pt-4 border-t border-spa-accent/30 flex items-center justify-between gap-4 mt-6">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-spa-textMuted font-semibold leading-none mb-1">
                Estimated Total
              </span>
              <span className="text-2xl font-bold tracking-tight text-spa-brand leading-none">
                \${finalEstimatedTotal}
              </span>
            </div>
            <button
              type="submit"
              className="flex-1 bg-spa-brand hover:bg-spa-brand/90 text-white font-medium py-3.5 rounded-xl text-base tracking-wider transition-all duration-300 shadow-md hover:shadow-spa-brand/10 transform active:scale-[0.99]"
            >
              Request Appointment
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
