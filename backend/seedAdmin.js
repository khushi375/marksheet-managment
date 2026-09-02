const dns = require("dns");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

if (process.env.DNS_SERVER) {
    dns.setServers([process.env.DNS_SERVER]);
}

const Admin =
    require("./models/Admin");

const EMAIL =
    process.env.ADMIN_EMAIL;

const PASSWORD =
    process.env.ADMIN_PASSWORD;

async function seedAdmin() {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected"
        );

        const hashedPassword =
            await bcrypt.hash(
                PASSWORD,
                12
            );

        const existing =
            await Admin.findOne({
                email: EMAIL
            });

        if (existing) {

            existing.password =
                hashedPassword;

            await existing.save();

            console.log(
                "Admin already existed. Password updated."
            );

        } else {

            await Admin.create({
                email: EMAIL,
                password:
                    hashedPassword,
                name:
                    "University Administrator"
            });

            console.log(
                "Admin created successfully"
            );
        }

        console.log("");
        console.log(
            "Login Email:",
            EMAIL
        );
        console.log(
            "Login Password:",
            PASSWORD
        );

        process.exit(0);

    } catch (error) {

        console.error(
            "Seed Error:",
            error
        );

        process.exit(1);
    }
}

seedAdmin();