import { createTRPCRouter, ultraProtectedProcedure } from "../trpc";
import { subDays, startOfDay, endOfDay } from "date-fns";

const adminDashboardRouter = createTRPCRouter({
  getAdminDashboardDetails: ultraProtectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const yesterday = subDays(today, 1);
    const startOfYesterday = startOfDay(yesterday);

    const [
      orderCounts,
      transactionSums,
      pendingOrders,
      shipmentCounts,
      totalShipments,
    ] = await Promise.all([
      // Combine order counts for today and yesterday
      ctx.db.order.groupBy({
        by: ["orderDate"],
        _count: true,
        where: {
          orderDate: {
            gte: startOfYesterday,
            lte: endOfToday,
          },
        },
      }),

      // Combine transaction sums for today and yesterday
      ctx.db.transaction.groupBy({
        by: ["createdAt"],
        _sum: {
          amount: true,
        },
        where: {
          createdAt: {
            gte: startOfYesterday,
            lte: endOfToday,
          },
          status: "SUCCESS",
          type: "DEBIT",
        },
      }),

      // Fetch pending orders (already optimized)
      ctx.db.order.findMany({
        where: {
          status: "BOOKED",
        },
        select: {
          id: true,
          user: {
            select: {
              kycDetails: {
                select: {
                  companyInfo: {
                    select: {
                      companyName: true,
                    },
                  },
                },
              },
            },
          },
          orderDate: true,
        },
        take: 10,
      }),

      // Combine all shipment status counts into a single query
      ctx.db.shipment.groupBy({
        by: ["status"],
        _count: true,
      }),

      ctx.db.shipment.count(),
    ]);

    // Process the results
    const todayOrderCount =
      orderCounts.find((c) => c.orderDate >= startOfToday)?._count ?? 0;
    const yesterdayOrderCount =
      orderCounts.find((c) => c.orderDate < startOfToday)?._count ?? 0;

    const todayTotalMoney =
      transactionSums.find((t) => t.createdAt >= startOfToday)?._sum.amount ??
      0;
    const yesterdayTotalMoney =
      transactionSums.find((t) => t.createdAt < startOfToday)?._sum.amount ?? 0;

    const shipmentCountMap = Object.fromEntries(
      shipmentCounts.map(
        ({ status, _count }: { status: string; _count: number }) => [
          status,
          _count,
        ],
      ),
    );

    return {
      todayOrderCount,
      yesterdayOrderCount,
      todayTotalMoney,
      yesterdayTotalMoney,
      pendingOrders,
      shipmentCount: {
        totalShipments: totalShipments,
        pickupPending: shipmentCountMap.PICKUP ?? 0,
        pending: shipmentCountMap.PENDING ?? 0,
        delivered: shipmentCountMap.DELIVERED ?? 0,
        inTransit: shipmentCountMap.TRANSIT ?? 0,
        infoReceived: shipmentCountMap.INFORECEIVED ?? 0,
        expired: shipmentCountMap.EXPIRED ?? 0,
        undelivered: shipmentCountMap.UNDELIVERED ?? 0,
        exception: shipmentCountMap.EXCEPTION ?? 0,
      },
    };
  }),
});

export default adminDashboardRouter;
