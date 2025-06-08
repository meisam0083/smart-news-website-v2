import React, { useState, useEffect } from 'react';

// کامپوننت اصلی اپلیکیشن
function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const generateNewsFromTopics = async () => {
      try {
        setLoading(true);
        // ۱. گرفتن موضوعات داغ ایران
        const topicsResponse = await fetch('/.netlify/functions/fetch-news');
        if (!topicsResponse.ok) throw new Error('خطا در دریافت موضوعات داغ');
        const trendingTopics = await topicsResponse.json();

        // ۲. تبدیل هر موضوع به یک مقاله کامل توسط هوش مصنوعی
        const generatedArticles = await Promise.all(
          trendingTopics.map(async (topic) => {
            const prompt = `به عنوان یک خبرنگار حرفه‌ای و بی‌طرف، یک مقاله خبری جذاب و دقیق در دو پاراگراف در مورد موضوع زیر بنویس. در پاراگراف اول به کلیات و اهمیت موضوع بپرداز و در پاراگراف دوم جزئیات و تحلیل‌های بیشتری ارائه بده. فقط متن مقاله را برگردان.
            موضوع: "${topic.topic}"`;

            const geminiResponse = await fetch('/.netlify/functions/gemini-proxy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt }),
            });

            if (!geminiResponse.ok) return null;
            const geminiResult = await geminiResponse.json();
            
            return {
              id: topic.id,
              title: topic.topic, // عنوان همان موضوع داغ است
              summary: geminiResult.response.substring(0, 150) + '...', // خلاصه کوتاه برای کارت
              content: geminiResult.response, // محتوای کامل تولید شده
              category: topic.category,
              timestamp: new Date().toISOString(), // زمان تولید مقاله
            };
          })
        );
        
        setNews(generatedArticles.filter(Boolean));
        setError(null);
      } catch (err) {
        setError('متاسفانه در حال حاضر امکان تولید اخبار هوشمند وجود ندارد.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    generateNewsFromTopics();
  }, []);

  const Header = () => (
    <header className="bg-white/95"><div className="container mx-auto max-w-3xl px-6 py-8 text-center"><h1 className="text-4xl font-extrabold text-blue-600 mb-4">اخبار هوشمند ایران</h1><p className="text-base font-semibold text-gray-500">تحلیل هوشمند مهم‌ترین رویدادهای روز ایران</p></div></header>
  );

  const ArticleCard = ({ article, index }) => {
    const toPersianDigits = (num) => num.toString().replace(/[0-9]/g, (w) => "۰۱۲۳۴۵۶۷۸۹"[w]);
    const timeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (seconds < 60) return "لحظاتی پیش";
        const minutes = seconds / 60;
        if (minutes < 60) return toPersianDigits(Math.floor(minutes)) + " دقیقه پیش";
        const hours = minutes / 60;
        return toPersianDigits(Math.floor(hours)) + " ساعت پیش";
    }
    return (
        <div onClick={() => setSelectedArticle(article)} className="bg-white cursor-pointer rounded-2xl shadow-sm border border-gray-200/80 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-500 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
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
    if (loading) return <div className="text-center p-10 text-lg text-gray-600">خبرنگار هوشمند در حال تحلیل رویدادهای ایران...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    return (
      <div className="container mx-auto max-w-3xl px-6 py-8"><div className="space-y-6">
          {news.map((article, index) => <ArticleCard key={article.id} article={article} index={index} />)}
      </div></div>
    );
  };
  
  const ArticleDetailView = ({ article, onBack }) => (
    <div className="container mx-auto max-w-3xl px-6 py-8 animate-fade-in-up">
        <button onClick={onBack} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg mb-8 hover:bg-gray-300 transition-colors">&rarr; بازگشت به لیست اخبار</button>
        <div className="bg-white rounded-2xl p-8">
             <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold mb-4 px-3 py-1 rounded-full">{article.category}</span>
             <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-snug">{article.title}</h1>
             <div className="text-lg text-gray-700 leading-loose space-y-4">
                 {article.content.split('\n').map((p, i) => p && <p key={i}>{p}</p>)}
             </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main>{selectedArticle ? <ArticleDetailView article={selectedArticle} onBack={() => setSelectedArticle(null)} /> : <NewsFeed />}</main>
    </div>
  );
}

export default App;
