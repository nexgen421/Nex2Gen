"use server";

import { uploadFileToS3Directory } from "~/lib/aws";
import { env } from "~/env";
import path from "path";

export const uploadSupportImages = async (formData: FormData) => {
  const files = formData.getAll("images") as File[];

  const fileNames: string[] = [];
  // Upload Images first
  const imagePromises = files.map(async (img: File) => {
    const fileName = `${Date.now()}-${img.name}`;
    fileNames.push(fileName);
    const fileType = img.type;
    const file = Buffer.from(await img.arrayBuffer());

    return uploadFileToS3Directory(file, "support", fileName, fileType);
  });

  await Promise.all(imagePromises);

  const urls = fileNames.map(
    (fn) =>
      `https://${env.NEXT_AWS_S3_BUCKET_NAME}.s3.${env.NEXT_AWS_S3_REGION}.amazonaws.com/` +
      path.join("support", fn),
  );

  return urls;
};
