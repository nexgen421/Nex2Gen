import React from "react";
import { TableBody, TableRow, TableCell } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";

const SupportTableSkeleton = () => {
  return (
    <TableBody>
  <TableRow>
    <TableCell>
      <Skeleton className="h-6 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-28" />
    </TableCell>
    <TableCell>
      <Badge>
        <Skeleton className="h-6 w-16" />
      </Badge>
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-20" />
    </TableCell>
  </TableRow>
  <TableRow>
    <TableCell>
      <Skeleton className="h-6 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-28" />
    </TableCell>
    <TableCell>
      <Badge>
        <Skeleton className="h-6 w-16" />
      </Badge>
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-20" />
    </TableCell>
  </TableRow>
  <TableRow>
    <TableCell>
      <Skeleton className="h-6 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-28" />
    </TableCell>
    <TableCell>
      <Badge>
        <Skeleton className="h-6 w-16" />
      </Badge>
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-20" />
    </TableCell>
  </TableRow>
  <TableRow>
    <TableCell>
      <Skeleton className="h-6 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-28" />
    </TableCell>
    <TableCell>
      <Badge>
        <Skeleton className="h-6 w-16" />
      </Badge>
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-20" />
    </TableCell>
  </TableRow>
</TableBody>
  );
};

export default SupportTableSkeleton;
