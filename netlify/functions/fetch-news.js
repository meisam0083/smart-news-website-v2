// This function now provides trending topics related to Iran
exports.handler = async () => {
  // For now, we simulate finding trending topics.
  // In the future, this could fetch data from Google Trends or other sources.
  const trendingTopics = [
    {
      "id": "iran-stock-market-1",
      "topic": "آخرین تحولات بازار بورس و فرابورس ایران",
      "category": "اقتصادی"
    },
    {
      "id": "iran-tech-startup-2",
      "topic": "رونمایی از جدیدترین دستاوردهای استارتاپ‌های دانش‌بنیان",
      "category": "فناوری"
    },
    {
      "id": "iran-national-football-3",
      "topic": "عملکرد تیم ملی فوتبال ایران در رقابت‌های مقدماتی",
      "category": "ورزشی"
    },
    {
        "id": "iran-environment-water-4",
        "topic": "چالش‌های مدیریت منابع آبی در فلات مرکزی ایران",
        "category": "محیط زیست"
    }
  ];

  try {
    return {
      statusCode: 200,
      body: JSON.stringify(trendingTopics),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error.' }) };
  }
};
