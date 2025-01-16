import React from "react";
import { Button } from "~/components/ui/button";

const PaginationBtn = ({ handleChange, totalPages, currentPage }) => {

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Show all pages if there are 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            onClick={() => handleChange(i)}
            // style={currentPage === i ? "primary" : "default"}
            style={{backgroundColor:currentPage===i? "blue" :"white",color:currentPage===i? "white" :"black"}}
          >
            {i}
          </Button>
        );
      }
    } else {
      // Always show the first page
      pages.push(
        <Button
          key={1}
          onClick={() => handleChange(1)}
          style={{backgroundColor:currentPage===1? "blue" :"white",color:currentPage===1? "white" :"black"}}
        >
          1
        </Button>
      );

      // Show the second page
      pages.push(
        <Button
          key={2}
          onClick={() => handleChange(2)}
          style={{backgroundColor:currentPage===2? "blue" :"white",color:currentPage===2? "white" :"black"}}
        >
          2
        </Button>
      );

      // Show ellipsis if needed
      if (currentPage > 4) pages.push(<span key="ellipsis1">...</span>);

      // Show surrounding pages around the current page (up to 1 page before and after)
      const startPage = Math.max(3, currentPage - 1);
      const endPage = Math.min(totalPages - 2, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <Button
            key={i}
            onClick={() => handleChange(i)}
            style={{backgroundColor:currentPage===i? "blue" :"white",color:currentPage===i? "white" :"black"}}
          >
            {i}
          </Button>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 3) pages.push(<span key="ellipsis2">...</span>);

      // Always show the last page
      pages.push(
        <Button
          key={totalPages}
          onClick={() => handleChange(totalPages)}
          style={{backgroundColor:currentPage===totalPages? "blue" :"white",color:currentPage===totalPages? "white" :"black"}}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", marginTop: 16, width: "100%", justifyContent: "flex-end" }}>
      <Button
        onClick={() => handleChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ marginRight: 8 }}
      >
        Prev
      </Button>

      {generatePageNumbers()}

      <Button
        onClick={() => handleChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ marginLeft: 8 }}
      >
        Next
      </Button>
    </div>
  );
};

export default PaginationBtn;
