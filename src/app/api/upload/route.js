import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import { Buffer } from 'buffer';
import { query } from '../../../lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export const POST = async (req, res) => {
  const form = formidable({ multiples: true });

  const data = await new Promise((resolve, reject) => {
    const chunks = [];
    req.body.on('data', (chunk) => {
      chunks.push(chunk);
    });
    req.body.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    req.body.on('error', (err) => {
      reject(err);
    });
  });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(NextResponse.json({ message: 'Error parsing form data.' }, { status: 500 }));
      }

      const { image_url } = fields;
      const { image } = files;

      if (!image_url && !image) {
        return reject(NextResponse.json({ message: 'Please provide either an image file or an image URL.' }, { status: 400 }));
      }

      try {
        let queryText = 'INSERT INTO ImageUploads (image_url, image_name, status) VALUES ($1, $2, $3) RETURNING *';
        const values = [image_url, image ? image.originalFilename : null, 'active'];

        if (image) {
          const imagePath = image.filepath;
          const buffer = fs.readFileSync(imagePath);

          queryText = 'INSERT INTO ImageUploads (image, image_name, status) VALUES ($1, $2, $3) RETURNING *';
          values[0] = buffer;
        }

        const result = await query(queryText, values);

        resolve(NextResponse.json({ message: 'Image uploaded successfully!', image: result.rows[0] }));
      } catch (error) {
        console.error(error);
        return reject(NextResponse.json({ message: 'Error uploading image.' }, { status: 500 }));
      }
    });
  });
};
