import axios from 'axios';
import Noty from 'noty';
import moment from 'moment';

export function initAdmin(socket) {
    const orderTableBody = document.querySelector('#orderTableBody');

    // Function to render order items
    function renderItems(items) {
        const parsedItems = Object.values(items);
        return parsedItems.map((menuItem) => {
            return `
                <p>${menuItem.item.name} - ${menuItem.qty} pcs</p>
            `;
        }).join('');
    }

    // Function to generate markup for orders
    function generateMarkup(orders) {
        return orders.map(order => {
            return `
                <tr class="bg-gray-100">
                    <td class="border px-4 py-2 text-green-900">
                        <p class="font-bold">${order._id}</p>
                        <div>${renderItems(order.items)}</div>
                    </td>
                    <td class="border px-4 py-2">${order.customerId.name}</td>
                    <td class="border px-4 py-2">${order.address}</td>
                    <td class="border px-4 py-2">
                        <div class="inline-block relative">
                            <form action="/admin/order/status" method="POST">
                                <input type="hidden" name="orderId" value="${order._id}">
                                <select name="status" onchange="this.form.submit()" class="block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300">
                                    <option value="order_placed" ${order.status === 'order_placed' ? 'selected' : ''}>Placed</option>
                                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                    <option value="prepared" ${order.status === 'prepared' ? 'selected' : ''}>Prepared</option>
                                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                                </select>
                            </form>
                        </div>
                    </td>
                    <td class="border px-4 py-2">${moment(order.createdAt).format('hh:mm A')}</td>
                </tr>
            `;
        }).join('');
    }

    // Function to update orders table
    function updateOrdersTable(orders) {
        orderTableBody.innerHTML = generateMarkup(orders);
    }

    // Initial fetch of orders from server
    axios.get('/admin/order', {
        headers: {
            "X-Requested-With": 'XMLHttpRequest'
        }
    }).then(res => {
        const orders = res.data;
        updateOrdersTable(orders);

        // Socket connection for real-time updates
    
        socket.on('orderPlaced', (order) => {
            // Show notification
            new Noty({
                type: 'success',
                timeout: 1000,
                text: 'New order',
                progressBar: false
            }).show();

            // Update orders and re-render table
            orders.unshift(order);
            // updateOrdersTable(orders);
            orderTableBody.innerHTML = '';
            orderTableBody.innerHTML = generateMarkup(orders)

        });
    }).catch(err => {
        console.error('Error fetching orders:', err);
    });
}




