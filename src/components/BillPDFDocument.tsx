import React, { forwardRef, useEffect } from "react";
import { format } from "date-fns";
import type { api } from "~/trpc/server";
import Loading from "~/app/loading";
import Image from "next/image";
import numeral from "numeral";
import { toast } from "sonner";

type OrderType = Awaited<ReturnType<typeof api.bill.getUserBill>>;

interface Transaction {
  amount: number;
  orderPaymentDetails?: {
    order: {
      packageDetails?: {
        physicalWeight: number;
      } | null;
      isInsured?: boolean;
    };
  } | null;
}

interface TransactionSummary {
  count: number;
  baseAmount: number;
  insuranceAmount: number;
}

type WeightBracket = 0.5 | 1 | 2 | 3 | 5 | 10 | 15 | 20 | 25 | 30;

interface TransactionSummaries {
  insured: Record<WeightBracket, TransactionSummary>;
  nonInsured: Record<WeightBracket, TransactionSummary>;
}

interface TableColumn<T> {
  title: string;
  render: (data: T, index: number) => React.ReactNode;
  className?: string;
}

const getWeightBracket = (physicalWeight: number): WeightBracket => {
  const brackets: WeightBracket[] = [0.5, 1, 2, 3, 5, 10, 15, 20, 25, 30];
  return brackets.find((b) => physicalWeight <= b) ?? 30;
};

const summarizeTransactions = (
  transactions: Transaction[],
  insuranceCost: number,
): TransactionSummaries => {
  const summary: TransactionSummaries = {
    insured: {} as Record<WeightBracket, TransactionSummary>,
    nonInsured: {} as Record<WeightBracket, TransactionSummary>,
  };

  transactions.forEach((transaction) => {
    const physicalWeight =
      transaction.orderPaymentDetails?.order.packageDetails?.physicalWeight ??
      0;
    const weight = getWeightBracket(physicalWeight);
    const isInsured = transaction.orderPaymentDetails?.order.isInsured ?? false;
    const insuranceAmount = isInsured ? insuranceCost : 0;
    const baseAmount = transaction.amount - insuranceAmount;

    const category = isInsured ? "insured" : "nonInsured";

    if (!summary[category][weight]) {
      summary[category][weight] = {
        count: 0,
        baseAmount: 0,
        insuranceAmount: 0,
      };
    }

    summary[category][weight].count += 1;
    summary[category][weight].baseAmount += baseAmount;
    summary[category][weight].insuranceAmount += insuranceAmount;
  });

  return summary;
};

const BillPDFDocument = forwardRef<
  HTMLDivElement,
  {
    orderData: OrderType | undefined;
    isLoading: boolean;
    billDate: Date | undefined;
  }
