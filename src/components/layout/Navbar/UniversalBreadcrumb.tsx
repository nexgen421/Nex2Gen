"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import Link from "next/link";

const UniversalBreadcrumb = () => {
  const pathname = usePathname();
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {pathname.split("/").map((path, index) => {
          return (
            <>
              {index !== pathname.split("/").length - 1 && (
                <>
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink asChild className="capitalize">
                      <Link href="#">{path}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index !== pathname.split("/").length && (
                    <BreadcrumbSeparator />
                  )}
                </>
              )}
            </>
          );
        })}
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">
            {pathname.split("/").at(pathname.split("/").length - 1)}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default UniversalBreadcrumb;
