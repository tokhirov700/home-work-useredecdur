import { useReducer, useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import './App.css';

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return [...state, action.product];
    case "REMOVE_FROM_CART":
      return state.filter(product => product.id !== action.id);
    default:
      return state;
  }
};

function App() {
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const initialState = [];

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then(response => response.json())
      .then(data => setProducts(data.products))
      .catch(error => console.log(error));
  }, []);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", product });
  };

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", id });
  };

  const toggleCart = (product) => {
    if (isProductInCart(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  useEffect(() => {
    setTotal(state.reduce((acc, b) => acc + b.price, 0).toFixed(2));
  }, [state]);

  const isProductInCart = (id) => {
    return state.some(product => product.id === id);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
      <div>
        <h1>PRODUCTS</h1>
        <div className="products">
          {products.map(product =>
            <div className="product-card" key={product.id}>
              <img width={100} src={product.images[0]} alt="" />
              <h3>{product.title}</h3>
              <p>${product.price}</p>
              <button onClick={() => addToCart(product)}>Add to cart</button>
              <div onClick={() => toggleCart(product)} style={{ cursor: 'pointer', marginLeft: '10px', display: 'inline-block' }}>
                {isProductInCart(product.id) ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h1>CART PRODUCTS <span>{state.length}</span></h1>
        <strong>
          Subtotal: ${total}
          <br />
          Tax: ${(total * 0.12).toFixed(2)}
          <br />
          Total: ${(total * 1.12).toFixed(2)}
        </strong>
        <div className="cart-products">
          {state.map(product =>
            <div className="product-card" key={product.id}>
              <img width={100} src={product.images[0]} alt="" />
              <h3>{product.title}</h3>
              <p>${product.price}</p>
              <button onClick={() => removeFromCart(product.id)}>Remove from cart</button>
              <div onClick={() => toggleCart(product)} style={{ cursor: 'pointer', marginLeft: '10px', display: 'inline-block' }}>
                <AiFillHeart color="red" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
