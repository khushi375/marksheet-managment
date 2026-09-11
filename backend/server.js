const dns = require("dns");
const dotenv = require("dotenv");

dotenv.config();

if (process.env.DNS_SERVER) {
    dns.setServers([process.env.DNS_SERVER]);
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Admin = require("./models/Admin");
const Class = require("./models/Class");

const authRoutes =
    require("./routes/authRoutes");

const classRoutes =
    require("./routes/classRoutes");

const studentRoutes =
    require("./routes/studentRoutes");

const app =
    express();

app.use(cors());

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);

app.get(
    "/",
    (req, res) => {

        res.json({
            success: true,
            message:
                "University Examination Management System API is running"
        });
    }
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/classes",
    classRoutes
);

app.use(
    "/api/students",
    studentRoutes
);

mongoose
    .connect(
        process.env.MONGO_URI
    )
    .then(() => {

        return migrateLegacyClasses();
    })
    .then(() => {

        console.log(
            "MongoDB Connected Successfully"
        );

        app.listen(
            process.env.PORT || 5000,
            () => {

                console.log(
                    `Server running on http://localhost:${process.env.PORT || 5000}`
                );
            }
        );
    })

    .catch(error => {

        console.error(
            "MongoDB Connection Error:",
            error
        );
    });

async function migrateLegacyClasses() {
    const adminEmail = String(process.env.ADMIN_EMAIL || "")
        .trim()
        .toLowerCase();

    if (!adminEmail) {
        return;
    }

    const admin = await Admin.findOne({
        email: adminEmail
    });

    if (!admin) {
        return;
    }

    await Class.updateMany(
        {
            $or: [
                { createdBy: { $exists: false } },
                { createdBy: null }
            ]
        },
        {
            $set: { createdBy: admin._id }
        }
    );
}