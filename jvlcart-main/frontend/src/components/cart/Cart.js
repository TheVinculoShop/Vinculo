import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { decreaseCartItemQty, increaseCartItemQty, removeItemFromCart } from '../../slices/cartSlice';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

export default function Cart() {
    const { items } = useSelector(state => state.cartState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const increaseQty = (item) => {
        const count = item.quantity;
        if (item.stock === 0 || count >= item.stock) return;
        dispatch(increaseCartItemQty(item.product));
    };

    const decreaseQty = (item) => {
        const count = item.quantity;
        if (count === 1) return;
        dispatch(decreaseCartItemQty(item.product));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping');
    };

    const CartItem = ({ item }) => (
        <div key={item.product} className="cart-item">
            <div className="item-image-container">
                <div className="image-shadow">
                    <img src={item.image} alt={item.name} />
                </div>
            </div>
            <div className="item-content">
                <Link to={`/product/${item.product}`} className="item-name">{item.name}</Link>
                <p className="item-price">${item.price}</p>
                <div className="item-quantity">
                    <button className="btn btn-decrease" onClick={() => decreaseQty(item)}>
                        <FaMinus />
                    </button>
                    <input type="number" className="quantity-input" value={item.quantity} readOnly />
                    <button className="btn btn-increase" onClick={() => increaseQty(item)}>
                        <FaPlus />
                    </button>
                    <button className="btn btn-remove" aria-label={`Remove ${item.name} from cart`} onClick={() => dispatch(removeItemFromCart(item.product))}>
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <Fragment>
            <div className="cart-container">
                {items.length === 0 ? 
                    <h2 className="empty-cart">Your Cart is Empty</h2> :
                    <Fragment>
                        <h2 className="cart-header">Shopping Cart</h2>
                        <div className="cart-items">
                            {items.map(item => (
                                <CartItem key={item.product} item={item} />
                            ))}
                        </div>
                        <div className="order-summary">
                            <h4>Order Summary</h4>
                            <p>Subtotal: <span>{items.reduce((acc, item) => acc + item.quantity, 0)} Items</span></p>
                            <p>Estimated Total: <span>${items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</span></p>
                            <button className="btn btn-checkout" onClick={checkoutHandler}>Proceed to Checkout</button>
                        </div>
                    </Fragment>
                }
            </div>

            <style jsx>{`
                :root {
                    --main-color: #102c57;
                    --secondary-color: #5a6c8c; /* Lighter shade */
                    --hover-color: #d3d3d3; /* Light grey color on hover */
                    --bg-color: #f4f7f6;
                    --white: #fff;
                    --border-color: #e0e0e0;
                    --shadow-color: rgba(0, 0, 0, 0.1);
                    --shadow-hover-color: rgba(0, 0, 0, 0.15);
                }

                .cart-container {
                    min-height: calc(100vh - 120px);
                    padding: 40px;
                    box-sizing: border-box;
                    background: var(--bg-color);
                    margin-top: 80px;
                    margin-bottom: 80px;
                }

                .empty-cart, .cart-header {
                    text-align: center;
                    margin-top: 20px;
                    font-family: 'Roboto', sans-serif;
                }

                .cart-header {
                    font-size: 2.5rem;
                    color: var(--main-color);
                    font-weight: 700;
                    margin-bottom: 30px;
                }

                .cart-items {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .cart-item {
                    display: flex;
                    align-items: flex-start;
                    padding: 20px;
                    border-radius: 12px;
                    background: var(--white);
                    box-shadow: 0 12px 24px var(--shadow-color);
                    border: 1px solid var(--border-color);
                    transition: box-shadow 0.3s ease, transform 0.3s ease;
                    position: relative;
                }

                .cart-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 16px 32px var(--shadow-hover-color);
                }

                .item-image-container {
                    width: 150px;
                    height: 150px;
                    margin-right: 20px;
                }

                .image-shadow {
                    width: 100%;
                    height: 100%;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .image-shadow img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .item-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    position: relative;
                }

                .item-name {
                    text-decoration: none;
                    color: var(--main-color);
                    font-weight: 600;
                    font-size: 1.2rem;
                }

                .item-price {
                    color: #333;
                    font-size: 1.2rem;
                }

                .item-quantity {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    position: relative;
                }

                .btn {
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background-color 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backface-visibility: hidden;
                }

                .btn-decrease, .btn-increase {
                    background-color: var(--secondary-color);
                    color: var(--white);
                    width: 35px;
                    height: 35px;
                }

                .btn-decrease:hover, .btn-increase:hover, .btn-remove:hover, .btn-checkout:hover {
                    background-color: var(--hover-color);
                }

                .btn-remove {
                    background-color: var(--secondary-color);
                    color: var(--white);
                    width: 35px;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    backface-visibility: hidden;
                }

                .quantity-input {
                    width: 30px;
                    height: 30px;
                    text-align: center;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    padding: 2px;
                    font-size: 0.9rem;
                }

                .order-summary {
                    background-color: var(--white);
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 12px 24px var(--shadow-color);
                    margin-top: 30px;
                }

                .order-summary h4 {
                    margin-bottom: 20px;
                    color: var(--main-color);
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .order-summary p {
                    margin: 10px 0;
                    font-size: 1.2rem;
                    color: #333;
                }

                .order-summary span {
                    font-weight: 600;
                }

                .btn-checkout {
                    width: 100%;
                    background-color: #28a745;
                    color: var(--white);
                    font-size: 1.2rem;
                    padding: 12px;
                    border-radius: 8px;
                    margin: 0 auto;
                    display: block;
                    text-align: center;
                }

                /* Desktop View */
                @media (min-width: 992px) {
                    .btn-checkout {
                        width: 50%; /* Reduced width */
                    }
                }

                /* Mobile View */
                @media (max-width: 576px) {
                    .cart-item {
                        flex-direction: column;
                        padding: 15px;
                        position: relative;
                    }

                    .item-image-container {
                        display: flex;
                        justify-content: center;
                        margin-bottom: 15px;
                        width: 100%;
                    }

                    .image-shadow {
                        width: 120px;
                        height: 120px;
                    }

                    .item-quantity {
                        display: flex;
                        justify-content: center;
                        gap: 10px;
                        margin-top: 10px;
                    }

                    .btn-decrease, .btn-increase, .btn-remove {
                        width: 35px;
                        height: 35px;
                    }

                    .btn-remove {
                        margin-left: 0;
                        margin-top: 0;
                    }
                }

                @media (min-width: 577px) and (max-width: 768px) {
                    .cart-item {
                        flex-direction: row;
                    }

                    .item-content {
                        margin-left: 20px;
                    }
                }
            `}</style>
        </Fragment>
    );
}
