import query from '../config/db.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import hashPassword from '../utils/hashPassword.js';
import matchPassword from '../utils/matchPasswords.js';
import validatePassword from '../utils/validatePassword.js';
import validateEmail from '../utils/validateEmail.js';

const userControllers = {
    getRegisterForm: (req, res) => {
        res.status(200).render('get-register-form');
    },
    register: async (req, res) => {
        const { email, password, rePassword } = req.body;

        const sqlStr = `SELECT * FROM users WHERE email=?`;
        const params = [email];

        const result = await query(sqlStr, params);
        //check if email exists
        if (result.length > 0) {
            return res.status(400).render('404', {
                title: 'User already exists',
                message: 'User already exists. Please login'
            });
        }
        //validate email and password and check if passwords matches
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const doPasswordsMatch = matchPassword(password, rePassword);

        if (isEmailValid && isPasswordValid && doPasswordsMatch) {
            //hash password
            const hashedPassword = hashPassword(password);

            //create user
            const sqlStr = `INSERT INTO users (email, password) VALUES (?, ?)`;
            const params = [email, hashedPassword];

            const result = await query(sqlStr, params);

            if (result.affectedRows > 0) {
                res.status(302).redirect('/api/login');
            } else {
                res.status(400).render('404', {
                    title: 'Error',
                    message: 'Invalid email or password'
                });
            }
        } else {
            res.status(400).render('404', {
                title: `Invalid email or password`,
                message: `Invalid email or password`
            });
        }
    },
    getLoginForm: (req, res) => {
        res.status(200).render('get-login-form');
    },
    login: async (req, res) => {
        const { email, password } = req.body;

        //check if the email exists
        const sqlStr = `SELECT * FROM users WHERE email=?`;
        const params = [email];

        const result = await query(sqlStr, params);

        if (result.length === 0) {
            return res.status(400).render('404', {
                title: 'Email not found',
                message: 'Email not found. Please register'
            });
        }

        //check if the password is correct
        bcrypt.compare(password, result[0].password, (err, isValid) => {
            if (err) {
                console.error(err);
                throw err;
            }
            if (!isValid) {
                return res.status(400).render('404', {
                    title: 'Email or password incorrect',
                    message: 'Email or password incorrect'
                });
            }
            //create token
            const token = jwt.sign({ email }, process.env.TOKEN_SECRET);
            //set cookie
            if (token) {
                res.cookie('token', token, { httpOnly: true });
                res.status(302).redirect('/api/books');
            }
        });
    },
    logout: (req, res) => {
        res.clearCookie('token');
        res.status(302).redirect('/api/books');
    }
};

export default userControllers;
