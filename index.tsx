
import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Heart, Sparkles, X, Lock, ChevronRight, ChevronDown, AlertCircle, Calendar as CalendarIcon, Key, Timer, Sun, CloudSun, Flower, Coffee, Star, Smile, Gift as GiftIcon, ArrowLeft } from 'lucide-react';

// --- TYPES ---
interface Gift {
  day: number;
  title: string;
  description: string;
  icon: string;
}

interface Challenge {
  id: string;
  question: string;
  correctDate: { day: number; month: number; year: number };
}

interface CheerUpPhrase {
  id: number;
  phrase: string;
  icon: React.ReactNode;
}

// --- DATA ---
const ADVENT_GIFTS: Gift[] = [
  { day: 1, title: "Sıcak Çikolata Gecesi", description: "Bugün enn sevdiğin battaniyeye sarılıp beraber film(harry potter hihihi) izleyip sıcak çikolata içiyoruz", icon: "☕" },
  { day: 2, title: "Masaj Kuponu", description: "Yorgun bir günün ardından 45 dakikalık tüm vucut masajı benden!", icon: "💆‍♀️" },
  { day: 3, title: "Nostalji Turu", description: "Eskiden yaşadığımız, istediğin bir anı tekrar yaşayacağız !", icon: "📍" },
  { day: 4, title: "Film Maratonu", description: "Seçimi tamamen sen yapıyorsun, mısırlar benden hihihihii!", icon: "🎬" },
  { day: 5, title: "Sana Özel Bir Şiir", description: "Senin için yazdığım minik bir not gizli bir yerde onu bulmanı bekliyor.", icon: "✍️" },
  { day: 6, title: "Akşam Yemeği Benden", description: "Bu akşam mutfak bana emanet, en sevdiğin yemeği yapıyorum.", icon: "🍳" },
  { day: 7, title: "Yıldız İzleme", description: "Hava soğuk olsa da arabanın içinde gökyüzünü izlemeye gidelim.", icon: "✨" },
  { day: 8, title: "Küçük Bir Hediye", description: "Gizli bir yerde senin onu bulmanı bekliyor!", icon: "🎁" },
  { day: 9, title: "Dans Gecesi", description: "Sadece ikimiz için çalan bir şarkıda dans edelim.(mutlu isek ona göre bir şarkı mutsuz ise ona göre bir şarkı ama dans edeceğiz kesinlikle)", icon: "💃" },
  { day: 10, title: "Müze Gezisi", description: "Saçma sapan müzelere gidip buraya niye geldik diyeceğiz.", icon: "🏛️" },
  { day: 11, title: "Kahvaltı Keyfi", description: "Yarın sabah yatağına krallara layık bir kahvaltı gelecek.", icon: "🥐" },
  { day: 12, title: "Oyun Gecesi", description: "En sevdiğin kutu oyununu veya video oyununu oynayacağız.", icon: "🎮" },
  { day: 13, title: "Fotoğraf Albümü", description: "En sevdiğim 5 fotoğrafımızı bastırıp sana getirdim ama nerde bul onu heheheheheheehehe.", icon: "📸" },
  { day: 14, title: "Tatlı Kaçamağı", description: "Her zaman gitmek istediğin o kuruvasancıya gidiyoruz!", icon: "🍰" },
  { day: 15, title: "Sınırsız Öpücük", description: "Bugün istediğin her an 10 öpücük hakkın varrr Ama bu hakkını kullanmazsan 1 saat aralıksız nefes almadan öpücük varr!", icon: "💋" },
  { day: 16, title: "Doğa Yürüyüşü", description: "Temiz hava alıp beraber uzun bir yürüyüş yapalım.", icon: "🌲" },
  { day: 17, title: "Evde Spa", description: "Yüz maskeleri, mumlar ve huzur dolu bir akşam bizi bekliyor.", icon: "🧼" },
  { day: 18, title: "En Sevdiğin Şarkı", description: "Sana özel bir çalma listesi hazırladım, kulak tıkacını hazırlaa!", icon: "🎵" },
  { day: 19, title: "Sinema Keyfi", description: "Bizim evde ya da ayarladığımız bir evde mumlarla hazırlanmış bir ortamda birlikte yatarak film izlemekk!", icon: "🍿" },
  { day: 20, title: "Kitap Okuma", description: "En sıkıcı günümüz olabilir ama seninle kitapda okurum ben.", icon: "📖" },
  { day: 21, title: "Sabah Uykusu", description: "Bugün senin yapman gereken tüm işler bende sen hiçbir şey yapmayacaksınn!", icon: "😴" },
  { day: 22, title: "Gün Batımı", description: "Manzarası güzel bir yere gidip günü beraber batıralım.", icon: "🌅" },
  { day: 23, title: "Geçmişten Bir Anı", description: "Sana ilk aşık olduğum anı tüm detaylarıyla anlatacağım.", icon: "❤️" },
  { day: 24, title: "Büyük Sürpriz!", description: "Bugün çok güzel giyinmelisin... Başka bir ipucu yokk!!!", icon: "🎄" },
];

