import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    const { message, name, email } = await req.json();

    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `${name} <${email}>`,
            to: process.env.EMAIL_TO,
            subject: `Message from Portfolio`,
            text:
                `You have received a new message from your portfolio contact form.
            
            Name: ${name}
            Email: ${email}
            
            Message:
            ${message}`,
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                          <h2>New Message from Portfolio</h2>
                          <p><strong>Name:</strong> ${name}</p>
                          <p><strong>Email:</strong> ${email}</p>
                          <p><strong>Message:</strong></p>
                          <p>${message.replace(/\n/g, '<br />')}</p>
                        </div>`,
        };

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Error sending email', error }), {
            status: 500,
        });
    }
}
