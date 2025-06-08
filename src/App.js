import React from 'react'; // <<-- فقط این خط تغییر کرده است

// داده های نمونه که از قبل توسط AI خلاصه شده اند
const preSummarizedNews = [
  {
    id: '1',
    title: 'تحولات جهانی در حوزه انرژی‌های پاک',
    summary: 'گذار به انرژی‌های تجدیدپذیر با سرعت بیشتری در حال انجام است و نوآوری‌ها در زمینه پنل‌های خورشیدی و توربین‌های بادی، آینده انرژی جهان را شکل می‌دهند.',
    timestamp: new Date().setHours(10, 30, 0, 0),
    category: 'انرژی پاک'
  },
  {
    id: '2',
    title: 'آینده هوش مصنوعی: فراتر از تصور',
    summary: 'مدل‌های جدید هوش مصنوعی با قابلیت‌های استدلال و خلاقیت پیشرفته، در حال ایجاد تحول در صنایع خلاق، پزشکی و علوم پایه هستند.',
    timestamp: new Date().setHours(11, 0, 0, 0),
    category: 'فناوری'
  },
  {
    id: '3',
    title: 'اقتصاد دیجیتال و چالش‌های پیش رو',
    summary: 'رشد سریع اقتصاد دیجیتال، فرصت‌های بی‌نظیری ایجاد کرده است، اما چالش‌هایی مانند امنیت سایبری و حفظ حریم خصوصی نیازمند راه‌حل‌های نوآورانه هستند.',
    timestamp: new Date().setHours(9, 45, 0, 0),
    category: 'اقتصاد'
  },
];

// کامپوننت اصلی اپلیکیشن
function App() {

  // کامپوننت هدر
  const Header = () => (
    <header className="bg-white/95">
      <div className="container mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-4xl font-extrabold text-gray-900">داشبورد اخبار هوشمند</h1>
        <p className="mt-2 text-lg text-gray-500">کاوش در مهم‌ترین اخبار و تحلیل‌های روز</p>
      </div>
    </header>
  );

  // کامپوننت کارت خبر
  const ArticleCard = ({ article }) => {
    // تابع کمکی برای نمایش تاریخ به صورت "۳ ساعت پیش" و غیره
    const timeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " سال پیش";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " ماه پیش";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " روز پیش";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " ساعت پیش";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " دقیقه پیش";
        return "لحظاتی پیش";
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-500">
            <div className="flex justify-between items-center mb-4">
                 <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{article.category}</span>
                 <span className="text-xs text-gray-400 font-medium">{timeAgo(article.timestamp)}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 leading-snug">{article.title}</h3>
            <p className="text-gray-500 text-base mt-2 leading-relaxed">{article.summary}</p>
        </div>
    );
  };

  // کامپوننت فید اخبار
  const NewsFeed = () => (
    <div className="container mx-auto max-w-3xl px-6 py-8">
      <div className="space-y-6">
        {preSummarizedNews.map(article => <ArticleCard key={article.id} article={article} />)}
      </div>
    </div>
  );


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
