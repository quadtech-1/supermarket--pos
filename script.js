let products = [];
let sales = [];
let cart = [];


// ==========================================
// STORE SETTINGS
// ==========================================

let storeSettings = {
  storeName: "My Store",
  ownerName: "",
  phone: "",
  email: "",
  address: "",
  city: ""
};


// ==========================================
// LOAD SAVED DATA
// ==========================================

try {
  products =
    JSON.parse(localStorage.getItem("posProducts")) || [];
} catch (e) {
  products = [];
}

try {
  sales =
    JSON.parse(localStorage.getItem("posSales")) || [];
} catch (e) {
  sales = [];
}

try {
  const savedSettings =
    JSON.parse(localStorage.getItem("posStoreSettings"));

  if (savedSettings) {
    storeSettings = {
      ...storeSettings,
      ...savedSettings
    };
  }
} catch (e) {
  console.log("Store settings could not be loaded.");
}


// ==========================================
// START APP
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

  // ========================================
  // ELEMENTS
  // ========================================

  const productName =
    document.getElementById("productName");

  const retailPrice =
    document.getElementById("productRetailPrice");

  const wholesalePrice =
    document.getElementById("productWholesalePrice");

  const productStock =
    document.getElementById("productStock");

  const addProductButton =
    document.getElementById("addProductButton");

  const productSearch =
    document.getElementById("productSearch");

  const inventorySearch =
    document.getElementById("inventorySearch");

  const saleType =
    document.getElementById("saleType");

  const customerName =
    document.getElementById("customerName");

  const customerPhone =
    document.getElementById("customerPhone");

  const amountPaid =
    document.getElementById("amountPaid");

  const completeSaleButton =
    document.getElementById("completeSaleButton");

  const customerSearch =
    document.getElementById("customerSearch");


  // ========================================
  // STORE SETTINGS ELEMENTS
  // ========================================

  const storeNameInput =
    document.getElementById("storeName");

  const ownerNameInput =
    document.getElementById("ownerName");

  const storePhoneInput =
    document.getElementById("storePhone");

  const storeEmailInput =
    document.getElementById("storeEmail");

  const storeAddressInput =
    document.getElementById("storeAddress");

  const storeCityInput =
    document.getElementById("storeCity");

  const saveStoreButton =
    document.getElementById("saveStoreButton");


  // ========================================
  // PAYMENT METHOD
  // ========================================

  let paymentMethod =
    document.getElementById("paymentMethod");


  // ========================================
  // SAVE DATA
  // ========================================

  function saveData() {

    localStorage.setItem(
      "posProducts",
      JSON.stringify(products)
    );

    localStorage.setItem(
      "posSales",
      JSON.stringify(sales)
    );
  }


  // ========================================
  // STORE SETTINGS
  // ========================================

  function saveStoreSettings() {

    localStorage.setItem(
      "posStoreSettings",
      JSON.stringify(storeSettings)
    );
  }


  function loadStoreSettings() {

    if (!storeNameInput) return;

    storeNameInput.value =
      storeSettings.storeName || "";

    if (ownerNameInput) {
      ownerNameInput.value =
        storeSettings.ownerName || "";
    }

    if (storePhoneInput) {
      storePhoneInput.value =
        storeSettings.phone || "";
    }

    if (storeEmailInput) {
      storeEmailInput.value =
        storeSettings.email || "";
    }

    if (storeAddressInput) {
      storeAddressInput.value =
        storeSettings.address || "";
    }

    if (storeCityInput) {
      storeCityInput.value =
        storeSettings.city || "";
    }

    updateStoreTitle();
  }


  function updateStoreTitle() {

    const title =
      document.getElementById("appStoreName");

    if (!title) return;

    title.textContent =
      storeSettings.storeName || "My Store";
  }


  // ========================================
  // SAVE STORE BUTTON
  // ========================================

  if (saveStoreButton) {

    saveStoreButton.addEventListener(
      "click",
      function () {

        const name =
          storeNameInput
            ? storeNameInput.value.trim()
            : "";

        if (name === "") {

          alert("Please enter a store name.");

          return;
        }

        storeSettings = {

          storeName: name,

          ownerName:
            ownerNameInput
              ? ownerNameInput.value.trim()
              : "",

          phone:
            storePhoneInput
              ? storePhoneInput.value.trim()
              : "",

          email:
            storeEmailInput
              ? storeEmailInput.value.trim()
              : "",

          address:
            storeAddressInput
              ? storeAddressInput.value.trim()
              : "",

          city:
            storeCityInput
              ? storeCityInput.value.trim()
              : ""
        };

        saveStoreSettings();

        updateStoreTitle();

        const message =
          document.getElementById("storeSaveMessage");

        if (message) {

          message.textContent =
            "✅ Store information saved!";

          setTimeout(function () {
            message.textContent = "";
          }, 3000);
        }

        alert("✅ Store information saved!");
      }
    );
  }


  // ========================================
  // ADD PRODUCT
  // ========================================

  if (addProductButton) {

    addProductButton.addEventListener(
      "click",
      function () {

        const name =
          productName.value.trim();

        const retail =
          Number(retailPrice.value);

        const wholesale =
          Number(wholesalePrice.value);

        const stock =
          Number(productStock.value);

        if (name === "") {
          alert("Please enter product name.");
          return;
        }

        if (retail <= 0) {
          alert("Please enter a valid retail price.");
          return;
        }

        if (wholesale <= 0) {
          alert("Please enter a valid wholesale price.");
          return;
        }

        if (stock < 0 || isNaN(stock)) {
          alert("Please enter a valid quantity.");
          return;
        }

        products.push({

          id: Date.now(),

          name: name,

          retailPrice: retail,

          wholesalePrice: wholesale,

          stock: stock

        });

        saveData();

        productName.value = "";
        retailPrice.value = "";
        wholesalePrice.value = "";
        productStock.value = "";

        showProducts();
        showSaleProducts();

        alert("✅ Product added successfully!");
      }
    );
  }


  // ========================================
  // SHOW PRODUCTS
  // ========================================

  function showProducts() {

    const list =
      document.getElementById("productList");

    if (!list) return;

    const query =
      inventorySearch
        ? inventorySearch.value.trim().toLowerCase()
        : "";

    const filtered =
      products.filter(function (product) {

        return product.name
          .toLowerCase()
          .includes(query);

      });

    list.innerHTML = "";

    if (filtered.length === 0) {

      list.innerHTML =
        '<p class="empty">No products found.</p>';

      updateDashboard();

      return;
    }

    filtered.forEach(function (product) {

      const index =
        products.indexOf(product);

      const stock =
        Number(product.stock);

      let stockClass = "good";
      let stockText = "🟢 In stock";

      if (stock <= 0) {

        stockClass = "low";
        stockText = "🔴 Out of stock";

      } else if (stock <= 5) {

        stockClass = "low";
        stockText = "🟠 Low stock";
      }

      list.innerHTML += `

        <div class="product-card">

          <div class="product-top">

            <div>

              <div class="product-name">
                ${product.name}
              </div>

              <div class="product-price">
                Retail:
                ₦${Number(product.retailPrice).toLocaleString()}
              </div>

              <div class="product-price">
                Wholesale:
                ₦${Number(product.wholesalePrice).toLocaleString()}
              </div>

            </div>

            <strong>
              ${stock}
            </strong>

          </div>

          <div class="stock ${stockClass}">
            ${stockText}
          </div>

          <br>

          <button
            onclick="deleteProduct(${index})"
            style="
              background:#dc2626;
              color:white;
              border:0;
              padding:9px 12px;
              border-radius:8px;
            "
          >
            🗑️ Delete
          </button>

        </div>

      `;
    });

    updateDashboard();
  }


  // ========================================
  // DELETE PRODUCT
  // ========================================

  window.deleteProduct =
    function (index) {

      const product = products[index];

      if (!product) return;

      if (!confirm(`Delete "${product.name}"?`)) {
        return;
      }

      products.splice(index, 1);

      saveData();

      showProducts();
      showSaleProducts();
    };


  // ========================================
  // TODAY'S SALES
  // ========================================

  function showTodaySales() {

    const today =
      new Date().toDateString();

    let total = 0;

    sales.forEach(function (sale) {

      if (
        new Date(sale.date).toDateString() === today
      ) {

        total += Number(sale.total);
      }
    });

    const salesTotal =
      document.getElementById("salesTotal");

    if (salesTotal) {

      salesTotal.textContent =
        "₦" + total.toLocaleString();
    }
  }


  // ========================================
  // PRODUCT SEARCH
  // ========================================

  if (productSearch) {

    productSearch.addEventListener(
      "input",
      showSaleProducts
    );
  }


  if (saleType) {

    saleType.addEventListener(
      "change",
      showSaleProducts
    );
  }


  if (inventorySearch) {

    inventorySearch.addEventListener(
      "input",
      showProducts
    );
  }


  // ========================================
  // SHOW SALE PRODUCTS
  // ========================================

  function showSaleProducts() {

    const box =
      document.getElementById("saleProducts");

    if (!box) return;

    const search =
      productSearch
        ? productSearch.value.trim().toLowerCase()
        : "";

    box.innerHTML = "";

    const results =
      products.filter(function (product) {

        return product.name
          .toLowerCase()
          .includes(search);

      });

    if (results.length === 0) {

      box.innerHTML =
        '<p class="empty">No matching product found.</p>';

      return;
    }

    results.forEach(function (product) {

      const index =
        products.indexOf(product);

      const price =
        saleType && saleType.value === "wholesale"
          ? Number(product.wholesalePrice)
          : Number(product.retailPrice);

      const disabled =
        Number(product.stock) <= 0
          ? "disabled"
          : "";

      box.innerHTML += `

        <div class="sale-product">

          <div class="sale-product-info">

            <strong>
              ${product.name}
            </strong>

            <small>
              ₦${price.toLocaleString()}
              • Stock: ${product.stock}
            </small>

          </div>

          <button
            class="add-button"
            onclick="addToCart(${index})"
            ${disabled}
          >
            ${
              Number(product.stock) <= 0
              ? "Out of Stock"
              : "+ Add"
            }
          </button>

        </div>

      `;
    });
  }


  // ========================================
  // ADD TO CART
  // ========================================

  window.addToCart =
    function (index) {

      const product = products[index];

      if (!product) return;

      if (Number(product.stock) <= 0) {

        alert("This product is out of stock.");

        return;
      }

      const type =
        saleType
          ? saleType.value
          : "retail";

      const price =
        type === "wholesale"
          ? Number(product.wholesalePrice)
          : Number(product.retailPrice);

      const existing =
        cart.find(function (item) {

          return (
            item.index === index &&
            item.type === type
          );

        });

      if (existing) {

        if (
          existing.quantity >= Number(product.stock)
        ) {

          alert("Not enough stock.");

          return;
        }

        existing.quantity++;

      } else {

        cart.push({

          index: index,

          name: product.name,

          price: price,

          quantity: 1,

          type: type

        });
      }

      showCart();
    };


  // ========================================
  // SHOW CART
  // ========================================

  function showCart() {

    const box =
      document.getElementById("cart");

    if (!box) return;

    box.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

      box.innerHTML =
        '<p class="empty">Cart is empty.</p>';
    }

    cart.forEach(function (item, index) {

      const subtotal =
        item.price * item.quantity;

      total += subtotal;

      box.innerHTML += `

        <div class="cart-item">

          <div class="cart-row">

            <strong>
              ${item.name}
            </strong>

            <strong>
              ₦${subtotal.toLocaleString()}
            </strong>

          </div>

          <small>
            ${
              item.type === "wholesale"
              ? "Wholesale"
              : "Retail"
            }
            • ₦${item.price.toLocaleString()}
          </small>

          <div class="quantity-controls">

            <button
              onclick="decreaseQuantity(${index})"
            >
              −
            </button>

            <button>
              ${item.quantity}
            </button>

            <button
              onclick="increaseQuantity(${index})"
            >
              +
            </button>

            <button
              onclick="removeFromCart(${index})"
            >
              Remove
            </button>

          </div>

        </div>

      `;
    });

    const cartTotal =
      document.getElementById("cartTotal");

    if (cartTotal) {

      cartTotal.textContent =
        "₦" + total.toLocaleString();
    }

    calculateChange();
  }


  // ========================================
  // QUANTITY CONTROLS
  // ========================================

  window.increaseQuantity =
    function (index) {

      const item = cart[index];

      if (!item) return;

      const product =
        products[item.index];

      if (!product) return;

      if (
        item.quantity >= Number(product.stock)
      ) {

        alert("Not enough stock.");

        return;
      }

      item.quantity++;

      showCart();
    };


  window.decreaseQuantity =
    function (index) {

      if (!cart[index]) return;

      if (cart[index].quantity > 1) {

        cart[index].quantity--;

      } else {

        cart.splice(index, 1);
      }

      showCart();
    };


  window.removeFromCart =
    function (index) {

      cart.splice(index, 1);

      showCart();
    };


  // ========================================
  // CART TOTAL
  // ========================================

  function getCartTotal() {

    let total = 0;

    cart.forEach(function (item) {

      total +=
        item.price * item.quantity;

    });

    return total;
  }


  // ========================================
  // CHANGE
  // ========================================

  function calculateChange() {

    const changeDisplay =
      document.getElementById("changeDisplay");

    if (!changeDisplay) return;

    const total =
      getCartTotal();

    const paid =
      amountPaid
        ? Number(amountPaid.value)
        : 0;

    if (
      paid <= 0 ||
      total <= 0
    ) {

      changeDisplay.innerHTML = "";

      return;
    }

    if (paid < total) {

      const remaining =
        total - paid;

      changeDisplay.innerHTML = `

        <strong style="color:#dc2626;">
          Amount remaining:
          ₦${remaining.toLocaleString()}
        </strong>

      `;

    } else {

      const change =
        paid - total;

      changeDisplay.innerHTML = `

        <strong style="color:#16a34a;">
          Change:
          ₦${change.toLocaleString()}
        </strong>

      `;
    }
  }


  if (amountPaid) {

    amountPaid.addEventListener(
      "input",
      calculateChange
    );
  }


  // ========================================
  // COMPLETE SALE
  // ========================================

  if (completeSaleButton) {

    completeSaleButton.addEventListener(
      "click",
      function () {

        if (cart.length === 0) {

          alert("Your cart is empty.");

          return;
        }

        const name =
          customerName
            ? customerName.value.trim()
            : "";

        const phone =
          customerPhone
            ? customerPhone.value.trim()
            : "";

        if (name === "") {

          alert("Please enter customer name.");

          return;
        }

        if (phone === "") {

          alert("Please enter customer phone number.");

          return;
        }

        const total =
          getCartTotal();

        const paid =
          amountPaid
            ? Number(amountPaid.value)
            : 0;

        if (
          isNaN(paid) ||
          paid < total
        ) {

          alert(
            "Amount paid is not enough.\n\n" +
            "Total: ₦" +
            total.toLocaleString()
          );

          return;
        }

        const change =
          paid - total;

        const selectedPaymentMethod =
          paymentMethod
            ? paymentMethod.value
            : "Cash";


        // REDUCE STOCK

        cart.forEach(function (item) {

          if (products[item.index]) {

            products[item.index].stock -=
              item.quantity;

          }

        });


        // CREATE SALE

        const sale = {

          id: Date.now(),

          date: new Date().toISOString(),

          customerName: name,

          customerPhone: phone,

          paymentMethod:
            selectedPaymentMethod,

          items:
            cart.map(function (item) {

              return {

                name: item.name,

                price: item.price,

                quantity: item.quantity,

                type: item.type

              };

            }),

          total: total,

          paid: paid,

          change: change
        };


        sales.unshift(sale);

        saveData();


        // RECEIPT ITEMS

        let receiptItems = "";

        cart.forEach(function (item) {

          const subtotal =
            item.price * item.quantity;

          receiptItems += `

            <div class="receipt-line">

              <span>
                ${item.name} × ${item.quantity}
              </span>

              <span>
                ₦${subtotal.toLocaleString()}
              </span>

            </div>

          `;
        });


        // RECEIPT

        const receipt =
          document.getElementById("receipt");

        if (receipt) {

          receipt.innerHTML = `

            <h2>
              ${storeSettings.storeName || "My Store"}
            </h2>

            ${
              storeSettings.ownerName
              ? `<p>${storeSettings.ownerName}</p>`
              : ""
            }

            ${
              storeSettings.address
              ? `<p>${storeSettings.address}</p>`
              : ""
            }

            ${
              storeSettings.city
              ? `<p>${storeSettings.city}</p>`
              : ""
            }

            ${
              storeSettings.phone
              ? `<p>${storeSettings.phone}</p>`
              : ""
            }

            ${
              storeSettings.email
              ? `<p>${storeSettings.email}</p>`
              : ""
            }

            <p>
              <strong>SALES RECEIPT</strong>
            </p>

            <hr>

            <p>
              <strong>Customer:</strong>
              ${name}
            </p>

            <p>
              <strong>Phone:</strong>
              ${phone}
            </p>

            <p>
              <strong>Payment:</strong>
              ${selectedPaymentMethod}
            </p>

            <p>
              <strong>Date:</strong>
              ${new Date().toLocaleString()}
            </p>

            <hr>

            ${receiptItems}

            <div class="receipt-total">

              <div class="receipt-line">
                <span>TOTAL</span>
                <span>
                  ₦${total.toLocaleString()}
                </span>
              </div>

              <div class="receipt-line">
                <span>PAID</span>
                <span>
                  ₦${paid.toLocaleString()}
                </span>
              </div>

              <div class="receipt-line">
                <span>PAYMENT</span>
                <span>
                  ${selectedPaymentMethod}
                </span>
              </div>

              <div class="receipt-line">
                <span>CHANGE</span>
                <span>
                  ₦${change.toLocaleString()}
                </span>
              </div>

            </div>

            <p>
              Thank you for shopping with us! ❤️
            </p>

            <button onclick="printReceipt()">
              🖨️ Print Receipt
            </button>

          `;

          receipt.style.display = "block";
        }


        // CLEAR FORM

        cart = [];

        if (customerName) {
          customerName.value = "";
        }

        if (customerPhone) {
          customerPhone.value = "";
        }

        if (amountPaid) {
          amountPaid.value = "";
        }

        if (paymentMethod) {
          paymentMethod.value = "Cash";
        }

        showCart();
        showProducts();
        showSaleProducts();
        showTodaySales();
        showSalesHistory();
        updateDashboard();

        alert("✅ Sale completed successfully!");
      }
    );
  }


  // ========================================
  // CUSTOMER SEARCH
  // ========================================

  if (customerSearch) {

    customerSearch.addEventListener(
      "input",
      showCustomerHistory
    );
  }


  function showCustomerHistory() {

    const box =
      document.getElementById("customerHistory");

    if (!box) return;

    const search =
      customerSearch.value
        .trim()
        .toLowerCase();

    if (search === "") {

      box.innerHTML =
        '<p class="empty">Search for a customer to view history.</p>';

      return;
    }

    const found =
      sales.filter(function (sale) {

        const name =
          String(sale.customerName || "")
            .toLowerCase();

        const phone =
          String(sale.customerPhone || "")
            .toLowerCase();

        return (
          name.includes(search) ||
          phone.includes(search)
        );

      });

    if (found.length === 0) {

      box.innerHTML =
        '<p class="empty">No customer history found.</p>';

      return;
    }

    let totalSpent = 0;

    found.forEach(function (sale) {

      totalSpent += Number(sale.total);

    });

    let html = `

      <div class="history-card">

        <h3>
          👤 ${found[0].customerName}
        </h3>

        <p>
          Phone:
          ${found[0].customerPhone}
        </p>

        <p>
          <strong>Purchases:</strong>
          ${found.length}

          <br><br>

          <strong>Total Spent:</strong>
          ₦${totalSpent.toLocaleString()}
        </p>

      </div>

    `;

    found.forEach(function (sale) {

      const date =
        new Date(sale.date);

      let items = "";

      sale.items.forEach(function (item) {

        items += `

          ${item.name}
          × ${item.quantity}
          —
          ₦${(
            item.price *
            item.quantity
          ).toLocaleString()}

          <br>

        `;
      });

      html += `

        <div class="history-card">

          <strong>
            📅 ${date.toLocaleDateString()}
          </strong>

          <br><br>

          ${items}

          <br>

          <strong>
            Total:
            ₦${Number(sale.total).toLocaleString()}
          </strong>

          <br>

          Payment:
          ${sale.paymentMethod || "Cash"}

        </div>

      `;
    });

    box.innerHTML = html;
  }


  // ========================================
  // SALES HISTORY
  // ========================================

  function showSalesHistory() {

    const box =
      document.getElementById("salesHistory");

    if (!box) return;

    box.innerHTML = "";

    if (sales.length === 0) {

      box.innerHTML =
        '<p class="empty">No sales yet.</p>';

      return;
    }

    sales.forEach(function (sale) {

      const date =
        new Date(sale.date);

      let items = "";

      sale.items.forEach(function (item) {

        items +=
          item.name +
          " × " +
          item.quantity +
          "<br>";

      });

      box.innerHTML += `

        <div class="history-card">

          <strong>

            🧾 Sale —
            ${date.toLocaleDateString()}
            ${date.toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit"
              }
            )}

          </strong>

          <small>

            Customer:
            ${sale.customerName}

            <br>

            Phone:
            ${sale.customerPhone}

            <br>

            Payment:
            ${sale.paymentMethod || "Cash"}

          </small>

          <br>

          ${items}

          <br>

          <strong>

            Total:
            ₦${Number(sale.total).toLocaleString()}

          </strong>

          <br>

          Paid:
          ₦${Number(sale.paid).toLocaleString()}

          <br>

          Change:
          ₦${Number(sale.change).toLocaleString()}

        </div>

      `;
    });
  }


  // ========================================
  // DASHBOARD
  // ========================================

  function updateDashboard() {

    const transactionCount =
      document.getElementById("transactionCount");

    const customerCount =
      document.getElementById("customerCount");

    const productCount =
      document.getElementById("productCount");

    const lowStock =
      document.getElementById("lowStock");

    if (transactionCount) {
      transactionCount.textContent =
        sales.length;
    }

    if (customerCount) {

      const customers = new Set();

      sales.forEach(function (sale) {

        if (sale.customerPhone) {

          customers.add(
            sale.customerPhone
          );

        } else if (sale.customerName) {

          customers.add(
            sale.customerName
          );

        }

      });

      customerCount.textContent =
        customers.size;
    }

    if (productCount) {

      productCount.textContent =
        products.length;
    }

    if (lowStock) {

      lowStock.textContent =
        products.filter(function (product) {

          return Number(product.stock) <= 5;

        }).length;
    }
  }


  // ========================================
  // PRINT RECEIPT
  // ========================================

  window.printReceipt =
    function () {

      const receipt =
        document.getElementById("receipt");

      if (!receipt) return;

      const printWindow =
        window.open("", "_blank");

      if (!printWindow) {

        alert(
          "Please allow pop-ups to print the receipt."
        );

        return;
      }

      printWindow.document.write(`

        <html>

        <head>

          <title>
            ${storeSettings.storeName || "Receipt"}
          </title>

          <style>

            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 400px;
              margin: auto;
              color: #111;
            }

            button {
              display: none !important;
            }

            .receipt-line {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              margin: 10px 0;
            }

            .receipt-total {
              border-top: 1px dashed #777;
              padding-top: 10px;
              margin-top: 15px;
            }

            h2 {
              text-align: center;
            }

            p {
              text-align: center;
            }

            hr {
              border: 0;
              border-top: 1px solid #ddd;
            }

          </style>

        </head>

        <body>

          ${receipt.innerHTML}

        </body>

        </html>

      `);

      printWindow.document.close();

      printWindow.focus();

      setTimeout(function () {

        printWindow.print();

      }, 300);
    };


  // ========================================
  // INITIAL DISPLAY
  // ========================================

  loadStoreSettings();

  showProducts();

  showSaleProducts();

  showCart();

  showTodaySales();

  showSalesHistory();

  updateDashboard();

});


