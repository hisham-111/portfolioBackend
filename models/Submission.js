// models/Submission.js
import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    from_name: { type: String, required: true },
    email_id: { type: String, required: true },
    project_form: { type: String },
    message_id: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Use default export for the model
export default mongoose.model('Submission', submissionSchema);