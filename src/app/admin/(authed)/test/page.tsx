"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const TestingPage = () => {
  const { data } = api.tracking.getAllTracking.useQuery({});
  const { mutateAsync } = api.tracking.createTracking.useMutation();
  return (
    <Button
      onClick={async () => {
        await mutateAsync({
          courier_code: "delhivery",
          tracking_number: "123456",
        });
      }}
    >
      Click Me
    </Button>
  );
};

export default TestingPage;
