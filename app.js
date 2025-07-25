const listProductHTML = document.querySelector('.listProduct');
const listCartHTML = document.querySelector('.listCart');
const iconCart = document.querySelector('.icon-cart');
const iconCartSpan = document.querySelector('.icon-cart span');
const body = document.querySelector('body');
const closeCart = document.querySelector('.close');

let products = [];
let cart = [];


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})



// 初始化應用程式
const initApp = () => {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data.categories;
        addDataToHTML();

        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    });
};

// 將商品動態加入到 HTML
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';

    products.forEach((category, index) => {
        // 建立分類區塊
        const categorySection = document.createElement('div');
        categorySection.classList.add('category-section');
        
        // 自動設定分類區塊的 ID
        categorySection.id = `category-${index + 1}`;

        categorySection.innerHTML = `<h2>${category.name}</h2>`;
        
        const productList = document.createElement('div');
        productList.classList.add('product-list');

        category.products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h3>${product.name}</h3>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
            productList.appendChild(newProduct);
        });

        categorySection.appendChild(productList);
        listProductHTML.appendChild(categorySection);
    });
};


// 點擊加入購物車
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});

// 其他邏輯（購物車功能）保持不變

initApp();


// 從所有分類中尋找商品
const getProductById = (product_id) => {
    for (let category of products) {
        for (let product of category.products) {
            if (product.id == product_id) {
                return product;
            }
        }
    }
    return null;
};



const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
};

// 更新購物車顯示
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;

    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            // 使用新函數尋找商品
            let info = getProductById(item.product_id);
            if (!info) return; // 如果商品不存在，跳過

            totalPrice += info.price * item.quantity;

            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">${info.name}</div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
            listCartHTML.appendChild(newItem);
        });
    }
    iconCartSpan.innerText = totalQuantity;
};

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1;
                break;
            case 'minus':
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
};


document.addEventListener('DOMContentLoaded', function() {
    const listItems = document.querySelectorAll('.list-group li');
    
    listItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // 目標 ID 是 "category-1", "category-2", ...
            const targetId = `category-${index + 1}`;
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});


const clearCart = () => {
  cart = [];
  localStorage.removeItem('cart');
  listCartHTML.innerHTML = '';
  iconCartSpan.innerText = '0';
};