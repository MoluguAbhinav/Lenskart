const cds = require('@sap/cds');
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'REPLACE_THIS_WITH_A_STRONG_SECRET';

module.exports = cds.service.impl(async function() {
    const { Users } = this.entities;

    // Signup logic
    this.on('signup', async (req) => {
        console.log(">>> SIGNUP HANDLER CALLED <<<", req.data);
        const { email, password, username, mobilenumber } = req.data;
        if (!email || !password || !username || !mobilenumber)
            return req.reject(400, "All fields required");
        const exists = await SELECT.one.from(Users).where({ email });
        if (exists) return req.reject(400, "Email already exists");
        const hash = await bcrypt.hash(password, 10);
        const id = cds.utils.uuid();
        await INSERT.into(Users).entries({
            ID: id,
            email,
            password: hash,
            username,
            mobilenumber,
            createdAt: new Date()
        });
        return { success: true };
    });

    // Login logic
    this.on('login', async (req) => {
        console.log(">>> LOGIN HANDLER CALLED <<<", req.data);
        const { email, password } = req.data;
        if (!email || !password)
            return req.reject(400, "All fields required");
        const user = await SELECT.one.from(Users).where({ email });
        if (!user) return req.reject(400, "Invalid credentials");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return req.reject(400, "Invalid credentials");
        // Generate a fake JWT for demo (replace with real JWT in production)
        const token = Buffer.from(`${email}:${JWT_SECRET}`).toString('base64');
        return { token, username: user.username };
    });
});