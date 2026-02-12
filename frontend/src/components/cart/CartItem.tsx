
import { useCart } from "../../hooks/useCart";
import "./CartItem.css";

import type { CartItem } from "../../types/cartTypes";

interface CartItemProps {
  item: CartItem;
}

export function CartItem({ item }: CartItemProps) {

  const { removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.title} className="item-image" />
      <div className="item-details">
        <h3>{item.title}</h3>
        <p className="item-price">€{item.price.toFixed(2)}</p>
      </div>
      <p className="item-total">€{item.price.toFixed(2)}</p>
      <button className="remove-button" onClick={() => removeFromCart(item.id)}>
        <span className="material-icons">delete</span>
      </button>
    </div>
  );
}
