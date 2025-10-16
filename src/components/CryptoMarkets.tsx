import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const API_BASE = 'https://functions.poehali.dev';
const CRYPTO_URL = `${API_BASE}/458d1703-6447-443a-831f-1e8921175f50`;

interface Crypto {
  id: number;
  name: string;
  symbol: string;
  price_usd: number;
  price_stars: number;
  total_supply: number;
}

const CryptoMarkets = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = async () => {
    try {
      const response = await fetch(CRYPTO_URL);
      const data = await response.json();
      setCryptos(data);
    } catch (error) {
      console.error('Failed to fetch cryptos:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockChart = () => {
    const points = 20;
    const data = [];
    let value = 50 + Math.random() * 50;
    
    for (let i = 0; i < points; i++) {
      value += (Math.random() - 0.5) * 10;
      value = Math.max(10, Math.min(100, value));
      data.push(value);
    }
    
    return data;
  };

  const renderSparkline = (data: number[]) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg viewBox="0 0 100 100" className="w-24 h-12" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          fill="url(#gradient)"
          points={`0,100 ${points} 100,100`}
        />
      </svg>
    );
  };

  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur">
        <CardContent className="p-8 text-center">
          <Icon name="Loader2" className="animate-spin mx-auto mb-2" size={32} />
          <p>Загрузка данных...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <Icon name="TrendingUp" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Рынок криптовалют</h2>
              <p className="text-sm text-white/60 font-normal mt-1">{cryptos.length} активных монет</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {cryptos.map((crypto) => {
              const chartData = generateMockChart();
              const change = (Math.random() - 0.5) * 10;
              const isPositive = change > 0;

              return (
                <div
                  key={crypto.id}
                  className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/10 hover:border-primary/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 p-2">
                      <img 
                        src={`https://cryptologos.cc/logos/${crypto.name.toLowerCase().replace(/\s+/g, '-')}-${crypto.symbol.toLowerCase()}-logo.png`}
                        alt={crypto.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.classList.add('bg-gradient-to-br', 'from-primary', 'via-secondary', 'to-primary');
                            const span = document.createElement('span');
                            span.className = 'text-white font-bold text-xl';
                            span.textContent = crypto.symbol.charAt(0);
                            parent.appendChild(span);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{crypto.name}</h3>
                      <p className="text-sm text-white/60 font-mono">{crypto.symbol}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-mono text-xl font-bold text-white">
                        ${crypto.price_usd.toLocaleString()}
                      </p>
                      <p className="text-sm text-white/60 font-mono">
                        {crypto.price_stars.toFixed(4)} ⭐
                      </p>
                    </div>

                    <div className="hidden md:block">
                      {renderSparkline(chartData)}
                    </div>

                    <Badge 
                      variant={isPositive ? 'default' : 'destructive'} 
                      className="min-w-24 h-8 text-base font-bold shadow-lg"
                    >
                      <Icon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={16} className="mr-1" />
                      {isPositive ? '+' : ''}{change.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoMarkets;