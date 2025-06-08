import React, { useState } from 'react';
import './index.css'; // فایل استایل را وارد می کنیم

// کامپوننت SVG برای آیکون ها جهت زیبایی بیشتر
const NewsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z" />
    <path d="M16 2v20" /><path d="M11 12h-1" /><path d="M11 8h-1" /><path d="M11 16h-1" />
  </svg>
);


// داده های نمونه که حالا فرض می کنیم از قبل توسط AI خلاصه شده اند
const preSummarizedNews = [
  {
    id: '1',
    title: 'تحولات جهانی در حوزه انرژی‌های پاک',
    imageUrl: 'https://placehold.co/600x400/2563eb/ffffff?text=Energy',
    summary: 'گذار به انرژی‌های تجدیدپذیر با سرعت بیشتری در حال انجام است و نوآوری‌ها در زمینه پنل‌های خورشیدی و توربین‌های بادی، آینده انرژی جهان را شکل می‌دهند.',
    content: `در مواجهه با بحران اقلیمی، جهان شاهد یک تغییر پارادایم به سمت منابع انرژی پاک است. سرمایه‌گذاری‌های عظیم در فناوری‌های خورشیدی و بادی، هزینه‌های تولید را کاهش داده و این منابع را به گزینه‌هایی رقابتی در برابر سوخت‌های فسیلی تبدیل کرده است. دولت‌ها نیز با ارائه سیاست‌های حمایتی، این گذار استراتژیک را تسریع می‌بخشند.`,
    timestamp: new Date().setHours(10, 30, 0, 0),
    category: 'انرژی پاک'
  },
  {
    id: '2',
    title: 'آینده هوش مصنوعی: فراتر از تصور',
    imageUrl: 'https://placehold.co/600x400/4f46e5/ffffff?text=AI',
    summary: 'مدل‌های جدید هوش مصنوعی با قابلیت‌های استدلال و خلاقیت پیشرفته، در حال ایجاد تحول در صنایع خلاق، پزشکی و علوم پایه هستند.',
    content: `هوش مصنوعی دیگر تنها یک ابزار برای اتوماسیون وظایf نیست، بلکه به یک همکار خلاق تبدیل شده است. مدل‌های زبانی بزرگ (LLMs) اکنون می‌توانند در نوشتن کد، تولید محتوای هنری و حتی کمک به تحقیقات علمی پیچیده نقش ایفا کنند. این پیشرفت‌ها، مرزهای بین توانایی‌های انسان و ماشین را کمرنگ‌تر از همیشه کرده‌اند.`,
    timestamp: new Date().setHours(11, 0, 0, 0),
    category: 'فناوری'
  },
    {
    id: '3',
    title: 'اقتصاد دیجیتال و چالش‌های پیش رو',
    imageUrl: 'https://placehold.co/600x400/0d9488/ffffff?text=Economy',
    summary: 'رشد سریع اقتصاد دیجیتال، فرصت‌های بی‌نظیری ایجاد کرده است، اما چالش‌هایی مانند امنیت سایبری و حفظ حریم خصوصی نیازمند راه‌حل‌های نوآورانه هستند.',
    content: `با گسترش تجارت الکترونیک، فین‌تک و کار از راه دور، اقتصاد جهانی به طور فزاینده‌ای دیجیتالی می‌شود. این تحول، بهره‌وری را افزایش داده و بازارهای جدیدی را خلق کرده است. با این حال، تضمین امنیت داده‌ها و ایجاد مقرراتی که از حقوق کاربران محافظت کند، به یکی از اولویت‌های اصلی دولت‌ها و شرکت‌ها تبدیل شده است.`,
    timestamp: new Date().setHours(9, 45, 0, 0),
    category: 'اقتصاد'
  },
];

// کامپوننت اصلی اپلیکیشن
function App() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  // کامپوننت هدر
  const Header = () => (
    <header className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-full">
            <NewsIcon />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">اخبار هوشمند</h1>
        </div>
      </div>
    </header>
  );

  // کامپوننت کارت خبر
  const ArticleCard = ({ article }) => (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer flex flex-col group"
      onClick={() => setSelectedArticle(article)}
    >
      <div className="overflow-hidden">
        <img src={article.imageUrl} alt={article.title} className="w-full h-56 object-cover transform transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-sm font-bold text-blue-600 mb-2">{article.category}</span>
        <h3 className="text-xl font-bold text-gray-900 flex-grow group-hover:text-blue-700 transition-colors">{article.title}</h3>
        <p className="text-gray-600 text-base mt-4 leading-relaxed">{article.summary}</p>
      </div>
    </div>
  );

  // کامپوننت فید اخبار
  const NewsFeed = () => (
    <div className="container mx-auto px-4 py-8 sm:py-12">
       <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">آخرین تحلیل‌ها</h2>
       <p className="text-lg text-gray-500 mb-12 text-center">منتخبی از مهم‌ترین اخبار روز که توسط هوش مصنوعی خلاصه شده‌اند</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {preSummarizedNews.map(article => <ArticleCard key={article.id} article={article} />)}
      </div>
    </div>
  );

  // کامپوننت مودال جزئیات خبر
  const ArticleDetailModal = ({ article, onClose }) => {
    if (!article) return null;

    // تابع کمکی برای فرمت تاریخ در مودال
    const formatModalTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 sm:p-8 overflow-y-auto">
            <div className="mb-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full">{article.category}</span>
                <p className="text-sm text-gray-500 mt-3">{formatModalTimestamp(article.timestamp)}</p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">{article.title}</h2>
            <div className="text-gray-700 text-lg leading-loose space-y-4">
                {article.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>
          <div className="flex justify-end p-4 bg-gray-100 border-t border-gray-200 rounded-b-2xl">
            <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">بستن</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <NewsFeed />
      </main>
      <ArticleDetailModal 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />
    </div>
  );
}

export default App;
