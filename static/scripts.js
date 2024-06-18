// document.addEventListener('DOMContentLoaded', () => {
//     const productList = document.getElementById('product-list');
//     const cartContents = document.getElementById('cart-contents');
//     const categoryFilter = document.getElementById('category-filter');
//     const regionFilter = document.getElementById('region-filter');
//     const filterButton = document.getElementById('filter-button');
//     const minPriceInput = document.getElementById('min-price');
//     const maxPriceInput = document.getElementById('max-price');

//     const apiBaseUrl = 'http://127.0.0.1:8000/api';

//     // Fetch and display products
//     const fetchProducts = (filters = {}) => {
//         let url = `${apiBaseUrl}/products/`;
//         const params = new URLSearchParams(filters).toString();
//         if (params) {
//             url += `?${params}`;
//         }

//         fetch(url)
//             .then(response => response.json())
//             .then(products => {
//                 productList.innerHTML = '';
//                 if (products.length === 0) {
//                     productList.innerHTML = '<p>No products found.</p>';
//                     return;
//                 }
//                 products.forEach(product => {
//                     const productDiv = document.createElement('div');
//                     productDiv.classList.add('product');
//                     productDiv.innerHTML = `
//                         <h3>${product.name}</h3>
//                         <p>${product.description}</p>
//                         <p>Price: $${product.price}</p>
//                         <p>Stock: ${product.stock_quantity}</p>
//                         <button onclick="addToCart(${product.id})">Add to Cart</button>
//                     `;
//                     productList.appendChild(productDiv);
//                 });
//             })
//             .catch(error => {
//                 console.error('Error fetching products:', error);
//                 productList.innerHTML = '<p>Error loading products.</p>';
//             });
//     };

//     // Fetch and populate category and region filters
//     const fetchCategoriesAndRegions = () => {
//         fetch(`${apiBaseUrl}/categories/`)
//             .then(response => response.json())
//             .then(categories => {
//                 categories.forEach(category => {
//                     const option = document.createElement('option');
//                     option.value = category.id;
//                     option.textContent = category.name;
//                     categoryFilter.appendChild(option);
//                 });
//             })
//             .catch(error => console.error('Error fetching categories:', error));

//         fetch(`${apiBaseUrl}/regions/`)
//             .then(response => response.json())
//             .then(regions => {
//                 regions.forEach(region => {
//                     const option = document.createElement('option');
//                     option.value = region.id;
//                     option.textContent = region.name;
//                     regionFilter.appendChild(option);
//                 });
//             })
//             .catch(error => console.error('Error fetching regions:', error));
//     };

//     // Add product to cart
//     function addToCart(id){
//         const productId = id;
//         fetch(`${apiBaseUrl}/cart/`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ product: productId })    
//         })
//             .then(response => response.json())
//             .then(cartItem => {
//                 alert('Product added to cart');
//                 fetchCartContents();
//             })
//             .catch(error => console.error('Error adding to cart:', error));

//     }
//     // const addToCart = (productId) => {
//     //     alert("before fetch")
//     //     fetch(`${apiBaseUrl}/cart/`, {
//     //         method: 'POST',
//     //         headers: {
//     //             'Content-Type': 'application/json',
//     //         },
//     //         body: JSON.stringify({ product: productId, quantity: 1 }) 
//     //     })
//     //         .then(response => response.json())
//     //         .then(cartItem => {
//     //             alert(" fetch")

//     //             alert('Product added to cart');
//     //             fetchCartContents();
//     //         })
//     //         .catch(error => console.error('Error adding to cart:', error));
//     // };

//     // Fetch and display cart contents
//     const fetchCartContents = () => {
//         fetch(`${apiBaseUrl}/cart/`)
//             .then(response => response.json())
//             .then(cartItems => {
//                 cartContents.innerHTML = '';
//                 if (cartItems.length === 0) {
//                     cartContents.innerHTML = '<p>Your cart is empty.</p>';
//                     return;
//                 }
//                 cartItems.forEach(item => {
//                     const cartItemDiv = document.createElement('div');
//                     cartItemDiv.classList.add('cart-item');
//                     cartItemDiv.innerHTML = `
//                         <p>${item.product.name} (Quantity: ${item.quantity})</p>
//                     `;
//                     cartContents.appendChild(cartItemDiv);
//                 });
//             })
//             .catch(error => {
//                 console.error('Error fetching cart contents:', error);
//                 cartContents.innerHTML = '<p>Error loading cart contents.</p>';
//             });
//     };

