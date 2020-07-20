// add to cart
function addToCart (index) {
    let product = {...products[index]}, cartIndex

    // check if product out of stock
    if (products[index].stock === 0) {
        alert('Product is out of stock.')
        return
    }

    // add input quantity
    const quantity = parseInt(prompt('How much you want to buy?', 1))
    if (quantity > products[index].stock) {
        alert('Product is out of stock.')
        return
    }

    // check if product already exist in cart
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === product.name) { // product already exits
            cartIndex = i
        }
    }

    // add to cart database
    if (cartIndex !== undefined) {
        cart[cartIndex].quantity += quantity
        cart[cartIndex].total = cart[cartIndex].quantity * product.price
    } else {
        product.quantity = quantity
        product.total = quantity * product.price
        delete product.stock
        cart.push(product)
    }
    
    // decrease product stock
    products[index].stock -= quantity // products[index].stock = products[index].stock - quantity

    // show cart
    showCart(cart)
    showProduct(products)
    document.getElementById('total-cart').innerHTML = `Total : ${totalPaymentCount()}`

    // enable check out button
    document.getElementById('button-check-out').disabled = false
}

// show user cart
function showCart (data) {
    let tbody = document.getElementsByTagName('table')[1].tBodies[0]

    // do iteration
    let result = []
    for (let i = 0; i < data.length; i++) {
        let tr = `<tr><td>${i+1}</td>`
        for (let key in data[i]) {
            if (key === 'image') {
                tr += `<td><img src="${data[i][key]}" alt="product-image" width="50px"/></td>`
            } else if (key === 'price') {
                null
            } else {
                tr += `<td>${data[i][key]}</td>`
            }
        }
        tr += `<td><button type="button" name="button-delete-cart" onclick="deleteCart(${i})">Delete ❌</button></td></tr>`
        result.push(tr)
    }

    // show to DOM
    tbody.innerHTML = result.join('')
}

// delete cart item
function deleteCart (index) {
    // index of products
    let indexOfProduct = findIndexOf(cart[index].name)

    // check quantity
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1
        cart[index].total = cart[index].quantity * cart[index].price
    } else {
        // delete cart from cart database
        cart.splice(index, 1)
    }

    // restore product's stock
    products[indexOfProduct].stock++

    // show an updated cart
    showCart(cart)
    showProduct(products)
    document.getElementById('total-cart').innerHTML = `Total : ${totalPaymentCount()}`

    // check button
    document.getElementById('button-check-out').disabled = cart.length === 0 ? true : false
}

// check out
function checkOut () {
    // transaction receipt
    let receipt = document.getElementById('transaction-receipt'), result = ''
    for (let i = 0; i < cart.length; i++) {
        result += `${i+1}. ${cart[i].name} => ${cart[i].quantity} x ${cart[i].price} = ${cart[i].total}<br>`
        // totalPayment += cart[i].total
    }

    // show result
    result += '----------------------------------<br>'
    result += `Total payment = ${totalPaymentCount()}`

    // show receipt
    receipt.innerHTML = result

    // check button
    document.getElementById('button-pay').disabled = false
    let deleteCart = document.getElementsByName('button-delete-cart')
    let addToCart = document.getElementsByName('button-add-to-cart')
    for (let element of deleteCart) {
        element.disabled = true
    }
    for (let element of addToCart) {
        element.disabled = true
    }
}

// user payment
function pay () {
    // get user money
    let userMoney = parseInt(document.getElementById('user-money').value)

    // check input
    if (isNaN(userMoney)) {
        alert('Sorry, input wrong.')
        return
    }

    // check user payment
    let finalOutput = document.getElementById('final-output'),
    totalPayment = totalPaymentCount()
    if (userMoney < totalPayment) {
        alert('Sorry 😭, Not Enough Money.')
        return
    } else if (userMoney > totalPayment) {
        finalOutput.innerHTML = `Thank you 🙏. <br> Your refund = ${userMoney - totalPayment}`
    } else {
        finalOutput.innerHTML = 'Tha nk you 🙏.'
    }

    // save purchase history
    histories.push(new History(document.getElementById('title').textContent.split(' ')[1], new Date().toLocaleString(), totalPayment))

    // show buy again button
    document.getElementById('button-buy-again').hidden = false
}

// buy again ?
function buyAgain () {
    // ask user confirmation
    let confirmation = confirm('Do you want to buy again ?')
    if (confirmation === true) {
        // totalPayment = 0
        document.getElementById('final-output').innerHTML = ''
        document.getElementById('transaction-receipt').innerHTML = ''
        document.getElementById('total-cart').innerHTML = 'Total : '
        document.getElementById('user-money').value = ''
        document.getElementById('button-check-out').disabled = true
        document.getElementById('button-pay').disabled = true
        document.getElementById('button-buy-again').hidden = true
        
        // delete all item inside user cart
        cart = []

        // reset button
        let deleteCart = document.getElementsByName('button-delete-cart')
        let addToCart = document.getElementsByName('button-add-to-cart')
        for (let element of deleteCart) {
            element.disabled = false
        }
        for (let element of addToCart) {
            element.disabled = false
        }

        // show an updated cart
        showCart(cart)
    }
}

// total payment
function totalPaymentCount () {
    let totalPayment = 0
    for (let i = 0; i < cart.length; i++) {
        totalPayment += cart[i].total
    }

    return totalPayment
}