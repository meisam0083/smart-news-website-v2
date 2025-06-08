const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const { GEMINI_API_KEY } = process.env;
  if (!GEMINI_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'کلید API تنظیم نشده است.' }) };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'پرامپت الزامی است.' }) };
    }
    
    // مدل Gemini 1.5 Flash برای سرعت و کیفیت بالاتر در ترجمه و خلاصه سازی
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash/generateContent?key=${GEMINI_API_KEY}`;
    
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

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
    
    // بررسی ساختار پاسخ جدید Gemini
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
        const summary = data.candidates[0].content.parts[0].text;
        return { statusCode: 200, body: JSON.stringify({ response: summary }) };
    } else {
        console.error('Unexpected Gemini API response structure:', data);
        return { statusCode: 500, body: JSON.stringify({ error: 'پاسخ غیرمنتظره از سرور هوش مصنوعی.' }) };
    }

  } catch (error) {
    console.error('Function Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'خطای داخلی سرور.' }) };
  }
};
