import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Globe, Star, BarChart2, MessageSquare, AlertTriangle, 
  CheckCircle, Smartphone, Share2, Loader2, Info, ArrowLeft, 
  Lightbulb, List, TrendingUp, ShieldAlert, Cpu, Download, 
  Activity, Users, Copy, Check, ChevronDown, MessageCircle, Calendar
} from 'lucide-react';

// --- YARDIMCI BİLEŞENLER ---

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

// --- CHART BİLEŞENLERİ ---

const TrendChart = ({ reviews }) => {
  const dailyData = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    const groups = {};
    reviews.forEach(r => {
      try {
        const dateKey = new Date(r.rawDate).toLocaleDateString('en-CA');
        if (!groups[dateKey]) groups[dateKey] = { sum: 0, count: 0, date: dateKey };
        groups[dateKey].sum += r.rating;
        groups[dateKey].count += 1;
      } catch (e) {
        // Tarih hatası varsa atla
      }
    });
    
    return Object.values(groups)
      .map(g => ({ date: g.date, avg: g.sum / g.count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [reviews]);

  if (dailyData.length < 2) return <div className="h-40 flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">Trend analizi için yeterli tarih verisi yok.</div>;

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
        <line x1="0" y1="0" x2="100" y2="0" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1={height/2} x2="100" y2={height/2} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1={height} x2="100" y2={height} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2" />
        <polyline fill="none" stroke="#3b82f6" strokeWidth="1.5" points={points} vectorEffect="non-scaling-stroke" />
        {dailyData.map((d, i) => {
             const x = (i / (dailyData.length - 1)) * width;
             const y = height - ((d.avg - minAvg) / (maxAvg - minAvg)) * height;
             return <circle key={i} cx={x} cy={y} r="1.5" fill="white" stroke="#3b82f6" strokeWidth="1"><title>{d.date}: {d.avg.toFixed(1)}</title></circle>
        })}
        <text x="0" y={height + 8} fontSize="4" fill="#94a3b8">{dailyData[0].date}</text>
        <text x="100" y={height + 8} fontSize="4" fill="#94a3b8" textAnchor="end">{dailyData[dailyData.length-1].date}</text>
      </svg>
    </div>
  );
};

const DistributionChart = ({ reviews }) => {
  const counts = [0, 0, 0, 0, 0, 0];
  if (reviews) reviews.forEach(r => counts[r.rating]++);
  const max = Math.max(...counts.slice(1)) || 1;

  return (
    <div className="h-40 flex items-end justify-between gap-2 px-2">
      {[1, 2, 3, 4, 5].map(star => (
        <div key={star} className="flex flex-col items-center gap-1 w-full group">
           <div className="text-xs font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{counts[star]}</div>
           <div className={`w-full rounded-t-lg transition-all duration-500 ${star >= 4 ? 'bg-green-400' : star <= 2 ? 'bg-red-400' : 'bg-gray-300'}`} style={{ height: `${(counts[star] / max) * 100}%`, minHeight: '4px' }}></div>
           <div className="text-xs font-bold text-gray-600 flex items-center gap-0.5">{star} <Star className="w-2.5 h-2.5 fill-gray-600 text-gray-600" /></div>
        </div>
      ))}
    </div>
  );
};

// --- CEVAP OLUŞTURUCU ---

const TONES = { formal: { tr: "Resmi", en: "Formal" }, casual: { tr: "Samimi", en: "Casual" }, support: { tr: "Destek", en: "Supportive" } };

const generateAIResponse = (review, tone, lang) => {
  const isPositive = review.rating >= 4;
  const content = (review.title + " " + review.content).toLowerCase();
  const hasBug = ['hata', 'bug', 'crash', 'açılmıyor'].some(k => content.includes(k));
  const hasMoney = ['para', 'ücret', 'pahalı'].some(k => content.includes(k));
  
  const templates = {
    tr: {
      formal: { 
        pos: `Sayın ${review.author},\n\nDeğerli yorumlarınız için teşekkür ederiz.`,
        neg: `Sayın ${review.author},\n\nYaşadığınız sorun için üzgünüz.`,
        bug: `Sayın ${review.author},\n\nTeknik hata bildiriminiz için teşekkürler, inceliyoruz.`
      },
      casual: {
        pos: `Selam ${review.author}! 🚀 Harika yorumun için sağ ol!`,
        neg: `Selam, bu durum can sıkıcı olmalı. Hemen ilgileniyoruz.`,
        bug: `Selam! Hata bildirimini aldık, ekip bakıyor! 🛠️`
      },
      support: {
        pos: `Merhaba, geri bildiriminiz bizim için çok değerli.`,
        neg: `Merhaba, destek ekibimizle iletişime geçerseniz yardımcı olabiliriz.`,
        bug: `Merhaba, bu hatayı düzeltmek için çalışıyoruz. Lütfen güncel kalın.`
      }
    },
    en: {
      formal: { pos: "Dear User, Thank you.", neg: "Dear User, We apologize.", bug: "Dear User, We are fixing this." },
      casual: { pos: "Thanks! 🚀", neg: "So sorry! 😔", bug: "Thanks for the heads up! 🛠️" },
      support: { pos: "We appreciate your feedback.", neg: "Please contact support.", bug: "Update coming soon." }
    }
  };
  
  const tLang = templates[lang] || templates.en;
  let selectedSet = tLang[tone] || tLang.formal;
  
  if (hasBug && selectedSet.bug) return selectedSet.bug;
  if (hasMoney && selectedSet.money) return selectedSet.money || selectedSet.neg;
  return isPositive ? selectedSet.pos : selectedSet.neg;
};

const ReviewResponseCard = ({ review, lang }) => {
  const [tone, setTone] = useState('formal');
  const [copied, setCopied] = useState(false);
  const responseText = useMemo(() => generateAIResponse(review, tone, lang), [review, tone, lang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(responseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 hover:bg-slate-50 transition-colors border-b border-gray-100 last:border-0">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">{review.author.charAt(0).toUpperCase()}</div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">{review.author}</h4>
            <div className="text-xs text-gray-400 flex items-center gap-2"><span>{new Date(review.rawDate).toLocaleDateString()}</span> • <span>v{review.version}</span></div>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <h5 className="font-bold text-gray-800 text-sm mb-2">{review.title}</h5>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.content}</p>
      <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-lg"><MessageCircle className="w-3.5 h-3.5 text-blue-600" /></div>
            <span className="text-xs font-bold text-blue-800 uppercase">AI Reply</span>
          </div>
          <div className="flex items-center gap-2">
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="pl-3 pr-8 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
              <option value="formal">{TONES.formal[lang]}</option>
              <option value="casual">{TONES.casual[lang]}</option>
              <option value="support">{TONES.support[lang]}</option>
            </select>
            <button onClick={handleCopy} className="p-1.5 rounded-lg border bg-white border-blue-200 text-gray-500 hover:text-blue-600">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
          </div>
        </div>
        <textarea readOnly value={responseText} className="w-full text-sm text-slate-700 bg-transparent resize-none outline-none font-medium leading-relaxed" rows={responseText.split('\n').length} />
      </div>
    </div>
  );
};

// --- SABİTLER ---

const TRANSLATIONS = {
  tr: {
    heroTitle: "Uygulama İnceleme Analizi",
    heroSubtitle: "Yapay zeka destekli içgörüler ile kullanıcı geri bildirimlerini analiz edin.",
    placeholder: "App Store veya Play Store linki yapıştırın...",
    analyzeBtn: "Analiz Et",
    loading: "Veriler çekiliyor...",
    errorGeneric: "Veri alınamadı. Proxy sorunu olabilir, lütfen tekrar deneyin.",
    summary: "Analiz Özeti",
    recommendations: "Öneriler",
    sentimentDist: "Duygu Dağılımı",
    recentReviews: "Son Yorumlar",
    allReviews: "Tüm Yorumlar",
    seeAll: "Tümünü Gör",
    back: "Geri",
    playStoreWarn: "Google Play kısıtlamaları nedeniyle detaylı analiz sınırlıdır.",
    topics: { bug: "Hata", ads: "Reklam", perf: "Performans", money: "Fiyat" },
    sentiment: { pos: "Olumlu", neg: "Olumsuz", neu: "Nötr" },
    filterTitle: "Tarih Filtresi",
    trendChart: "Puan Trendi",
    distChart: "Yıldız Dağılımı"
  },
  en: {
    heroTitle: "App Review Analytics",
    heroSubtitle: "Analyze user feedback with AI-powered insights.",
    placeholder: "Paste App Store or Play Store link...",
    analyzeBtn: "Analyze",
    loading: "Fetching data...",
    errorGeneric: "Failed to fetch data. Please try again.",
    summary: "Analysis Summary",
    recommendations: "Recommendations",
    sentimentDist: "Sentiment Distribution",
    recentReviews: "Recent Reviews",
    allReviews: "All Reviews",
    seeAll: "See All",
    back: "Back",
    playStoreWarn: "Detailed analysis is limited for Google Play due to restrictions.",
    topics: { bug: "Bug", ads: "Ads", perf: "Performance", money: "Pricing" },
    sentiment: { pos: "Positive", neg: "Negative", neu: "Neutral" },
    filterTitle: "Date Filter",
    trendChart: "Rating Trend",
    distChart: "Star Distribution"
  }
};

// --- ANA UYGULAMA ---

export default function AppAnalysis() {
  const [lang, setLang] = useState('tr');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appData, setAppData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const t = TRANSLATIONS[lang];

  // YENİ: Gelişmiş Proxy ve Veri Çekme Fonksiyonu
  const fetchSmart = async (targetUrl) => {
    const proxies = [
      { url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`, type: 'raw' }, // Daha stabil
      { url: `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`, type: 'json_wrapper' },
      { url: `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`, type: 'raw' },
      { url: `https://thingproxy.freeboard.io/fetch/${targetUrl}`, type: 'raw' }
    ];

    for (const proxy of proxies) {
      try {
        const res = await fetch(`${proxy.url}${proxy.url.includes('?') ? '&' : '?'}t=${Date.now()}`);
        if (!res.ok) continue;

        let data;
        if (proxy.type === 'json_wrapper') {
          const wrapper = await res.json();
          // AllOrigins içeriği string olarak döndürür, onu tekrar parse etmeliyiz
          if (wrapper.contents) {
            try {
              data = JSON.parse(wrapper.contents);
            } catch (e) {
              data = wrapper.contents; // JSON değilse text olarak al
            }
          } else {
            throw new Error("AllOrigins content empty");
          }
        } else {
          // Raw proxy'ler direkt JSON veya Text döner
          // GÜVENLİK: İçerik tipi ne olursa olsun JSON olarak parse etmeyi dene, olmazsa text olarak al.
          const text = await res.text();
          try {
            data = JSON.parse(text);
          } catch (e) {
            data = text;
          }
        }
        
        // Eğer veri boşsa veya hata içeriyorsa bir sonraki proxye geçmek için hata fırlatılabilir
        if (!data) throw new Error("Empty response");
        
        return data;
      } catch (e) {
        console.warn(`Proxy failed: ${proxy.url}`, e);
      }
    }
    throw new Error("All proxies failed");
  };

  const fetchReviewsForCountry = async (id, countryCode) => {
    // Limit 500'e çıkarıldı
    const rssUrl = `https://itunes.apple.com/${countryCode}/rss/customerreviews/id=${id}/sortBy=mostRecent/json?limit=500`;
    try {
        const rssJson = await fetchSmart(rssUrl);
        if (rssJson && rssJson.feed && rssJson.feed.entry) {
            const entries = Array.isArray(rssJson.feed.entry) ? rssJson.feed.entry : [rssJson.feed.entry];
            return entries.slice(1).map(r => ({
                author: r.author?.name?.label || "User",
                rating: parseInt(r['im:rating']?.label || "0"),
                title: r.title?.label || "",
                content: r.content?.label || "",
                version: r['im:version']?.label || "",
                rawDate: r.updated?.label || new Date().toISOString(),
                date: new Date(r.updated?.label || new Date()).toLocaleDateString()
            }));
        }
    } catch (e) {
        console.warn(`Reviews fetch failed for country ${countryCode}:`, e);
    }
    return [];
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
      let platform = '', id = '';
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
        // 1. App Info
        const lookupUrl = `https://itunes.apple.com/lookup?id=${id}`;
        const json = await fetchSmart(lookupUrl);
        
        // GÜVENLİK: JSON yapısını kontrol et
        if (!json || typeof json !== 'object' || !json.results || !Array.isArray(json.results) || json.results.length === 0) { 
            throw new Error("App Not Found or Invalid Data Structure"); 
        }
        
        const info = json.results[0];

        // 2. Reviews - Country Fallback Logic
        // Önce TR dene, veri yoksa US dene
        let cleanReviews = await fetchReviewsForCountry(id, 'tr');
        
        if (cleanReviews.length === 0) {
            console.log("TR store has no reviews, falling back to US store...");
            cleanReviews = await fetchReviewsForCountry(id, 'us');
        }

        setAppData({
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
        });
        setReviews(cleanReviews);
        setFilteredReviews(cleanReviews);

      } else {
        // Android Simple Scrape (Basic Info Only)
        const playUrl = `https://play.google.com/store/apps/details?id=${id}&hl=${lang}`;
        const html = await fetchSmart(playUrl);

        if (typeof html !== 'string') throw new Error("Invalid Android Data");

        const nameMatch = html.match(/<h1 itemprop="name">([^<]+)<\/h1>/) || html.match(/<h1[^>]*>([^<]+)<\/h1>/);
        const iconMatch = html.match(/<img[^>]+src="([^"]+)"[^>]+alt="Cover art"[^>]*>/) || html.match(/<img[^>]+src="([^"]+)"[^>]+class="T75a adNLdk"[^>]*>/);

        setAppData({
          name: nameMatch ? nameMatch[1] : "Android App",
          icon: iconMatch ? iconMatch[1] : "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg",
          developer: "Google Play Developer",
          desc: "Google Play scraping limitation: Full details unavailable.",
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

  // --- LOGIC: FILTER & ANALYZE ---
  
  useEffect(() => {
    if (!reviews.length) {
      setFilteredReviews([]);
      return;
    }
    let filtered = [...reviews];
    if (dateRange.start) filtered = filtered.filter(r => new Date(r.rawDate) >= new Date(dateRange.start));
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(r => new Date(r.rawDate) <= endDate);
    }
    setFilteredReviews(filtered);
  }, [dateRange, reviews]);

  const analyzeReviews = (list, language, globalStats = { globalAvg: 0, globalCount: 0 }) => {
    if (!list || list.length === 0) return null;

    let sentimentScore = 0;
    let pos = 0, neg = 0;
    const topics = { perf: 0, bug: 0, money: 0, ads: 0 };
    let textDump = "";
    const words = {};

    const STOP_WORDS_LIST = lang === 'tr' ? 
      ['ve', 'bir', 'bu', 'da', 'de', 'için', 'ile', 'çok', 'ama', 'fakat', 'daha', 'en', 'kadar', 'olarak', 'ben', 'sen', 'o', 'biz', 'siz', 'onlar', 'mi', 'mı', 'mu', 'mü', 'uygulama', 'app'] :
      ['and', 'the', 'a', 'an', 'is', 'to', 'in', 'of', 'for', 'it', 'this', 'that', 'with', 'but', 'on', 'are', 'was', 'very', 'so', 'my', 'i', 'app', 'application'];

    list.forEach(r => {
      const txt = (r.title + " " + r.content).toLowerCase();
      textDump += txt + " ";
      if (r.rating >= 4) { pos++; sentimentScore++; }
      else if (r.rating <= 2) { neg++; sentimentScore--; }

      if (['hız', 'yavaş', 'slow', 'lag'].some(k => txt.includes(k))) topics.perf++;
      if (['hata', 'bug', 'crash'].some(k => txt.includes(k))) topics.bug++;
      if (['para', 'ücret', 'money', 'price'].some(k => txt.includes(k))) topics.money++;
      if (['reklam', 'ads'].some(k => txt.includes(k))) topics.ads++;
    });

    textDump.split(/\s+/).forEach(w => {
      const clean = w.replace(/[^a-zçğıöşü0-9]/gi, '');
      if (clean.length > 3 && !STOP_WORDS_LIST.includes(clean)) {
        words[clean] = (words[clean] || 0) + 1;
      }
    });

    const topWords = Object.entries(words).sort((a,b) => b[1]-a[1]).slice(0, 5).map(i => i[0]);
    const total = list.length;
    const ratio = Math.round((pos/total)*100);
    const summary = [];
    const recs = [];

    if (language === 'tr') {
      summary.push(`Seçilen kriterlere göre **${total} adet yorum** analiz edildi.`);
      summary.push(`Memnuniyet oranı **%${ratio}**.`);
      if (topics.bug > 0) summary.push(`**Teknik sorunlar** (${topics.bug}) gündemde.`);
      if (topics.ads > 0) summary.push(`**Reklam** şikayetleri (${topics.ads}) var.`);
      
      if(topics.bug > 0) recs.push("Teknik hataları inceleyin.");
      if(topics.ads > 0) recs.push("Reklam stratejisini gözden geçirin.");
      if(recs.length === 0) recs.push("Kullanıcı etkileşimini sürdürün.");
    } else {
      summary.push(`Analyzed **${total} reviews**.`);
      summary.push(`Satisfaction: **${ratio}%**.`);
      if(topics.bug > 0) recs.push("Fix bugs.");
      if(recs.length === 0) recs.push("Keep it up.");
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
  }, [lang, filteredReviews, appData]); // appData dependency eklendi

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20"><BarChart2 className="w-5 h-5 text-white" /></div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">AppInsight</span>
          </div>
          <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium"><Globe className="w-4 h-4" /> {lang.toUpperCase()}</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className={`max-w-3xl mx-auto transition-all duration-500 ${appData ? 'mb-8' : 'mb-20'}`}>
          {!appData && <div className="text-center py-10"><h1 className="text-4xl font-extrabold text-slate-900 mb-4">{t.heroTitle}</h1><p className="text-slate-500">{t.heroSubtitle}</p></div>}
          <div className="relative flex items-center bg-white rounded-xl shadow-xl overflow-hidden p-1">
            <div className="pl-4 text-gray-400"><Search className="w-5 h-5" /></div>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t.placeholder} className="flex-1 px-4 py-4 outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base bg-transparent" />
            <button onClick={handleAnalyze} disabled={loading || !url} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-md disabled:opacity-50">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.analyzeBtn}</button>
          </div>
        </div>

        {error && <div className="max-w-3xl mx-auto mb-8 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3"><AlertTriangle className="w-5 h-5" /> {error}</div>}

        {appData && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-50 -z-0"></div>
               <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                  <img src={appData.icon} alt={appData.name} className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] shadow-lg border border-gray-100 object-cover bg-white" />
                  <div className="flex-1 w-full">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{appData.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="text-blue-600 font-medium">{appData.developer}</span>
                      <span>{appData.genre}</span>
                      <span>{appData.price}</span>
                    </div>
                    <a href={appData.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700"><Download className="w-4 h-4" /> Store</a>
                    <div className="mt-6 flex items-center gap-8">
                       <div className="flex items-center gap-2">
                          <span className="text-4xl font-bold text-gray-900">{appData.rating ? appData.rating.toFixed(1) : '-'}</span>
                          <div className="flex flex-col text-sm"><StarRating rating={appData.rating || 0} /><span className="text-gray-400 mt-0.5">{appData.count?.toLocaleString()} Ratings</span></div>
                       </div>
                       <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${appData.platform === 'android' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-700 border-slate-200'}`}><Smartphone className="w-3 h-3" /> {appData.platform === 'android' ? 'Android' : 'iOS'}</div>
                    </div>
                  </div>
               </div>
            </div>

            {appData.platform === 'ios' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                 <div className="md:col-span-12">
                   <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
                     <div className="flex items-center gap-2 text-gray-700 font-bold text-sm"><Calendar className="w-5 h-5 text-blue-500" /> {t.filterTitle}</div>
                     <div className="flex items-center gap-2">
                       <input type="date" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
                       <span className="text-gray-400">-</span>
                       <input type="date" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
                     </div>
                     <div className="ml-auto text-xs text-gray-500">Showing {filteredReviews.length} reviews</div>
                   </div>
                 </div>
                 <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-500" /> {t.trendChart}</h4>
                    <TrendChart reviews={filteredReviews} />
                 </div>
                 <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-purple-500" /> {t.distChart}</h4>
                    <DistributionChart reviews={filteredReviews} />
                 </div>
              </div>
            )}

            {analysis && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"><div className="flex items-center gap-2 mb-4"><div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><List className="w-5 h-5" /></div><h3 className="text-lg font-bold text-gray-900">{t.summary}</h3></div><ul className="space-y-4">{analysis.summary.map((p, i) => <li key={i} className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" /><span dangerouslySetInnerHTML={{__html: p.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}} /></li>)}</ul></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title={t.topics.bug} value={analysis.topics.bug} icon={ShieldAlert} color={analysis.topics.bug > 0 ? "red" : "blue"} />
                    <StatCard title={t.topics.ads} value={analysis.topics.ads} icon={AlertTriangle} color={analysis.topics.ads > 0 ? "red" : "blue"} />
                    <StatCard title={t.topics.perf} value={analysis.topics.perf} icon={Cpu} color={analysis.topics.perf > 0 ? "red" : "blue"} />
                    <StatCard title={t.topics.money} value={analysis.topics.money} icon={TrendingUp} color="blue" />
                  </div>
                  {filteredReviews.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between"><h3 className="font-bold text-gray-800">{t.recentReviews}</h3><button onClick={() => setShowAllReviews(true)} className="text-xs text-blue-600 font-bold hover:underline">{t.seeAll}</button></div>
                      <div>{filteredReviews.slice(0, 3).map((r, i) => <ReviewResponseCard key={i} review={r} lang={lang} />)}</div>
                    </div>
                  )}
                </div>
                <div className="md:col-span-4 space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-4">AI Score</div>
                    <div className={`text-6xl font-black mb-2 tracking-tighter ${analysis.score > 0 ? 'text-blue-600' : 'text-gray-400'}`}>{analysis.score > 0 ? '+' : ''}{analysis.score}</div>
                    <div className="flex gap-1 mb-6"><span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">{analysis.pos} Pos</span><span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-bold">{analysis.neg} Neg</span></div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${analysis.score > 0 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${Math.min((Math.abs(analysis.score) / analysis.total) * 100, 100)}%` }}></div></div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"><h4 className="font-bold text-gray-800 mb-4">Trend Keywords</h4><div className="flex flex-wrap gap-2">{analysis.topWords.map((w, i) => <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-lg text-sm capitalize hover:bg-slate-100 transition-colors cursor-default">{w}</span>)}</div></div>
                </div>
              </div>
            )}
          </div>
        )}
        {showAllReviews && (
          <div className="fixed inset-0 z-[60] bg-white overflow-auto p-6">
             <div className="max-w-5xl mx-auto">
               <button onClick={() => setShowAllReviews(false)} className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"><ArrowLeft className="w-4 h-4" /> {t.back}</button>
               <h2 className="text-2xl font-bold mb-6">{t.allReviews}</h2>
               <div className="space-y-4">{filteredReviews.map((r, i) => <ReviewResponseCard key={i} review={r} lang={lang} />)}</div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
