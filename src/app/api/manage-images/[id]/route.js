import db from '../../../../lib/db';

export async function DELETE(request) {
  try {
    console.log("Request URL:", request.url);
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); 

    console.log("Extracted ID:", id);

    if (!id) {
      return new Response(JSON.stringify({ error: 'Image ID is required' }), { status: 400 });
    }

    const intId = parseInt(id, 10);
    if (isNaN(intId)) {
      return new Response(JSON.stringify({ error: 'Invalid Image ID' }), { status: 400 });
    }

    const selectQuery = 'SELECT * FROM "imageuploads" WHERE id = $1';
    const { rows: existingRows } = await db.query(selectQuery, [intId]);

    if (existingRows.length === 0) {
      console.log("Image not found in database:", intId);
      return new Response(JSON.stringify({ error: 'Image not found' }), { status: 404 });
    }
    const query = `
      DELETE FROM "imageuploads"
      WHERE id = $1
      RETURNING *;
    `;
    const values = [intId];
    const { rows } = await db.query(query, values);

    if (rows.length === 0) {
      console.log("Failed to delete image:", intId);
      return new Response(JSON.stringify({ error: 'Image not found' }), { status: 404 });
    }

    console.log("Successfully deleted image:", intId);
    return new Response(JSON.stringify({ message: 'Image deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting image:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete image' }), { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const query = `
      UPDATE "imageuploads"
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 RETURNING *;
    `;
    const values = [status, id];

    const { rows } = await db.query(query, values);
    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    console.error('Error updating status:', error);
    return new Response(JSON.stringify({ error: 'Failed to update status' }), { status: 500 });
  }
}