const CHEER_UP_PHRASES: CheerUpPhrase[] = [
  { id: 1, phrase: "Gülüşün dünyamı aydınlatıyor, lütfen sönmesine izin verme. ✨", icon: <Sun className="text-yellow-400" /> },
  { id: 2, phrase: "Şüphesiz güçlükle beraber bir kolaylık vardır. Gerçekten, güçlükle beraber bir kolaylık vardır", icon: <CloudSun className="text-blue-400" /> },
  { id: 3, phrase: "Ben her zaman yanındayım, elini hiç bırakmayacağım. 🤝❤️", icon: <Heart className="text-rose-500 fill-rose-500" /> },
  { id: 4, phrase: "Kullarım sana Beni sorarlarsa, bilsinler ki Ben, şüphesiz onlara yakınım. Benden isteyenin, dua ettiğinde duasını kabul ederim. Artık onlar da davetimi kabul edip Bana inansınlar ki doğru yolda yürüyenlerden olsunlar.😊", icon: <Star className="text-amber-400" /> },
  { id: 5, phrase: "Senin kadar güçlü ve güzel birini tanımıyorum. 💪🌹", icon: <Flower className="text-pink-400" /> },
  { id: 6, phrase: "Seni her halinle, en çok da gülerken seviyorum. 😊", icon: <Smile className="text-orange-400" /> },
  { id: 7, phrase: "Hadi derin bir nefes al, ben buradayım ve seni çok seviyorum. 🌬️💖", icon: <Sparkles className="text-purple-400" /> },
  { id: 8, phrase: "Ey inananlar! Sabır ve namazla yardım dileyin. Allah, muhakkak ki sabredenlerle beraberdir.😊", icon: <Coffee className="text-brown-400" /> },
  { id: 9, phrase: "Dünyanın en tatlı insanı bugün biraz üzgün mü? Hemen neşelendirelim! 🍭", icon: <GiftIcon className="text-emerald-400" /> },
  { id: 10, phrase: "Küçük bir hatırlatma: Sen benim başıma gelen en güzel şeysin. 🍀", icon: <Heart className="text-red-500" /> },
  { id: 11, phrase: "Allah, sizin düşmanlarınızı çok daha iyi bilir. Allah, dost olarak yeter. Allah, yardımcı olarak da yeter.😊", icon: <Heart className="text-red-500" /> },
  { id: 12, phrase: "Olur ki (bazen) hoşunuza gitmeyen bir şey sizin için hayırlı olur ve hoşunuza giden bir şey de sizin için şer olur. (Hayırlı ve doğru olanı) Allah bilir, siz bilemezsiniz 🍀", icon: <Heart className="text-red-500" /> },
];

