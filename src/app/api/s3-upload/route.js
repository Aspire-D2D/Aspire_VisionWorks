import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import db from "../../../lib/db";
import path from 'path';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(file, fileName) {
  const fileBuffer = file;
  console.log(fileName);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,  // Upload the file with its full name, including extension
    Body: fileBuffer,
    ContentType: "image/jpg",  // Keep it fixed or dynamically set based on file type
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  // Construct the public URL for the uploaded file
  const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  return imageUrl;
}

async function saveImageToDatabase(userId, imageUrl, imageName, pageName, testimonialText, starRating) {
  const query = `
    INSERT INTO "imageuploads" (
      user_id, image_url, image_name, page_name, testimonial_text, star_rating
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
  `;

  const values = [userId, imageUrl, imageName, pageName, testimonialText, starRating];

  try {
    const result = await db.query(query, values);
    return result.rows[0].id;  // Return the ID of the new image entry
  } catch (err) {
    console.error('Error inserting into database:', err);
    throw new Error('Database insertion failed');
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const userId = formData.get("user_id");  // Make sure to pass user_id in the form
    const pageName = formData.get("page_name");
    const testimonialText = formData.get("testimonial_text");
    const starRating = formData.get("star_rating");

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;  // The full file name, including extension

    // Extract the file name without the extension
    const imageNameWithoutExtension = path.basename(fileName, path.extname(fileName));

    // Upload the file with its full name (with extension) to S3
    const imageUrl = await uploadFileToS3(buffer, fileName);

    const imageId = await saveImageToDatabase(userId, imageUrl, imageNameWithoutExtension, pageName, testimonialText, starRating);

    return NextResponse.json({ success: true, imageId, imageUrl });
  } catch (error) {
    console.error('Error in file upload and database insert:', error);
    return NextResponse.json({ error: "Error uploading file and saving data" }, { status: 500 });
  }
}
