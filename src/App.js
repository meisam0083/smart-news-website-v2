import React, { useState, useEffect } from 'react';

// کامپوننت اصلی اپلیکیشن
function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // این `useEffect` فقط یک بار موقع بالا آمدن سایت اجرا می شود
  useEffect(() => {
    // تابع برای گرفتن اخبار واقعی
    const fetchRealNews = async () => {
      try {
        const response = await fetch('/.netlify/functions/fetch-news');
        if (!response.ok) {
          throw new Error('خطا در دریافت اطلاعات از سرور');
        }
        const articles = await response.json();
        setNews(articles);
        setError(null);
      } catch (err) {
        setError('متاسفانه در حال حاضر امکان دریافت اخبار وجود ندارد.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealNews();
  }, []); // آرایه خالی به این معنی است که فقط یک بار اجرا شود


  // کامپوننت هدر
  const Header = () => (
    <header className="bg-white/95">
      <div className="container mx-auto max-w-3xl px-6 py-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">اخبار هوشمند</h1>
        <p className="text-base font-semibold text-gray-500">کاوش در مهم‌ترین اخبار و تحلیل‌های روز</p>
      </div>
    </header>
  );

  // کامپوننت کارت خبر
  const ArticleCard = ({ article, index }) => (
    <a href={article.url} target="_blank" rel="noopener noreferrer"
      className="bg-white block rounded-2xl shadow-sm border border-gray-200/80 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-500 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
        <div className="flex justify-between items-center mb-4">
             <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{article.source.name}</span>
             <span className="text-xs text-gray-400 font-medium">{new Date(article.publishedAt).toLocaleDateString('fa-IR')}</span>
        </div>
        <h3 className="text-base font-bold text-gray-800 leading-tight">{article.title}</h3>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{article.description}</p>
    </a>
  );

  // کامپوننت فید اخبار
  const NewsFeed = () => {
    if (loading) {
      return <div className="text-center p-10">درحال بارگذاری اخبار...</div>;
    }

    if (error) {
      return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
      <div className="container mx-auto max-w-3xl px-6 py-8">
        <div className="space-y-6">
          {news.map((article, index) => <ArticleCard key={article.url + index} article={article} index={index} />)}
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main>
        <NewsFeed />
      </main>
    </div>
  );
}

export default App;
