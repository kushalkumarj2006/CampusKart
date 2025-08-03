// Global state
let currentView = 'home';
let cart = [];
let printSettings = {
    color: false,
    doubleSided: false,
    copies: 1,
    pages: 0
};
let uploadedFile = null;

// Products data
const products = [
    { id: 1, name: 'Notebook', price: 25, emoji: '📓' },
    { id: 2, name: 'Pen (Blue)', price: 10, emoji: '🖊️' },
    { id: 3, name: 'Pen (Black)', price: 10, emoji: '✒️' },
    { id: 4, name: 'Pencil', price: 5, emoji: '✏️' },
    { id: 5, name: 'Eraser', price: 3, emoji: '🧽' },
    { id: 6, name: 'Ruler', price: 15, emoji: '📏' },
    { id: 7, name: 'Highlighter', price: 20, emoji: '🖍️' },
    { id: 8, name: 'Stapler', price: 45, emoji: '📎' },
    { id: 9, name: 'Glue Stick', price: 12, emoji: '🏷️' },
    { id: 10, name: 'Paper (A4)', price: 30, emoji: '📄' },
    { id: 11, name: 'Folder', price: 18, emoji: '📁' },
    { id: 12, name: 'Calculator', price: 150, emoji: '🧮' }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('CampusKart app initializing...');
    try {
        loadProducts();
        console.log('Products loaded successfully');
        updateCartDisplay();
        console.log('Cart display updated');
        showView('home');
        console.log('Home view shown');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Navigation functions
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

function showView(viewName) {
    // Hide all views
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.style.display = 'none');
    
    // Show selected view
    const selectedView = document.getElementById(viewName);
    if (selectedView) {
        selectedView.style.display = 'block';
    }
    
    // Update navigation states
    updateNavigation(viewName);
    
    // Close mobile menu
    const menu = document.getElementById('mobileMenu');
    menu.classList.remove('active');
    
    currentView = viewName;
}

function updateNavigation(activeView) {
    // Update desktop navigation
    const desktopNavItems = document.querySelectorAll('.nav-btn');
    desktopNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === activeView) {
            item.classList.add('active');
        }
    });
    
    // Update mobile navigation
    const mobileNavItems = document.querySelectorAll('.nav-item');
    mobileNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === activeView) {
            item.classList.add('active');
        }
    });
    
    // Update bottom navigation
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    bottomNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === activeView) {
            item.classList.add('active');
        }
    });
}

// Print Service functions
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        uploadedFile = file;
        
        // Simulate page counting (in real app, this would analyze the file)
        const pages = Math.floor(Math.random() * 10) + 1;
        printSettings.pages = pages;
        
        // Show file preview
        document.getElementById('filePreview').style.display = 'block';
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('pageCount').textContent = pages;
        
        updatePrintPrice();
        document.getElementById('paymentBtn').disabled = false;
    }
}

function removeFile() {
    uploadedFile = null;
    printSettings.pages = 0;
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('fileInput').value = '';
    document.getElementById('pageCount').textContent = '0';
    updatePrintPrice();
    document.getElementById('paymentBtn').disabled = true;
}

function togglePrintType() {
    printSettings.color = !printSettings.color;
    const btn = document.getElementById('printTypeBtn');
    const priceDisplay = document.getElementById('priceDisplay');
    
    if (printSettings.color) {
        btn.textContent = '🌈 Colour print';
        btn.classList.add('active');
        priceDisplay.textContent = '₹2/page';
    } else {
        btn.textContent = 'Black & White print';
        btn.classList.remove('active');
        priceDisplay.textContent = '₹1/page';
    }
    
    updatePrintPrice();
}

function toggleDoubleSided() {
    printSettings.doubleSided = !printSettings.doubleSided;
    const btn = document.getElementById('doubleSidedBtn');
    
    if (printSettings.doubleSided) {
        btn.textContent = 'Double Sided';
        btn.classList.add('active');
    } else {
        btn.textContent = 'Single Sided';
        btn.classList.remove('active');
    }
    
    updatePrintPrice();
}

function changeCopies(delta) {
    printSettings.copies = Math.max(1, printSettings.copies + delta);
    document.getElementById('copiesCount').textContent = printSettings.copies;
    updatePrintPrice();
}

function updatePrintPrice() {
    const pricePerPage = printSettings.color ? 2 : 1;
    const totalPages = printSettings.pages * printSettings.copies;
    const adjustedPages = printSettings.doubleSided ? Math.ceil(totalPages / 2) : totalPages;
    const total = adjustedPages * pricePerPage;
    
    document.getElementById('totalPrice').textContent = total.toFixed(2);
}

function processPayment() {
    if (!uploadedFile) {
        alert('Please upload a file first!');
        return;
    }
    
    // Simulate payment processing
    const total = document.getElementById('totalPrice').textContent;
    alert(`Payment of ₹${total} processed successfully! Your document is being printed. Please collect it from the machine in 30 seconds.`);
    
    // Reset form
    removeFile();
    printSettings = { color: false, doubleSided: false, copies: 1, pages: 0 };
    document.getElementById('printTypeBtn').textContent = 'Black & White print';
    document.getElementById('printTypeBtn').classList.remove('active');
    document.getElementById('doubleSidedBtn').textContent = 'Single Sided';
    document.getElementById('doubleSidedBtn').classList.remove('active');
    document.getElementById('copiesCount').textContent = '1';
    document.getElementById('priceDisplay').textContent = '₹1/page';
}

