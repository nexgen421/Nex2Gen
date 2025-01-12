import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { env } from "~/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { type DocumentType } from "~/lib/types";

const s3 = new S3Client({
  region: env.NEXT_AWS_S3_REGION,
  credentials: {
    accessKeyId: env.NEXT_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
  },
});

export async function POST(req: Request) {
  const { fileName, docType, extension } = (await req.json()) as {
    fileName: string;
    docType: DocumentType;
    extension: string;
  };

  const command = new PutObjectCommand({
    Bucket: env.NEXT_AWS_S3_BUCKET_NAME,
    Key: `kyc/${docType}/` + fileName + "." + extension,
    ContentType: `image/${extension}`,
  });

  try {
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 120 });
    console.log(presignedUrl);

    return NextResponse.json(
      { presignedUrl },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allow necessary methods
        },
      },
    );
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}

export async function GET(req: Request) {
  try {
    const queryParams = new URL(req.url).searchParams;

    const fileName = queryParams.get("fileName");
    const docType = queryParams.get("docType");

    if (!fileName || !docType) {
      return NextResponse.json(
        { error: "Missing required query parameters" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }

    const command = new GetObjectCommand({
      Bucket: env.NEXT_AWS_S3_BUCKET_NAME,
      Key: `kyc/${docType}/` + fileName,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 120 });

    return NextResponse.json(
      { presignedUrl },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}
