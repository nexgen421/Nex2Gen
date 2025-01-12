"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "~/components/ui/pagination";

const PagePagination = ({
  totalItems,
  itemsPerPage = 10,
  pageUrl
}: {
  totalItems: number;
  itemsPerPage?: number;
  pageUrl: string;
}) => {
  const params = useSearchParams();
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = parseInt(params.get("page") ?? "0", 10);
  const router = useRouter();

  const handlePrevious = () => {
    if (currentPage > 0) {
      router.push(`${pageUrl}?page=${currentPage - 1}`);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      router.push(`${pageUrl}?page=${currentPage + 1}`);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      router.push(`${pageUrl}?page=${page}`);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const showEllipsis = totalPages > 5;
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 3);

    for (let i = startPage; i < endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageClick(i)}
            isActive={i === currentPage}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (showEllipsis) {
      if (startPage > 0) {
        pageNumbers.unshift(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      if (endPage < totalPages) {
        pageNumbers.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            disabled={currentPage === 0}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PagePagination;
