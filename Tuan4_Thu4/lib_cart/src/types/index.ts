export interface CartItem {
  _id?: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface Product {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  stock: number;
  createdAt?: Date;
}

export interface CartUIComponents {
  inputText: (props: InputTextProps) => string;
  button: (props: ButtonProps) => string;
  modal: (props: ModalProps) => string;
  card: (props: CardProps) => string;
}

export interface InputTextProps {
  id: string;
  name: string;
  placeholder?: string;
  value?: string | number;
  type?: 'text' | 'number' | 'email';
  required?: boolean;
  className?: string;
}

export interface ButtonProps {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: string;
  disabled?: boolean;
}

export interface ModalProps {
  id: string;
  title: string;
  content: string;
  showFooter?: boolean;
  footerButtons?: ButtonProps[];
}

export interface CardProps {
  title?: string;
  content: string;
  image?: string;
  footer?: string;
  className?: string;
}
