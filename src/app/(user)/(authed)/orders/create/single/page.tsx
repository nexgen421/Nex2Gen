import React from "react";
import CreateOrderForm from "./_CreateOrderForm";
import { Heading } from "~/components/ui/heading";

const CreateOrder = async () => {
  return (
    <>
      <Heading level={2}>Create Order</Heading>
      <CreateOrderForm />
    </>
  );
};

export default CreateOrder;
