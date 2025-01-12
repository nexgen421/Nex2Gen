import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import {
  adminAuthRouter,
  adminRouter,
  authRouter,
  labelRouter,
  orderRouter,
  rateRouter,
  shipmentRouter,
  supportRouter,
  trackingRouter,
  userRouter,
  walletRouter,
  supportConversationRouter,
  fundRouter,
  adminDashboardRouter,
  adminSupportConversationRouter,
  testingRouter as testRouter,
  revenueRouter,
  userOrderRouter,
  adminOrderRouter,
  billRouter,
  promotionsRouter,
  adminSettingsRouter,
  riderRouter,
  paymentRouter
} from "./routers";

export const appRouter = createTRPCRouter({
  tracking: trackingRouter,
  auth: authRouter,
  adminAuth: adminAuthRouter,
  admin: adminRouter,
  order: orderRouter,
  user: userRouter,
  support: supportRouter,
  wallet: walletRouter,
  shipment: shipmentRouter,
  label: labelRouter,
  rate: rateRouter,
  supportConversation: supportConversationRouter,
  fund: fundRouter,
  adminDashboard: adminDashboardRouter,
  adminConversation: adminSupportConversationRouter,
  test: testRouter,
  track: trackingRouter,
  revenue: revenueRouter,
  userOrder: userOrderRouter,
  adminOrder: adminOrderRouter,
  bill: billRouter,
  promotions: promotionsRouter,
  adminSettings: adminSettingsRouter,
  rider: riderRouter,
  payment:paymentRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
