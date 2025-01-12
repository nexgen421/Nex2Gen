import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";

interface SelectCourierProviderProps {
  setCourierProvider: React.Dispatch<React.SetStateAction<string>>;
  courierProvider: string;
}

const SelectCourierProvider: React.FC<SelectCourierProviderProps> = ({
  courierProvider,
  setCourierProvider,
}) => {
  return (
    <Select
      value={courierProvider}
      onValueChange={(value) => setCourierProvider(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select A Courier Provider" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="delhivery">Delhivery</SelectItem>
        <SelectItem value="ecom-express">EComExpress</SelectItem>
        <SelectItem value="shadowfax">ShadowFax</SelectItem>
        <SelectItem value="valmo">Valmo</SelectItem>
        <SelectItem value="xpressbees">XPressBees</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectCourierProvider;
