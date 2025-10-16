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

    toast({
      title: type === 'buy' ? 'Покупка' : 'Продажа',
      description: `${amount} ${selectedCrypto.symbol} за ${total.toFixed(2)} ${currency === 'stars' ? '⭐' : '$'}`,
    });

    setAmount('');
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-white/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="ArrowUpCircle" size={24} className="text-secondary" />
            Покупка
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Криптовалюта</label>
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
            <label className="text-sm font-medium mb-2 block">Валюта оплаты</label>
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
            <div className="p-4 bg-slate-100 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span>Цена за 1 {selectedCrypto.symbol}:</span>
                <span className="font-mono font-bold">
                  {(currency === 'stars' ? selectedCrypto.price_stars : selectedCrypto.price_usd).toFixed(2)}
                  {currency === 'stars' ? ' ⭐' : ' $'}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span className="font-mono text-primary">
                  {(parseFloat(amount) * (currency === 'stars' ? selectedCrypto.price_stars : selectedCrypto.price_usd)).toFixed(2)}
                  {currency === 'stars' ? ' ⭐' : ' $'}
                </span>
              </div>
            </div>
          )}

          <Button onClick={() => handleTrade('buy')} className="w-full h-12 text-lg">
            <Icon name="ShoppingCart" size={20} className="mr-2" />
            Купить
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="ArrowDownCircle" size={24} className="text-destructive" />
            Продажа
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Криптовалюта</label>
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
            <label className="text-sm font-medium mb-2 block">Получить в</label>
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
            <div className="p-4 bg-slate-100 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span>Цена за 1 {selectedCrypto.symbol}:</span>
                <span className="font-mono font-bold">
                  {(currency === 'stars' ? selectedCrypto.price_stars : selectedCrypto.price_usd).toFixed(2)}
                  {currency === 'stars' ? ' ⭐' : ' $'}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Получите:</span>
                <span className="font-mono text-secondary">
                  {(parseFloat(amount) * (currency === 'stars' ? selectedCrypto.price_stars : selectedCrypto.price_usd)).toFixed(2)}
                  {currency === 'stars' ? ' ⭐' : ' $'}
                </span>
              </div>
            </div>
          )}

          <Button onClick={() => handleTrade('sell')} variant="destructive" className="w-full h-12 text-lg">
            <Icon name="TrendingDown" size={20} className="mr-2" />
            Продать
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingPanel;
