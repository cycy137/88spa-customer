// src/App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SpecialPromo from './components/SpecialPromo'; 
import Services from './components/Services';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import MobileBookingPopup from './components/MobileBookingPopup';
import { useSeasonalTheme } from './hooks/useSeasonalTheme';
import { fetchInitData, createAppointment } from './api/index';

export default function App() {
  const [dbConfig, setDbConfig] = useState({ services: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetService, setTargetService] = useState(null);

  // 挂载季节性主题机制
  useSeasonalTheme(dbConfig?.themeConfig);

  // 实时同步 D1 后端共享库数据
  useEffect(() => {
    const initializeStoreData = async () => {
      const data = await fetchInitData();
      if (data && data.services) {
        setDbConfig(data);
      }
    };
    initializeStoreData();
  }, []);

  const handleOpenBooking = (service = null) => {
    setTargetService(service);
    setIsModalOpen(true);
  };

  const handleAppointmentSubmit = async (appointmentPayload) => {
    try {
      await createAppointment(appointmentPayload);
      alert(`🎉 Appointment submitted successfully for ${appointmentPayload.customerName}!`);
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to sync appointment with backend. Please retry.");
    }
  };

  return (
    <div className="bg-spa-lightBg min-h-screen antialiased selection:bg-spa-gold selection:text-spa-textDark transition-colors duration-700">
      
      <header>
        <Navbar onBookNowClick={() => handleOpenBooking(null)} />
      </header>
      
      <main>
        {/* 1. 全清透、高易读环境大图首屏 */}
        <Hero onBookNowClick={() => handleOpenBooking(null)} />
        {/* 2. 独立高显特价区：由独立组件控制，新上项目与特价一目了然 */}
        <SpecialPromo 
          onBookNowClick={handleOpenBooking} 
          activeServices={dbConfig.services} 
        />
        {/* 3. 常规业务主菜单区 */}
        <Services onBookNowClick={handleOpenBooking} />
        
        <Reviews />
      </main>
      
      <Footer />

      {/* 手机端进站预约弹窗：每天只弹一次，电脑端不显示；促销位预留在组件内部 */}
      <MobileBookingPopup onBookNowClick={() => handleOpenBooking(null)} />

      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        servicesList={dbConfig.services} // 传入联动项目与加购项
        staffList={dbConfig.staff}       // 🌟 核心：将后端 D1 初始化拉取到的技师列表无缝推给弹窗过滤！
        selectedService={targetService}
        onSubmitAppointment={handleAppointmentSubmit}
      />
      
    </div>
  );
}
