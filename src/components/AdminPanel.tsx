import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const API_BASE = 'https://functions.poehali.dev';
const ADMIN_URL = `${API_BASE}/3088768a-597a-4246-83b7-f485d533a2e3`;
const CRYPTO_URL = `${API_BASE}/458d1703-6447-443a-831f-1e8921175f50`;

interface User {
  id: number;
  username: string;
  is_blocked: boolean;
  created_at: string;
}

interface Crypto {
  id: number;
  name: string;
  symbol: string;
  price_usd: number;
  price_stars: number;
}

const AdminPanel = ({ userId }: { userId: number }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [newCryptoName, setNewCryptoName] = useState('');
  const [newCryptoSymbol, setNewCryptoSymbol] = useState('');
  const [newCryptoPrice, setNewCryptoPrice] = useState('');
  const [newCryptoStars, setNewCryptoStars] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchCryptos();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(ADMIN_URL, {
        headers: { 'X-User-Id': userId.toString() }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchCryptos = async () => {
    try {
      const response = await fetch(CRYPTO_URL);
      const data = await response.json();
      setCryptos(data);
    } catch (error) {
      console.error('Failed to fetch cryptos:', error);
    }
  };

  const handleBlockUser = async (targetUserId: number, block: boolean) => {
    try {
      const response = await fetch(ADMIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: block ? 'block' : 'unblock',
          user_id: targetUserId
        })
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: `Пользователь ${block ? 'заблокирован' : 'разблокирован'}`
        });
        fetchUsers();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить действие',
        variant: 'destructive'
      });
    }
  };

  const handleAddBalance = async () => {
    if (!selectedUser || !selectedCrypto || !amount) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(ADMIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: 'add_balance',
          user_id: selectedUser,
          crypto_id: selectedCrypto,
          amount: parseFloat(amount)
        })
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Баланс пользователя обновлен'
        });
        setAmount('');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить баланс',
        variant: 'destructive'
      });
    }
  };

  const handleAddCrypto = async () => {
    if (!newCryptoName || !newCryptoSymbol || !newCryptoPrice || !newCryptoStars) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(CRYPTO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCryptoName,
          symbol: newCryptoSymbol,
          price_usd: parseFloat(newCryptoPrice),
          price_stars: parseFloat(newCryptoStars),
          total_supply: 1000000000
        })
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Новая криптовалюта добавлена'
        });
        setNewCryptoName('');
        setNewCryptoSymbol('');
        setNewCryptoPrice('');
        setNewCryptoStars('');
        fetchCryptos();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить криптовалюту',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-white/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Users" size={24} />
            Управление пользователями
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
              >
                <div>
                  <p className="font-bold">{user.username}</p>
                  <p className="text-xs text-slate-500">ID: {user.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.is_blocked ? 'destructive' : 'default'}>
                    {user.is_blocked ? 'Заблокирован' : 'Активен'}
                  </Badge>
                  <Button
                    size="sm"
                    variant={user.is_blocked ? 'default' : 'destructive'}
                    onClick={() => handleBlockUser(user.id, !user.is_blocked)}
                  >
                    {user.is_blocked ? 'Разблокировать' : 'Заблокировать'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t space-y-3">
            <h3 className="font-bold">Добавить баланс пользователю</h3>
            <Select value={selectedUser?.toString()} onValueChange={(v) => setSelectedUser(parseInt(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите пользователя" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCrypto?.toString()} onValueChange={(v) => setSelectedCrypto(parseInt(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите криптовалюту" />
              </SelectTrigger>
              <SelectContent>
                {cryptos.map((crypto) => (
                  <SelectItem key={crypto.id} value={crypto.id.toString()}>
                    {crypto.name} ({crypto.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Количество"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <Button onClick={handleAddBalance} className="w-full">
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить баланс
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Coins" size={24} />
            Управление криптовалютами
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cryptos.map((crypto) => (
              <div
                key={crypto.id}
                className="p-3 border border-slate-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold">{crypto.name}</p>
                  <Badge>{crypto.symbol}</Badge>
                </div>
                <div className="text-sm text-slate-600">
                  <p>${crypto.price_usd.toFixed(2)} / {crypto.price_stars.toFixed(2)} ⭐</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t space-y-3">
            <h3 className="font-bold">Добавить новую криптовалюту</h3>
            <Input
              placeholder="Название"
              value={newCryptoName}
              onChange={(e) => setNewCryptoName(e.target.value)}
            />
            <Input
              placeholder="Символ (BTC, ETH...)"
              value={newCryptoSymbol}
              onChange={(e) => setNewCryptoSymbol(e.target.value.toUpperCase())}
            />
            <Input
              type="number"
              placeholder="Цена в USD"
              value={newCryptoPrice}
              onChange={(e) => setNewCryptoPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Цена в Telegram Stars"
              value={newCryptoStars}
              onChange={(e) => setNewCryptoStars(e.target.value)}
            />
            <Button onClick={handleAddCrypto} className="w-full">
              <Icon name="PlusCircle" size={16} className="mr-2" />
              Создать криптовалюту
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
