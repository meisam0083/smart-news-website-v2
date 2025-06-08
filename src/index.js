import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // این فایل رو در مرحله بعد می سازیم
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// ریشه اپلیکیشن رو پیدا می کنیم
const root = ReactDOM.createRoot(document.getElementById('root'));

// کامپوننت اصلی App رو داخل ریشه رندر می کنیم
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// سرویس ورکر رو برای قابلیت های آفلاین و نصب فعال می کنیم
// به جای unregister() از register() استفاده می کنیم تا فعال بشه
serviceWorkerRegistration.register();

