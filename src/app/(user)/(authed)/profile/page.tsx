"use client";

import React from "react";
import { UserCircle, Building2 } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Loading from "~/app/loading";
import { api } from "~/trpc/react";
import { MdDocumentScanner, MdPassword } from "react-icons/md";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import moment from "moment";

interface TChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage = () => {
  const { data, isLoading } = api.user.fetchUserProfile.useQuery();
  const { mutateAsync, isPending } = api.user.changePassword.useMutation();
  const { register, handleSubmit, reset } = useForm<TChangePasswordForm>();

  if (isLoading || isPending) {
    return <Loading />;
  }

  if (!data) {
    return <div className="text-center text-red-500">Profile not found</div>;
  }

  const { name, email, kycDetails } = data;

  if (!kycDetails?.companyInfo) {
    return <div>Error fetching kyc details</div>;
  }
  const { companyInfo, panInfo, aadharInfo } = kycDetails;

  const handleChangePassword = async (data: TChangePasswordForm) => {
    await mutateAsync(data);
    toast.success("Password changed successfully");
    reset({ confirmPassword: "", newPassword: "", oldPassword: "" });
  };

  return (
    <div className="container mx-auto p-4">
      <Heading level={2}>Your Profile</Heading>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCircle className="mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Company Name:</strong> {companyInfo.companyName}
            </p>
            <p>
              <strong>Company Type:</strong> {companyInfo.companyType}
            </p>
            <p>
              <strong>Contact Number:</strong>{" "}
              {companyInfo.companyContactNumber}
            </p>
            <p>
              <strong>Company Email:</strong> {companyInfo.companyEmail}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(companyInfo.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MdDocumentScanner className="mr-2" />
              Document Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Aadhar Number:</strong> {aadharInfo?.aadharNumber}
            </p>
            <p>
              <strong>Aadhar Holder Name:</strong> {aadharInfo?.holderName}
            </p>
            <p>
              <strong>Bank Name:</strong>{" "}
              {moment(aadharInfo?.dob).format("DD/MM/YYYY")}
            </p>
            <p>
              <strong>PAN Number</strong> {panInfo?.panNumber}
            </p>
            <p>
              <strong>PAN Holder Name:</strong> {panInfo?.holderName}
            </p>
            <p>
              <strong>PAN Holder Name:</strong> {panInfo?.holderName}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MdPassword className="mr-2" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(handleChangePassword)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1">
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input
                  type="password"
                  className="Input"
                  id="oldPassword"
                  {...register("oldPassword", { required: true })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  type="password"
                  id="newPassword"
                  {...register("newPassword", { required: true })}
                  className="Input"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  className="Input"
                  id="confirmPassword"
                  {...register("confirmPassword", { required: true })}
                />
              </div>

              <Button type="submit" disabled={isPending}>
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
