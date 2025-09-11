// Cart form functionality

// Get cart item data from DOM
function getCartItemData() {
  const dataElement = document.getElementById('cart-item-data');
  if (dataElement) {
    try {
      return JSON.parse(dataElement.textContent);
    } catch (error) {
      console.error('Error parsing cart item data:', error);
      return null;
    }
  }
  return null;
}

// Update cart count on load
document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
});

async function updateCartCount() {
  try {
    const response = await fetch('/cart/api/cart');
    const data = await response.json();
    if (data.success) {
      const countElement = document.getElementById('cart-count');
      if (countElement) {
        countElement.textContent = data.data.totalItems || 0;
      }
    }
  } catch (error) {
    console.error('Error updating cart count:', error);
  }
}

// Form submission handler
document
  .getElementById('cart-form')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      productId: formData.get('productId'),
      quantity: parseInt(formData.get('quantity')),
    };

    try {
      let response;
      const cartItemData = getCartItemData();

      if (cartItemData) {
        // Update existing item
        response = await fetch('/cart/api/cart/' + cartItemData._id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: data.quantity }),
        });
      } else {
        // Add new item
        response = await fetch('/cart/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }

      const result = await response.json();
      if (result.success) {
        alert(result.message || 'Thành công!');
        window.location.href = '/cart';
      } else {
        alert(result.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi xử lý yêu cầu');
    }
  });

// Delete function
async function deleteItem() {
  const cartItemData = getCartItemData();

  if (!cartItemData) return;

  if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

  try {
    const response = await fetch('/cart/api/cart/' + cartItemData._id, {
      method: 'DELETE',
    });

    const result = await response.json();
    if (result.success) {
      alert('Đã xóa sản phẩm khỏi giỏ hàng');
      window.location.href = '/cart';
    } else {
      alert(result.message || 'Có lỗi xảy ra');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Có lỗi xảy ra khi xóa sản phẩm');
  }
}
