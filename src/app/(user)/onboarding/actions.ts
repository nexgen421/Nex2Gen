"use server";
import { uploadFileToS3 } from "~/lib/aws";
import { env } from "~/env";

export const uploadEverything = async (formData: FormData) => {
  try {
    const aadharCardFront = formData.get("aadharCardFront") as File;
    const aadharCardBack = formData.get("aadharCardBack") as File;
    const panCard = formData.get("panCard") as File;
    const blankCheque = formData.get("blankCheque") as File;
    const userId = formData.get("userId") as string;

    const aadharCardFrontUrl = await uploadAadharCardBack(
      aadharCardBack,
      userId,
    );
    const aadharCardBackUrl = await uploadAadharCardFront(
      aadharCardFront,
      userId,
    );
    const blankChequeUrl = await uploadBlankCheque(blankCheque, userId);
    const pandCardUrl = await uploadPanCard(panCard, userId);

    const generalUrl = `https://${env.NEXT_AWS_S3_BUCKET_NAME}.s3.${env.NEXT_AWS_S3_REGION}.amazonaws.com/`;

    return {
        aadharCardFrontUrl: generalUrl + aadharCardFrontUrl, 
        aadharCardBackUrl: generalUrl + aadharCardBackUrl, 
        panCardUrl: generalUrl + pandCardUrl, 
        blankChequeUrl: generalUrl + blankChequeUrl
    };

  } catch (error) {
    throw error;
  }
};

export const uploadAadharCardFront = async (file: File, userId: string) => {
  try {
    if (file.size === 0) {
      throw new Error("Enter a file to upload...");
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type;
    const fileExtension = file.name
      .split(".")
      .at(file.name.split(".").length - 1);

    const fileName = `${userId}-aadhar-front.${fileExtension}`;
    await uploadFileToS3(buffer, fileName, fileType);
    return fileName;
  } catch (error) {
    throw error;
  }
};

export const uploadAadharCardBack = async (file: File, userId: string) => {
  try {
    if (file.size === 0) {
      throw new Error("Enter a file to upload...");
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type;
    const fileExtension = file.name
      .split(".")
      .at(file.name.split(".").length - 1);

    const fileName = `${userId}-aadhar-back.${fileExtension}`;
    await uploadFileToS3(buffer, fileName, fileType);
    return fileName;
  } catch (error) {
    throw error;
  }
};

export const uploadPanCard = async (file: File, userId: string) => {
  try {
    if (file.size === 0) {
      throw new Error("Enter a file to upload...");
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type;
    const fileExtension = file.name
      .split(".")
      .at(file.name.split(".").length - 1);
    const fileName = `${userId}-pan.${fileExtension}`;
    await uploadFileToS3(buffer, fileName, fileType);


    return fileName;
  } catch (error) {
    throw error;
  }
};

export const uploadBlankCheque = async (file: File, userId: string) => {
  try {
    if (file.size === 0) {
      throw new Error("Enter a file to upload...");
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type;
    const fileExtension = file.name
      .split(".")
      .at(file.name.split(".").length - 1);
    const fileName = `${userId}-blank-cheque.${fileExtension}`;
    await uploadFileToS3(buffer, fileName, fileType);
    return fileName;
  } catch (error) {
    throw error;
  }
};