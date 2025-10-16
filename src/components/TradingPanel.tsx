import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const API_BASE = 'https://functions.poehali.dev';
const CRYPTO_URL = `${API_BASE}/458d1703-6447-443a-831f-1e8921175f50`;

interface Crypto {
  id: number;
  name: string;
  symbol: string;
  price_usd: number;
  price_stars: number;
}

const TradingPanel = ({ userId }: { userId: number }) => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'usd' | 'stars'>('stars');
  const { toast } = useToast();

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = async () => {
    try {
      const response = await fetch(CRYPTO_URL);
      const data = await response.json();
      setCryptos(data);
      if (data.length > 0) setSelectedCrypto(data[0]);
    } catch (error) {
      console.error('Failed to fetch cryptos:', error);
    }
  };

  const handleTrade = (type: 'buy' | 'sell') => {
    if (!selectedCrypto || !amount) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    const price = currency === 'stars' ? selectedCrypto.price_stars : selectedCrypto.price_usd;
    const total = parseFloat(amount) * price;

    if (currency === 'stars') {
      toast({
        title: type === 'buy' ? 'Покупка за Telegram Stars' : 'Продажа за Telegram Stars',
        description: `Для оплаты ${total.toFixed(2)} ⭐ напишите @azepinov в Telegram`,
        duration: 8000
      });
    } else {
      toast({
        title: type === 'buy' ? 'Покупка' : 'Продажа',
        description: `${amount} ${selectedCrypto.symbol} за $${total.toFixed(2)}`,
      });
    }

    setAmount('');
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary"></div>
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-br from-secondary to-green-400 rounded-lg shadow-lg">
              <Icon name="ArrowUpCircle" size={24} />
            </div>
            <span className="text-2xl">Покупка</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <label className="text-sm font-medium mb-2 block text-white/80">Криптовалюта</label>
            <Select
              value={selectedCrypto?.id.toString()}
              onValueChange={(value) => {
                const crypto = cryptos.find(c => c.id.toString() === value);
                setSelectedCrypto(crypto || null);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cryptos.map((crypto) => (
                  <SelectItem key={crypto.id} value={crypto.id.toString()}>
                    {crypto.name} ({crypto.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-white/80">Валюта оплаты</label>
            <Select value={currency} onValueChange={(value: 'usd' | 'stars') => setCurrency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stars">Telegram Stars ⭐</SelectItem>
                <SelectItem value="usd">US Dollars $</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Количество</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-mono text-lg"
            />
          </div>

          {selectedCrypto && amount && (
            <div className="p-5 bg-gradient-to-br from-white/20 to-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
              <div className="flex justify-between text-sm mb-2 text-white/70">
                <span>Цена за 1 {selectedCrypto.symbol}:</span>
                <span className="font-mono font-bold text-white">
                  {(currency === 'stars' ? selectedCrypto.price_stars : selectedCrypto.price_usd).toFixed(2)}
                  {currency === 'stars' ? ' ⭐' : ' $'}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span className="text-white">Итого:</span>
                <span className="font-mono text-secondary">
                  {(parseFloat(amount) * (currency === 'stars' ? selectedCrypto.price_stars : selectedCrypto.price_usd)).toFixed(2)}
                  {currency === 'stars' ? ' ⭐' : ' $'}
                </span>
              </div>
            </div>
          )}

          <Button onClick={() => handleTrade('buy')} className="w-full h-14 text-lg font-bold bg-gradient-to-r from-secondary to-green-400 hover:from-secondary/90 hover:to-green-400/90 shadow-xl hover:shadow-2xl transition-all duration-300">
            <Icon name="ShoppingCart" size={20} className="mr-2" />
            Купить
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg shadow-lg">
              <Icon name="ArrowDownCircle" size={24} />
            </div>
            <span className="text-2xl">Продажа</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <label className="text-sm font-medium mb-2 block text-white/80">Криптовалюта</label>
            <Select
              value={selectedCrypto?.id.toString()}
              onValueChange={(value) => {
                const crypto = cryptos.find(c => c.id.toString() === value);
                setSelectedCrypto(crypto || null);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cryptos.map((crypto) => (
                  <SelectItem key={crypto.id} value={crypto.id.toString()}>
                    {crypto.name} ({crypto.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-white/80">Получить в</label>
            <Select value={currency} onValueChange={(value: 'usd' | 'stars') => setCurrency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stars">Telegram Stars ⭐</SelectItem>
                <SelectItem value="usd">US Dollars $</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-white/80">Количество</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-mono text-lg h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          {selectedCrypto && amount && (
            <div className="p-5 bg-gradient-to-br from-white/20 to-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
              <div className="flex justify-between text-sm mb-2 text-white/70">
                <span>Цена за 1 {selectedCrypto.symbol}:</span>
                <span className="font-mono font-bold text-white">
                  {(currency === 'stars' ? selectedCrypto.price_stars : selectedCrypto.price_usd).toFixed(2)}
                  {currency === 'stars' ? ' ⭐' : ' $'}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span className="text-white">Получите:</span>
                <span className="font-mono text-orange-400">
                  {(parseFloat(amount) * (currency === 'stars' ? selectedCrypto.price_stars : selectedCrypto.price_usd)).toFixed(2)}
                  {currency === 'stars' ? ' ⭐' : ' $'}
                </span>
              </div>
            </div>
          )}

          <Button onClick={() => handleTrade('sell')} className="w-full h-14 text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-xl hover:shadow-2xl transition-all duration-300">
            <Icon name="TrendingDown" size={20} className="mr-2" />
            Продать
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingPanel;