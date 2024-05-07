import axios from 'axios'
import Noty from 'noty'
import cartController from '../../app/http/controllers/customers/cartController'

// Using require syntax
const { initAdmin } = require('./admin');
import moment from 'moment'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')


function updateCart(cake){
    axios.post('/update-cart',cake).then(res=>{
        
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout:1000,
            text:'Item added to cart',
            progressBar:false
            // layout:'topLeft'                             // we can also change the position msg by use of layout
        }).show()
    }).catch(err=>{
        new Noty({
            type: 'error',
            timeout:1000,
            text:'Something went wrong',
            progressBar:false
            // layout:'topLeft'                             // we can also change the position msg by use of layout
        }).show()

    })

}

addToCart.forEach((btn) => {
    btn.addEventListener('click',(e)=> {
        

        let cake = JSON.parse(btn.dataset.cake);                    //setting the data-attribute& converting into the object
        let logoutButton = document.querySelector('#logout'); // Check if logout button exists
        if (logoutButton) {
          updateCart(cake);
        } else {
          window.location.href = "/login"
        }

    })

})

//Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}

 

//change orderStatus

let statuses=  document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
 order   =   JSON.parse(order)

let time = document.createElement('small')


function updateStatus(order){
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status)=>{
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')

        }
        if(dataProp === order.status){
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')

            }
           
        }


    })

}

updateStatus(order);

//Socket
let socket = io()

// join

if(order){
    socket.emit('join',`order_${order._id}`)
}

let adminAreaPath = window.location.pathname
// console.log(adminAreaPath)
if(adminAreaPath.includes('admin'))
    initAdmin(socket)

    socket.emit('join', 'adminRoom')

//listening the client

socket.on('orderUpdated',(data)=>{
    const updatedOrder = {...order}                        //copying the order
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout:1000,
        text:'Order updated',
        progressBar:false
                                 // we can also change the position msg by use of layout
    }).show()
   
})