const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedExtensions = [
            ".csv",
            ".xlsx",
            ".xls"
        ];

        const extension =
            "." +
            file.originalname
                .split(".")
                .pop()
                .toLowerCase();

        if (
            allowedExtensions.includes(
                extension
            )
        ) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only CSV, XLSX or XLS files are allowed"
                )
            );
        }
    }
});

module.exports = upload;