import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/get-current-user';

export default async function CashierStatsPage() {
  const user = await getCurrentUser();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const todayTx = user?.storeId
    ? await prisma.order.findMany({
        where: {
          storeId: user.storeId,
          status: 'completed',
          order_date: { gte: startOfToday, lt: startOfTomorrow },
        },
        select: { id: true, total_amount: true },
      })
    : [];

  const totalToday = todayTx.reduce(
    (sum, tx) => sum + Number(tx.total_amount ?? 0),
    0
  );

  return (
    <div className="space-y-4">
      <h1 className="text-sm font-semibold text-gray-900">
        Sales Statistics (Today)
      </h1>

      <div className="grid md:grid-cols-3 gap-3 text-xs">
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="text-gray-500">Transactions</div>
          <div className="text-xl font-semibold text-gray-900">
            {todayTx.length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="text-gray-500">Revenue</div>
          <div className="text-xl font-semibold text-gray-900">
            Rp {totalToday.toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  );
}
