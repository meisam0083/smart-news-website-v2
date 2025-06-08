import React, { useState, useEffect } from 'react';

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    // اگر در صفحه جزئیات هستیم، اخبار جدید را لود نکن
    if (selectedArticle) return;
    
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch('/.netlify/functions/generate-and-get-news');
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "خطا در ارتباط با سرور هوشمند");
        }
        const articles = await response.json();
        setNews(articles);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [selectedArticle]); // هر بار که به صفحه اصلی برمی گردیم، اخبار تازه لود می شود

  const Header = () => (
    <header className="bg-white/95"><div className="container mx-auto max-w-3xl px-6 py-8 text-center"><h1 className="text-4xl font-extrabold text-blue-600 mb-4">اخبار هوشمند ایران</h1><p className="text-base font-semibold text-gray-500">تحلیل هوشمند مهم‌ترین رویدادهای روز ایران</p></div></header>
  );

  const ArticleCard = ({ article, index }) => {
    const timeAgo = (timestamp) => "لحظاتی پیش"; // برای سادگی
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
    if (loading) return <div className="text-center p-10 text-lg">خبرنگار هوشمند در حال تحلیل رویدادها...</div>;
    if (error) return <div className="text-center p-10 text-red-500">خطا: {error}</div>;
    return (
      <div className="container mx-auto max-w-3xl px-6 py-8"><div className="space-y-6">
          {news.map((article, index) => <ArticleCard key={article.id} article={article} index={index} />)}
      </div></div>
    );
  };

  const ArticleDetailView = ({ article, onBack }) => (
    <div className="container mx-auto max-w-3xl px-6 py-8 animate-fade-in-up">
        <button onClick={onBack} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg mb-8 hover:bg-gray-300 transition-colors">&larr; بازگشت به لیست اخبار</button>
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
