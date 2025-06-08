import React, { useState, useEffect } from 'react';

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // این تابع فقط یک فایل محلی را می خواند، برای همین بسیار سریع و مطمئن است
    const fetchSampleNews = async () => {
      try {
        // ما آدرس فایل بایگانی نمونه را مستقیم به fetch می دهیم
        const response = await fetch('/news.json');
        const articles = await response.json();
        setNews(articles);
      } catch (error) {
        console.error("Failed to fetch sample news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSampleNews();
  }, []);

  const Header = () => (
    <header className="bg-white/95"><div className="container mx-auto max-w-3xl px-6 py-8 text-center"><h1 className="text-4xl font-extrabold text-blue-600 mb-4">اخبار هوشمند ایران</h1><p className="text-base font-semibold text-gray-500">تحلیل هوشمند مهم‌ترین رویدادهای روز ایران</p></div></header>
  );

  const ArticleCard = ({ article, index }) => {
    const toPersianDigits = (numStr) => String(numStr).replace(/[0-9]/g, (w) => "۰۱۲۳۴۵۶۷۸۹"[w]);
    const timeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (seconds < 60) return "لحظاتی پیش";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${toPersianDigits(minutes)} دقیقه پیش`;
        const hours = Math.floor(minutes / 60);
        return `${toPersianDigits(hours)} ساعت پیش`;
    }
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex justify-between items-center mb-4">
                 <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{article.category}</span>
                 <span className="text-xs text-gray-400 font-medium">{timeAgo(article.timestamp)}</span>
            </div>
            <h3 className="text-base font-bold text-gray-800 leading-tight">{article.title}</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{article.summary}</p>
        </div>
    );
  };
  
  const NewsFeed = () => {
    if (loading) return <div className="text-center p-10 text-lg">درحال بارگذاری...</div>;
    return (
      <div className="container mx-auto max-w-3xl px-6 py-8"><div className="space-y-6">
          {news.map((article, index) => <ArticleCard key={article.id} article={article} index={index} />)}
      </div></div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header /><main><NewsFeed /></main>
    </div>
  );
}

export default App;
