"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { amountSuggestions } from "~/lib/constants";
import { api } from "~/trpc/react";
import numeral from "numeral";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loading from "~/app/loading";

interface TRefNumber {
  refNumber: string;
}

// interface PaymentCreateResponse {
//   data: {
//     result: {
//       payment_url: string;
//       amount: string;
//       order_id: string;
//       customerEmail: string;
//       [key: string]: string; // Allow additional string properties in `result`
//     };
//     // [key: string]: any; // Allow additional properties in `data`
//   };
// }

const AddFundsPage = () => {
  const { data, isLoading } = api.wallet.getFunds.useQuery();

  const { mutateAsync: createWalletRequest, isPending } =
    api.wallet.createWalletRequest.useMutation({
      onError(error) {
        toast.error(error.message);
      },
    });
  const { mutateAsync: paymentCreate } =
    api.payment.paymentCreate.useMutation();
  const [fundInput, setFundInput] = useState<number>(0);

  const router = useRouter();
  const { register, handleSubmit } = useForm<TRefNumber>();

  const generateOrderId = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) =>
      ("0" + byte.toString(16)).slice(-2),
    ).join("");
  };

  const [payMentUrl, setPaymentUrl] = useState("");

  useEffect(() => {
    if (payMentUrl) {
      // Automatically redirect when the payment URL is available
      window.location.href = payMentUrl;
    }
  }, [payMentUrl]);

  const handleAddFundInWallet = async () => {
    const amount = fundInput.toString(); // Example input for amount
    const order_id = generateOrderId(); // You should define this function
    const customerEmail = "customer@example.com"; // Replace with actual email
    try {
      const data = await paymentCreate({
        amount,
        order_id,
        customerEmail,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setPaymentUrl(data?.data);
      // window.open(data.data.result.payment_url)
    } catch (error) {
      console.error(error, "Error creating payment order");
    }
  };

  const handleRefForm = async (data: TRefNumber) => {
    if (fundInput === 0) {
      return;
    }

    if (!data.refNumber) {
      return;
    }

    console.log({
      ...data,
      fundInput,
    });

    await createWalletRequest({
      fundInput: fundInput,
      referenceNumber: data.refNumber,
    });

    toast.success("Funds Request sent successfully!");
    router.push("/funds");
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-2">
        <div className="col-span-1 flex w-full flex-col gap-2 p-4">
          <h1 className="text-3xl font-bold">Add Funds</h1>
          <p className="text-lg tracking-wide text-muted-foreground">
            Enter the amount you&apos;d like to add to your wallet.
          </p>

          <form className="">
            <div className="flex w-full items-center gap-2">
              {/* TODO: Make the input bar as full width */}
              <Input
                className="w-full"
                onChange={(e) => setFundInput(+e.target.value)}
                value={fundInput}
              />
              <p className="text-muted-foreground">INR</p>
            </div>

            {/* Amount Suggestion Cards */}
            <ScrollArea className="mt-3 w-full">
              <div className="flex items-center gap-2">
                {amountSuggestions.map((suggestion) => (
                  <Badge
                    key={suggestion.id}
                    variant={"secondary"}
                    className="rounded-full px-4 py-1 text-sm hover:cursor-pointer hover:bg-gray-200"
                    onClick={() => setFundInput(suggestion.amount)}
                  >
                    {suggestion.amount}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </form>
        </div>

        <div className="col-span-1 h-full rounded-xl bg-muted p-4">
          <h1 className="text-3xl font-bold">Wallet Balance</h1>
          {isLoading ? (
            <Skeleton className="mt-10 h-[30px] w-full" />
          ) : (
            <>
              <h3 className="mt-10 text-2xl font-semibold">
                Current Balance: ₹{numeral(data ?? 0).format("0.00")}
              </h3>
              <h3 className="text-2xl font-semibold">
                Added Amount: ₹{numeral(fundInput).format("0.00")}
              </h3>
              <h3 className="text-2xl font-semibold">
                Final Balance: ₹
                {numeral(+(data ?? 0) + +fundInput).format("0.00")}
              </h3>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-2">
        {/* <Image src="/qr-code-1.jpeg" alt="qr code" height={400} width={400} /> */}
        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(handleRefForm)}
        >
          {/* <p className="text-sm font-semibold">
            Do the payment and add the reference number for further verification
          </p> */}
          <div className="mt-10 w-full">
            {/* <Label htmlFor="refNumber">UTR/Transaction ID</Label> */}
            {/* <Input id="refNumber" {...register("refNumber")} /> */}
          </div>

          <Button
            // type="submit"
            variant="default"
            size="lg"
            className="w-full"
            // disabled={isPending}
            onClick={handleAddFundInWallet}
          >
            Add Funds
          </Button>
        </form>
      </div>
    </>
  );
};

export default AddFundsPage;
