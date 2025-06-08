// این فایل به عنوان یک سرور کوچک عمل می کند تا کلید API شما مخفی بماند
const fetch = require('node-fetch');

exports.handler = async (event) => {
  // فقط درخواست های POST را قبول می کنیم
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // کلید API را از متغیرهای محیطی Netlify می خوانیم
  const { GEMINI_API_KEY } = process.env;
  if (!GEMINI_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'کلید API تنظیم نشده است.' }) };
  }

  try {
    // پرامپت (دستور) را از درخواست دریافت می کنیم
    const { prompt } = JSON.parse(event.body);
    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'پرامپت الزامی است.' }) };
    }
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    // درخواست را به سرور گوگل ارسال می کنیم
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return { statusCode: response.status, body: JSON.stringify({ error: 'خطا در ارتباط با سرور هوش مصنوعی.' }) };
    }

    const data = await response.json();
    // پاسخ تمیز شده را استخراج می کنیم
    const summary = data.candidates[0]?.content?.parts[0]?.text || 'خلاصه ای دریافت نشد.';

    // پاسخ موفق را به اپلیکیشن برمی گردانیم
    return { statusCode: 200, body: JSON.stringify({ response: summary }) };

  } catch (error) {
    console.error('Function Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'خطای داخلی سرور.' }) };
  }
};
