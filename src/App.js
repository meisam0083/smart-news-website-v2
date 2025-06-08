import React, { useState, useEffect } from 'react';

// کامپوننت اصلی اپلیکیشن
function App() {
  // یک state برای نگهداری اخبار ترجمه شده
  const [persianNews, setPersianNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processNews = async () => {
      try {
        // ۱. گرفتن خبرهای انگلیسی
        setLoading(true);
        const newsResponse = await fetch('/.netlify/functions/fetch-news');
        if (!newsResponse.ok) throw new Error('خطا در دریافت اخبار اولیه');
        const englishArticles = await newsResponse.json();

        // ۲. ترجمه و خلاصه سازی هر خبر
        const translatedArticles = await Promise.all(
          englishArticles.map(async (article) => {
            // فقط مقالاتی که عنوان دارند را پردازش کن
            if (!article.title || article.title === "[Removed]") return null;

            const prompt = `Please act as a professional news editor. First, translate the following English news title and description into fluent and natural Persian. Then, based on the translated content, write a single, engaging, and concise summary paragraph in Persian.
            
            English Title: "${article.title}"
            English Description: "${article.description}"

            Only provide the final Persian summary paragraph, without any extra titles or introductory phrases.`;

            const geminiResponse = await fetch('/.netlify/functions/gemini-proxy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt }),
            });

            if (!geminiResponse.ok) return null; // اگر ترجمه یک خبر شکست خورد، از آن بگذر

            const geminiResult = await geminiResponse.json();

            return {
              id: article.url, // از URL به عنوان شناسه یکتا استفاده می کنیم
              title: geminiResult.response.split('\n')[0], // خط اول پاسخ را عنوان در نظر می گیریم
              summary: geminiResult.response, // کل پاسخ را خلاصه می گیریم
              source: article.source.name,
              timestamp: article.publishedAt,
              originalUrl: article.url,
            };
          })
        );
        
        // مقالات ناموفق (null) را حذف کن
        setPersianNews(translatedArticles.filter(Boolean));
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

  const ArticleCard = ({ article, index }) => (
    <a href={article.originalUrl} target="_blank" rel="noopener noreferrer"
      className="bg-white block rounded-2xl shadow-sm border border-gray-200/80 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-500 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}>
        <div className="flex justify-between items-center mb-4">
             <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{article.source}</span>
             <span className="text-xs text-gray-400 font-medium">{new Date(article.timestamp).toLocaleDateString('fa-IR')}</span>
        </div>
        <h3 className="text-base font-bold text-gray-800 leading-tight">{article.title}</h3>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{article.summary}</p>
    </a>
  );

  const NewsFeed = () => {
    if (loading) {
      return (
        <div className="text-center p-10 text-lg text-gray-600">
          <p>درحال دریافت اخبار از منابع جهانی...</p>
          <p className="text-sm mt-2">سپس ترجمه و خلاصه‌سازی توسط هوش مصنوعی...</p>
        </div>
      );
    }
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (persianNews.length === 0) return <div className="text-center p-10">هیچ خبری برای نمایش یافت نشد.</div>

    return (
      <div className="container mx-auto max-w-3xl px-6 py-8">
        <div className="space-y-6">
          {persianNews.map((article, index) => <ArticleCard key={article.id} article={article} index={index} />)}
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
