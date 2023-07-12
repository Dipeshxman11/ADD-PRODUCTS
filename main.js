// Get DOM elements
const productForm = document.getElementById('productForm');
const priceInput = document.getElementById('price');
const productNameInput = document.getElementById('productName');
const productList = document.getElementById('productList');
const totalValueElement = document.getElementById('totalValue');

let products = [];

// Event listener for adding a product
productForm.addEventListener('submit', addProduct);

// Axios GET request to fetch products
window.addEventListener('DOMContentLoaded', function() {
  axios.get("https://crudcrud.com/api/65c6ebc9b2ad49abadcb3d97d5e27cdd/Productdata")
    .then(response => {
      console.log(response);

      products = response.data;

      // Clear the product list
      productList.innerHTML = '';

      // Iterate through the fetched products and add them to the product list
      products.forEach((product, index) => {
        const productItem = document.createElement('li');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
          <span>${product.productName} - $${product.price}</span>
          <span class="delete-btn" onclick="deleteProductAxios(${index})">Delete</span>
        `;
        productList.appendChild(productItem);
      });

      // Update the total value
      updateTotalValue();
    })
    .catch(error => {
      console.error(error);
    });
});

// Function to add a product
function addProduct(e) {
  e.preventDefault();

  const price = priceInput.value;
  const productName = productNameInput.value;

  if (price && productName) {
    const product = { price, productName };

    axios.post("https://crudcrud.com/api/65c6ebc9b2ad49abadcb3d97d5e27cdd/Productdata", product)
      .then(response => {
        console.log(response);
        products.push(response.data);

        // Create the product item
        const productItem = document.createElement('li');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
          <span>${productName} - $${price}</span>
          <span class="delete-btn" onclick="deleteProductAxios(${products.length - 1})">Delete</span>
        `;

        // Append the product item to the product list
        productList.appendChild(productItem);

        // Update the total value
        updateTotalValue();

        // Clear the input fields
        priceInput.value = '';
        productNameInput.value = '';
      })
      .catch(error => {
        console.error(error);
      });
  }
}

// Function to delete a product
function deleteProductAxios(index) {
  const productId = products[index]._id;

  axios.delete(`https://crudcrud.com/api/65c6ebc9b2ad49abadcb3d97d5e27cdd/Productdata/${productId}`)
    .then(response => {
      console.log(response);
      products.splice(index, 1);

      // Remove the product item from the product list
      productList.removeChild(productList.childNodes[index]);

      // Update the total value
      updateTotalValue();
    })
    .catch(error => {
      console.error(error);
    });
}

// Function to update the total value
function updateTotalValue() {
  const totalValue = products.reduce((sum, product) => sum + parseInt(product.price), 0);
  totalValueElement.textContent = "$" + totalValue;
}
