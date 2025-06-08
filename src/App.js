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
    content: `هوش مصنوعی دیگر تنها یک ابزار برای اتوماسیون وظایف نیست، بلکه به یک همکار خلاق تبدیل شده است. مدل‌های زبانی بزرگ (LLMs) اکنون می‌توانند در نوشتن کد، تولید محتوای هنری و حتی کمک به تحقیقات علمی پیچیده نقش ایفا کنند. این پیشرفت‌ها، مرزهای بین توانایی‌های انسان و ماشین را کمرنگ‌تر از همیشه کرده‌اند.`,
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
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center p-4 sm:p-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">اخبار هوشمند</h1>
        <a href="#about" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm sm:text-base hover:bg-blue-700 transition-colors">
          درباره ما
        </a>
      </div>
    </header>
  );

  // کامپوننت کارت خبر
  const ArticleCard = ({ article }) => (
    <div 
      className="bg-white rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col"
      onClick={() => setSelectedArticle(article)}
    >
      <img src={article.imageUrl} alt={article.title} className="w-full h-52 object-cover" />
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-sm font-bold text-blue-600 mb-2">{article.category}</span>
        <h3 className="text-xl font-bold text-gray-900 flex-grow">{article.title}</h3>
        <p className="text-gray-600 text-base mt-3 leading-relaxed">{article.summary}</p>
      </div>
    </div>
  );

  // کامپوننت فید اخبار
  const NewsFeed = () => (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
       <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">آخرین اخبار و تحلیل‌ها</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {preSummarizedNews.map(article => <ArticleCard key={article.id} article={article} />)}
      </div>
    </div>
  );

  // کامپوننت مودال جزئیات خبر
  const ArticleDetailModal = ({ article, onClose }) => {
    if (!article) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
        <div className="bg-gray-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 sm:p-8 overflow-y-auto">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold mb-4 px-3 py-1 rounded-full">{article.category}</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{article.title}</h2>
            <p className="text-sm text-gray-500 mb-6">{formatTimestamp(article.timestamp)}</p>
            <img src={article.imageUrl} alt={article.title} className="w-full h-64 object-cover rounded-xl mb-6" />
            <div className="prose max-w-none text-gray-700 text-lg leading-loose" dangerouslySetInnerHTML={{ __html: marked(article.content.replace(/\n/g, '<br/>')) }} />
          </div>
          <div className="flex justify-end p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">بستن</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        <NewsFeed />
      </main>
    </div>
  );
}

export default App;
