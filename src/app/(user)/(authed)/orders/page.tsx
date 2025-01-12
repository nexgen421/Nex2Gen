import React from "react";
import UserOrderListTable from "~/components/order/UserOrderListTable";
import { Heading } from "~/components/ui/heading";

const UserOrdersPage = () => {
  return (
    <>
      <Heading level={2}>Your Orders</Heading>
      <UserOrderListTable />
    </>
  );
};

export default UserOrdersPage;
