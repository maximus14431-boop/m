// Анимация логотипа
const headerTitle = document.querySelector('.logo h1');
if (headerTitle) {
    let h1clickCount = 0;
    const messages = ['дай на пропитание', 'дай на НА что-нибудь', 'дай на ЖИЗНЬ'];
    headerTitle.addEventListener('click', function() {
        const randomIndex = Math.floor(Math.random() * messages.length);
        this.textContent = messages[randomIndex];
        h1clickCount++;
        if (h1clickCount === 500) {
            alert('закрой сайт не мучайся');
            h1clickCount = 0;
        }
    });
}

// Данные для кнопок "Подробнее"
const productDetails = [
    ['dead space', 'для пк', '1000 рублей'],
    ['dead space 2', 'для пк', '1889 рублей'],
    ['dead space 3', 'для пк', '8769 рублей'],
    ['dead space 4', 'для пк', '3000 рублей'],
    ['игра гта', 'для пк', '999 рублей'],
    ['игра дота', 'для пк', '10000000рублей'],
    ['игра майн крафт', 'для пк', '1899 рублей'],
    ['бутерброды', 'для пк', '999 рублей'],
    ['вкуснятина', 'для пк', '10000000 рублей'],
    ['суши', 'для пк', '1889 рублей'],
    ['затрод', 'для пк', '0 рублей'],
    ['нищий', 'для пк', '99999999 рублей'],
];

// Добавляем кнопки "Подробнее"
document.querySelectorAll('.product-card').forEach(function(card, i) {
    const info = card.querySelector('.product-info');
    const footer = card.querySelector('.product-footer');
    if (!info || !footer) return;

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'product-details';
    detailsDiv.style.display = 'none';
    detailsDiv.innerHTML = '<div>' + (productDetails[i] || productDetails[0]).map(item => `<div>${item}</div>`).join('') + '</div>';
    info.insertBefore(detailsDiv, footer);

    const btn = document.createElement('button');
    btn.className = "details-btn";
    btn.textContent = 'Подробнее';
    footer.insertBefore(btn, footer.querySelector('.add-to-cart-btn'));

    let isVisible = false;
    btn.addEventListener('click', function() {
        isVisible = !isVisible;
        detailsDiv.style.display = isVisible ? 'block' : 'none';
        btn.textContent = isVisible ? 'скрыть' : 'подробнее';
    });
});

// Кнопка "Наверх"
const scrollTopBtn = document.createElement('button');
scrollTopBtn.textContent = '↑';
scrollTopBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;border-radius:50%;width:50px;height:50px;background:#8B0000;color:white;border:none;cursor:pointer;display:none;z-index:1000;font-size:30px;transition: all 0.3s;';
document.body.appendChild(scrollTopBtn);
window.addEventListener('scroll', function() {
    scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});
scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Фильтрация товаров
function filterProducts(filterType) {
    const productCards = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    filterButtons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(`'${filterType}'`)) {
            btn.classList.add('active');
        }
    });
    productCards.forEach(function(card) {
        const priceElement = card.querySelector('.price');
        if (!priceElement) return;
        const priceText = priceElement.textContent;
        const price = parseInt(priceText.replace(/\D/g, ''));
        let showproduct = false;
        if (filterType === 'all') showproduct = true;
        else if (filterType === 'low') showproduct = price <= 2000;
        else if (filterType === 'medium') showproduct = price >= 2000 && price < 8000;
        else if (filterType === 'high') showproduct = price > 8000;
        card.style.display = showproduct ? 'flex' : 'none';
    });
}

// Корзина
let cart = [];

function addToCart(productName, price) {
    const item = cart.find(i => i.name === productName);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ name: productName, price, quantity: 1 });
    }
    updateCart();
    alert(`✔ ${productName} добавлен в корзину за ${price} рублей`);
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCart();
}

function changeQuantity(productName, delta) {
    const item = cart.find(item => item.name === productName);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productName);
    } else {
        updateCart();
    }
}

function clearCart() {
    cart = [];
    updateCart();
    alert('Корзина очищена');
}

function checkout() {
    if (!cart.length) {
        alert('корзина пуста!');
        return;
    }
    showOrderModal();  // открываем модальное окно вместо старого alert
}

function updateCart() {
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    if (!itemsEl) return;
    itemsEl.innerHTML = '';
    if (cart.length === 0) {
        itemsEl.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        if (totalEl) totalEl.style.display = 'none';
        if (countEl) countEl.textContent = '0';
        return;
    }
    if (totalEl) totalEl.style.display = 'block';
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="item-name">${item.name}</div>
            <div class="item-price">${item.price} руб.</div>
            <div class="item-quantity">
                <button onclick="changeQuantity('${item.name}', -1)" class="quantity-btn">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity('${item.name}', 1)" class="quantity-btn">+</button>
            </div>
            <div class="item-total">${itemTotal} руб.</div>
            <button onclick="removeFromCart('${item.name}')" class="remove-btn">✖</button>
        `;
        itemsEl.appendChild(row);
    });
    document.getElementById('total-price').textContent = total;
    if (countEl) countEl.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

// Обработчики кнопок "В корзину"
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.product-card');
        if (!card) return;
        const name = card.querySelector('h3')?.textContent;
        const priceEl = card.querySelector('.price');
        if (!name || !priceEl) return;
        const price = parseInt(priceEl.textContent.replace(/\D/g, ''));
        addToCart(name, price);
    });
});
document.getElementById('clear-cart-btn')?.addEventListener('click', clearCart);
document.getElementById('checkout-btn')?.addEventListener('click', checkout);
updateCart();

// Модальное окно
const modal = document.getElementById('order-modal');
const closeModal = document.querySelector('.close-modal');
const cancelOrder = document.getElementById('cancel-order');
const orderForm = document.getElementById('order-form');

function showOrderModal() {
    if (modal) modal.style.display = 'flex';
}
function closeOrderModal() {
    if (modal) {
        modal.style.display = 'none';
        orderForm?.reset();
    }
}
if (closeModal) closeModal.addEventListener('click', closeOrderModal);
if (cancelOrder) cancelOrder.addEventListener('click', closeOrderModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) closeOrderModal();
});

function validateCardNumber(card) {
    const cleaned = card.replace(/\s/g, '');
    return /^\d{16}$/.test(cleaned);
}

if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullname = document.getElementById('fullname').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const deliveryTime = document.getElementById('delivery-time').value;
        const cardNumber = document.getElementById('card-number').value.trim();

        if (!fullname || !phone || !address || !cardNumber) {
            alert('Заполните все обязательные поля!');
            return;
        }
        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 11) {
            alert('Номер телефона должен состоять из 11 цифр!');
            return;
        }
        if (!validateCardNumber(cardNumber)) {
            alert('Номер карты должен состоять из 16 цифр!');
            return;
        }
        const orderData = {
            customer: fullname,
            phone: phoneDigits,
            address,
            deliveryTime: deliveryTime || 'как можно скорее',
            cardLast4: cardNumber.replace(/\s/g, '').slice(-4),
            items: cart.map(i => `${i.name} x${i.quantity} = ${i.price * i.quantity} руб.`).join(', '),
            total: cart.reduce((s, i) => s + i.price * i.quantity, 0)
        };
        console.log('заказ отправлен:', orderData);
        alert(`✅ Заказ оформлен!\n${fullname}, ваш заказ на сумму ${orderData.total} руб. будет доставлен по адресу: ${address}\nС карты ****${orderData.cardLast4} списание прошло успешно.`);
        clearCart();
        closeOrderModal();
    });
}

window.checkout = checkout;