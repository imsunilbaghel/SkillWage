import { transporter } from "../config/nodemailer.js";
import Contact from "../models/Contact.js";

// ── POST /api/contact ──
export const submitContact = async (req, res, next) => {
  try {
    const { fullname, email, message } = req.body;

    const contact = await Contact.create({
      fullname,
      email,
      message,
    });

    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <div style="background-color: #0f172a; padding: 25px; text-align: center; border-bottom: 4px solid #3b82f6;">
          <img src="https://skillwage.vercel.app/image/Skillwage.png" alt="SkillWage Logo" style="max-height: 55px;" />
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">New Contact Request</h2>
          <p style="color: #64748b; font-size: 16px; line-height: 1.5;">You have received a new message from the <strong>Contact Us</strong> form on the SkillWage platform.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 25px;">
            <tr>
              <td style="padding: 12px 15px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-weight: 600; width: 100px; color: #475569; border-top-left-radius: 6px;">Name</td>
              <td style="padding: 12px 15px; border: 1px solid #e2e8f0; color: #334155; font-weight: 500; border-top-right-radius: 6px;">${fullname}</td>
            </tr>
            <tr>
              <td style="padding: 12px 15px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-weight: 600; color: #475569;">Email</td>
              <td style="padding: 12px 15px; border: 1px solid #e2e8f0; color: #334155;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 15px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-weight: 600; color: #475569; border-bottom-left-radius: 6px; vertical-align: top;">Message</td>
              <td style="padding: 12px 15px; border: 1px solid #e2e8f0; color: #334155; white-space: pre-wrap; line-height: 1.6; border-bottom-right-radius: 6px;">${message}</td>
            </tr>
          </table>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 13px; border-top: 1px solid #e2e8f0;">
          &copy; ${new Date().getFullYear()} SkillWage. This is an automated message.
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `New Contact Request from ${fullname}`,
      html: htmlTemplate,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message: "Your message has been submitted successfully",
      data: {
        contact: {
          _id: contact._id,
          fullname: contact.fullname,
          email: contact.email,
          message: contact.message,
          createdAt: contact.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
