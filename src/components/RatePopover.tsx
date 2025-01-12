import React from "react";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

const RatePopover = () => {
  const { data: rates, isLoading } = api.rate.getRateById.useQuery();

  const weightPrices = [
    { weight: "500g", price: rates?.halfKgPrice },
    { weight: "1Kg", price: rates?.oneKgPrice },
    { weight: "2Kg", price: rates?.twoKgPrice },
    { weight: "3Kg", price: rates?.threeKgPrice },
    { weight: "5Kg", price: rates?.fiveKgPrice },
    { weight: "7kg", price: rates?.sevenKgPrice },
    { weight: "10Kg", price: rates?.tenKgPrice },
    { weight: "12Kg", price: rates?.twelveKgPrice },
    { weight: "15Kg", price: rates?.fifteenKgPrice },
    { weight: "17Kg", price: rates?.seventeenKgPrice },
    { weight: "20Kg", price: rates?.twentyKgPrice },
    { weight: "22Kg", price: rates?.twentyTwoKgPrice },
    { weight: "25Kg", price: rates?.twentyFiveKgPrice },
    { weight: "28Kg", price: rates?.twentyEightKgPrice },
    { weight: "30Kg", price: rates?.thirtyKgPrice },
    { weight: "35Kg", price: rates?.thirtyFiveKgPrice },
    { weight: "40Kg", price: rates?.fortyKgPrice },
    { weight: "45Kg", price: rates?.fortyFiveKgPrice },
    { weight: "50Kg", price: rates?.fiftyKgPrice },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <h3 className="mb-2 font-semibold">Weight Prices</h3>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Weight</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                      </TableRow>
                    ))
                : weightPrices.map(({ weight, price }) => (
                    <TableRow key={weight}>
                      <TableCell>{weight}</TableCell>
                      <TableCell>{price}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RatePopover;
