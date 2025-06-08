import React, { useState, useEffect } from 'react';

// کامپوننت اصلی اپلیکیشن
function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // این state برای مدیریت صفحه ای است که کاربر می بیند
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const processNews = async () => {
      try {
        setLoading(true);
        const newsResponse = await fetch('/.netlify/functions/fetch-news');
        if (!newsResponse.ok) throw new Error('خطا در دریافت اخبار اولیه');
        const englishArticles = await newsResponse.json();

        const translatedArticles = await Promise.all(
          englishArticles.map(async (article) => {
            if (!article.title || article.title === "[Removed]") return null;

            const prompt = `Please act as a professional news editor. First, provide a concise, engaging, and SEO-friendly title in Persian based on the English title. Then, on a new line, write a detailed and well-structured news article in fluent Persian based on the English content.

English Title: "${article.title}"
English Description: "${article.description}"

Your response should ONLY be the Persian title on the first line, followed by the Persian article body.`;
            
            const geminiResponse = await fetch('/.netlify/functions/gemini-proxy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt }),
            });

            if (!geminiResponse.ok) return null;
            const geminiResult = await geminiResponse.json();
            const parts = geminiResult.response.split('\n');
            const title = parts[0];
            const content = parts.slice(1).join('\n');

            return {
              id: article.url,
              title: title,
              summary: content.substring(0, 150) + '...', // یک خلاصه کوتاه برای کارت
              content: content, // متن کامل برای صفحه جزئیات
              source: article.source.name,
              timestamp: article.publishedAt,
              originalUrl: article.url,
            };
          })
        );
        
        setNews(translatedArticles.filter(Boolean));
        setError(null);
      } catch (err) {
        setError('متاسفانه در حال حاضر امکان پردازش اخبار وجود ندارد.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    processNews();
  }, []);

  const Header = () => (
    <header className="bg-white/95">
      <div className="container mx-auto max-w-3xl px-6 py-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">اخبار هوشمند</h1>
        <p className="text-base font-semibold text-gray-500">کاوش در مهم‌ترین اخبار و تحلیل‌های روز</p>
      </div>
    </header>
  );

  const ArticleCard = ({ article, index }) => {
    const toPersianDigits = (num) => num.toString().replace(/[0-9]/g, (w) => "۰۱۲۳۴۵۶۷۸۹"[w]);
    const timeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        let interval = seconds / 3600;
        if (interval > 24) return toPersianDigits(Math.floor(interval/24)) + " روز پیش";
        if (interval > 1) return toPersianDigits(Math.floor(interval)) + " ساعت پیش";
        interval = seconds / 60;
        if (interval > 1) return toPersianDigits(Math.floor(interval)) + " دقیقه پیش";
        return "لحظاتی پیش";
    }
    return (
        <div 
          onClick={() => setSelectedArticle(article)}
          className="bg-white cursor-pointer rounded-2xl shadow-sm border border-gray-200/80 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-500 animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex justify-between items-center mb-4">
                 <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{article.source}</span>
                 <span className="text-xs text-gray-400 font-medium">{timeAgo(article.timestamp)}</span>
            </div>
            <h3 className="text-base font-bold text-gray-800 leading-tight">{article.title}</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{article.summary}</p>
        </div>
    );
  };
  
  const NewsFeed = () => {
    if (loading) return <div className="text-center p-10 text-lg text-gray-600">درحال پردازش هوشمند اخبار...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    return (
      <div className="container mx-auto max-w-3xl px-6 py-8">
        <div className="space-y-6">
          {news.map((article, index) => <ArticleCard key={article.id} article={article} index={index} />)}
        </div>
      </div>
    );
  };
  
  const ArticleDetailView = ({ article, onBack }) => (
    <div className="container mx-auto max-w-3xl px-6 py-8 animate-fade-in-up">
        <button onClick={onBack} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg mb-8 hover:bg-gray-300 transition-colors">
            &rarr; بازگشت به لیست اخبار
        </button>
        <div className="bg-white rounded-2xl p-8">
             <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold mb-4 px-3 py-1 rounded-full">{article.source}</span>
             <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-snug">{article.title}</h1>
             <p className="text-sm text-gray-500 mb-6">{new Date(article.timestamp).toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
             <div className="text-lg text-gray-700 leading-loose space-y-4">
                 {article.content.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
             </div>
             <a href={article.originalUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-8 text-blue-600 font-semibold hover:underline">
                مشاهده منبع اصلی خبر
             </a>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main>
        {/* اینجا جادو اتفاق می افتد: اگر خبری انتخاب شده بود، صفحه جزئیات را نشان بده، وگرنه لیست اخبار را */}
        {selectedArticle ? (
          <ArticleDetailView article={selectedArticle} onBack={() => setSelectedArticle(null)} />
        ) : (
          <NewsFeed />
        )}
      </main>
    </div>
  );
}

export default App;