const CHALLENGES: Challenge[] = [
  { id: 'kiss', question: "İLK ÖPÜCÜKKK", correctDate: { day: 26, month: 8, year: 2023 } },
  { id: 'date', question: "İLK DATEEEEE", correctDate: { day: 23, month: 8, year: 2023 } },
  { id: 'propose', question: "EVLİLİK TEKLİFİİİİ", correctDate: { day: 26, month: 5, year: 2024 } },
];

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const YEARS = Array.from({ length: 10 }, (_, i) => 2020 + i);

// --- COMPONENTS ---

const Snowfall: React.FC = () => {
  const snowflakes = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${5 + Math.random() * 10}s`,
      delay: `${Math.random() * 5}s`,
      size: `${10 + Math.random() * 20}px`,
      opacity: 0.2 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((s) => (
        <div key={s.id} className="snowflake" style={{ left: s.left, animationDuration: s.duration, animationDelay: s.delay, fontSize: s.size, opacity: s.opacity }}>
          ❄
        </div>
      ))}
    </div>
  );
};

const CustomSelector: React.FC<{ label: string; value: number; options: (string | number)[]; onChange: (val: number) => void }> = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{label}</span>
    <div className="relative group">
      <select 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="appearance-none w-full bg-rose-50 border-2 border-rose-100 text-slate-700 py-3 pl-4 pr-10 rounded-2xl focus:border-rose-400 focus:bg-white outline-none transition-all cursor-pointer font-semibold"
      >
        {options.map((opt, idx) => (
          <option key={idx} value={typeof opt === 'string' ? idx + 1 : opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-rose-400">
        <ChevronDown size={18} />
      </div>
    </div>
  </div>
);

const CheerUpView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedPhrase, setSelectedPhrase] = useState<CheerUpPhrase | null>(null);

  return (
    <div className="fixed inset-0 z-[110] flex flex-col items-center justify-start p-4 bg-gradient-to-b from-indigo-50 to-white overflow-y-auto">
      <div className="w-full max-w-4xl mt-8">
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-500 font-bold hover:text-indigo-700 transition-colors mb-8 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Ana Ekrana Dön
        </button>

        <header className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
            <Sun className="text-indigo-500 animate-spin-slow" size={40} />
          </div>
          <h2 className="text-4xl font-bold text-slate-800 mb-4 font-romantic">Gülümsemen Her Şeye Değer...</h2>
          <p className="text-slate-500 italic">Senin için hazırladığım küçük sevgi mesajlarından birini seç.</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          {CHEER_UP_PHRASES.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setSelectedPhrase(item)}
              className="aspect-square bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 hover:shadow-indigo-200/60 border border-indigo-50 flex flex-col items-center justify-center gap-3 transition-all hover:-translate-y-2 active:scale-95 group animate-in zoom-in duration-500"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="text-3xl transform group-hover:scale-125 transition-transform duration-300">
                {item.icon}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aç Beni</span>
            </button>
          ))}
        </div>
      </div>

      {selectedPhrase && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-indigo-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl relative animate-in zoom-in duration-300">
            <button onClick={() => setSelectedPhrase(null)} className="absolute top-6 right-6 text-slate-300 hover:text-indigo-500 transition-colors">
              <X size={28} />
            </button>
            <div className="text-6xl mb-8 flex justify-center">
              {selectedPhrase.icon}
            </div>
            <p className="text-xl font-medium text-slate-700 leading-relaxed mb-8 italic">
              "{selectedPhrase.phrase}"
            </p>
            <button 
              onClick={() => setSelectedPhrase(null)} 
              className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              İyi ki Varsın ❤️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AccessGate: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [shuffledChallenges, setShuffledChallenges] = useState<Challenge[]>([]);
  const [isCheerUpMode, setIsCheerUpMode] = useState(false);
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2023);
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setShuffledChallenges([...CHALLENGES].sort(() => Math.random() - 0.5));
    audioRef.current = new Audio('bok.ogg');

    const reloadTimer = setTimeout(() => {
      window.location.reload();
    }, 2 * 60 * 1000); 
    
    return () => clearTimeout(reloadTimer);
  }, []);

  const playBokSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.warn("Ses çalınamadı. 'bok.ogg' dosyası mevcut değil.", err);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChallenge) return;

    const { correctDate } = activeChallenge;
    if (day === correctDate.day && month === correctDate.month && year === correctDate.year) {
      onUnlock();
    } else {
      setError(true);
      setIsShaking(true);
      playBokSound();
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  if (isCheerUpMode) return <CheerUpView onBack={() => setIsCheerUpMode(false)} />;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950 overflow-y-auto text-slate-800">
      <Snowfall />
      
      <div className={`w-full max-w-lg bg-white rounded-[3rem] p-8 md:p-12 text-center shadow-[0_30px_100px_-20px_rgba(244,63,94,0.4)] relative overflow-hidden transition-all duration-500 ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-rose-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-rose-50 rounded-full blur-3xl opacity-60"></div>
        
        <div className="relative z-10">
          {!activeChallenge ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-100 rounded-[2rem] mb-8 rotate-3">
                <Lock className="text-rose-500" size={36} />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-3 font-romantic">Aşk Mahzeni</h2>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed italic px-6">
                İçeri girmek için kalbinden geçen bir anahtarı seç...
              </p>

              <div className="grid grid-cols-1 gap-4">
                {shuffledChallenges.map((challenge, idx) => (
                  <button
                    key={challenge.id}
                    onClick={() => setActiveChallenge(challenge)}
                    className="flex items-center gap-6 p-6 bg-rose-50 hover:bg-rose-100 border-2 border-rose-100 hover:border-rose-300 rounded-3xl transition-all group active:scale-95"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Key className="text-rose-500" size={28} />
                    </div>
                    <div className="text-left flex-1">
                      <span className="text-slate-800 font-bold text-xl font-romantic tracking-wide">Anahtar {idx + 1}</span>
                    </div>
                    <ChevronRight className="text-rose-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <button 
                  onClick={() => setIsCheerUpMode(true)}
                  className="w-full py-4 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 italic"
                >
                  Canım Sıkkın... ❤️
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in duration-500">
              <button 
                onClick={() => setActiveChallenge(null)}
                className="absolute -top-4 -left-4 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-100 rounded-[2rem] mb-8 animate-pulse">
                <Heart className="text-rose-500 fill-rose-500" size={36} />
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-3 font-romantic">Hatıra Doğrulama</h2>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed italic px-6">
                Seçtiğin anahtarın sorusu: <br/>
                <span className="font-bold text-rose-600 not-italic block mt-2 text-lg leading-tight">{activeChallenge.question}</span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  <CustomSelector label="Gün" value={day} options={days} onChange={setDay} />
                  <CustomSelector label="Ay" value={month} options={MONTHS} onChange={setMonth} />
                  <CustomSelector label="Yıl" value={year} options={YEARS} onChange={setYear} />
                </div>

                <div className="h-4">
                  {error && (
                    <p className="text-rose-500 text-sm font-semibold animate-bounce flex items-center justify-center gap-2">
                      <span>BOKK 💩</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-[1.5rem] font-bold text-lg transition-all active:scale-95 shadow-xl shadow-rose-200 flex items-center justify-center gap-3 group"
                >
                  Kapıyı Aç
                  <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-10px); }
          80% { transform: translateX(10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

interface AdventDoorProps {
  gift: Gift;
  isOpened: boolean;
  onOpen: (day: number) => void;
}

const AdventDoor: React.FC<AdventDoorProps> = ({ gift, isOpened, onOpen }) => {
  return (
    <div className="relative h-44 w-full perspective-1000 group cursor-pointer" onClick={() => onOpen(gift.day)}>
      <div className={`absolute inset-0 rounded-3xl bg-white shadow-2xl flex flex-col items-center justify-center p-4 text-center transition-all duration-500 transform ${isOpened ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <span className="text-5xl mb-3 drop-shadow-sm">{gift.icon}</span>
        <h3 className="text-[11px] font-black text-rose-600 leading-tight uppercase tracking-widest">{gift.title}</h3>
        <p className="text-[10px] text-slate-400 font-medium leading-tight mt-2 px-1 line-clamp-3">"{gift.description}"</p>
      </div>

      <div 
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-xl border-2 border-rose-300/20 flex items-center justify-center transition-all duration-700 origin-left transform backface-hidden z-10
          ${isOpened ? 'rotate-y-[-120deg] opacity-0 pointer-events-none' : 'rotate-y-0 opacity-100 hover:brightness-110'}
        `}
        style={{ transform: isOpened ? 'rotateY(-120deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}
      >
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
            <span className="text-white text-2xl font-black font-romantic">{gift.day}</span>
          </div>
          <Heart size={14} className="text-rose-300/40 fill-rose-300/20" />
        </div>
        <div className="absolute top-3 right-3 opacity-10"><Sparkles size={16} color="white" /></div>
        <div className="absolute bottom-3 left-3 opacity-10"><Sparkles size={16} color="white" /></div>
      </div>
    </div>
  );
};

const App = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [openedDoors, setOpenedDoors] = useState<number[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(10);
  const [pendingGift, setPendingGift] = useState<Gift | null>(null);

  // TAKVİM MANTIĞI REVERT: 
  // Eski basit mantığa geri dönüyoruz. Bugünün tarihinden 14 çıkarıyoruz.
  const currentDayOfMonth = new Date().getDate();
  const todayBox = currentDayOfMonth - 14;
  const tomorrowBox = todayBox + 1;

  // Countdown Logic
  useEffect(() => {
    let timer: number;
    if (isCountingDown && countdownValue > 0) {
      timer = window.setInterval(() => {
        setCountdownValue(prev => prev - 1);
      }, 1000);
    } else if (isCountingDown && countdownValue === 0) {
      setIsCountingDown(false);
      setSelectedGift(pendingGift);
      setPendingGift(null);
    }
    return () => clearInterval(timer);
  }, [isCountingDown, countdownValue, pendingGift]);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  const handleOpenDoor = (day: number) => {
    const gift = ADVENT_GIFTS.find(g => g.day === day);
    if (!gift) return;

    if (!openedDoors.includes(day)) {
      setOpenedDoors(prev => [...prev, day]);
    }

    setPendingGift(gift);
    setCountdownValue(10);
    setIsCountingDown(true);
  };

  if (!isUnlocked) return <AccessGate onUnlock={handleUnlock} />;

  return (
    <div className="min-h-screen pb-24 relative bg-slate-950 animate-in fade-in duration-1000">
      <Snowfall />

      <div className="sticky top-0 z-50 w-full bg-rose-600/90 backdrop-blur-lg text-white py-4 px-6 text-center shadow-2xl border-b border-rose-400/30">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8">
          <div className="flex items-center gap-2">
            <AlertCircle className="shrink-0 animate-pulse text-rose-200" size={18} />
            <p className="text-xs md:text-sm font-bold tracking-tight">
              Bugün <span className="text-yellow-300 text-lg mx-1">{todayBox}.</span> kutuyu, yarın <span className="text-yellow-300 text-lg mx-1">{tomorrowBox}.</span> kutuyu açmalısın bebeğim ❤️
            </p>
          </div>
          <div className="hidden md:block w-px h-6 bg-rose-400/30"></div>
          <p className="text-[10px] md:text-xs font-medium italic text-rose-100/80">
            Senden sakladığım için özür dilerim, telafi edeceğim sevgilim.
          </p>
        </div>
      </div>

      <header className="relative z-10 pt-16 pb-12 text-center px-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-500/10 rounded-full mb-8 animate-bounce">
          <Heart className="text-rose-500 fill-rose-500" size={40} />
        </div>
        <h1 className="text-5xl md:text-7xl font-romantic text-white mb-6 drop-shadow-[0_10px_10px_rgba(244,63,94,0.3)]">
          Aşk Dolu Günlerimiz
        </h1>
        <p className="text-rose-200/50 max-w-sm mx-auto text-sm italic font-medium leading-relaxed uppercase tracking-[0.2em]">
          Seninle geçen her an bir hediye
        </p>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {ADVENT_GIFTS.map((gift) => (
            <AdventDoor key={gift.day} gift={gift} isOpened={openedDoors.includes(gift.day)} onOpen={handleOpenDoor} />
          ))}
        </div>
      </main>

      <footer className="relative z-10 mt-24 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 bg-rose-900/40"></div>
          <Sparkles className="text-yellow-400" size={16} />
          <p className="text-rose-200/30 text-xs tracking-[0.4em] uppercase font-black">Sonsuz Sevgilerle</p>
          <Sparkles className="text-yellow-400" size={16} />
          <div className="h-px w-12 bg-rose-900/40"></div>
        </div>
      </footer>

      {isCountingDown && (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center p-6 bg-slate-950/98 backdrop-blur-3xl transition-all duration-500 animate-in fade-in">
          <div className="relative">
            <div className="w-64 h-64 rounded-full border-8 border-rose-500/20 flex items-center justify-center">
              <span className="text-9xl font-black text-rose-500 animate-pulse font-romantic">
                {countdownValue}
              </span>
            </div>
            <div className="absolute inset-0 animate-spin-slow">
              <Heart className="text-rose-500/30 absolute top-0 left-1/2 -translate-x-1/2" size={32} />
            </div>
          </div>
          <p className="mt-12 text-2xl font-romantic text-white italic animate-bounce">
            {countdownValue > 7 ? "Hazır mısın sevgilim? ❤️" : 
             countdownValue > 4 ? "Geliyorrrr... ✨" : 
             countdownValue > 0 ? "Heeeyecanlı mısın? 😍" : "Açılıyor! 🎁"}
          </p>
        </div>
      )}

      {selectedGift && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl transition-all duration-500">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-[0_50px_100px_-20px_rgba(244,63,94,0.5)] relative overflow-hidden animate-in zoom-in duration-300">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-rose-50 rounded-full blur-3xl opacity-50"></div>
            <button onClick={() => setSelectedGift(null)} className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors">
              <X size={28} />
            </button>
            <div className="text-7xl mb-8 transform hover:scale-110 transition-transform duration-300 cursor-default">{selectedGift.icon}</div>
            <div className="text-rose-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">MUCİZE GÜN {selectedGift.day}</div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6 font-romantic">{selectedGift.title}</h2>
            <div className="bg-rose-50 p-6 rounded-3xl mb-10 border border-rose-100 italic text-slate-600 leading-relaxed shadow-inner">
              "{selectedGift.description}"
            </div>
            <button onClick={() => setSelectedGift(null)} className="w-full py-5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-[1.5rem] font-black text-lg transition-all active:scale-95 shadow-2xl shadow-rose-200">
              Teşekkürler Sevgilim ❤️
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 left-6 right-6 z-40 max-w-md mx-auto">
        <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/5 p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-6">
          <div className="bg-rose-500/20 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
            <Heart className="text-rose-500 fill-rose-500" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-rose-200/40 mb-2 uppercase font-black tracking-widest">
              <span>Mutluluk İlerlemesi</span>
              <span>{openedDoors.length} / 24</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 transition-all duration-1000 relative" style={{ width: `${(openedDoors.length / 24) * 100}%` }}>
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
