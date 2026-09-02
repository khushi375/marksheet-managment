const express = require("express");

const {
    getClasses,
    createClass,
    deleteClass
} = require("../controllers/classController");

const protect =
    require("../middleware/authMiddleware");

const router =
    express.Router();

router.get(
    "/",
    protect,
    getClasses
);

router.post(
    "/",
    protect,
    createClass
);

router.delete(
    "/:id",
    protect,
    deleteClass
);

module.exports = router;