//     filterButton.addEventListener('click', () => {
//         const filters = {
//             category_id: categoryFilter.value,
//             region_id: regionFilter.value,
//             min_price: minPriceInput.value,
//             max_price: maxPriceInput.value
//         };
//         fetchProducts(filters);
//     });

//     window.addToCart = addToCart;

//     fetchProducts();
//     fetchCategoriesAndRegions();
//     fetchCartContents();
// });


document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartContents = document.getElementById('cart-contents');
    const categoryFilter = document.getElementById('category-filter');
    const regionFilter = document.getElementById('region-filter');
    const filterButton = document.getElementById('filter-button');
    const refreshButton = document.getElementById('refresh-button');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');

    const apiBaseUrl = 'http://127.0.0.1:8000/api';

    // Function to get the CSRF token from the cookies
    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    const csrfToken = getCookie('csrftoken');

    // Fetch and display products
    const fetchProducts = (filters = {}) => {
        let url = `${apiBaseUrl}/products/`;
        const params = new URLSearchParams(filters).toString();
        if (params) {
            url += `?${params}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(products => {
                productList.innerHTML = '';
                if (products.length === 0) {
                    productList.innerHTML = '<p>No products found.</p>';
                    return;
                }
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');
                    productDiv.innerHTML = `
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                        <p>Stock: ${product.stock_quantity}</p>
                        <button onclick="addToCart(${product.id})">Add to Cart</button>
                    `;
                    productList.appendChild(productDiv);
                });
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                productList.innerHTML = '<p>Error loading products.</p>';
            });
    };

    // Fetch and populate category and region filters
    const fetchCategoriesAndRegions = () => {
        fetch(`${apiBaseUrl}/categories/`)
            .then(response => response.json())
            .then(categories => {
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categoryFilter.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching categories:', error));

        fetch(`${apiBaseUrl}/regions/`)
            .then(response => response.json())
            .then(regions => {
                regions.forEach(region => {
                    const option = document.createElement('option');
                    option.value = region.id;
                    option.textContent = region.name;
                    regionFilter.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching regions:', error));
    };

    // Add product to cart
    const addToCart = (productId) => {
        fetch(`${apiBaseUrl}/cart/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(cartItem => {
                alert('Product added to cart');
                fetchCartContents();
            })
            .catch(error => console.error('Error adding to cart:', error));
    };

    // Fetch and display cart contents
    const fetchCartContents = () => {
        fetch(`${apiBaseUrl}/cart/`)
            .then(response => response.json())
            .then(cartItems => {
                cartContents.innerHTML = '';
                if (cartItems.length === 0) {
                    cartContents.innerHTML = '<p>Your cart is empty.</p>';
                    return;
                }
                cartItems.forEach(item => {
                    const cartItemDiv = document.createElement('div');
                    cartItemDiv.classList.add('cart-item');
                    cartItemDiv.innerHTML = `
                        <p>${item.product.name} (Quantity: ${item.quantity})</p>
                        <button onclick="removeFromCart(${item.id})">Remove</button>
                    `;
                    cartContents.appendChild(cartItemDiv);
                });
            })
            .catch(error => {
                console.error('Error fetching cart contents:', error);
                cartContents.innerHTML = '<p>Error loading cart contents.</p>';
            });
    };

    // Remove product from cart
    const removeFromCart = (cartItemId) => {
        fetch(`${apiBaseUrl}/cart/${cartItemId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrfToken,
            }
        })
            .then(() => {
                alert('Product removed from cart');
                fetchCartContents();
            })
            .catch(error => console.error('Error removing from cart:', error));
    };

    filterButton.addEventListener('click', () => {
        const filters = {
            category_id: categoryFilter.value,
            region_id: regionFilter.value,
            min_price: minPriceInput.value,
            max_price: maxPriceInput.value
        };
        fetchProducts(filters);
    });

    refreshButton.addEventListener('click', () => {
        location.reload(); // Refresh the page
    });

    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;

    fetchProducts();
    fetchCategoriesAndRegions();
    fetchCartContents();
});
