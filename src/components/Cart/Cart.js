import { useContext, useState } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';

const Cart = (props) => {
  const cartCtx = useContext(CartContext);

  const [isCheckout, setIsCheckout] = useState(false);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const orderh = () => {
    setIsCheckout(true);
  };

  const submitOrderh = (userData) => {
    fetch('https://react14-2f161-default-rtdb.firebaseio.com/orders.json', {
      method: 'POST',
      body:JSON.stringify({
        user:userData,
        orderedItems:cartCtx.items
      })
    });
  };

  const Modalactions = <div className={classes.actions}>
    <button className={classes['button--alt']} onClick={props.onClose}>
      Close
  </button>
    {hasItems && <button className={classes.button} onClick={orderh}>Order</button>}
  </div>;

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  return (
    <Modal onClose={props.onClose}>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>

      {isCheckout && <Checkout onConfirm={submitOrderh} onCancel={props.onClose} />}

      {!isCheckout && Modalactions}
    </Modal>
  );
};

export default Cart;
