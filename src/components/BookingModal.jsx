// src/components/BookingModal.jsx
import React, { useState, useEffect } from 'react';
import { transformServiceData } from '../utils/serviceMapper';

/**
 * 官网在线预约弹窗
 * 流程：先选时间 → 再选项目（分类卡片，非长列表）→ 联系方式 → 提交
 * 规则：电话必填，姓名/邮箱可选；技师自动分配（已移除 Preferred Therapist 选项）
 */

// 当天日期（本地时区，格式 YYYY-MM-DD），用于预约日期默认值
const todayStr = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

// 项目分类（与 Services 主菜单保持一致的顺序）
const SERVICE_CATEGORIES = ['Combo', 'Full Body', 'Head', 'Foot'];
const priceOf = (s) => s.salePrice ?? s.price;

export default function BookingModal({ isOpen, onClose, servicesList = [], selectedService, onSubmitAppointment }) {
  
  // 1. 初始化表单状态（无 staffId，技师自动分配）
  const [formData, setFormData] = useState({
    customerPhone: '',     // 唯一核心必填
    customerName: '',      // Optional
    customerEmail: '',     // Optional
    serviceId: '',         // 选择的项目
    appointmentDate: todayStr(),
    appointmentTime: '',
    notes: ''              // 备注
  });

  // 2. 初始化选中的加购项状态
  const [selectedAddons, setSelectedAddons] = useState([]);

  // 2b. 预约人数（默认 1 人，可选 1-8 人）
  const [partySize, setPartySize] = useState(1);

  // 3. 项目分类 Tab 状态（默认 Combo）
  const [serviceCategory, setServiceCategory] = useState('Combo');

  // 从共享的全量服务列表中，精准剥离出“升级加购项（isAddon === 1）”
  const addonServices = servicesList.filter(item => item.isAddon === 1);
  // 剥离出常规主项目
  const mainServices = servicesList.filter(item => item.isAddon !== 1);

  // 当前分类下的项目（按价格从低到高）
  const categoryServices = mainServices
    .filter(s => s.category === serviceCategory)
    .sort((a, b) => priceOf(a) - priceOf(b));

  // 打开弹窗时初始化：日期重置为今天，加购清空，人数重置为 1，项目按传入的 selectedService 或默认 Combo 最便宜的
  useEffect(() => {
    if (!isOpen) return;
    setSelectedAddons([]);
    setPartySize(1);
    setFormData(prev => ({ ...prev, appointmentDate: todayStr() }));
    const pick = (svc) => {
      setFormData(prev => ({ ...prev, serviceId: svc.id.toString() }));
      setServiceCategory(SERVICE_CATEGORIES.includes(svc.category) ? svc.category : 'Combo');
    };
    if (selectedService) {
      pick(selectedService);
    } else {
      const sorted = [...mainServices].sort((a, b) => priceOf(a) - priceOf(b));
      const combos = sorted.filter(s => s.category === 'Combo');
      const fallback = combos[0] || sorted[0];
      if (fallback) pick(fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  // 动态价格实时计算（主项目实时价 + 所有勾选的加购特价）
  const currentMainService = servicesList.find(s => s.id.toString() === formData.serviceId);
  const mainPrice = currentMainService ? priceOf(currentMainService) : 0;
  
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = addonServices.find(a => a.id === id);
    return sum + (addon ? priceOf(addon) : 0);
  }, 0);

  const finalEstimatedTotal = (mainPrice + addonsTotal) * partySize;

  // 提交预约申请
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.customerPhone.trim()) {
      alert("Phone Number is strictly required to secure your appointment.");
      return;
    }
    if (!formData.appointmentDate || !formData.appointmentTime) {
      alert("Please select a valid Date and Time.");
      return;
    }
    if (!formData.serviceId) {
      alert("Please select a treatment.");
      return;
    }

    const combinedDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}:00`);
    const isoTimeStr = combinedDateTime.toISOString();

    const addonText = selectedAddons.length > 0 
      ? `[Add-ons: ${selectedAddons.map(id => addonServices.find(a => a.id === id)?.name).join(', ')}]`
      : '';
    const partyText = partySize > 1 ? `[Party of ${partySize}]` : '';
    const finalRemark = [formData.notes.trim(), addonText, partyText].filter(Boolean).join(' ');

    const finalPayload = {
      customerName: formData.customerName.trim() || "Guest Client",
      customerPhone: formData.customerPhone.trim(),
      staffId: 1,               // 自动分配
      staffName: "House Staff", // 自动分配
      serviceId: parseInt(formData.serviceId),
      serviceName: currentMainService ? currentMainService.name : "未知项目",
      appointmentTime: isoTimeStr,
      duration: currentMainService ? currentMainService.duration : 60,
      serviceFee: finalEstimatedTotal,
      tip: 0,
      status: "booked",
      remark: finalRemark
    };

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

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          
          {/* Step 1：先选时间 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-spa-brand text-white text-[11px] flex items-center justify-center font-semibold">1</span>
              <label className="text-xs font-semibold uppercase tracking-wider text-spa-textDark">Select Date & Time *</label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="date" name="appointmentDate" required value={formData.appointmentDate} onChange={handleChange}
                  className="w-full bg-spa-lightBg border border-spa-accent rounded-xl px-4 py-3 focus:outline-none focus:border-spa-brand transition-colors text-base font-medium"
                />
              </div>
              <div>
                <input
                  type="time" name="appointmentTime" required value={formData.appointmentTime} onChange={handleChange}
                  className="w-full bg-spa-lightBg border border-spa-accent rounded-xl px-4 py-3 focus:outline-none focus:border-spa-brand transition-colors text-base font-medium"
                />
              </div>
            </div>
          </div>

          {/* Step 2：再选项目（分类卡片，非长列表） */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-spa-brand text-white text-[11px] flex items-center justify-center font-semibold">2</span>
              <label className="text-xs font-semibold uppercase tracking-wider text-spa-textDark">Select Treatment *</label>
            </div>
            {/* 分类小 Tab */}
            <div className="flex flex-wrap gap-2 mb-3">
              {SERVICE_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setServiceCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs tracking-wider transition-all ${
                    serviceCategory === cat
                      ? 'bg-spa-brand text-white font-medium shadow-sm'
                      : 'bg-spa-accent/30 hover:bg-spa-accent/60 text-spa-textDark/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* 项目卡片（单选） */}
            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
              {categoryServices.map(service => {
                const { displayName } = transformServiceData(service);
                const isSelected = formData.serviceId === service.id.toString();
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, serviceId: service.id.toString() }))}
                    className={`flex items-center justify-between text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-spa-brand/5 border-spa-brand shadow-sm'
                        : 'bg-spa-lightBg border-spa-accent/60 hover:border-spa-brand/40'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{displayName}</div>
                      <div className="mt-1.5">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-spa-gold bg-spa-gold/10 border border-spa-gold/30 px-2.5 py-1 rounded-full">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {service.duration} mins
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-3 text-right">
                      <span className="text-sm font-semibold">${priceOf(service)}</span>
                      {service.salePrice ? (
                        <span className="ml-1.5 text-[10px] font-bold text-red-500 uppercase">Sale</span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
              {categoryServices.length === 0 && (
                <p className="text-xs text-spa-textMuted text-center py-4">No treatments in this category yet.</p>
              )}
            </div>

       
          </div>

          {/* Step 3：联系方式 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-spa-brand text-white text-[11px] flex items-center justify-center font-semibold">3</span>
              <label className="text-xs font-semibold uppercase tracking-wider text-spa-textDark">Your Contact Info</label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-spa-textMuted mb-1">Phone Number * (Required)</label>
                <input
                  type="tel" name="customerPhone" required value={formData.customerPhone} onChange={handleChange} placeholder="(425) 867-1867"
                  className="w-full bg-spa-lightBg border border-spa-accent rounded-xl px-4 py-3 focus:outline-none focus:border-spa-brand transition-colors text-base font-medium tracking-wide"
                />
              </div>
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
            </div>
                 {/* 预约人数 */}
            <div className="flex items-center justify-between mt-3 p-3 bg-spa-lightBg border border-spa-accent/60 rounded-xl">
              <div>
                <div className="text-sm font-medium">Number of Guests</div>
                <div className="text-[11px] text-spa-textMuted">How many people is this booking for?</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPartySize(prev => Math.max(1, prev - 1))}
                  disabled={partySize <= 1}
                  className="w-8 h-8 rounded-full border border-spa-accent flex items-center justify-center text-lg font-medium transition-all hover:border-spa-brand disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <span className="text-base font-bold w-6 text-center">{partySize}</span>
                <button
                  type="button"
                  onClick={() => setPartySize(prev => Math.min(8, prev + 1))}
                  disabled={partySize >= 8}
                  className="w-8 h-8 rounded-full border border-spa-accent flex items-center justify-center text-lg font-medium transition-all hover:border-spa-brand disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 升级加购项目区（Add-ons Checkboxes） */}
          {addonServices.length > 0 && (
            <div className="bg-spa-accent/20 p-4 rounded-2xl border border-spa-accent/60 space-y-3 animate-fade-in">
              <span className="block text-xs font-bold uppercase tracking-widest text-spa-gold">
                Enhance Your Experience (Optional Add-ons)
              </span>
              <div className="space-y-2">
                {addonServices.map(addon => {
                  const isChecked = selectedAddons.includes(addon.id);
                  const promoPrice = priceOf(addon);
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
                        {promoPrice === 0 ? 'FREE' : `+$${promoPrice}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 到店备注 */}
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

          {/* 实时总价动态换算与提交 */}
          <div className="pt-4 border-t border-spa-accent/30 flex items-center justify-between gap-4 mt-6">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-spa-textMuted font-semibold leading-none mb-1">
                Estimated Total
              </span>
              <span className="text-2xl font-bold tracking-tight text-spa-brand leading-none">
                ${finalEstimatedTotal}
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
