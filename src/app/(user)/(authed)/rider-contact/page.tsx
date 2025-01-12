"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Phone, User } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import Loading from "~/app/loading";

const COURIER_TYPES = {
  DELHIVERY: "DELHIVERY",
  ECOMEXPRESS: "ECOMEXPRESS",
  XPRESSBEES: "XPRESSBEES",
  SHADOWFAX: "SHADOWFAX",
} as const;

const COURIER_ROLES = {
  PICKUP_BOY_1: "PICKUP_BOY_1",
  PICKUP_BOY_2: "PICKUP_BOY_2",
  PICKUP_BOY_3: "PICKUP_BOY_3",
  PICKUP_BOY_4: "PICKUP_BOY_4",
  HUB_INCHARGE: "HUB_INCHARGE",
  ZONAL_SALES_MANAGER: "ZONAL_SALES_MANAGER",
} as const;

type CourierType = keyof typeof COURIER_TYPES;
type CourierRole = keyof typeof COURIER_ROLES;

interface ContactForm {
  name: string;
  phone: string;
}

type CourierContacts = Record<CourierType, Record<CourierRole, ContactForm>>;

const formatDisplayName = (str: string) => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const ContactTable = ({
  courierType,
  contacts,
  onChange,
  onSave,
}: {
  courierType: CourierType;
  contacts: Record<CourierRole, ContactForm>;
  onChange: (
    role: CourierRole,
    field: keyof ContactForm,
    value: string,
  ) => void;
  onSave: (role: CourierRole) => void;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.values(COURIER_ROLES).map((role) => (
          <TableRow key={role}>
            <TableCell className="font-medium">
              {formatDisplayName(role)}
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <Input
                  placeholder="Enter name"
                  className="max-w-xs"
                  value={contacts[role]?.name ?? ""}
                  onChange={(e) => onChange(role, "name", e.target.value)}
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                <Input
                  placeholder="Enter phone"
                  className="max-w-xs"
                  value={contacts[role]?.phone ?? ""}
                  onChange={(e) => onChange(role, "phone", e.target.value)}
                />
              </div>
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onSave(role)}>
                Save
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const RiderContact = () => {
  const { mutateAsync } = api.rider.createContactUser.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success("Changed Successfully");
    },
  });

  const { data, isLoading } = api.rider.getContacts.useQuery();

  const [formData, setFormData] = useState<CourierContacts>(() => {
    // Initialize empty state with all possible combinations
    const initialState: CourierContacts = Object.values(COURIER_TYPES).reduce(
      (acc, courierType) => {
        acc[courierType] = Object.values(COURIER_ROLES).reduce(
          (roleAcc, role) => {
            roleAcc[role] = { name: "", phone: "" };
            return roleAcc;
          },
          {} as Record<CourierRole, ContactForm>,
        );
        return acc;
      },
      {} as CourierContacts,
    );
    return initialState;
  });

  // Update form data when backend data is loaded
  useEffect(() => {
    if (data?.contacts) {
      const updatedFormData = { ...formData };

      data.contacts.forEach((contact) => {
        const courierType = contact.courierType as CourierType;
        const role = contact.role as CourierRole;

        if (!updatedFormData[courierType]) {
          updatedFormData[courierType] = {} as Record<CourierRole, ContactForm>;
        }

        updatedFormData[courierType][role] = {
          name: contact.name,
          phone: contact.phone,
        };
      });

      setFormData(updatedFormData);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  const handleChange = (
    courierType: CourierType,
    role: CourierRole,
    field: keyof ContactForm,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [courierType]: {
        ...prev[courierType],
        [role]: {
          ...prev[courierType][role],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async (courierType: CourierType, role: CourierRole) => {
    const contactData = formData[courierType][role];

    // Validation function
    const isValidContactData = (name: string, phone: string) => {
      const nameRegex = /^[^\d]+$/; // Name should not be numeric
      const phoneRegex = /^\d{10}$/; // Phone should be 10 digits

      if (!name || !nameRegex.test(name)) {
        toast.error("Invalid name. Name should not be empty or numeric.");
        return false;
      }

      if (!phone || !phoneRegex.test(phone)) {
        toast.error("Invalid phone number. Phone number should be 10 digits.");
        return false;
      }

      return true;
    };

    if (!isValidContactData(contactData.name, contactData.phone)) {
      return;
    }

    toast.promise(
      mutateAsync({
        courierType,
        name: contactData.name,
        phone: contactData.phone,
        role,
      }),
      {
        loading: "Creating Pickup Contact",
      },
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rider Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={COURIER_TYPES.DELHIVERY.toLowerCase()}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            {Object.values(COURIER_TYPES).map((company) => (
              <TabsTrigger
                key={company}
                value={company.toLowerCase()}
                className="text-sm"
              >
                {formatDisplayName(company)}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.values(COURIER_TYPES).map((company) => (
            <TabsContent key={company} value={company.toLowerCase()}>
              <Card>
                <CardHeader>
                  <Heading level={3}>
                    {formatDisplayName(company)} Contacts
                  </Heading>
                </CardHeader>
                <CardContent>
                  <ContactTable
                    courierType={company}
                    contacts={formData[company]}
                    onChange={(role, field, value) =>
                      handleChange(company, role, field, value)
                    }
                    onSave={(role) => handleSave(company, role)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RiderContact;
