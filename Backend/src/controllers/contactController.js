import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

// ── POST /api/contact ──
export const submitContact = async (req, res, next) => {
  try {
    const { fullname, email, message } = req.body;

    const contact = await Contact.create({
      fullname,
      email,
      message,
    });

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `New Contact Request from ${fullname}`,
      text: `You have received a new message from the Contact Us form:\n\nName: ${fullname}\nEmail: ${email}\nMessage:\n${message}`,
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
