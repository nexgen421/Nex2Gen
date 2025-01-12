"use client";

import React from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import PagePagination from "~/components/layout/PagePagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";
import { buttonVariants } from "~/components/ui/button";
import { type RateList } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Eye, Pencil } from "lucide-react";
import Loading from "~/app/loading";

const RateDialog = ({ rates }: { rates: RateList | null }) => {
  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({ size: "icon", variant: "ghost" })}
      >
        <Eye />
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Rate List</DialogTitle>
        </DialogHeader>
        {rates === null && <p>Rate List not updated yet!</p>}
        {rates !== null && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Weight</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>500g</TableCell>
                <TableCell>{rates.halfKgPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1Kg</TableCell>
                <TableCell>{rates.oneKgPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2Kg</TableCell>
                <TableCell>{rates.twoKgPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3Kg</TableCell>
                <TableCell>{rates.threeKgPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5Kg</TableCell>
                <TableCell>{rates.fiveKgPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>10Kg</TableCell>
                <TableCell>{rates.tenKgPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>15Kg</TableCell>
                <TableCell>{rates.fifteenKgPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>20Kg</TableCell>
                <TableCell>{rates.twentyKgPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>25Kg</TableCell>
                <TableCell>{rates.twentyFiveKgPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>30Kg</TableCell>
                <TableCell>{rates.thirtyKgPrice}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};

const RateCard = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const { data, isLoading } = api.rate.getUserWithRates.useQuery({
    page: +(params.get("page") ?? 0),
  });

  if (isLoading) return <Loading />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rates</CardTitle>
        <CardDescription>
          Check & Modify the rates of your Customers
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!isLoading && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Company Name</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>View Rate List</TableHead>
                <TableHead>Update Rate List</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-semibold">
                    {user.kycDetails?.companyInfo?.companyName}
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <RateDialog rates={user.rateList} />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/rates/${user.id}`}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon",
                      })}
                    >
                      <Pencil />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <CardFooter>
        <PagePagination pageUrl={pathname} itemsPerPage={10} totalItems={100} />
      </CardFooter>
    </Card>
  );
};

export default RateCard;
