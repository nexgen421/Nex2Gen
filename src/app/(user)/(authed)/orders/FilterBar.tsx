import React from "react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DatePicker } from "~/components/ui/date-picker";

type FilterType = "date" | "awb" | "status";
type StatusType = "ALL" | "RECIEVED" | "READY_TO_SHIP";

interface FilterBarProps {
  onFilterChange: (filterType: FilterType, value: string) => void;
  filterData: {
    filterDate: Date | null;
    filterAwb: string;
    filterStatus: StatusType;
  };
}

const FilterBar: React.FC<FilterBarProps> = ({
  filterData,
  onFilterChange,
}) => {
  return (
    <div className="mb-4 flex items-center justify-evenly space-x-4">
      <DatePicker
        setDate={(date) =>
          onFilterChange(
            "date",
            date?.toLocaleString() ?? Date.now().toString(),
          )
        }
        date={filterData.filterDate ?? new Date()}
        id="date-picker"
      />
      <Input
        type="text"
        placeholder="Filter by AWB number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onFilterChange("awb", e.target.value)
        }
      />
      <Select
        onValueChange={(value: StatusType) => onFilterChange("status", value)}
      >
        <SelectTrigger className="w-1/3">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>
          <SelectItem value="RECIEVED">Received</SelectItem>
          <SelectItem value="READY_TO_SHIP">Ready To Ship</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterBar;
