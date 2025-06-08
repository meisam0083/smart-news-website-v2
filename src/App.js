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

// داده های نمونه که حالا فرض می کنیم از قبل خلاصه شده اند
const preSummarizedNews = [
  {
    id: '1',
    title: 'تغییرات اقلیمی و آینده سیاره زمین',
    imageUrl: 'https://placehold.co/600x400/15803d/ffffff?text=Climate',
    // این خلاصه کوتاه برای نمایش در کارت خبر است
    summary: 'تحلیلگران بر این باورند که افزایش دمای جهانی و ذوب شدن یخچال‌های طبیعی، چالش‌های بزرگی برای بشریت در قرن ۲۱ ایجاد کرده است.',
    // این متن کامل‌تر (که توسط AI تولید شده) در مودال نمایش داده می‌شود
    content: `بر اساس آخرین گزارش‌ها، تغییرات اقلیمی به عنوان یک بحران جهانی شناخته می‌شود که پیامدهایی چون افزایش سطح دریاها و وقوع پدیده‌های آب و هوایی شدید را به همراه دارد. فعالیت‌های انسانی، به ویژه سوزاندن سوخت‌های فسیلی، عامل اصلی این تغییرات معرفی شده‌اند. راهکارهای جهانی برای مقابله با این پدیده بر گذار به انرژی‌های تجدیدپذیر و همکاری‌های بین‌المللی متمرکز است.`,
    timestamp: new Date().setHours(10, 30, 0, 0),
    category: 'محیط زیست'
  },
  {
    id: '2',
    title: 'پیشرفت‌های اخیر در هوش مصنوعی',
    imageUrl: 'https://placehold.co/600x400/16a34a/ffffff?text=AI',
    summary: 'هوش مصنوعی با پیشرفت‌های چشمگیر در پردازش زبان طبیعی و رباتیک، در حال دگرگون کردن صنایع مختلف و زندگی روزمره است.',
    content: `انقلاب هوش مصنوعی با سرعتی بالا در حال پیشرفت است و کاربردهای آن از پزشکی و تشخیص بیماری‌ها تا حمل‌ونقل خودران و امور مالی گسترش یافته است. با وجود پتانسیل عظیم برای حل مشکلات پیچیده، چالش‌های اخلاقی و تاثیر بر بازار کار نیز از دغدغه‌های اصلی این حوزه به شمار می‌رود. توسعه مسئولانه AI کلید بهره‌برداری از فرصت‌های آینده خواهد بود.`,
    timestamp: new Date().setHours(11, 0, 0, 0),
    category: 'فناوری'
  },
];

// کامپوننت اصلی اپلیکیشن
function App() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  // کامپوننت هدر
  const Header = () => (
    <header className="bg-green-700 text-white p-4 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-xl sm:text-2xl font-bold">اخبار هوشمند</h1>
        <nav><a href="#about" className="text-sm sm:text-base hover:text-green-200">درباره ما</a></nav>
      </div>
    </header>
  );

  // کامپوننت کارت خبر
  const ArticleCard = ({ article }) => (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col"
      onClick={() => setSelectedArticle(article)}
    >
      <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-sm font-semibold text-green-600 mb-2">{article.category}</span>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-grow">{article.title}</h3>
        <p className="text-gray-700 text-sm mt-2 leading-relaxed">{article.summary}</p>
      </div>
    </div>
  );

  // کامپوننت فید اخبار
  const NewsFeed = ({ news }) => (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {news.map(article => <ArticleCard key={article.id} article={article} />)}
      </div>
    </div>
  );

  // کامپوننت مودال جزئیات خبر
  const ArticleDetailModal = ({ article, onClose }) => {
    if (!article) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="p-5 sm:p-7 overflow-y-auto">
            <img src={article.imageUrl} alt={article.title} className="w-full h-56 sm:h-72 object-cover rounded-xl mb-5" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{article.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{formatTimestamp(article.timestamp)}</p>
            <div className="prose max-w-none text-gray-800 leading-loose" dangerouslySetInnerHTML={{ __html: marked(article.content.replace(/\n/g, '<br/>')) }} />
          </div>
          <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
            <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-5 rounded-lg transition-colors">بستن</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {/* حالا از داده های از قبل خلاصه شده استفاده می کنیم */}
        <NewsFeed news={preSummarizedNews} />
      </main>
      <ArticleDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}

export default App;
