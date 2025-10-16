import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import CryptoMarkets from '@/components/CryptoMarkets';
import TradingPanel from '@/components/TradingPanel';
import UserProfile from '@/components/UserProfile';
import AdminPanel from '@/components/AdminPanel';

const API_BASE = 'https://functions.poehali.dev';
const AUTH_URL = `${API_BASE}/84d755aa-2607-4e80-a05f-350e1295cdb6`;

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showTelegramBanner, setShowTelegramBanner] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('crypto_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setShowAuth(false);
    }
  }, []);

  const handleAuth = async () => {
    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'register',
          username,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        localStorage.setItem('crypto_user', JSON.stringify(data));
        setShowAuth(false);
        toast({
          title: isLogin ? 'Вход выполнен' : 'Регистрация завершена',
          description: `Добро пожаловать, ${data.username}!`
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Что-то пошло не так',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('crypto_user');
    setShowAuth(true);
  };

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <Icon name="TrendingUp" size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">CRYPTO PLATFORM</h1>
            <p className="text-slate-600 mt-2">Торговля криптовалютой</p>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12"
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
            />
            <Button
              onClick={handleAuth}
              className="w-full h-12 text-lg"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full"
            >
              {isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт?'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {showTelegramBanner && (
        <Alert className="rounded-none border-0 bg-primary text-white">
          <div className="container mx-auto flex items-center justify-between">
            <AlertDescription className="flex items-center gap-2">
              <Icon name="Send" size={20} />
              <span>Лучший Telegram канал о крипте:</span>
              <a
                href="https://t.me/+tT16Ud1xci03MjIy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold hover:text-blue-100"
              >
                Подписаться
              </a>
            </AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTelegramBanner(false)}
              className="text-white hover:bg-white/20"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </Alert>
      )}

      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6 bg-white/5 backdrop-blur p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="TrendingUp" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CRYPTO PLATFORM</h1>
              <p className="text-sm text-slate-300">Добро пожаловать, {user?.username}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
            <Icon name="LogOut" size={16} className="mr-2" />
            Выход
          </Button>
        </div>

        <Tabs defaultValue="markets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur">
            <TabsTrigger value="markets" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Рынки
            </TabsTrigger>
            <TabsTrigger value="trade" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Icon name="ArrowLeftRight" size={16} className="mr-2" />
              Торговля
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Icon name="User" size={16} className="mr-2" />
              Профиль
            </TabsTrigger>
            {user?.is_admin && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
                <Icon name="Shield" size={16} className="mr-2" />
                Админ
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="markets">
            <CryptoMarkets />
          </TabsContent>

          <TabsContent value="trade">
            <TradingPanel userId={user?.id} />
          </TabsContent>

          <TabsContent value="profile">
            <UserProfile userId={user?.id} />
          </TabsContent>

          {user?.is_admin && (
            <TabsContent value="admin">
              <AdminPanel userId={user?.id} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
