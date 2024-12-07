import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  try {
    // Query the database for the image related to the "Home" page and active status
    const result = await db.query(
      `SELECT image_url, image, image_alt_text, testimonial_text FROM ImageUploads WHERE page_name = $1 AND status = 'active' AND image_name = 'home'`,
      ['Home']
    );

    // If no image is found, return a 404 error with a message
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Destructure the necessary values from the database result
    const { image_url, image, image_alt_text, testimonial_text } = result.rows[0];

    let base64Image = null;

    // If the image field is present and it is a Buffer, convert it to base64
    if (image) {
      if (Buffer.isBuffer(image)) {
        base64Image = `data:image/jpeg;base64,${image.toString('base64')}`;
      } else {
        console.warn('Image is not a buffer');
        base64Image = image; // Fallback in case the image is not stored as a buffer
      }
    }

    // Return the data as a JSON response to the frontend
    return NextResponse.json({
      image_url,
      image: base64Image,
      image_alt_text,
      testimonial_text,  // Add testimonial_text in the response
    });

  } catch (error) {
    // Log the error and return a 500 status if something goes wrong
    console.error('Error fetching image data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