// Stationery Shop functions
function loadProducts() {
    console.log('Loading products...');
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.error('productsGrid element not found!');
        return;
    }
    console.log('productsGrid found:', grid);
    grid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-emoji">${product.emoji}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">₹${product.price}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        grid.appendChild(productCard);
    });
    console.log(`Loaded ${products.length} products`);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartDisplay();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, item.quantity + delta);
        if (item.quantity === 0) {
            removeFromCart(productId);
        }
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0';
        checkoutBtn.disabled = true;
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <span>${item.emoji} ${item.name}</span>
                <div style="font-size: 0.875rem; color: #94a3b8;">₹${item.price} × ${item.quantity}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button onclick="updateQuantity(${item.id}, -1)" style="background: #ef4444; color: white; border: none; border-radius: 0.25rem; width: 1.5rem; height: 1.5rem; cursor: pointer;">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" style="background: #8b5cf6; color: white; border: none; border-radius: 0.25rem; width: 1.5rem; height: 1.5rem; cursor: pointer;">+</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total;
    checkoutBtn.disabled = false;
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = document.getElementById('cartTotal').textContent;
    alert(`Order placed successfully! Total: ₹${total}. Your items will be dispensed shortly. Please collect them from the machine.`);
    
    // Clear cart
    cart = [];
    updateCartDisplay();
}

// AI Assistant functions
function askQuestion(question) {
    document.getElementById('chatInput').value = question;
    sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        addMessage(response, 'bot');
    }, 1000);
}

function addMessage(content, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('items') || message.includes('stationery') || message.includes('available')) {
        return `We have a wide range of stationery items available 24/7:
        <br><br>📓 Notebooks (₹25)
        <br>🖊️ Pens - Blue/Black (₹10)
        <br>✏️ Pencils (₹5)
        <br>🧽 Erasers (₹3)
        <br>📏 Rulers (₹15)
        <br>🖍️ Highlighters (₹20)
        <br>📎 Staplers (₹45)
        <br>🏷️ Glue Sticks (₹12)
        <br>📄 A4 Paper (₹30)
        <br>📁 Folders (₹18)
        <br>🧮 Calculators (₹150)
        <br><br>Visit our Shop section to place an order!`;
    }
    
    if (message.includes('print') || message.includes('cost') || message.includes('price')) {
        return `Our printing services are super affordable:
        <br><br>🖨️ <strong>Black & White:</strong> ₹1 per page
        <br>🌈 <strong>Colour Print:</strong> ₹2 per page
        <br><br>📱 <strong>How to print:</strong>
        <br>1. Upload your PDF or image
        <br>2. Choose print options (B&W/Color, copies, etc.)
        <br>3. Pay via UPI/GPay/PhonePe/Paytm
        <br>4. Collect your printout in ~30 seconds!
        <br><br>Visit our Print section to get started!`;
    }
    
    if (message.includes('location') || message.includes('where') || message.includes('machine')) {
        return `🗺️ <strong>CampusKart machines are located at:</strong>
        <br><br>• College hostels and common areas
        <br>• University campuses
        <br>• Coaching centers and libraries
        <br>• Study centers and co-working spaces
        <br>• PG accommodations
        <br><br>⏰ <strong>Available 24/7</strong> - No more waiting for shop hours!
        <br><br>📍 Find the nearest machine in your campus area.`;
    }
    
    if (message.includes('payment') || message.includes('pay') || message.includes('upi')) {
        return `💳 <strong>We accept multiple payment methods:</strong>
        <br><br>• UPI (Any UPI app)
        <br>• Google Pay (GPay)
        <br>• PhonePe
        <br>• Paytm
        <br>• QR Code scanning
        <br><br>🔒 All payments are secure and instant!
        <br>💰 No cash needed - completely digital experience.`;
    }
    
    if (message.includes('time') || message.includes('fast') || message.includes('quick')) {
        return `⚡ <strong>Lightning fast service:</strong>
        <br><br>🖨️ <strong>Printing:</strong> ~30 seconds average
        <br>📦 <strong>Stationery:</strong> Instant dispensing
        <br>💳 <strong>Payment:</strong> 2-3 seconds
        <br>🤖 <strong>AI Help:</strong> Real-time responses
        <br><br>⏰ Available 24/7 - No queues, no waiting!`;
    }
    
    if (message.includes('help') || message.includes('support') || message.includes('problem')) {
        return `🆘 <strong>Need help? I'm here for you!</strong>
        <br><br>I can assist you with:
        <br>• 📦 Finding the right stationery items
        <br>• 🖨️ Printing questions and troubleshooting
        <br>• 💰 Pricing and payment information
        <br>• 📍 Machine locations and availability
        <br>• ❓ Any other questions about CampusKart
        <br><br>Just ask me anything! I'm your 24/7 campus companion. 😊`;
    }
    
    return `Thanks for your question! 😊
    <br><br>I can help you with:
    <br>• 📦 Stationery items and prices
    <br>• 🖨️ Printing services and costs
    <br>• 📍 Machine locations
    <br>• 💳 Payment options
    <br>• ⏰ Service timings
    <br><br>What would you like to know more about?`;
}

function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Utility functions
function formatCurrency(amount) {
    return `₹${amount.toFixed(2)}`;
}
