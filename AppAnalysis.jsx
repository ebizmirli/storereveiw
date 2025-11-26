import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Globe, Star, BarChart2, MessageSquare, AlertTriangle, 
  CheckCircle, Smartphone, Share2, Loader2, Info, ArrowLeft, 
  Lightbulb, List, TrendingUp, ShieldAlert, Cpu, Download, 
  Activity, Users, Copy, Check, ChevronDown, MessageCircle, Calendar
} from 'lucide-react';

// --- YARDIMCI BİLEŞENLER (UI Kütüphanesi) ---

// Yıldız Derecelendirme Bileşeni
const StarRating = ({ rating, size = "w-4 h-4" }) => (
  <div className="flex text-yellow-400 gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`${size} ${i < Math.round(rating) ? 'fill-current' : 'text-gray-200 fill-gray-200'}`} 
      />
    ))}
  </div>
);

// Etiket (Badge) Bileşeni
const Badge = ({ children, color = "blue", icon: Icon }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    red: "bg-red-50 text-red-700 border-red-100",
    yellow: "bg-amber-50 text-amber-700 border-amber-100",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${colors[color]}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};

// İstatistik Kartı
const StatCard = ({ title, value, subtext, icon: Icon, color = "blue" }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-emerald-600 bg-emerald-50",
    red: "text-red-600 bg-red-50",
    purple: "text-purple-600 bg-purple-50"
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};

// --- CHART BİLEŞENLERİ (SVG) ---

