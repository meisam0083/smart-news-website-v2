import React, { useState } from 'react';
import { marked } from 'marked';
import './index.css'; // فایل استایل را وارد می کنیم

// تابع کمکی برای فرمت زیبای تاریخ به فارسی
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('fa-IR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// داده های نمونه اخبار
const mockNews = [
  {
    id: '1',
    title: 'تغییرات اقلیمی و آینده سیاره زمین',
    imageUrl: 'https://placehold.co/600x400/15803d/ffffff?text=Climate',
    summary: 'مقاله ای جامع در مورد آخرین تحولات تغییرات اقلیمی، اثرات آن بر محیط زیست و راهکارهای جهانی برای مقابله با آن.',
    content: `**تغییرات اقلیمی: یک بحران جهانی**\n\nتغییرات اقلیمی یکی از بزرگترین چالش‌های پیش روی بشریت در قرن 21 است. افزایش دمای جهانی، ذوب شدن یخچال‌های طبیعی، و بالا آمدن سطح دریاها از جمله پیامدهای این پدیده هستند.`,
    timestamp: new Date().setHours(10, 30, 0, 0),
    category: 'محیط زیست'
  },
  {
    id: '2',
    title: 'پیشرفت‌های اخیر در هوش مصنوعی',
    imageUrl: 'https://placehold.co/600x400/16a34a/ffffff?text=AI',
    summary: 'مروری بر تازه‌ترین دستاوردهای هوش مصنوعی در زمینه‌های مختلف از جمله پردازش زبان طبیعی و بینایی کامپیوتر.',
    content: `**انقلاب هوش مصنوعی در راه است**\n\nهوش مصنوعی (AI) به سرعت در حال پیشرفت است و مرزهای آنچه را که ماشین‌ها می‌توانند انجام دهند، جابجا می‌کند. از پردازش زبان طبیعی (NLP) گرفته تا رباتیک پیشرفته، کاربردهای AI در حال تغییر زندگی روزمره و صنایع مختلف هستند.`,
    timestamp: new Date().setHours(11, 0, 0, 0),
    category: 'فناوری'
  },
];

// کامپوننت اصلی اپلیکیشن
function App() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [summarizedContent, setSummarizedContent] = useState({});
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  // تابع فراخوانی هوش مصنوعی برای خلاصه سازی
  const summarizeArticle = async (articleId, content) => {
    setLoadingSummary(true);
    setSummaryError('');
    try {
      const prompt = `متن خبری زیر را به زبان فارسی و در حداکثر 3 جمله کلیدی و مهم خلاصه کن. فقط متن خلاصه را برگردان:\n\n${content}`;
      const apiUrl = '/.netlify/functions/gemini-proxy';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ارتباط با سرور هوش مصنوعی ناموفق بود');
      }

      const result = await response.json();
      if (result.response) {
        setSummarizedContent(prev => ({ ...prev, [articleId]: result.response }));
      } else {
        throw new Error('پاسخ معتبری از هوش مصنوعی دریافت نشد.');
      }
    } catch (error) {
      setSummaryError(error.message);
    } finally {
      setLoadingSummary(false);
    }
  };

  // کامپوننت هدر
  const Header = () => (
    <header className="bg-green-700 text-white p-4 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">اخبار هوشمند</h1>
        <nav><a href="#about" className="hover:text-green-200">درباره ما</a></nav>
      </div>
    </header>
  );

  // کامپوننت کارت خبر
  const ArticleCard = ({ article }) => (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105 duration-300 cursor-pointer flex flex-col"
      onClick={() => setSelectedArticle(article)}
    >
      <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-sm font-semibold text-green-600">{article.category}</span>
        <h3 className="font-bold text-xl my-2 text-gray-800 flex-grow">{article.title}</h3>
        <p className="text-gray-600 text-sm">{article.summary}</p>
      </div>
    </div>
  );

  // کامپوننت فید اخبار
  const NewsFeed = ({ news }) => (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map(article => <ArticleCard key={article.id} article={article} />)}
      </div>
    </div>
  );

  // کامپوننت مودال جزئیات خبر
  const ArticleDetailModal = ({ article, onClose }) => {
    if (!article) return null;
    const displayedContent = summarizedContent[article.id] || article.content;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{article.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{formatTimestamp(article.timestamp)}</p>
            <img src={article.imageUrl} alt={article.title} className="w-full h-64 object-cover rounded-md mb-4" />
            <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: marked(displayedContent.replace(/\n/g, '<br/>')) }} />
          </div>
          <div className="flex justify-end items-center gap-3 p-4 bg-gray-50 border-t border-gray-200">
            {loadingSummary && <p className="text-gray-600 animate-pulse">در حال خلاصه‌سازی...</p>}
            {summaryError && <p className="text-red-500 text-sm">{summaryError}</p>}
            {!loadingSummary && !summaryError && !summarizedContent[article.id] && (
              <button onClick={() => summarizeArticle(article.id, article.content)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                خلاصه‌سازی با AI
              </button>
            )}
            <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">بستن</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        <NewsFeed news={mockNews} />
      </main>
      <ArticleDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}

export default App;
