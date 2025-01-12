"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useForm } from "react-hook-form";
import { type Session } from "next-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  Loader2,
  User2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertOctagonIcon, Building2, CreditCard } from "lucide-react";

const steps = [
  { number: 1, title: "Company Details", icon: Building2 },
  { number: 2, title: "Address Information", icon: Home },
  { number: 3, title: "Aadhar Information", icon: User2Icon },
  { number: 4, title: "PAN Details", icon: CreditCard },
];

interface TKYC {
  companyName: string;
  companyEmail: string;
  companyMobile: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
  famousLandmark: string;
  contactName: string;
  contactMobile: string;
  pickupName: string;
  aadharHolderName: string;
  aadharNumber: string;
  fatherName: string;
  panHolderName: string;
  panNumber: string;
}

interface OnboardingFormProps {
  session: Session;
}


const OnboardingForm: React.FC<OnboardingFormProps> = ({ session }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const { mutateAsync } = api.auth.submitKYC.useMutation({
    onError(error) {
      toast.error(error.message);
    },
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
    trigger,
    setFocus
  } = useForm<TKYC>();

  console.log(errors);

  const checkErrors = () => {
    if (Object.keys(errors).length === 0) return;

    for (const [errorTopic, errorContent] of Object.entries(errors)) {
      toast.error(errorContent.message);
      setFocus(errorTopic as keyof TKYC);
    }
  }

  const [aadharDob, setAadharDob] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [companyType, setCompanyType] = useState<string>("");

  const validateStep = async () => {
    let fieldsToValidate: (keyof TKYC)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["companyName", "companyEmail", "companyMobile"];
        if (!companyType) {
          toast.error("Please select a company type");
          return false;
        }
        break;
      case 2:
        fieldsToValidate = [
          "address",
          "pickupName",
          "city",
          "state",
          "pincode",
          "famousLandmark",
          "contactName",
          "contactMobile",
        ];
        break;
      case 3:
        if (!aadharDob) {
          toast.error("Please select a date of birth");
          return false;
        }
        fieldsToValidate = ["aadharHolderName", "aadharNumber"];
        return true;
      case 4:
        fieldsToValidate = ["panHolderName", "panNumber", "fatherName"];
        break;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const addKYCDetailsHandler = async (data: TKYC) => {
    console.log(data);
    setIsLoading(true);

    try {
      toast.promise(
        mutateAsync({
          companyEmail: data.companyEmail,
          companyMobile: data.companyMobile,
          companyName: data.companyName,
          companyType: companyType,
          address: data.address,
          pincode: +data.pincode,
          city: data.city,
          state: data.state,
          famousLandmark: data.famousLandmark,
          contactName: data.contactName,
          contactMobile: data.contactMobile,
          pickupName: data.pickupName,
          aadharHolderName: data.aadharHolderName,
          aadharNumber: data.aadharNumber,
          dob: aadharDob ?? new Date(),
          fatherName: data.fatherName,
          panHolderName: data.panHolderName,
          panNumber: data.panNumber,
        }),
        {
          loading: "Submitting KYC details...",
          success: "KYC details submitted successfully!",
          error: (error: { message?: string }) =>
            `Error: ${error?.message ? error.message : "Something went wrong"}`,
        },
      );

      router.push("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed flex h-screen w-full items-center justify-center bg-white/20">
        <Loader2 className="animate-spin duration-200" />
      </div>
    );
  }

  return (
    <Card className="container mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Complete your KYC
        </CardTitle>
        <CardDescription>
          Provide your Identity & Address Proof for Verification
        </CardDescription>
      </CardHeader>

      <div className="mx-auto mt-6 flex max-w-4xl items-center justify-between">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                currentStep === step.number
                  ? "bg-blue-600 text-white"
                  : currentStep > step.number
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {currentStep > step.number ? (
                <Check size={20} />
              ) : (
                <step.icon size={20} />
              )}
            </div>
            <span className="mt-2 text-sm text-gray-600">{step.title}</span>
          </div>
        ))}
      </div>

      <CardContent className="mt-12">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(addKYCDetailsHandler)}
        >
          {/* COMPANY DETAILS */}
          <div className="flex flex-col gap-2">
            {currentStep === 1 && (
              <>
                <div className="flex w-full flex-wrap items-center gap-5">
                  <div className="flex w-full flex-col gap-2 md:w-[48%]">
                    <Label
                      htmlFor="companyName"
                      className={`${errors?.companyName ? "text-red-600" : "text-black"}`}
                    >
                      Company Name
                    </Label>
                    <Input
                      className={`w-full ${errors.companyName ? "border-red-600" : null}`}
                      id="companyName"
                      {...register("companyName", {
                        required: "Company Name is required",
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message:
                            "Company Name should contain only letters and spaces",
                        },
                      })}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2 md:w-[48%]">
                    <Label
                      htmlFor="companyEmail"
                      className={`${errors?.companyEmail ? "text-red-600" : "text-black"}`}
                    >
                      Company Email
                    </Label>
                    <Input
                      className={`w-full ${errors.companyEmail ? "border-red-600" : null}`}
                      id="companyEmail"
                      {...register("companyEmail", {
                        required: "Company Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
                        },
                      })}
                    />
                  </div>
                </div>
                <div className="flex w-full flex-wrap items-center gap-5">
                  <div className="flex w-full flex-col gap-2 md:w-[48%]">
                    <Label
                      className={`${errors?.companyMobile ? "text-red-600" : "text-black"}`}
                      htmlFor="companyMobile"
                    >
                      Company Mobile Number
                    </Label>
                    <Input
                      className={`w-full ${errors.companyMobile ? "border-red-600" : null}`}
                      id="companyMobile"
                      {...register("companyMobile", {
                        required: "Company Mobile Number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Mobile Number should be 10 digits",
                        },
                      })}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2 md:w-[48%]">
                    <Label htmlFor="companyType">Company Type</Label>
                    <Select onValueChange={(value) => setCompanyType(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Company Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Proprietorship">
                          Proprietorship
                        </SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <Alert variant="destructive">
                  <AlertOctagonIcon className="h-4 w-4" />
                  <AlertTitle>Check Your Details</AlertTitle>
                  <AlertDescription>
                    Please make sure that you enter correct details to avoid any
                    kind of issues in future.
                  </AlertDescription>
                </Alert>
                <div className="flex w-full flex-col gap-2">
                  <Label
                    htmlFor="billingAddress"
                    className={`${errors.address ? "text-red-600" : "text-black"}`}
                  >
                    Address
                  </Label>
                  <Input
                    className={`w-full ${errors.address ? "border-red-600" : null}`}
                    id="billingAddress"
                    {...register("address", {
                      required: "Billing Address is required",
                      pattern: {
                        value: /^[a-zA-Z0-9\s,.-/+]+$/,
                        message: "Invalid characters in Billing Address",
                      },
                    })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex w-full flex-col gap-2">
                    <Label
                      htmlFor="city"
                      className={`${errors?.pickupName ? "text-red-600" : "text-black"}`}
                    >
                      Pickup Location Name
                    </Label>
                    <Input
                      {...register("pickupName")}
                      className={`w-full ${errors.pickupName ? "border-red-600" : null}`}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <Label
                      htmlFor="city"
                      className={`${errors?.city ? "text-red-600" : "text-black"}`}
                    >
                      City
                    </Label>
                    <Input
                      {...register("city")}
                      className={`w-full ${errors.city ? "border-red-600" : null}`}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <Label
                      htmlFor="state"
                      className={`${errors?.state ? "text-red-600" : "text-black"}`}
                    >
                      State
                    </Label>
                    <Input
                      id="state"
                      {...register("state")}
                      className={`w-full ${errors.state ? "border-red-600" : null}`}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <Label
                      htmlFor="pincode"
                      className={`${errors?.pincode ? "text-red-600" : "text-black"}`}
                    >
                      Pincode
                    </Label>
                    <Input
                      id="pincode"
                      {...register("pincode")}
                      className={`w-full ${errors.pincode ? "border-red-600" : null}`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex w-full flex-col gap-2">
                    <Label
                      htmlFor="famousLandmark"
                      className={`${errors?.famousLandmark ? "text-red-600" : "text-black"}`}
                    >
                      Famous Landmark
                    </Label>
                    <Input
                      id="famousLandmark"
                      {...register("famousLandmark")}
                      className={`w-full ${errors.famousLandmark ? "border-red-600" : null}`}
                    />
                  </div>

                  <div className="flex w-full flex-col gap-2">
                    <Label
                      htmlFor="contactName"
                      className={`${errors?.contactName ? "text-red-600" : "text-black"}`}
                    >
                      Contact Name
                    </Label>
                    <Input
                      id="contactName"
                      {...register("contactName")}
                      className={`w-full ${errors.contactName ? "border-red-600" : null}`}
                    />
                  </div>

                  <div className="flex w-full flex-col gap-2">
                    <Label
                      className={`${errors?.contactMobile ? "text-red-600" : "text-black"}`}
                      htmlFor="contactMobile"
                    >
                      Contact Mobile Number
                    </Label>
                    <Input
                      id="contactMobile"
                      {...register("contactMobile")}
                      className={`w-full ${errors.contactMobile ? "border-red-600" : null}`}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {currentStep === 3 && (
            <div className="flex flex-col gap-2">
              <div className="flex w-full flex-wrap items-center gap-5">
                <div className="flex w-full flex-col gap-2 md:w-[48%]">
                  <Label
                    htmlFor="aadharNumber"
                    className={`${errors?.aadharNumber ? "text-red-600" : "text-black"}`}
                  >
                    Aadhar Card Number
                  </Label>
                  <Input
                    {...register("aadharNumber", {
                      required: "Aadhar Number is required",
                      pattern: {
                        value: /^\d{4}\s?\d{4}\s?\d{4}$/,
                        message:
                          "Invalid Aadhar Number format. Should be 12 digits",
                      },
                      validate: {
                        validAadhar: (value) => {
                          // Remove spaces for validation
                          const cleanedValue = value.replace(/\s/g, "");

                          // Check if all digits are same
                          if (/^(.)\1+$/.test(cleanedValue)) {
                            return "Invalid Aadhar Number";
                          }

                          // Verhoeff algorithm could be implemented here for more thorough validation
                          return true;
                        },
                      },
                    })}
                    type="text"
                    className={`w-full ${errors.aadharNumber ? "border-red-600" : null}`}
                    id="aadharNumber"
                    placeholder="XXXX XXXX XXXX"
                    maxLength={14}
                    onChange={(e) => {
                      // Format as user types: XXXX XXXX XXXX
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length > 0) {
                        value = value.match(/.{1,4}/g)?.join(" ") ?? value;
                      }
                      e.target.value = value;
                    }}
                  />
                </div>
                <div className="flex w-full flex-col gap-2 md:w-[48%]">
                  <Label
                    htmlFor="aadharHolderName"
                    className={`${errors?.aadharHolderName ? "text-red-600" : "text-black"}`}
                  >
                    Aadhar Holder Name
                  </Label>
                  <Input
                    {...register("aadharHolderName", {
                      required: "Aadhar Holder Name is required",
                      pattern: {
                        value: /^[A-Za-z\s]{1,50}$/,
                        message: "Name should only contain letters and spaces",
                      },
                      minLength: {
                        value: 3,
                        message: "Name should be at least 3 characters long",
                      },
                    })}
                    type="text"
                    className={`w-full ${errors.aadharHolderName ? "border-red-600" : null}`}
                    id="aadharHolderName"
                  />
                </div>
                <div className="flex w-full flex-col gap-2 md:w-[48%]">
                  <Label htmlFor="dateOfBirth">Date Of Birth</Label>
                  <Input
                    type="date"
                    className="w-full"
                    id="dateOfBirth"
                    value={
                      aadharDob ? aadharDob.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      setAadharDob(newDate);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex flex-col gap-2">
              <div className="flex w-full flex-wrap items-center gap-5">
                <div className="flex w-full flex-col gap-2 md:w-[48%]">
                  <Label
                    htmlFor="panNumber"
                    className={`${errors?.panNumber ? "text-red-600" : "text-black"}`}
                  >
                    Pan Card Number
                  </Label>
                  <Input
                    className={`w-full ${errors.panNumber ? "border-red-600" : null}`}
                    id="panNumber"
                    {...register("panNumber", {
                      required: "PAN Number is required",
                    })}
                    type="text"
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    style={{ textTransform: "uppercase" }}
                  />
                </div>
                <div className="flex w-full flex-col gap-2 md:w-[48%]">
                  <Label
                    htmlFor="panHolderName"
                    className={`${errors?.panHolderName ? "text-red-600" : "text-black"}`}
                  >
                    Pan Holder Name
                  </Label>
                  <Input
                    className={`w-full ${errors.panHolderName ? "border-red-600" : null}`}
                    id="panHolderName"
                    {...register("panHolderName", {
                      required: "Pan Holder Name is required",
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message:
                          "Bank Name should contain only letters and spaces",
                      },
                    })}
                  />
                </div>
                <div className="flex w-full flex-col gap-2 md:w-[48%]">
                  <Label
                    htmlFor="fatherName"
                    className={`${errors?.fatherName ? "text-red-600" : "text-black"}`}
                  >
                    Father&apos;s Name
                  </Label>
                  <Input
                    className={`w-full ${errors.fatherName ? "border-red-600" : null}`}
                    id="fatherName"
                    {...register("fatherName", {
                      required: "Father's Name is required",
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message:
                          "Bank Name should contain only letters and spaces",
                      },
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                setCurrentStep((prev) => Math.max(1, prev - 1));
              }}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft size={16} /> Previous
            </Button>

            <Button
              onClick={async (e) => {
                if (currentStep === steps.length) {
                  // Handle form submission
                } else {
                  try {
                    const isValid = await validateStep();
                    checkErrors();
                    if (isValid) {
                      setCurrentStep((prev) =>
                        Math.min(steps.length, prev + 1),
                      );
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              type={currentStep === steps.length ? "submit" : "button"}
            >
              {currentStep === steps.length ? (
                <>
                  Submit <Check size={16} />
                </>
              ) : (
                <>
                  Next <ChevronRight size={16} />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OnboardingForm;
