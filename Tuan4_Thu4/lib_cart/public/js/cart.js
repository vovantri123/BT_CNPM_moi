/**
 * Cart Library JavaScript Utilities
 * Provides common functions for cart operations and UI interactions
 */

class CartLibraryJS {
  constructor() {
    this.apiBase = '';
    this.init();
  }

  init() {
    // Initialize event listeners
    this.setupEventListeners();
    // Update cart count on load
    this.updateCartCount();
  }

  setupEventListeners() {
    // Handle form submissions
    document.addEventListener('submit', this.handleFormSubmit.bind(this));

    // Handle quantity input changes
    document.addEventListener('input', this.handleQuantityChange.bind(this));

    // Handle modal events
    document.addEventListener('click', this.handleModalEvents.bind(this));
  }

  handleFormSubmit(event) {
    const form = event.target;
    if (form.dataset.cartForm) {
      event.preventDefault();
      this.submitCartForm(form);
    }
  }

  handleQuantityChange(event) {
    const input = event.target;
    if (input.type === 'number' && input.dataset.cartQuantity) {
      // Debounce quantity updates
      clearTimeout(input.updateTimeout);
      input.updateTimeout = setTimeout(() => {
        this.updateItemQuantity(input.dataset.itemId, input.value);
      }, 500);
    }
  }

  handleModalEvents(event) {
    const target = event.target;

    // Close modal when clicking backdrop
    if (target.classList.contains('modal-backdrop')) {
      this.closeModal(target.closest('.modal').id);
    }

    // Handle modal triggers
    if (target.dataset.modalTarget) {
      this.openModal(target.dataset.modalTarget);
    }
  }

  // Cart API methods
  async addToCart(productId, quantity = 1) {
    try {
      const response = await fetch(`${this.apiBase}/cart/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();

      if (data.success) {
        this.showNotification('Đã thêm vào giỏ hàng!', 'success');
        this.updateCartCount();
        return data.data;
      } else {
        this.showNotification(data.message || 'Có lỗi xảy ra', 'error');
        return null;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.showNotification('Có lỗi xảy ra khi thêm vào giỏ hàng', 'error');
      return null;
    }
  }

  async updateItemQuantity(itemId, quantity) {
    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    }

    try {
      const response = await fetch(`${this.apiBase}/cart/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: parseInt(quantity) }),
      });

      const data = await response.json();

      if (data.success) {
        this.updateCartCount();
        this.updateCartDisplay();
        return data.data;
      } else {
        this.showNotification(data.message || 'Có lỗi xảy ra', 'error');
        return null;
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      this.showNotification('Có lỗi xảy ra khi cập nhật số lượng', 'error');
      return null;
    }
  }

  async removeFromCart(itemId) {
    try {
      const response = await fetch(`${this.apiBase}/cart/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        this.showNotification('Đã xóa khỏi giỏ hàng', 'success');
        this.updateCartCount();
        this.updateCartDisplay();
        return true;
      } else {
        this.showNotification(data.message || 'Có lỗi xảy ra', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      this.showNotification('Có lỗi xảy ra khi xóa sản phẩm', 'error');
      return false;
    }
  }

  async clearCart() {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      return false;
    }

    try {
      const response = await fetch(`${this.apiBase}/cart/api/cart`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        this.showNotification('Đã xóa toàn bộ giỏ hàng', 'success');
        this.updateCartCount();
        this.updateCartDisplay();
        return true;
      } else {
        this.showNotification(data.message || 'Có lỗi xảy ra', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      this.showNotification('Có lỗi xảy ra khi xóa giỏ hàng', 'error');
      return false;
    }
  }

  async getCart() {
    try {
      const response = await fetch(`${this.apiBase}/cart/api/cart`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        console.error('Error getting cart:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Error getting cart:', error);
      return null;
    }
  }

  // UI Helper methods
  async updateCartCount() {
    try {
      const cart = await this.getCart();
      if (cart) {
        const countElements = document.querySelectorAll('[data-cart-count]');
        countElements.forEach((element) => {
          element.textContent = cart.totalItems || 0;
        });

        // Also update specific cart-count id
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
          cartCountElement.textContent = cart.totalItems || 0;
        }
      }
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  }

  async updateCartDisplay() {
    // Reload page if on cart page for simplicity
    if (window.location.pathname.includes('/cart')) {
      window.location.reload();
    }
  }

  showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach((notification) => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all transform translate-x-full max-w-sm`;

    // Set notification style based on type
    const styles = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-white',
      info: 'bg-blue-500 text-white',
    };

    notification.className += ` ${styles[type] || styles.info}`;
    notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    ×
                </button>
            </div>
        `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        if (notification.parentElement) {
          notification.classList.add('translate-x-full');
          setTimeout(() => {
            if (notification.parentElement) {
              notification.remove();
            }
          }, 300);
        }
      }, duration);
    }
  }

  // Modal methods
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }

  // Utility methods
  formatPrice(price, currency = 'VNĐ') {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ' + currency;
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize Cart Library
const cartLibrary = new CartLibraryJS();

// Global functions for backward compatibility
window.addToCart = (productId, quantity = 1) =>
  cartLibrary.addToCart(productId, quantity);
window.updateQuantity = (itemId, quantity) =>
  cartLibrary.updateItemQuantity(itemId, quantity);
window.removeItem = (itemId) => cartLibrary.removeFromCart(itemId);
window.clearCart = () => cartLibrary.clearCart();
window.updateCartCount = () => cartLibrary.updateCartCount();
window.showNotification = (message, type, duration) =>
  cartLibrary.showNotification(message, type, duration);
window.openModal = (modalId) => cartLibrary.openModal(modalId);
window.closeModal = (modalId) => cartLibrary.closeModal(modalId);

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CartLibraryJS;
}
