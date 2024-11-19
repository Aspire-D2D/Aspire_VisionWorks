import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { query } from '../../../lib/db';
import mime from 'mime-types';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    console.log("Processing request...");

    const contentType = req.headers.get('content-type');
    if (!contentType) {
      return NextResponse.json({ message: 'Content-Type header is missing' }, { status: 400 });
    }

    const boundary = getBoundary(contentType);
    if (!boundary) {
      return NextResponse.json({ message: 'Boundary not found in content-type' }, { status: 400 });
    }

    const rawBody = await req.text();
    const formData = parseMultipartData(rawBody, boundary);

    let image_url = '';
    let image = null;
    let page_name = formData.page_name || 'default_page';
    let image_name = formData.image_name || 'uploaded_image';
    let star_rating = null;
    let testimonial_text = '';

    if (formData.image_url) {
      image_url = formData.image_url;
    }

    if (formData.image) {
      image = formData.image;
      image_name = formData.image_name || 'uploaded_image';
    }

    if (formData.star_rating) {
      star_rating = parseInt(formData.star_rating, 10);
    }

    if (formData.testimonial_text) {
      testimonial_text = formData.testimonial_text;
    }

    if (!image_url && !image) {
      return NextResponse.json({ message: 'Please provide either an image file or an image URL.' }, { status: 400 });
    }

    if (image) {
      const fileExtension = mime.extension(formData.mimetype) || 'jpeg';
      const fileContentType = mime.lookup(fileExtension) || `image/${fileExtension}`;
      const fullImageName = getCleanImageName(image_name, fileExtension);

      const uploadResult = await uploadImageToS3(image, fullImageName, fileContentType);
      image_url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fullImageName}`;
      
      console.log("Uploaded image URL:", image_url);
    }

    const queryText = 'INSERT INTO ImageUploads (image_url, image_name, status, page_name, testimonial_text, star_rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [image_url, image_name, 'active', page_name, testimonial_text, star_rating];

    const result = await query(queryText, values);

    return NextResponse.json({
      message: 'Image uploaded successfully!',
      image: result.rows[0],
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ message: 'Error processing file.' }, { status: 500 });
  }
}

function getBoundary(contentType) {
  const match = contentType && contentType.match(/boundary=([^;]+)/);
  return match ? match[1] : null;
}

function parseMultipartData(body, boundary) {
  const parts = body.split(`--${boundary}`);
  const formData = {};

  parts.forEach((part) => {
    if (part.includes('Content-Disposition')) {
      const [headers, content] = part.split('\r\n\r\n');
      const contentDispositionMatch = headers.toString().match(/name="([^"]+)"/);

      if (contentDispositionMatch) {
        const name = contentDispositionMatch[1];
        if (name === 'image_url') {
          formData.image_url = content.toString().trim();
        } else if (name === 'image') {
          formData.image = Buffer.from(content.trim());
          formData.mimetype = headers.toString().match(/Content-Type: ([^;]+)/)?.[1] || 'image/jpeg';
        } else if (name === 'page_name') {
          formData.page_name = content.toString().trim();
        } else if (name === 'image_name') {
          formData.image_name = content.toString().trim();
        } else if (name === 'star_rating') {
          formData.star_rating = content.toString().trim();
        } else if (name === 'testimonial_text') {
          formData.testimonial_text = content.toString().trim();
        }
      }
    }
  });

  return formData;
}

function getCleanImageName(imageName, fileExtension) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const currentExtension = imageName.split('.').pop().toLowerCase();
  imageName = imageName.replace(/\s+/g, '_');

  if (!imageExtensions.includes(currentExtension)) {
    imageName = `${imageName}.${fileExtension}`;
  }
  return encodeURIComponent(imageName);
}

async function uploadImageToS3(imageBuffer, imageName, fileContentType) {
  const cleanImageName = getCleanImageName(imageName, mime.extension(fileContentType));

  console.log('Final image name for S3 upload:', cleanImageName);

  const params = {
    Bucket: BUCKET_NAME,
    Key: cleanImageName,
    Body: imageBuffer,
    ContentType: fileContentType,
  };

  try {
    const command = new PutObjectCommand(params);
    const uploadResult = await s3Client.send(command);
    console.log("S3 Upload Result:", uploadResult);
    return uploadResult;
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    throw new Error('Error uploading image to S3');
  }
}
