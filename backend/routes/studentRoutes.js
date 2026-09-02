const express = require("express");

const {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    updateMarks,
    deleteStudent,
    dashboardStats,
    uploadStudents
} = require("../controllers/studentController");

const protect =
    require("../middleware/authMiddleware");

const upload =
    require("../middleware/uploadMiddleware");

const router =
    express.Router();

router.get(
    "/class/:classId",
    protect,
    getStudents
);

router.get(
    "/class/:classId/stats",
    protect,
    dashboardStats
);

router.post(
    "/upload",
    protect,
    upload.single("studentFile"),
    uploadStudents
);

router.get(
    "/:id",
    protect,
    getStudent
);

router.post(
    "/",
    protect,
    createStudent
);

router.put(
    "/:id",
    protect,
    updateStudent
);

router.put(
    "/:id/marks",
    protect,
    updateMarks
);

router.delete(
    "/:id",
    protect,
    deleteStudent
);

module.exports = router;