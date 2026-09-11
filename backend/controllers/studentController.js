const Student = require("../models/Student");
const Class = require("../models/Class");

const getOwnedClass = (classId, adminId) =>
    Class.findOne({
        _id: classId,
        createdBy: adminId
    });

const calculateResult = (subjects = []) => {

    if (!subjects.length) {

        return {
            total: 0,
            maxMarks: 0,
            percentage: 0,
            grade: "-",
            result: "PENDING"
        };
    }

    const total =
        subjects.reduce(
            (sum, subject) =>
                sum + Number(subject.marks || 0),
            0
        );

    const maxMarks =
        subjects.length * 100;

    const percentage =
        (total / maxMarks) * 100;

    let grade = "F";

    if (percentage >= 90) {
        grade = "A+";
    } else if (percentage >= 80) {
        grade = "A";
    } else if (percentage >= 70) {
        grade = "B";
    } else if (percentage >= 60) {
        grade = "C";
    } else if (percentage >= 50) {
        grade = "D";
    } else if (percentage >= 40) {
        grade = "E";
    }

    const passed =
        subjects.every(
            subject =>
                Number(subject.marks) >= 40
        );

    return {
        total,
        maxMarks,
        percentage:
            Number(percentage.toFixed(2)),
        grade,
        result:
            passed
                ? "PASS"
                : "FAIL"
    };
};