// ==========================================
// PAGE NAVIGATION
// ==========================================

window.openPage =
  function(pageId, clickedButton) {

    document
      .querySelectorAll(".page")
      .forEach(function(page) {

        page.classList.remove("active");

      });

    const page =
      document.getElementById(pageId);

    if (page) {

      page.classList.add("active");

    }

    document
      .querySelectorAll(".nav-item")
      .forEach(function(button) {

        button.classList.remove("active");

      });

    if (clickedButton) {

      clickedButton.classList.add("active");

    } else {

      document
        .querySelectorAll(".nav-item")
        .forEach(function(button) {

          const onclickText =
            button.getAttribute("onclick") || "";

          if (
            onclickText.includes(
              "'" + pageId + "'"
            )
          ) {

            button.classList.add("active");

          }

        });

    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


// ==========================================
// ADD PRODUCT BOX
// ==========================================

window.showAddProduct =
  function() {

    const box =
      document.getElementById("addProductBox");

    if (!box) return;

    box.classList.toggle("hidden");
  };


// ==========================================
// OFFLINE APP / SERVICE WORKER
// ==========================================

if ("serviceWorker" in navigator) {

  window.addEventListener("load", function () {

    navigator.serviceWorker
      .register("./sw.js")
      .then(function () {

        console.log(
          "✅ Offline mode enabled."
        );

      })
      .catch(function (error) {

        console.log(
          "Offline mode setup error:",
          error
        );

      });

  });

}
