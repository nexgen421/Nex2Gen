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
        <SelectItem value="2">Delhivery</SelectItem>
        <SelectItem value="6">EComExpress</SelectItem>
        <SelectItem value="499">ShadowFax</SelectItem>
        <SelectItem value="16">XPressBees</SelectItem>
        <SelectItem value="60">EKart</SelectItem>
        <SelectItem value="99">Amazon</SelectItem>
        <SelectItem value="7">DTDC</SelectItem>
        <SelectItem value="24">Shree Maruti</SelectItem>
        <SelectItem value="23">Trackon</SelectItem>
      </SelectContent>
    </Select>
  );
};



export default SelectCourierProvider;
