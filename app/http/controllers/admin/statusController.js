const Order = require('../../../models/order');

function statusController() {
    return {
        update(req, res) {
            const { orderId, status } = req.body;

            Order.updateOne({ _id: orderId }, { status: status })
                .then(result => {
                    if (result.nModified > 0) {
                        req.flash('success', 'Order status updated successfully');
                    } else {
                        req.flash('error', 'Order not found or status not updated');
                    }
                    //Emit event
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderUpdated',{id:req.body.orderId, status:req.body.status})
                    res.redirect('/admin/order');
                })
                .catch(err => {
                    console.error('Error updating order status:', err);
                    req.flash('error', 'Failed to update order status');
                    res.redirect('/admin/order');
                });
        }
    };
}

module.exports = statusController;
