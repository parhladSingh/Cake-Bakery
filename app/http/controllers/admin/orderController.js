const order = require('../../../models/order');

function orderController() {
    return {
        index(req, res) {
            order.find({ status: { $ne: 'completed' } })
                .sort({ 'createdAt': -1 })
                .populate('customerId', '-password')
                .exec()
                .then(orders => {
                    if (req.xhr) {
                        res.json(orders);
                    } else {
                        // res.render('admin/orders', { orders });
                        res.render('admin/order', { orders }, (err, html) => {
                            if (err) {
                                console.error('Error rendering admin/orders:', err);
                                res.status(500).send('Internal Server Error');
                            } else {
                                res.send(html);
                            }
                        });
                        
                    }
                })
                .catch(err => {
                    console.error('Error fetching orders:', err);
                    res.status(500).send('Internal Server Error');
                });
        }
    };
}

module.exports = orderController;

