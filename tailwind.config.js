/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 关键改动：将背景和过渡色绑定到 CSS 变量上，实现动态响应
        spa: {
          lightBg: 'var(--spa-dynamic-bg)',      // 动态季度主背景色
          accent: 'var(--spa-dynamic-accent)',    // 动态季度辅助过渡色
          cardBg: '#ffffff',                      // 卡片保持干净的纯白层
          textDark: '#2c3e35',                    // 稳定的温和深鼠尾草绿文字
          textMuted: '#6b7c73',                   // 辅助灰绿文字
          brand: '#3d644e',                       // 经典植物绿品牌强调色
          gold: '#c5a880',                        // 精致哑光香槟金
        }
      },
      fontFamily: {
        sans: ['Playfair Display', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
