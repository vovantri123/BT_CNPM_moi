import {
  InputTextProps,
  ButtonProps,
  ModalProps,
  CardProps,
} from '../types/index.js';

export class UIComponents {
  static inputText(props: InputTextProps): string {
    const {
      id,
      name,
      placeholder = '',
      value = '',
      type = 'text',
      required = false,
      className = '',
    } = props;

    const baseClasses =
      'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500';
    const finalClasses = `${baseClasses} ${className}`.trim();

    return `
      <input
        type="${type}"
        id="${id}"
        name="${name}"
        placeholder="${placeholder}"
        value="${value}"
        ${required ? 'required' : ''}
        class="${finalClasses}"
      />
    `;
  }

  static button(props: ButtonProps): string {
    const {
      text,
      type = 'button',
      variant = 'primary',
      size = 'md',
      className = '',
      onClick = '',
      disabled = false,
    } = props;

    const baseClasses =
      'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';

    const variantClasses = {
      primary:
        'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
      secondary:
        'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      success:
        'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
    const finalClasses =
      `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`.trim();

    return `
      <button
        type="${type}"
        class="${finalClasses}"
        ${onClick ? `onclick="${onClick}"` : ''}
        ${disabled ? 'disabled' : ''}
      >
        ${text}
      </button>
    `;
  }

  static modal(props: ModalProps): string {
    const { id, title, content, showFooter = true, footerButtons = [] } = props;

    const footerHtml = showFooter
      ? `
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        ${footerButtons.map((btn) => this.button(btn)).join('')}
      </div>
    `
      : '';

    return `
      <div id="${id}" class="fixed inset-0 z-50 overflow-y-auto hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onclick="closeModal('${id}')"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    ${title}
                  </h3>
                  <div class="mt-2">
                    ${content}
                  </div>
                </div>
              </div>
            </div>
            ${footerHtml}
          </div>
        </div>
      </div>
    `;
  }

  static card(props: CardProps): string {
    const { title, content, image, footer, className = '' } = props;

    const baseClasses = 'bg-white overflow-hidden shadow rounded-lg';
    const finalClasses = `${baseClasses} ${className}`.trim();

    const imageHtml = image
      ? `
      <div class="aspect-w-16 aspect-h-9">
        <img class="w-full h-48 object-cover" src="${image}" alt="${
          title || 'Card image'
        }" />
      </div>
    `
      : '';

    const titleHtml = title
      ? `
      <div class="px-4 py-3 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">${title}</h3>
      </div>
    `
      : '';

    const footerHtml = footer
      ? `
      <div class="px-4 py-3 bg-gray-50 border-t border-gray-200">
        ${footer}
      </div>
    `
      : '';

    return `
      <div class="${finalClasses}">
        ${imageHtml}
        ${titleHtml}
        <div class="px-4 py-4">
          ${content}
        </div>
        ${footerHtml}
      </div>
    `;
  }
}
