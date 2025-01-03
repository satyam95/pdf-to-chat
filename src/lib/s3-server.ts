import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import os from "os";

export async function downloadFromS3(file_key: string) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      region: "us-east-1",
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    // Get the object from S3
    const obj = await s3.getObject(params).promise();

    // Create a platform-independent temporary directory
    const tmpDir = path.join(os.tmpdir(), "pdf-chat");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // Define the file path
    const file_name = path.join(tmpDir, `pdf-${Date.now()}.pdf`);

    // Write the file to the temporary directory
    fs.writeFileSync(file_name, obj.Body as Buffer);

    return file_name;
  } catch (error) {
    if (error instanceof Error) {
      // If error is an instance of the Error class
      console.error("Error downloading from S3:", error.message);
    } else {
      // Handle other unknown error types
      console.error("An unknown error occurred:", error);
    }
    return null;
  }
}
