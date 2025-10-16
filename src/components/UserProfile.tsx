import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const UserProfile = ({ userId }: { userId: number }) => {
  const mockBalances = [
    { crypto: 'Bitcoin', symbol: 'BTC', balance: 0.0234, value: 1503.45 },
    { crypto: 'Ethereum', symbol: 'ETH', balance: 1.25, value: 3907.19 },
    { crypto: 'Custom Coin', symbol: 'CUSTOM', balance: 1000, value: 1500.00 }
  ];

  const mockTransactions = [
    { id: 1, type: 'buy', crypto: 'BTC', amount: 0.01, price: 642.50, date: '2025-10-15 14:30' },
    { id: 2, type: 'sell', crypto: 'ETH', amount: 0.5, price: 1562.88, date: '2025-10-14 11:20' },
    { id: 3, type: 'buy', crypto: 'CUSTOM', amount: 500, price: 750.00, date: '2025-10-13 09:15' }
  ];

  const totalValue = mockBalances.reduce((sum, b) => sum + b.value, 0);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-white/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Wallet" size={24} />
            Баланс портфеля
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-6 bg-gradient-to-br from-primary to-secondary rounded-lg text-white">
            <p className="text-sm opacity-90 mb-1">Общая стоимость</p>
            <p className="text-4xl font-bold font-mono">${totalValue.toFixed(2)}</p>
          </div>

          <div className="space-y-3">
            {mockBalances.map((balance, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{balance.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold">{balance.crypto}</p>
                    <p className="text-sm text-slate-500">{balance.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold">{balance.balance}</p>
                  <p className="text-sm text-slate-500">${balance.value.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Clock" size={24} />
            История операций
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'buy' ? 'bg-secondary/20' : 'bg-destructive/20'
                  }`}>
                    <Icon
                      name={tx.type === 'buy' ? 'ArrowUpCircle' : 'ArrowDownCircle'}
                      size={20}
                      className={tx.type === 'buy' ? 'text-secondary' : 'text-destructive'}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={tx.type === 'buy' ? 'default' : 'destructive'} className="text-xs">
                        {tx.type === 'buy' ? 'Покупка' : 'Продажа'}
                      </Badge>
                      <span className="font-bold">{tx.crypto}</span>
                    </div>
                    <p className="text-xs text-slate-500">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold">{tx.amount}</p>
                  <p className="text-sm text-slate-500">${tx.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
