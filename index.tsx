
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { Heart, Sparkles, X, AlertCircle } from 'lucide-react';

// --- TYPES ---
interface Gift {
  day: number;
  title: string;
  description: string;
  icon: string;
}

// --- DATA ---
const ADVENT_GIFTS: Gift[] = [
  { day: 1, title: "Sıcak Çikolata Gecesi", description: "Bugün en sevdiğin battaniyeye sarılıp beraber film(harry potter hihihi) izleyip sıcak çikolata içiyoruz", icon: "☕" },
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
        <div
          key={s.id}
          className="snowflake"
          style={{
            left: s.left,
            animationDuration: s.duration,
            animationDelay: s.delay,
            fontSize: s.size,
            opacity: s.opacity,
          }}
        >
          ❄
        </div>
      ))}
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
    <div 
      className="relative h-40 w-full perspective-1000 group cursor-pointer"
      onClick={() => onOpen(gift.day)}
    >
      {/* Back Layer (The Content) */}
      <div className={`absolute inset-0 rounded-2xl bg-white shadow-xl flex flex-col items-center justify-center p-3 text-center transition-all duration-500 transform ${isOpened ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <span className="text-4xl mb-2">{gift.icon}</span>
        <h3 className="text-xs font-bold text-rose-600 leading-tight uppercase tracking-tighter">{gift.title}</h3>
        <p className="text-[10px] text-gray-500 leading-tight mt-2 px-1 line-clamp-3">{gift.description}</p>
      </div>

      {/* Front Layer (The Door) */}
      <div 
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-800 shadow-lg border-2 border-rose-400/30 flex items-center justify-center transition-all duration-700 origin-left transform backface-hidden z-10
          ${isOpened ? 'rotate-y-[-110deg] opacity-0' : 'rotate-y-0 opacity-100 hover:scale-[1.02] hover:bg-rose-500'}
        `}
        style={{ transform: isOpened ? 'rotateY(-110deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}
      >
        <div className="flex flex-col items-center">
          <span className="text-white text-3xl font-bold font-romantic drop-shadow-md">{gift.day}</span>
          <div className="mt-1 h-1 w-8 bg-white/20 rounded-full"></div>
        </div>
        
        <div className="absolute top-2 right-2 opacity-20"><Heart size={12} color="white" fill="white" /></div>
        <div className="absolute bottom-2 left-2 opacity-20"><Sparkles size={12} color="white" /></div>
        
        {!isOpened && (
          <div className="absolute right-4 w-3 h-3 rounded-full bg-yellow-400 shadow-inner border border-yellow-600/30"></div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [openedDoors, setOpenedDoors] = useState<number[]>(() => {
    const saved = localStorage.getItem('advent_opened_doors');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  useEffect(() => {
    localStorage.setItem('advent_opened_doors', JSON.stringify(openedDoors));
  }, [openedDoors]);

  const handleOpenDoor = (day: number) => {
    if (!openedDoors.includes(day)) {
      setOpenedDoors([...openedDoors, day]);
    }
    const gift = ADVENT_GIFTS.find(g => g.day === day);
    if (gift) {
      setSelectedGift(gift);
    }
  };

  return (
    <div className="min-h-screen pb-24 relative bg-slate-950">
      <Snowfall />

      {/* Apology Banner - Sticky at the top */}
      <div className="sticky top-0 z-50 w-full bg-rose-600/95 backdrop-blur-md text-white py-3 px-6 text-center shadow-2xl border-b border-rose-400/40">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <Heart className="shrink-0 animate-pulse fill-white" size={18} />
          <p className="text-sm md:text-base font-semibold tracking-wide">
            Senden sakladığım için özür dilerim, telafi etmek için elimden geleni yapacağım.
          </p>
          <Heart className="shrink-0 animate-pulse fill-white" size={18} />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-12 pb-8 text-center px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-500/20 rounded-full mb-6 animate-bounce">
          <Heart className="text-rose-500 fill-rose-500" size={32} />
        </div>
        <h1 className="text-4xl md:text-6xl font-romantic text-rose-100 mb-4 drop-shadow-2xl">
          Aşk Dolu Günlerimiz
        </h1>
        <p className="text-rose-200/60 max-w-sm mx-auto text-sm italic font-light leading-relaxed">
          "Seninle geçen her gün bir hediye ama bu ay her günün ayrı bir sürprizi var..."
        </p>
      </header>

      {/* Grid */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {ADVENT_GIFTS.map((gift) => (
            <AdventDoor 
              key={gift.day}
              gift={gift}
              isOpened={openedDoors.includes(gift.day)}
              onOpen={handleOpenDoor}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles className="text-yellow-400" size={14} />
          <p className="text-rose-200/40 text-xs tracking-widest uppercase font-semibold">Seninle her saniye çok değerli</p>
          <Sparkles className="text-yellow-400" size={14} />
        </div>
        <div className="text-rose-400/20 text-[10px] mt-4 mb-8 uppercase tracking-widest font-bold">Her Şey Senin İçin</div>
      </footer>

      {/* Gift Modal */}
      {selectedGift && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-100 rounded-full blur-2xl opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-100 rounded-full blur-2xl opacity-50"></div>
            
            <button 
              onClick={() => setSelectedGift(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-6xl mb-6 scale-125">{selectedGift.icon}</div>
            <div className="text-rose-500 font-bold text-xs uppercase tracking-[0.2em] mb-2">GÜN {selectedGift.day} SÜRPRİZİ</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{selectedGift.title}</h2>
            <p className="text-slate-600 mb-8 leading-relaxed italic">
              "{selectedGift.description}"
            </p>
            
            <button 
              onClick={() => setSelectedGift(null)}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-rose-200"
            >
              Kabul Edildi! 💖
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-40 max-w-sm mx-auto">
        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-2xl flex items-center gap-4">
          <div className="bg-rose-500/20 p-2 rounded-lg shrink-0">
            <Heart className="text-rose-500 fill-rose-500" size={16} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-white/50 mb-1 uppercase tracking-tighter font-bold">
              <span>Sevgi Yolculuğumuz</span>
              <span>{openedDoors.length} / 24</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-1000 shadow-[0_0_10px_rgba(244,63,94,0.5)]" 
                style={{ width: `${(openedDoors.length / 24) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
