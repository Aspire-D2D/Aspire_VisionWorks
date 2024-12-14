import db from '../../../lib/db';

export async function GET(request) {
  try {
    const { rows } = await db.query('SELECT * FROM "imageuploads" ORDER BY created_at DESC');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error fetching imageuploads:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch imageuploads' }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Image ID is required' }), { status: 400 });
    }

    const query = `
      DELETE FROM "imageuploads"
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id];

    const { rows } = await db.query(query, values);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Image not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Image deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting image:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete image' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, image_url, image_name, page_name, testimonial_text, star_rating, status } = body;

    const query = `
      INSERT INTO "imageuploads" (user_id, image_url, image_name, page_name, testimonial_text, star_rating, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [user_id, image_url, image_name, page_name, testimonial_text, star_rating, status];

    const { rows } = await db.query(query, values);
    return new Response(JSON.stringify(rows[0]), { status: 201 });
  } catch (error) {
    console.error('Error adding image:', error);
    return new Response(JSON.stringify({ error: 'Failed to add image' }), { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const query = `
      UPDATE "imageuploads"
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 RETURNING *`;
    const values = [status, id];

    const { rows } = await db.query(query, values);
    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    console.error('Error updating status:', error);
    return new Response(JSON.stringify({ error: 'Failed to update status' }), { status: 500 });
  }
}
