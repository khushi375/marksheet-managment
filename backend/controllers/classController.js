const Class = require("../models/Class");
const Student = require("../models/Student");

const getClasses = async (req, res) => {

    try {

        const classes =
            await Class.find()
                .sort({
                    createdAt: -1
                })
                .lean();

        for (const item of classes) {

            item.studentCount =
                await Student.countDocuments({
                    classId: item._id
                });
        }

        res.json({
            success: true,
            classes
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const createClass = async (req, res) => {

    try {

        const { className } =
            req.body;

        if (
            !className ||
            !className.trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Class name is required"
            });
        }

        const exists =
            await Class.findOne({
                className:
                    className.trim()
            });

        if (exists) {

            return res.status(400).json({
                success: false,
                message:
                    "This class already exists"
            });
        }

        const newClass =
            await Class.create({
                className:
                    className.trim()
            });

        res.status(201).json({
            success: true,
            message:
                "Class created successfully",
            class: newClass
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const deleteClass = async (req, res) => {

    try {

        const studentCount =
            await Student.countDocuments({
                classId: req.params.id
            });

        if (studentCount > 0) {

            return res.status(400).json({
                success: false,
                message:
                    "Cannot delete a class containing students"
            });
        }

        const deleted =
            await Class.findByIdAndDelete(
                req.params.id
            );

        if (!deleted) {

            return res.status(404).json({
                success: false,
                message:
                    "Class not found"
            });
        }

        res.json({
            success: true,
            message:
                "Class deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getClasses,
    createClass,
    deleteClass
};