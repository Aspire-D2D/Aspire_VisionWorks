import db from '../../../lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pageName = searchParams.get('pageName');

  console.log("Page Name:", pageName);

  if (!pageName) {
    return new Response(JSON.stringify({ error: 'Page name is required' }), { status: 400 });
  }

  try {
    // Update query with PostgreSQL parameterized query syntax
    const result = await db.query(
      'SELECT identity FROM pageidentities WHERE page_name = $1',
      [pageName]
    );   

    if (result.rows.length > 0) {
      const identities = result.rows.map(row => row.identity);
      return new Response(JSON.stringify({ identities }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Identity not found for this page' }), { status: 404 });
    }
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
  }
}
