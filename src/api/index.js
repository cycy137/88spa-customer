// src/api/index.js

// 共享的 Cloudflare Worker 后端 API 基础地址
const API_BASE_URL = 'https://88spa.cycy1357.workers.dev';

/**
 * 从共享后端获取初始化数据（服务列表、价格等）
 * @returns {Promise<Object>} 返回服务项目和店铺配置信息
 */
export const fetchInitData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/init-data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch store initial data:', error);
    // 如果后端暂时不可用，返回一个本地的 Mock 数据作为保底，防止前端页面卡死崩溃
    return {
      services: [
        { id: 1, name: 'Premium Head Spa', duration: 60, price: 88, description: 'Deep scalp cleansing, massage, and relaxation treatment.' },
        { id: 2, name: 'Deep Tissue Massage', duration: 60, price: 95, description: 'Therapeutic massage targetting deep muscle layers.' }
      ]
    };
  }
};

/**
 * 客户在官网提交在线预约申请
 * @param {Object} appointmentData 预约详情 (客户姓名、电话、选定时间、服务ID等)
 * @returns {Promise<Object>} 后端返回的创建结果
 */
export const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch('https://88spa.cycy1357.workers.dev/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // 👈 这一行和 Worker 里的 cors 互相接头，绝不能掉
      },
      body: JSON.stringify(appointmentData) // 👈 完美吐出符合要求的 JSON Body 字符串
    });
    
    if (!response.ok) throw new Error('Cloudflare D1 sync failed');
    return await response.json();
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};