const TrendChart = ({ reviews }) => {
  // Günlük ortalamaları hesapla
  const dailyData = useMemo(() => {
    const groups = {};
    reviews.forEach(r => {
      const dateKey = new Date(r.rawDate).toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!groups[dateKey]) groups[dateKey] = { sum: 0, count: 0, date: dateKey };
      groups[dateKey].sum += r.rating;
      groups[dateKey].count += 1;
    });
    
    return Object.values(groups)
      .map(g => ({ date: g.date, avg: g.sum / g.count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [reviews]);

  if (dailyData.length < 2) return <div className="h-40 flex items-center justify-center text-gray-400 text-sm">Trend analizi için daha fazla veri gerekiyor.</div>;

  const width = 100;
  const height = 40;
  const maxAvg = 5;
  const minAvg = 1;
  
  const points = dailyData.map((d, i) => {
    const x = (i / (dailyData.length - 1)) * width;
    const y = height - ((d.avg - minAvg) / (maxAvg - minAvg)) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-40">
      <svg viewBox={`0 0 ${width} ${height + 10}`} className="w-full h-full overflow-visible">
        {/* Grid lines */}
        <line x1="0" y1="0" x2="100" y2="0" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1={height/2} x2="100" y2={height/2} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1={height} x2="100" y2={height} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2" />
        
        {/* Trend Line */}
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Dots */}
        {dailyData.map((d, i) => {
             const x = (i / (dailyData.length - 1)) * width;
             const y = height - ((d.avg - minAvg) / (maxAvg - minAvg)) * height;
             return (
               <circle key={i} cx={x} cy={y} r="1.5" fill="white" stroke="#3b82f6" strokeWidth="1">
                 <title>{d.date}: {d.avg.toFixed(1)} Puan</title>
               </circle>
             )
        })}
        
        {/* Labels */}
        <text x="0" y={height + 8} fontSize="4" fill="#94a3b8">{dailyData[0].date}</text>
        <text x="100" y={height + 8} fontSize="4" fill="#94a3b8" textAnchor="end">{dailyData[dailyData.length-1].date}</text>
      </svg>
    </div>
  );
};

const DistributionChart = ({ reviews }) => {
  const counts = [0, 0, 0, 0, 0, 0]; // index 1 to 5
  reviews.forEach(r => counts[r.rating]++);
  const max = Math.max(...counts.slice(1));

  return (
    <div className="h-40 flex items-end justify-between gap-2 px-2">
      {[1, 2, 3, 4, 5].map(star => (
        <div key={star} className="flex flex-col items-center gap-1 w-full group">
           <div className="text-xs font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{counts[star]}</div>
           <div 
             className={`w-full rounded-t-lg transition-all duration-500 ${star >= 4 ? 'bg-green-400' : star <= 2 ? 'bg-red-400' : 'bg-gray-300'}`}
             style={{ height: `${max > 0 ? (counts[star] / max) * 100 : 0}%`, minHeight: '4px' }}
           ></div>
           <div className="text-xs font-bold text-gray-600 flex items-center gap-0.5">
             {star} <Star className="w-2.5 h-2.5 fill-gray-600 text-gray-600" />
           </div>
        </div>
      ))}
    </div>
  );
};


// --- CEVAP OLUŞTURUCU KART ---

const TONES = {
  formal: { tr: "Resmi", en: "Formal" },
  casual: { tr: "Samimi", en: "Casual" },
  support: { tr: "Destek/Çözüm", en: "Supportive" },
  grateful: { tr: "Minnettar", en: "Grateful" }
};

const generateAIResponse = (review, tone, lang) => {
  const isPositive = review.rating >= 4;
  const content = (review.title + " " + review.content).toLowerCase();
  
  const hasBug = ['hata', 'bug', 'crash', 'açılmıyor', 'atıyor', 'error', 'fail'].some(k => content.includes(k));
  const hasAds = ['reklam', 'ads', 'video', 'advert'].some(k => content.includes(k));
  const hasMoney = ['para', 'ücret', 'pahalı', 'abonelik', 'fiyat', 'money', 'price', 'expensive', 'cost', 'subscription'].some(k => content.includes(k));
  const hasPerf = ['yavaş', 'donuyor', 'kasıyor', 'slow', 'lag', 'freeze'].some(k => content.includes(k));

  const templates = {
    tr: {
      formal: {
        pos: `Sayın Kullanıcımız,\n\nDeğerli geri bildiriminiz ve güzel sözleriniz için çok teşekkür ederiz. Sizlere en iyi deneyimi sunmak için çalışmaya devam edeceğiz.\n\nSaygılarımızla,\nDestek Ekibi`,
        neg: `Sayın Kullanıcımız,\n\nYaşadığınız olumsuz deneyimden dolayı üzgünüz. Geri bildiriminizi dikkate alarak gerekli incelemeleri başlattık.\n\nSaygılarımızla,\nDestek Ekibi`,
        bug: `Sayın Kullanıcımız,\n\nBildirdiğiniz teknik sorun için özür dileriz. Hata raporunuzu geliştirici ekibimize ilettik ve bir sonraki güncellemede düzeltilmesi için öncelik verdik.\n\nAnlayışınız için teşekkürler.`,
        money: `Sayın Kullanıcımız,\n\nFiyatlandırma politikamızla ilgili geri bildiriminiz için teşekkür ederiz. Yerel piyasa koşullarını dikkate alarak fiyatlarımızı düzenli olarak gözden geçiriyoruz.`,
        perf: `Sayın Kullanıcımız,\n\nUygulama performansıyla ilgili yaşadığınız sorunların farkındayız. Mühendislerimiz optimizasyon üzerinde çalışıyor.`,
        ads: `Sayın Kullanıcımız,\n\nReklam gösterim sıklığı ile ilgili şikayetinizi not aldık. Kullanıcı deneyimini bozmamak adına reklam yerleşimlerini yeniden değerlendireceğiz.`
      },
      casual: {
        pos: `Selam ${review.author}! 🚀\n\nHarika yorumun için teşekkürler! Beğenmene çok sevindik. Bizi takip etmeye devam et! 😎`,
        neg: `Selam,\n\nUygulamada yaşadığın sorun için gerçekten üzgünüz 😔. Bunu hemen düzeltmek istiyoruz.`,
        bug: `Selam!\n\nHata bildirimini aldık! 🛠️ Ekibimiz şu an kodların arasına daldı ve sorunu çözmeye çalışıyor.`,
        money: `Selam,\n\nFiyatlar konusundaki düşüncelerini anlıyoruz. 💸 Geri bildirimini ekiple paylaştık!`,
        perf: `Selam!\n\nUygulamanın yavaş çalışması bizim de canımızı sıktı. 🐢 Hızlandırmak için motoru yeniliyoruz!`,
        ads: `Selam,\n\nReklamların bazen can sıkıcı olabileceğini biliyoruz. 📺 Dozunu ayarlamak için çalışacağız.`
      },
      support: {
        pos: `Merhaba,\n\nGeri bildiriminiz bizim için çok değerli. İyi kullanımlar dileriz.`,
        neg: `Merhaba,\n\nBu durumu yaşadığınız için üzgünüz. Sorunu çözmek adına lütfen 'Ayarlar > Destek' bölümünden cihaz loglarınızı bizimle paylaşır mısınız?`,
        bug: `Merhaba,\n\nTeknik aksaklık için özür dileriz. Bu hata üzerinde çalışıyoruz. Lütfen uygulamanızı güncel tutun.`,
        money: `Merhaba,\n\nAbonelik seçeneklerimizle ilgili endişelerinizi anlıyoruz. Size en uygun paketi bulmanız için destek ekibimize yazabilirsiniz.`,
        perf: `Merhaba,\n\nPerformans kaybı genellikle önbellek kaynaklı olabilir. Lütfen önbelleği temizleyip tekrar deneyin.`,
        ads: `Merhaba,\n\nReklam politikamızla ilgili geri bildiriminiz için teşekkürler. Premium seçeneklerimizi inceleyebilirsiniz.`
      }
    },
    en: {
        formal: {
            pos: "Dear User, Thank you for your kind words.",
            neg: "Dear User, We apologize for the inconvenience.",
            bug: "Dear User, We are working on the bug you reported.",
            money: "Dear User, We've noted your feedback on pricing.",
            perf: "Dear User, We are optimizing performance.",
            ads: "Dear User, We will review ad frequency."
        },
        casual: {
            pos: "Thanks for the love! 🚀",
            neg: "So sorry about that! 😔",
            bug: "Thanks for catching that bug! 🛠️",
            money: "We hear you on the pricing. 💸",
            perf: "We're tuning the engine to make it faster! 🐢",
            ads: "We know ads can be annoying. 📺"
        },
        support: {
            pos: "Thanks for your feedback!",
            neg: "Please contact support for help.",
            bug: "Please keep your app updated for the fix.",
            money: "Contact support for subscription help.",
            perf: "Try clearing your cache.",
            ads: "Check Premium for ad-free experience."
        }
    }
  };

  const tLang = templates[lang] || templates.en;
  let selectedSet = tLang[tone] || tLang.formal;

  if (hasBug && selectedSet.bug) return selectedSet.bug;
  if (hasMoney && selectedSet.money) return selectedSet.money;
  if (hasPerf && selectedSet.perf) return selectedSet.perf;
  if (hasAds && selectedSet.ads) return selectedSet.ads;
  
  return isPositive ? selectedSet.pos : selectedSet.neg;
};

const ReviewResponseCard = ({ review, lang }) => {
  const [tone, setTone] = useState('formal');
  const [copied, setCopied] = useState(false);

  const responseText = useMemo(() => {
    return generateAIResponse(review, tone, lang);
  }, [review, tone, lang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(responseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 hover:bg-slate-50 transition-colors border-b border-gray-100 last:border-0">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">
            {review.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">{review.author}</h4>
            <div className="text-xs text-gray-400 flex items-center gap-2">
                <span>{new Date(review.rawDate).toLocaleDateString()}</span> • <span>v{review.version}</span>
            </div>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <h5 className="font-bold text-gray-800 text-sm mb-2">{review.title}</h5>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.content}</p>

      <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-lg">
              <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">AI Suggested Reply</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative group">
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-medium text-gray-700 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="formal">{TONES.formal[lang]}</option>
                <option value="casual">{TONES.casual[lang]}</option>
                <option value="support">{TONES.support[lang]}</option>
              </select>
              <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button 
              onClick={handleCopy}
              className={`p-1.5 rounded-lg border transition-all ${copied ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white border-blue-200 text-gray-500 hover:text-blue-600 hover:border-blue-300'}`}
              title="Copy Response"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        <div className="relative">
          <textarea 
            readOnly
            value={responseText}
            className="w-full text-sm text-slate-700 bg-transparent resize-none outline-none font-medium leading-relaxed"
            rows={responseText.split('\n').length}
          />
        </div>
      </div>
    </div>
  );
};

// --- SABİT VERİLER VE DİL AYARLARI ---

const TRANSLATIONS = {
  tr: {
    heroTitle: "Uygulama İnceleme Analizi",
    heroSubtitle: "Yapay zeka destekli içgörüler ile kullanıcı geri bildirimlerini derinlemesine analiz edin.",
    placeholder: "App Store veya Play Store linki yapıştırın...",
    analyzeBtn: "Analiz Et",
    loading: "Veriler toplanıyor ve analiz ediliyor...",
    errorGeneric: "Veri çekilemedi. Linki kontrol edin veya daha sonra tekrar deneyin.",
    summary: "Detaylı Analiz Raporu",
    recommendations: "Stratejik Öneriler",
    sentimentDist: "Duygu Dağılımı",
    recentReviews: "Son Yorumlar",
    allReviews: "Tüm Yorumlar",
    seeAll: "Tümünü Gör",
    back: "Geri Dön",
    noData: "Yeterli veri yok.",
    playStoreWarn: "Google Play Store için tarih ve detaylı grafik verileri kısıtlıdır.",
    topics: { bug: "Hata Raporları", ads: "Reklam Şikayeti", perf: "Performans", money: "Fiyatlandırma" },
    sentiment: { pos: "Olumlu", neg: "Olumsuz", neu: "Nötr" },
    filterTitle: "Tarih Aralığı Filtresi",
    chartsTitle: "Veri Görselleştirme",
    trendChart: "Puan Trendi (Günlük)",
    distChart: "Yıldız Dağılımı"
  },
  en: {
    heroTitle: "App Review Analytics",
    heroSubtitle: "Deep dive into user feedback with AI-powered insights.",
    placeholder: "Paste App Store or Play Store link...",
    analyzeBtn: "Analyze",
    loading: "Collecting data and analyzing...",
    errorGeneric: "Failed to fetch data. Please check the link or try again later.",
    summary: "Detailed Analysis Report",
    recommendations: "Strategic Recommendations",
    sentimentDist: "Sentiment Distribution",
    recentReviews: "Recent Reviews",
    allReviews: "All Reviews",
    seeAll: "See All",
    back: "Go Back",
    noData: "Not enough data.",
    playStoreWarn: "Date and detailed chart data is limited for Google Play Store.",
    topics: { bug: "Bug Reports", ads: "Ad Complaints", perf: "Performance", money: "Pricing" },
    sentiment: { pos: "Positive", neg: "Negative", neu: "Neutral" },
    filterTitle: "Date Range Filter",
    chartsTitle: "Data Visualization",
    trendChart: "Rating Trend (Daily)",
    distChart: "Star Distribution"
  }
};

const STOP_WORDS = {
  tr: ['ve', 'bir', 'bu', 'da', 'de', 'için', 'ile', 'çok', 'ama', 'fakat', 'daha', 'en', 'kadar', 'olarak', 'ben', 'sen', 'o', 'biz', 'siz', 'onlar', 'mi', 'mı', 'mu', 'mü', 'uygulama', 'app'],
  en: ['and', 'the', 'a', 'an', 'is', 'to', 'in', 'of', 'for', 'it', 'this', 'that', 'with', 'but', 'on', 'are', 'was', 'very', 'so', 'my', 'i', 'app', 'application']
};

const TOPIC_KEYWORDS = {
  performance: ['hız', 'yavaş', 'donma', 'kasma', 'performans', 'slow', 'lag', 'freeze', 'fast', 'smooth'],
  bug: ['hata', 'bug', 'açılmıyor', 'atıyor', 'kapanıyor', 'error', 'crash', 'close', 'open'],
  monetization: ['para', 'ücret', 'abonelik', 'pahalı', 'bedava', 'money', 'price', 'subscription', 'expensive', 'free'],
  ads: ['reklam', 'reklamlar', 'video', 'ads', 'advertisement', 'popup']
};

// --- ANA BİLEŞEN ---

export default function AppAnalysis() {
  const [lang, setLang] = useState('tr');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appData, setAppData] = useState(null);
  const [reviews, setReviews] = useState([]);
  
  // Filtreleme State'leri
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filteredReviews, setFilteredReviews] = useState([]);

  const [analysis, setAnalysis] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const t = TRANSLATIONS[lang];

  // --- LOGIC: FETCH WITH FALLBACK ---

  // YENİ EKLENEN FONKSİYON: Proxy Yedekleme Sistemi
  const fetchWithFallback = async (targetUrl, type = 'json') => {
    // Öncelik sırasına göre proxy listesi
    const proxies = [
      // 1. AllOrigins Raw (Genelde en stabil)
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
      // 2. Corsproxy.io (Yedek)
      `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
      // 3. ThingProxy (Ek Yedek)
      `https://thingproxy.freeboard.io/fetch/${targetUrl}`
    ];

    // Sırayla deniyoruz
    for (const proxyUrl of proxies) {
      try {
        // Önbellekleme sorunlarını aşmak için timestamp ekliyoruz
        const urlWithTimestamp = `${proxyUrl}${proxyUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
        const res = await fetch(urlWithTimestamp);
        
        if (!res.ok) {
          console.warn(`Proxy failed (Status ${res.status}): ${proxyUrl}`);
          continue; // Bir sonraki proxy'ye geç
        }

        if (type === 'json') return await res.json();
        if (type === 'text') return await res.text();
        
      } catch (e) {
        console.warn(`Proxy connection failed: ${proxyUrl}`, e);
        // Hata olursa döngü devam eder ve bir sonraki proxy denenir
      }
    }
    // Eğer hepsi başarısız olursa
    throw new Error("Tüm proxy servisleri başarısız oldu.");
  };

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setAppData(null);
    setReviews([]);
    setFilteredReviews([]);
    setAnalysis(null);
    setShowAllReviews(false);
    setDateRange({ start: '', end: '' }); 

    try {
      let platform = '';
      let id = '';

      if (url.includes('apps.apple.com')) {
        const match = url.match(/id(\d+)/);
        if(match) { platform = 'ios'; id = match[1]; }
      } else if (url.includes('play.google.com')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        id = urlParams.get('id');
        if(id) platform = 'android';
      }

      if (!id) throw new Error("Invalid ID");

      if (platform === 'ios') {
        const lookupUrl = `https://itunes.apple.com/lookup?id=${id}`;
        
        // YENİ: fetchWithFallback kullanımı
        const json = await fetchWithFallback(lookupUrl, 'json');
        
        if (json.resultCount === 0) throw new Error("App Not Found");
        const info = json.results[0];

        // Fetch Reviews (RSS)
        const rssUrl = `https://itunes.apple.com/tr/rss/customerreviews/id=${id}/sortBy=mostRecent/json`;
        const rssJson = await fetchWithFallback(rssUrl, 'json');
        
        const entry = rssJson.feed.entry || [];
        const entries = Array.isArray(entry) ? entry : [entry];
        
        const cleanReviews = entries.slice(1).map(r => ({
          author: r.author?.name?.label || "User",
          rating: parseInt(r['im:rating']?.label || "0"),
          title: r.title?.label || "",
          content: r.content?.label || "",
          version: r['im:version']?.label || "",
          rawDate: r.updated?.label || new Date().toISOString(), 
          date: new Date(r.updated?.label || new Date()).toLocaleDateString()
        }));

        const appInfoData = {
          name: info.trackName,
          icon: info.artworkUrl512 || info.artworkUrl100,
          developer: info.artistName,
          desc: info.description,
          rating: info.averageUserRating,
          count: info.userRatingCount,
          price: info.formattedPrice,
          genre: info.primaryGenreName,
          url: info.trackViewUrl,
          platform: 'ios'
        };

        setAppData(appInfoData);
        setReviews(cleanReviews);
        setFilteredReviews(cleanReviews);

      } else {
        // Android Simple Scrape
        const playUrl = `https://play.google.com/store/apps/details?id=${id}&hl=${lang}`;
        
        // YENİ: fetchWithFallback kullanımı (text olarak)
        const html = await fetchWithFallback(playUrl, 'text');

        const nameMatch = html.match(/<h1 itemprop="name">([^<]+)<\/h1>/) || html.match(/<h1[^>]*>([^<]+)<\/h1>/);
        const iconMatch = html.match(/<img[^>]+src="([^"]+)"[^>]+alt="Cover art"[^>]*>/) || html.match(/<img[^>]+src="([^"]+)"[^>]+class="T75a adNLdk"[^>]*>/);

        setAppData({
          name: nameMatch ? nameMatch[1] : "Android App",
          icon: iconMatch ? iconMatch[1] : "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg",
          developer: "Google Play Developer",
          desc: "Description limited by Google Play restrictions.",
          rating: 0,
          count: 0,
          price: "Free/Paid",
          genre: "App",
          url: playUrl,
          platform: 'android'
        });
        setReviews([]);
        setFilteredReviews([]);
      }

    } catch (e) {
      console.error(e);
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC: FILTER ---
  
  useEffect(() => {
    if (!reviews.length) return;

    let filtered = [...reviews];

    if (dateRange.start) {
      filtered = filtered.filter(r => new Date(r.rawDate) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(r => new Date(r.rawDate) <= endDate);
    }

    setFilteredReviews(filtered);
  }, [dateRange, reviews]);


  // --- LOGIC: ANALYZE ---

  const analyzeReviews = (list, language, globalStats = { globalAvg: 0, globalCount: 0 }) => {
    let sentimentScore = 0;
    let pos = 0, neg = 0, writtenTotalRating = 0;
    let textDump = "";
    const topics = { perf: 0, bug: 0, money: 0, ads: 0 };
    const words = {};

    list.forEach(r => {
      const txt = (r.title + " " + r.content).toLowerCase();
      textDump += txt + " ";
      writtenTotalRating += r.rating;

      if (r.rating >= 4) { pos++; sentimentScore++; }
      else if (r.rating <= 2) { neg++; sentimentScore--; }

      if (TOPIC_KEYWORDS.performance.some(k => txt.includes(k))) topics.perf++;
      if (TOPIC_KEYWORDS.bug.some(k => txt.includes(k))) topics.bug++;
      if (TOPIC_KEYWORDS.monetization.some(k => txt.includes(k))) topics.money++;
      if (TOPIC_KEYWORDS.ads.some(k => txt.includes(k))) topics.ads++;
    });

    textDump.split(/\s+/).forEach(w => {
      const clean = w.replace(/[^a-zçğıöşü0-9]/gi, '');
      if (clean.length > 3 && !STOP_WORDS[language].includes(clean) && !STOP_WORDS['en'].includes(clean)) {
        words[clean] = (words[clean] || 0) + 1;
      }
    });

    const topWords = Object.entries(words).sort((a,b) => b[1]-a[1]).slice(0, 5).map(i => i[0]);
    
    const total = list.length;
    const writtenAvg = total > 0 ? writtenTotalRating / total : 0;
    const ratio = total > 0 ? Math.round((pos/total)*100) : 0;
    const summary = [];
    const recs = [];
    
    if (total === 0) return null;

    // Silent Majority Logic
    const silentMajorityGap = globalStats.globalAvg - writtenAvg;
    let silentMajorityInsight = "";
    
    if (globalStats.globalAvg > 0) {
      if (silentMajorityGap > 0.5) {
        silentMajorityInsight = language === 'tr' 
          ? `**Dikkat Çekici Fark:** Genel mağaza puanı (${globalStats.globalAvg.toFixed(1)}), seçili dönemdeki yorum ortalamasından (${writtenAvg.toFixed(1)}) yüksek. Sessiz çoğunluk memnun görünüyor.`
          : `**Notable Gap:** Store rating (${globalStats.globalAvg.toFixed(1)}) is higher than selected reviews avg (${writtenAvg.toFixed(1)}). Silent majority seems satisfied.`;
      } else if (silentMajorityGap < -0.5) {
        silentMajorityInsight = language === 'tr'
          ? `**Yükseliş Trendi:** Seçili dönemdeki yorumlar (${writtenAvg.toFixed(1)}), genel ortalamadan (${globalStats.globalAvg.toFixed(1)}) daha olumlu.`
          : `**Upward Trend:** Selected reviews (${writtenAvg.toFixed(1)}) are more positive than the global average.`;
      }
    }

    // Summary Text Generation
    if (language === 'tr') {
      summary.push(`Seçilen kriterlere göre **${total} adet yorum** analiz edildi.`);
      if(silentMajorityInsight) summary.push(silentMajorityInsight);
      summary.push(`Bu dönemdeki memnuniyet oranı **%${ratio}**.`);
      
      if (topics.bug > 0) summary.push(`**Teknik sorunlar** (${topics.bug} şikayet) gündemde.`);
      if (topics.ads > 0) summary.push(`**Reklam** şikayetleri (${topics.ads} adet) dikkat çekiyor.`);
      
      if(topics.bug > 0) recs.push("Teknik hataları inceleyin.");
      if(topics.ads > 0) recs.push("Reklam stratejisini gözden geçirin.");
      if(recs.length === 0) recs.push("Kullanıcı etkileşimini sürdürün.");

    } else {
      summary.push(`Analyzed **${total} reviews** based on selection.`);
      if(silentMajorityInsight) summary.push(silentMajorityInsight);
      summary.push(`Satisfaction rate for this period is **${ratio}%**.`);
      
      if(topics.bug > 0) recs.push("Investigate technical bugs.");
      if(recs.length === 0) recs.push("Maintain user engagement.");
    }

    return {
      total, pos, neg, neu: total - pos - neg,
      score: sentimentScore,
      topics, topWords, summary, recs
    };
  };

  useEffect(() => {
    if(appData && filteredReviews.length > 0) {
      setAnalysis(analyzeReviews(filteredReviews, lang, {
        globalAvg: appData.rating || 0,
        globalCount: appData.count || 0
      }));
    } else {
        setAnalysis(null);
    }
  }, [lang, filteredReviews]);

  // --- ALT SAYFA: TÜM YORUMLAR ---
  if (showAllReviews) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans p-6 md:p-12">
        <div className="max-w-5xl mx-auto animate-in slide-in-from-right fade-in duration-300">
          <button 
            onClick={() => setShowAllReviews(false)}
            className="group flex items-center gap-2 mb-8 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <div className="p-2 bg-white rounded-full border border-gray-200 group-hover:border-blue-200 shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">{t.back}</span>
          </button>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between sticky top-0 backdrop-blur-md z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{t.allReviews}</h2>
                <p className="text-gray-500 text-sm mt-1">{appData.name} - {filteredReviews.length} Reviews</p>
              </div>
              <Badge color="blue" icon={MessageSquare}>{filteredReviews.length}</Badge>
            </div>
            <div>
              {filteredReviews.map((r, i) => (
                <ReviewResponseCard key={i} review={r} lang={lang} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ANA DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              AppInsight
            </span>
          </div>
          <button 
            onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
            {lang.toUpperCase()}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* HERO & SEARCH */}
        {!appData && (
          <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {t.heroTitle}
            </h1>
            <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>
          </div>
        )}

        <div className={`max-w-3xl mx-auto transition-all duration-500 ${appData ? 'mb-8' : 'mb-20'}`}>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative flex items-center bg-white rounded-xl shadow-xl overflow-hidden p-1">
              <div className="pl-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t.placeholder}
                className="flex-1 px-4 py-4 outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base bg-transparent"
              />
              <button 
                onClick={handleAnalyze}
                disabled={loading || !url}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center gap-2 shadow-md shadow-blue-600/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.analyzeBtn}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* DASHBOARD CONTENT */}
        {appData && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
            
            {/* APP INFO HEADER */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-50 -z-0"></div>
               <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                  <img src={appData.icon} alt={appData.name} className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] shadow-lg border border-gray-100 object-cover bg-white" />
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{appData.name}</h2>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                          <span className="text-blue-600 font-medium">{appData.developer}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{appData.genre}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{appData.price}</span>
                        </div>
                      </div>
                      <a href={appData.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors text-gray-700">
                        <Download className="w-4 h-4" /> Store
                      </a>
                    </div>
                    <div className="mt-6 flex items-center gap-8">
                       <div className="flex items-center gap-2">
                          <span className="text-4xl font-bold text-gray-900">{appData.rating ? appData.rating.toFixed(1) : '-'}</span>
                          <div className="flex flex-col text-sm">
                            <StarRating rating={appData.rating || 0} size="w-4 h-4" />
                            <span className="text-gray-400 mt-0.5">{appData.count?.toLocaleString()} Ratings</span>
                          </div>
                       </div>
                       {appData.platform === 'android' && (
                         <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1"><Smartphone className="w-3 h-3" /> Android</div>
                       )}
                       {appData.platform === 'ios' && (
                         <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200 flex items-center gap-1"><Smartphone className="w-3 h-3" /> iOS</div>
                       )}
                    </div>
                  </div>
               </div>
            </div>

            {/* FILTERS & CHARTS */}
            {appData.platform === 'ios' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                 {/* Filters */}
                 <div className="md:col-span-12">
                   <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
                     <div className="flex items-center gap-2 text-gray-700 font-bold text-sm">
                       <Calendar className="w-5 h-5 text-blue-500" />
                       {t.filterTitle}
                     </div>
                     <div className="flex items-center gap-2">
                       <input 
                         type="date" 
                         className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                         value={dateRange.start}
                         onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                       />
                       <span className="text-gray-400">-</span>
                       <input 
                         type="date" 
                         className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                         value={dateRange.end}
                         onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                       />
                     </div>
                     <div className="ml-auto text-xs text-gray-500">
                       Showing {filteredReviews.length} reviews
                     </div>
                   </div>
                 </div>

                 {/* Charts */}
                 <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" /> {t.trendChart}
                    </h4>
                    <TrendChart reviews={filteredReviews} />
                 </div>
                 
                 <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-purple-500" /> {t.distChart}
                    </h4>
                    <DistributionChart reviews={filteredReviews} />
                 </div>
              </div>
            )}

            {/* ANALYTICS GRID */}
            {analysis && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Summary & Issues */}
                <div className="md:col-span-8 space-y-6">
                  
                  {/* Executive Summary */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><List className="w-5 h-5" /></div>
                      <h3 className="text-lg font-bold text-gray-900">{t.summary}</h3>
                    </div>
                    <ul className="space-y-4 relative z-10">
                      {analysis.summary.map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700 text-sm leading-relaxed">
                          <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                          <span dangerouslySetInnerHTML={{__html: point.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-900 font-bold">$1</strong>')}} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Lightbulb className="w-5 h-5" /></div>
                      <h3 className="text-lg font-bold text-emerald-900">{t.recommendations}</h3>
                    </div>
                    <div className="grid gap-3">
                      {analysis.recs.map((rec, i) => (
                        <div key={i} className="bg-white/80 backdrop-blur px-4 py-3 rounded-xl border border-emerald-100/50 text-emerald-800 text-sm font-medium shadow-sm">
                           {rec}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Topic Cards Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title={t.topics.bug} value={analysis.topics.bug} icon={ShieldAlert} color={analysis.topics.bug > 0 ? "red" : "blue"} />
                    <StatCard title={t.topics.ads} value={analysis.topics.ads} icon={AlertTriangle} color={analysis.topics.ads > 0 ? "red" : "blue"} />
                    <StatCard title={t.topics.perf} value={analysis.topics.perf} icon={Cpu} color={analysis.topics.perf > 0 ? "red" : "blue"} />
                    <StatCard title={t.topics.money} value={analysis.topics.money} icon={TrendingUp} color="blue" />
                  </div>

                  {/* Recent Reviews List (Preview) */}
                  {filteredReviews.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800">{t.recentReviews}</h3>
                        <button onClick={() => setShowAllReviews(true)} className="text-xs text-blue-600 font-bold hover:underline">
                          {t.seeAll}
                        </button>
                      </div>
                      <div>
                        {filteredReviews.slice(0, 3).map((r, i) => (
                          <ReviewResponseCard key={i} review={r} lang={lang} />
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Charts & Sentiment */}
                <div className="md:col-span-4 space-y-6">
                  
                  {/* Sentiment Score Card */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-4">AI Score</div>
                    <div className={`text-6xl font-black mb-2 tracking-tighter ${analysis.score > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                      {analysis.score > 0 ? '+' : ''}{analysis.score}
                    </div>
                    <div className="flex gap-1 mb-6">
                       <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">{analysis.pos} Pos</span>
                       <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-bold">{analysis.neg} Neg</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-1000 ${analysis.score > 0 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${Math.min((Math.abs(analysis.score) / analysis.total) * 100, 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Keywords Cloud */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-4">Trend Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.topWords.map((w, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-lg text-sm capitalize hover:bg-slate-100 transition-colors cursor-default">{w}</span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
