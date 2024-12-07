import { NextResponse } from 'next/server';
import db from '../../../lib/db'; 


export async function POST(req) {
  try {
    const { pageName, starRatingSelected, descriptionSelected } = await req.json();

    if (!pageName || typeof pageName !== 'string') {
      return NextResponse.json({ message: 'Invalid page name' }, { status: 400 });
    }

    if (typeof starRatingSelected !== 'boolean' || typeof descriptionSelected !== 'boolean') {
      return NextResponse.json({ message: 'Checkbox values must be boolean' }, { status: 400 });
    }

    const starRating = starRatingSelected ? true : false;  
    const description = descriptionSelected ? true : false; 

    const result = await db.query(
      'INSERT INTO Pages (page_name, star_rating, description) VALUES ($1, $2, $3) RETURNING *',
      [pageName, starRating, description]
    );
    const newPage = result.rows[0];
    
    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    console.error('Error inserting page into DB:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await db.query('SELECT page_name, star_rating, description FROM Pages');
    
    const pages = result.rows.map(row => ({
      name: row.page_name,
      starRatingEnabled: row.star_rating,
      descriptionEnabled: row.description
    }));

    return NextResponse.json(pages, { status: 200 });
  } catch (error) {
    console.error('Error fetching page details from DB:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