const getStudents = async (req, res) => {

    try {

        const classExists = await getOwnedClass(
            req.params.classId,
            req.admin.id
        );

        if (!classExists) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        const students =
            await Student.find({
                classId:
                    req.params.classId
            })
                .populate(
                    "classId",
                    "className"
                )
                .sort({
                    createdAt: -1
                });

        res.json({
            success: true,
            students
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getStudent = async (req, res) => {

    try {

        const student =
            await Student.findById(
                req.params.id
            ).populate(
                "classId",
                "className"
            );

        if (!student) {

            return res.status(404).json({
                success: false,
                message:
                    "Student not found"
            });
        }

        const classExists = await getOwnedClass(
            student.classId._id,
            req.admin.id
        );

        if (!classExists) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            student
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const createStudent = async (req, res) => {

    try {

        const {
            classId,
            rollNumber,
            name,
            email,
            course,
            semester,
            subjects = []
        } = req.body;

        if (
            !classId ||
            !rollNumber ||
            !name ||
            !email ||
            !course ||
            !semester
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please fill all required fields"
            });
        }

        const classExists = await getOwnedClass(
            classId,
            req.admin.id
        );

        if (!classExists) {

            return res.status(404).json({
                success: false,
                message:
                    "Selected class not found"
            });
        }

        const exists =
            await Student.findOne({
                classId,
                rollNumber:
                    rollNumber.trim()
            });

        if (exists) {

            return res.status(400).json({
                success: false,
                message:
                    "Roll number already exists in this class"
            });
        }

        const student =
            await Student.create({
                classId,
                rollNumber:
                    rollNumber.trim(),
                name:
                    name.trim(),
                email:
                    email.trim(),
                course:
                    course.trim(),
                semester:
                    Number(semester),
                subjects
            });

        res.status(201).json({
            success: true,
            message:
                "Student added successfully",
            student
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const updateStudent = async (req, res) => {

    try {

        const existingStudent = await Student.findById(
            req.params.id
        );

        if (!existingStudent || !await getOwnedClass(
            existingStudent.classId,
            req.admin.id
        )) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {

            return res.status(404).json({
                success: false,
                message:
                    "Student not found"
            });
        }

        res.json({
            success: true,
            message:
                "Student updated successfully",
            student
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const updateMarks = async (req, res) => {

    try {

        const { subjects } =
            req.body;

        if (!Array.isArray(subjects)) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid subjects data"
            });
        }

        const existingStudent = await Student.findById(
            req.params.id
        );

        if (!existingStudent || !await getOwnedClass(
            existingStudent.classId,
            req.admin.id
        )) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                subjects
            },
            {
                new: true,
                runValidators: true
            }
        ).populate(
            "classId",
            "className"
        );

        if (!student) {

            return res.status(404).json({
                success: false,
                message:
                    "Student not found"
            });
        }

        res.json({
            success: true,
            message:
                "Marks saved successfully",
            student,
            result:
                calculateResult(
                    student.subjects
                )
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const deleteStudent = async (req, res) => {

    try {

        const existingStudent = await Student.findById(
            req.params.id
        );

        if (!existingStudent || !await getOwnedClass(
            existingStudent.classId,
            req.admin.id
        )) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {

            return res.status(404).json({
                success: false,
                message:
                    "Student not found"
            });
        }

        res.json({
            success: true,
            message:
                "Student deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const dashboardStats = async (req, res) => {

    try {

        const classExists = await getOwnedClass(
            req.params.classId,
            req.admin.id
        );

        if (!classExists) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        const students =
            await Student.find({
                classId:
                    req.params.classId
            });

        let passed = 0;
        let failed = 0;
        let percentageSum = 0;
        let markedStudents = 0;

        students.forEach(student => {

            if (
                !student.subjects ||
                !student.subjects.length
            ) {
                return;
            }

            const result =
                calculateResult(
                    student.subjects
                );

            if (
                result.result === "PASS"
            ) {
                passed++;
            } else {
                failed++;
            }

            percentageSum +=
                result.percentage;

            markedStudents++;
        });

        const average =
            markedStudents
                ? percentageSum /
                  markedStudents
                : 0;

        res.json({
            success: true,

            stats: {
                totalStudents:
                    students.length,

                passed,

                failed,

                pending:
                    students.length -
                    markedStudents,

                averagePercentage:
                    Number(
                        average.toFixed(2)
                    )
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const uploadStudents = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message:
                    "Please upload a CSV or Excel file"
            });
        }

        const classId =
            req.body.classId;

        if (!classId) {

            return res.status(400).json({
                success: false,
                message:
                    "Class ID is required"
            });
        }

        const classExists = await getOwnedClass(
            classId,
            req.admin.id
        );

        if (!classExists) {

            return res.status(404).json({
                success: false,
                message:
                    "Class not found"
            });
        }

        const XLSX =
            require("xlsx");

        const workbook =
            XLSX.read(
                req.file.buffer,
                {
                    type: "buffer"
                }
            );

        const sheet =
            workbook.Sheets[
                workbook.SheetNames[0]
            ];

        const rows =
            XLSX.utils.sheet_to_json(
                sheet,
                {
                    defval: ""
                }
            );

        if (!rows.length) {

            return res.status(400).json({
                success: false,
                message:
                    "The uploaded file is empty"
            });
        }

        let imported = 0;
        let skipped = 0;

        const errors = [];

        for (
            let i = 0;
            i < rows.length;
            i++
        ) {

            const row = rows[i];

            const rollNumber =
                String(
                    row["Roll Number"] ||
                    row["rollNumber"] ||
                    row["RollNumber"] ||
                    ""
                ).trim();

            const name =
                String(
                    row["Name"] ||
                    row["name"] ||
                    ""
                ).trim();

            const email =
                String(
                    row["Email"] ||
                    row["email"] ||
                    ""
                ).trim();

            const course =
                String(
                    row["Course"] ||
                    row["course"] ||
                    ""
                ).trim();

            const semester =
                Number(
                    row["Semester"] ||
                    row["semester"] ||
                    0
                );

            if (
                !rollNumber ||
                !name ||
                !email ||
                !course ||
                !semester
            ) {

                skipped++;

                errors.push(
                    `Row ${i + 2}: Missing required data`
                );

                continue;
            }

            const duplicate =
                await Student.findOne({
                    classId,
                    rollNumber
                });

            if (duplicate) {

                skipped++;

                errors.push(
                    `Row ${i + 2}: Roll number ${rollNumber} already exists`
                );

                continue;
            }

            await Student.create({
                classId,
                rollNumber,
                name,
                email,
                course,
                semester,
                subjects: []
            });

            imported++;
        }

        res.json({
            success: true,

            message:
                "Student import completed",

            imported,

            skipped,

            errors
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    updateMarks,
    deleteStudent,
    dashboardStats,
    uploadStudents
};