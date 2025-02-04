// const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { Pegawai } = require("../models");

const form = (req, res) => {
    return res.render("loginPage", { errorMessages: [] });
    // res.json({ message: "This is login" });
};

const cekLogin = async (req, res) => {
    const { nip, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.render("loginPage", { errorMessages });
        // res.json({ errorMessages });
    }

    try {
        const user = await Pegawai.findOne({ where: { nip } });
        if (!user) {
            return res.render("loginPage", { errorMessages: ["Email atau password tidak valid"] });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.render("loginPage", { errorMessages: ["Email atau password tidak valid"] });
        }

        const token = jwt.sign(
            { id: user.id, nip: user.nip, role: user.role },
            "secretsecret",
            { expiresIn: 86400 }
        );

        res.cookie("token", token, { httpOnly: true });

        
        if (user.role == "user") {
            return res.redirect("/");
        } else if (user.role == "tu") {
            return res.redirect("/tu/dashboard");
        } else if (user.role == "admin") {
            return res.redirect("/admin/dashboard");
        }

        res.status(200).send({ auth: true, token: token });
    } catch (err) {
        // console.error("Error during login: ", err);
        // res.status(500).json({ message: "Internal server error" });
        return res.render("loginPage", { errorMessages: ["Internal server error"] });
    }
};

function logout(req, res) {
    res.clearCookie("token");
    res.redirect("/auth/login");
}

const ubahPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password saat ini salah" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await user.update({ password: hashedNewPassword });

        return res.status(200).json({ message: "Password berhasil diubah" });
    } catch (error) {
        console.log("Error during password change:", error);
        return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

const daftar = async (req, res) => { 
    try {
    console.log(req.body);
    const { name, nip, password, hp } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        name : name,
        nip: nip,
        password: hashedPassword,
        hp:hp, 
    });
    res.status(200).json({ message: 'Data berhasil disimpan', data: newUser });
    } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error });
    }
};

module.exports = {
    form,
    cekLogin,
    logout,
    ubahPassword,
    daftar,
};
