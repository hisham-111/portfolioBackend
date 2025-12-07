// controllers/emailController.js
import Submission from '../models/Submission.js';
import nodemailer from 'nodemailer';

// Named export for the controller function
export const sendEmailAndSave = async (req, res) => {
    // Note: process.env is automatically available in Node.js, 
    // but dotenv may need a specific call if not handled by the deployment environment.
    const { from_name, email_id, project_form, message_id } = req.body;

    // --- A. Validation ---
    if (!from_name || !email_id || !message_id) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    // --- B. Save to MongoDB ---
    let dbSuccess = false;
    try {
        const newSubmission = new Submission(req.body);
        await newSubmission.save();
        dbSuccess = true;
        console.log('Form submission saved to MongoDB.');
    } catch (error) {
        console.error('Error saving to DB:', error);
    }
    
    // --- C. Send Email via Nodemailer ---
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.TO_EMAIL,
            replyTo: email_id,
            subject: `New Contact Form from ${from_name}`,
            text: `Name: ${from_name}\nEmail: ${email_id}\nProject: ${project_form || 'N/A'}\nMessage: ${message_id}`,
        };

        await transporter.sendMail(mailOptions);
        
        // --- D. Final Response ---
        const message = dbSuccess 
            ? 'Email sent and submission recorded successfully!' 
            : 'Email sent successfully, but failed to record submission.';

        return res.status(200).json({ message });

    } catch (error) {
        console.error('Nodemailer Error:', error);
        return res.status(500).json({ 
            message: 'Internal server error while sending email.' 
        });
    }
};