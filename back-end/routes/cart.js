const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const { requireAuth } = require('../middleware');

router.get('/', requireAuth('pwa'), async (req, res) => {
    try {
        const listCart = await Cart.find({}).populate('field');
        const totalCart = await Cart.countDocuments({});
        const metadata = {
            count: totalCart,
        };

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'OK',
            data: {
                items: listCart,
                metadata,
            },
        });
    } catch {
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to get list cart',
        });
    }
})

router.post('/add', requireAuth('pwa'), async (req, res) => {
    try {
        const {
            user,
            field,
            timeSlots,
            orderDate
        } = req.body;

        const cartId = `${user}-${field}-${orderDate}-${timeSlots}`

        const existing = await Cart.findOne({ cartId });

        if (existing) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Cart item already exists',
                data: null,
            });
        } else {
            const data = await Cart.create({
                ...req.body,
                cartId,
            });

            return res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data,
            });
        }
    } catch {
        return res.status(500).json({
            code: 500,
            message: 'Failed to add item into cart',
            success: false,
        });
    }
})

router.patch('/:cartId/edit', requireAuth('pwa'), async (req, res) => {
    try {
        const cart = await Cart.findOne({ cartId: req.params.cartId });

        if (cart !== null) {
            const {
                user,
                field,
                timeSlots,
                orderDate
            } = req.body;

            const newCartId = `${user}-${field}-${orderDate}-${timeSlots}`

            const findCart = await Cart.findOne({ cartId: newCartId });

            if (findCart !== null) {
                return res.status(400).json({
                    code: 400,
                    message: 'This cart item already exists',
                    success: false,
                    data: null,
                });
            }

            cart.set({
                ...req.body,
                cartId: newCartId,
            });

            const data = await cart.save();

            return res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data,
            });
        } else {
            return res.status(404).json({
                code: 404,
                message: 'Not found',
                success: false,
                data: null,
            });
        }
    } catch (err) {
        return res.status(500).json({
            code: 500,
            message: 'Failed to edit cart item',
            success: false,
        });
    }
})

router.delete('/:cartId', requireAuth('pwa'), async (req, res) => {
    try {
        const cart = await Cart.findOne({ cartId: req.params.cartId });

        if (cart !== null) {
            await Cart.deleteOne({ _id: cart._id });

            return res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data: null,
            });
        } else {
            return res.status(404).json({
                code: 404,
                message: 'Not found',
                success: false,
                data: null,
            });
        }
    } catch {
        return res.status(500).json({
            code: 500,
            message: 'Failed to delete cart item',
            success: false,
        });
    }
})

module.exports = router;
