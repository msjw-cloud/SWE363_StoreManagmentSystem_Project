const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Task = require('../models/Task');
const Return = require('../models/Return');

router.get('/dashboard', auth, async (req, res, next) => {
    try {
        // Get today's date and start of current month
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const [
            totalOrders,
            monthlyOrders,
            totalProducts,
            lowStockProducts,
            pendingTasks,
            pendingReturns
        ] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
            Product.countDocuments(),
            Product.countDocuments({ items: { $lt: 10 } }),
            Task.countDocuments({ status: 'pending' }),
            Return.countDocuments({ status: 'Pending' })
        ]);

        // Get revenue statistics
        const revenueStats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$price' },
                    monthlyRevenue: {
                        $sum: {
                            $cond: [
                                { $gte: ['$createdAt', startOfMonth] },
                                '$price',
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        res.json({
            orders: {
                total: totalOrders,
                monthly: monthlyOrders
            },
            products: {
                total: totalProducts,
                lowStock: lowStockProducts
            },
            tasks: {
                pending: pendingTasks
            },
            returns: {
                pending: pendingReturns
            },
            revenue: {
                total: revenueStats[0]?.totalRevenue || 0,
                monthly: revenueStats[0]?.monthlyRevenue || 0
            }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;