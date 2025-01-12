import React from "react";
import { toast } from "sonner";
import { api } from "~/trpc/server";

const AWBTrackingPage = async ({
  params,
}: {
  params: { awbNumber: string };
}) => {
  try {
    const { data, meta } = await api.tracking.getTrackingByOriginalAwb({
      awbNumber: params.awbNumber,
    });

    if (!data) {
      return <div>Not Found</div>;
    }

    return <div>{JSON.stringify(data)}</div>;
  } catch (error) {
    return <h1>{JSON.stringify(error)}</h1>;
  }
};

export default AWBTrackingPage;
