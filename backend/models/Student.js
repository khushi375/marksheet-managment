const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true
        },

        rollNumber: {
            type: String,
            required: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true
        },

        course: {
            type: String,
            required: true,
            trim: true
        },

        semester: {
            type: Number,
            required: true
        },

        subjects: [
            {
                subjectName: {
                    type: String,
                    required: true,
                    trim: true
                },

                marks: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 100
                }
            }
        ]
    },

    {
        timestamps: true
    }
);

studentSchema.index(
    {
        classId: 1,
        rollNumber: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "Student",
    studentSchema
);