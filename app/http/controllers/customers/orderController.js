const Order = require('../../../models/order');
const moment = require('moment');

function orderController() {
    return {
        // Method to store a new order
        async store(req, res) {
            // Validate request parameters
            const { phone, address } = req.body;
            if (!phone || !address) {
                req.flash('error', 'All fields are required');
                return res.redirect('/cart');
            }

            try {
                // Create a new order instance
                const order = new Order({
                    customerId: req.user._id,
                    items: req.session.cart.items,
                    phone,
                    address
                });

                // Save the order to the database
                const result = await order.save();

                // Populate the 'customerId' field of the saved order
                await Order.populate(result, { path: 'customerId' });

                // Clear the cart after successful order placement
                delete req.session.cart;

                // Emit event
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit('orderPlaced', result);

                // Flash success message
                req.flash('success', 'Order placed successfully');

                // Redirect to customer orders page
                return res.redirect('/customer/orders'); 
            } catch (err) {
                console.error('Error saving order:', err);
                req.flash('error', 'Something went wrong');
                return res.redirect('/cart');
            }
        },

        // Method to fetch and render all orders for the current user
        async index(req, res) {
            try {
                const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
                res.render('customers/orders', { orders, moment });
            } catch (err) {
                console.error('Error fetching orders:', err);
                req.flash('error', 'Something went wrong');
                return res.redirect('/');
            }
        },

        // Method to fetch and render details of a specific order
        async show(req, res) {
            try {
                const order = await Order.findById(req.params.id);

                // Check if order was found
                if (!order) {
                    req.flash('error', 'Order not found');
                    return res.redirect('/');
                }

                // Authorize user by checking if the order belongs to the current user
                if (req.user && req.user._id.toString() === order.customerId.toString()) {
                    return res.render('customers/singleOrder', { order });
                } else {
                    req.flash('error', 'Unauthorized access');
                    return res.redirect('/');
                }
            } catch (err) {
                console.error('Error fetching order:', err);
                req.flash('error', 'Something went wrong');
                return res.redirect('/');
            }
        }
    };
}

module.exports = orderController;
