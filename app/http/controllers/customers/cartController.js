function cartController() {
    return {
        index(req, res) {
            res.render('customers/cart');
        },

        update(req, res) {
            // Initialize or retrieve the cart from session
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                };
            }

            const cart = req.session.cart;
            const { _id, price } = req.body; // Extract item ID and price from request body

            // Check if item already exists in cart
            if (!cart.items[_id]) {
                // Add new item to cart
                cart.items[_id] = {
                    item: req.body,
                    qty: 1
                };
            } else {
                // Increment quantity for existing item in cart
                cart.items[_id].qty += 1;
            }

            // Update totalQty
            cart.totalQty += 1;

            // Calculate totalPrice based on updated cart items
            cart.totalPrice = Object.values(cart.items).reduce((total, item) => {
                return total + (item.qty * item.item.price);
            }, 0);

            // Return updated cart information as JSON response
            return res.json({
                totalQty: cart.totalQty,
                totalPrice: cart.totalPrice
            });
        }
    };
}

module.exports = cartController;  

