const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
    {
        className: {
            type: String,
            required: true,
            trim: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

classSchema.index(
    {
        createdBy: 1,
        className: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model("Class", classSchema);