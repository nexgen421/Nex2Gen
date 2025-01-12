import authRouter from "./auth";
import adminAuthRouter from "./admin-auth";
import adminRouter from "./admin";
import orderRouter from "./order";
import userRouter from "./user";
import supportRouter from "./support";
import walletRouter from "./wallet";
import adminShipmentRouter from "./admin-shipment";
import labelRouter from "./label";
import rateRouter from "./rate-router";
import supportConversationRouter from "./support-conversation";
import trackingRouter from "./tracking";
import testingRouter from "./test";
import fundRouter from "./fund";
import adminDashboardRouter from "./admin-dashboard";
import adminSupportConversationRouter from "./support-chat-admin";
import revenueRouter from "./revenue";
import userOrderRouter from "./user-order";
import adminOrderRouter from "./admin-order";
import billRouter from "./bill";
import promotionsRouter from "./promotions";
import adminSettingsRouter from "./admin-settings";
import riderRouter from "./rider";
import paymentRouter from "./payment";

export {
  trackingRouter,
  authRouter,
  adminRouter,
  orderRouter,
  adminAuthRouter,
  userRouter,
  supportRouter,
  walletRouter,
  adminShipmentRouter as shipmentRouter,
  labelRouter,
  rateRouter,
  supportConversationRouter,
  testingRouter,
  fundRouter,
  adminDashboardRouter,
  adminSupportConversationRouter,
  revenueRouter,
  userOrderRouter,
  adminOrderRouter,
  billRouter,
  promotionsRouter,
  adminSettingsRouter,
  riderRouter,
  paymentRouter
};
