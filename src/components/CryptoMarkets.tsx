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
      <Card className="bg-white/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="TrendingUp" size={24} />
            Рынок криптовалют
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cryptos.map((crypto) => {
              const chartData = generateMockChart();
              const change = (Math.random() - 0.5) * 10;
              const isPositive = change > 0;

              return (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {crypto.symbol.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{crypto.name}</h3>
                      <p className="text-sm text-slate-500">{crypto.symbol}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-mono text-lg font-bold">
                        ${crypto.price_usd.toFixed(2)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {crypto.price_stars.toFixed(2)} ⭐
                      </p>
                    </div>

                    <div className="hidden md:block">
                      {renderSparkline(chartData)}
                    </div>

                    <Badge variant={isPositive ? 'default' : 'destructive'} className="min-w-20">
                      <Icon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={14} className="mr-1" />
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
