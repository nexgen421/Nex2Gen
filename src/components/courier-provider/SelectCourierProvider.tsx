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
  const provider=[
    {key:"Ecom Express",value:"6"},
    {key:"Delhivery",value:"2"},
    {key:"Xpressbee s",value:"16"},
    {key:"Ekart",value:"60"},
    {key:"Shadowfax",value:"499"},
    {key:"Amazon",value:"99"},
    {key:"DTDC",value:"7"},
    {key:"Shree Maruti",value:"24"},
    {key:"Trackon",value:"23"}
  ]
  return (
    <Select
      value={courierProvider}
      onValueChange={(value) => setCourierProvider(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select A Courier Provider" />
      </SelectTrigger>
      <SelectContent>
        {provider.map(data=><SelectItem value={JSON.stringify(data)}>{data.key}</SelectItem>)}
        {/* <SelectItem value="delhivery">Delhivery</SelectItem>
        <SelectItem value="ecom-express">EComExpress</SelectItem>
        <SelectItem value="shadowfax">ShadowFax</SelectItem>
        <SelectItem value="valmo">Valmo</SelectItem>
        <SelectItem value="xpressbees">XPressBees</SelectItem> */}
      </SelectContent>
    </Select>
  );
};

export default SelectCourierProvider;




