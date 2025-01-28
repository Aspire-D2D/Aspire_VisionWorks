import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  const { name, email, service, message } = await req.json();

  try {
    const { data, error } = await supabase
      .from('enquiries')
      .insert([{ name, email, service, message }]);

    if (error) {
      return new Response(JSON.stringify({ error: 'Error saving enquiry to the database' }), { status: 500 });
    }

    const mailOptions = {
      from: 'aspired2d@gmail.com',
      to: 'aspired2d@gmail.com',
      subject: 'New Enquiry from Website',
      text: `
        Hello,

        You have received a new enquiry from your website. Here are the details:

        ---------------------------------------------------

        Name: ${name}
        Email: ${email}
        Service Needed: ${service}

        ---------------------------------------------------
        
        Message:
        ${message}

        ---------------------------------------------------

        Please follow up with the user as soon as possible.

        Best regards,
        Aspire Design to Development Team
  `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Enquiry submitted successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error handling the enquiry:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
  }
}
