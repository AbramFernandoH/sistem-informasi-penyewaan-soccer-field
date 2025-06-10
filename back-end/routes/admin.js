require('dotenv').config();
const ExcelJS = require("exceljs");
const express = require('express');
const router = express.Router();
const { DateTime } = require('luxon');
const AdminUser = require('../model/admin');
const { isLoggedIn, isAdmin } = require('../middleware');

router.route('/')
    .get(async (req, res) => {
        try {
            const { skip } = req.query
            const currentSkip = skip ? Number(skip) : 0
            const listUser = await AdminUser.find({}).limit(10).skip(currentSkip);
            const totalUser = await AdminUser.countDocuments({});
            const metadata = {
                limit: 10,
                skip: currentSkip,
                count: totalUser,
            };

            return res.json({
                code: 200,
                success: true,
                message: 'OK',
                data: {
                    items: listUser,
                    metadata,
                },
            });
        } catch {
            return res.json({
                code: 500,
                success: false,
                message: 'Failed to get list user',
            });
        }
    })

router.route('/export')
    .post(isLoggedIn, isAdmin, async (req, res) => {
        try {
            const query = {
                admin: false
            }

            // Fetch User data
            const listUser = await AdminUser.find(query);

            // Create a new workbook
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Warga');

            // Define worksheet headers
            worksheet.columns = [
                { header: "NIK", key: "IDNumber", width: 30 },
                { header: "Nama KK", key: "headOfFamilyName", width: 30 },
                { header: "Username", key: "username", width: 20 },
                { header: "Alamat", key: "address", width: 25 },
            ];

            // Add data to the worksheet
            listUser.forEach(user => {
                worksheet.addRow({
                    IDNumber: String(AdminUser.IDNumber),
                    headOfFamilyName: AdminUser.headOfFamilyName,
                    username: AdminUser.username,
                    address: AdminUser.address,
                });
            });

            // Set up the response headers 
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", `attachment; filename=list-warga-${DateTime.now().toUnixInteger()}.xlsx`);

            // Write the workbook to the response object 
            await workbook.xlsx.write(res);
            await res.end();

            res.redirect('/user');
        } catch (error) {
            console.error('Error exporting list user to Excel:', error);
        }
    })

router.route('/add')
    .post(isLoggedIn, isAdmin, async (req, res) => {
        try {
            const { password } = req.body
            const user = new AdminUser(req.body);
            const data = await AdminUser.register(user, password);

            res.json({
                code: 200,
                message: 'OK',
                success: true,
                data,
            });
        } catch {
            res.json({
                code: 500,
                message: 'Failed to create admin user',
                success: false,
            });
        }

    })

router.route('/edit/:userId')
    .get(isLoggedIn, isAdmin, async (req, res) => {
        const editedUser = await AdminUser.findById(req.params.userId)
        res.render('user/edit-user', { headTitle: 'Ubah Warga', editedUser });
    })
    .patch(isLoggedIn, isAdmin, async (req, res) => {
        try {
            const editedUser = await AdminUser.findById(req.params.userId);
            const { password, ...rest } = req.body;

            if (password.length > 0) {
                await editedUser.setPassword(password);
                await editedUser.save();
            }

            await AdminUser.updateOne({ _id: req.params.userId }, rest);
            res.redirect('/user');
        } catch (e) {
            res.redirect('/user');
        }
    })

router.route('/delete/:userId')
    .delete(isLoggedIn, isAdmin, async (req, res) => {
        try {
            await AdminUser.deleteOne({ _id: req.params.userId });
            res.redirect('/user');
        } catch (e) {
            res.redirect('/user');
        }
    })

module.exports = router;