>(function PdfDocument({ orderData, isLoading, billDate }, ref) {
  useEffect(() => {
    if (billDate && billDate >= new Date()) {
      toast.error("Bills can only be generated for past dates.");
    } else if (orderData && orderData.transactions.length === 0) {
      toast.error("The bill is empty and cannot be generated.");
    }
  }, [billDate, orderData]);

  if (isLoading) return <Loading />;
  if (!orderData) return null;
  if (billDate && billDate >= new Date()) return null;
  if (orderData.transactions.length === 0) return null;

  const { transactions, userDetails, insuranceCost } = orderData;

  const transactionSummary = summarizeTransactions(transactions, insuranceCost);

  const companyName =
    userDetails?.kycDetails?.companyInfo?.companyName ?? "Customer Name";
  const address = `${userDetails?.pickupLocation?.address}-near ${userDetails?.pickupLocation?.famousLandmark}-${userDetails?.pickupLocation?.city}-${userDetails?.pickupLocation?.state}-${userDetails?.pickupLocation?.pincode}`;
  const phone =
    userDetails?.pickupLocation?.mobileNumber ?? "Phone not available";

  const totalBaseAmount =
    Object.values(transactionSummary.insured).reduce(
      (sum, { baseAmount }) => sum + baseAmount,
      0,
    ) +
    Object.values(transactionSummary.nonInsured).reduce(
      (sum, { baseAmount }) => sum + baseAmount,
      0,
    );
  const totalInsuranceAmount = Object.values(transactionSummary.insured).reduce(
    (sum, { insuranceAmount }) => sum + insuranceAmount,
    0,
  );
  const totalAmount = totalBaseAmount + totalInsuranceAmount;

  const TableHeader = <T,>({ columns }: { columns: TableColumn<T>[] }) => (
    <tr className="border-2 border-gray-300 bg-gray-100 text-xs font-normal">
      {columns.map((col, index) => (
        <th key={index} className={`p-1 text-left ${col.className ?? ""}`}>
          {col.title}
        </th>
      ))}
    </tr>
  );

  const TableRow = <T,>({
    data,
    columns,
    index,
  }: {
    data: T;
    columns: TableColumn<T>[];
    index: number;
  }) => (
    <tr className="border-b border-gray-200 text-xs">
      {columns.map((col, colIndex) => (
        <td key={colIndex} className={`p-1 ${col.className ?? ""}`}>
          {col.render(data, index)}
        </td>
      ))}
    </tr>
  );

  const TransactionTable = <T,>({
    title,
    data,
    columns,
  }: {
    title: string;
    data: Record<WeightBracket, T>;
    columns: TableColumn<T & { weight: WeightBracket }>[];
  }) => (
    <>
      <h3 className="mt-3 text-sm font-bold">{title}</h3>
      <table className="mb-4 w-full">
        <thead>
          <TableHeader columns={columns} />
        </thead>
        <tbody>
          {Object.entries(data).map(([weight, details], index) => (
            <TableRow
              key={index}
              data={{ weight: Number(weight) as WeightBracket, ...details }}
              columns={columns}
              index={index}
            />
          ))}
        </tbody>
      </table>
    </>
  );

  const columns: TableColumn<TransactionSummary & { weight: WeightBracket }>[] =
    [
      { title: "#", render: (_, index) => index + 1, className: "w-8" },
      {
        title: "Weight (Kg)",
        render: ({ weight }) => `${numeral(weight).format("0.000")} Kg`,
        className: "w-24",
      },
      {
        title: "Count",
        render: ({ count }) => count,
        className: "w-16 text-right",
      },
      {
        title: "Base (₹)",
        render: ({ baseAmount }) => `₹${numeral(baseAmount).format("0,0.00")}`,
        className: "w-24 text-right",
      },
      {
        title: "Insurance (₹)",
        render: ({ insuranceAmount }) =>
          `₹${numeral(insuranceAmount).format("0,0.00")}`,
        className: "w-24 text-right",
      },
      {
        title: "Total (₹)",
        render: ({ baseAmount, insuranceAmount }) =>
          `₹${numeral(baseAmount + insuranceAmount).format("0,0.00")}`,
        className: "w-24 text-right",
      },
    ];

  const nonInsuredColumns = columns.filter(
    (col) => col.title !== "Insurance (₹)",
  );

  return (
    <div ref={ref} className="mx-auto max-w-4xl bg-white p-4 text-sm">
      <h1 className="text-center text-lg font-bold text-gray-800">
        Tax Invoice
      </h1>

      <div className="mb-4 mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
          <div>
            <h2 className="text-sm font-bold">Nex Gen Courier Service</h2>
            <p className="text-xs text-muted-foreground">
              Phone: +91 7257080852
            </p>
          </div>
        </div>
        <div className="text-right">
          <p>
            <strong>Date:</strong>{" "}
            {format(billDate ?? new Date(), "dd/MM/yyyy")}
          </p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 rounded-none border border-gray-300 p-2">
        <div>
          <h3 className="font-semibold">Bill To:</h3>
          <p className="font-semibold">{companyName}</p>
          <p className="max-w-xs">{address}</p>
          <p>Phone: {phone}</p>
        </div>
      </div>

      <TransactionTable
        title="Insured Transactions"
        data={transactionSummary.insured}
        columns={columns}
      />
      <TransactionTable
        title="Non-Insured Transactions"
        data={transactionSummary.nonInsured}
        columns={nonInsuredColumns}
      />

      <div className="mb-4 border-t pt-2">
        <h3 className="mb-1 text-sm font-bold">Summary</h3>
        <table className="w-full text-xs">
          <tbody>
            <tr>
              <td className="py-0.5">
                <strong>Total Base Amount:</strong>
              </td>
              <td className="py-0.5 text-right">
                ₹ {numeral(totalBaseAmount).format("0,0.00")}
              </td>
            </tr>
            <tr>
              <td className="py-0.5">
                <strong>Total Insurance Amount:</strong>
              </td>
              <td className="py-0.5 text-right">
                ₹ {numeral(totalInsuranceAmount).format("0,0.00")}
              </td>
            </tr>
            <tr className="border-t font-bold">
              <td className="py-0.5">
                <strong>Total Amount (Base + Insurance):</strong>
              </td>
              <td className="py-0.5 text-right">
                ₹ {numeral(totalAmount).format("0,0.00")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-4 text-xs">
        <p className="font-semibold">Invoice Amount in Words:</p>
        <p>{numberToWords(totalAmount)} Rupees only</p>
      </div>

      <div className="mb-4 text-xs">
        <p className="font-semibold">Terms & Conditions:</p>
        <p>Thanks for doing business with us!</p>
      </div>

      <div className="text-right text-xs">
        <p className="font-semibold">For Nex Gen Courier Service:</p>
        <div className="mt-8">
          <p>Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
});

function numberToWords(num: number): string {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  if (num < 10) return ones[num] ?? "";
  if (num < 20) return teens[num - 10] ?? "";
  if (num < 100)
    return (
      tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "")
    );
  if (num < 1000)
    return (
      ones[Math.floor(num / 100)] +
      " Hundred" +
      (num % 100 !== 0 ? " and " + numberToWords(num % 100) : "")
    );
  if (num < 1000000)
    return (
      numberToWords(Math.floor(num / 1000)) +
      " Thousand" +
      (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "")
    );
  return "Number too large";
}

export default BillPDFDocument;
