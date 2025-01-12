import { env } from "~/env";
import { createHmac } from "crypto";
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { type $Enums } from "@prisma/client";
import { type TWebhookResponse } from "~/lib/tracking-more/webhook-body.schema";

export async function POST(request: Request) {
  const headersList = headers();
  const timeStr = headersList.get("Timestamp");
  const signature = headersList.get("Signature");

  if (!timeStr || !signature) {
    return new Response(
      JSON.stringify({ message: "Missing required headers" }),
      { status: 400 },
    );
  }

  if (!verifySignature(signature, timeStr)) {
    return new Response(JSON.stringify({ message: "Invalid signature" }), {
      status: 403,
    });
  }

  try {
    const prisma = new PrismaClient();

    const body = (await request.json()) as unknown as TWebhookResponse;

    const {
      data: { delivery_status, substatus, latest_event, id },
    } = body;

    const order = await prisma.order.findFirst({
      where: {
        shipment: {
          trackingId: id,
        },
      },
    });

    if (!order) {
      return new Response(
        JSON.stringify({
          message: "Order with given tracking id not found!",
        }),
        {
          status: 404,
        },
      );
    }

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        shipment: {
          update: {
            status: delivery_status
              .toString()
              .toUpperCase() as keyof typeof $Enums.ShipmentStatus,
            subStatus: substatus,
            latestEvent: latest_event,
          },
        },
      },
    });

    return new Response(JSON.stringify({ message: "Updated Successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ message: "Database error" }));
  }
}

function verifySignature(signature: string, timeStr: string) {
  const webhookSecret = env.WEBHOOK_SECRET;
  const hash = createHmac("sha-256", webhookSecret)
    .update(timeStr)
    .digest("hex");

  return hash === signature;
}
