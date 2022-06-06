import React from "react";
import "./Subtotal.css";
import CurrencyFormat from "react-currency-format";
import { useStateValue } from "../Stateprovider";
import { getTotalValue } from "../reducer";
import { useNavigate } from "react-router-dom";
import { CardElement } from "@stripe/react-stripe-js";

var sum = 0;

function Subtotal() {
  const history = useNavigate();
  const [{ basket }, dispatch] = useStateValue();
  // console.log(basket);

  return (
    <div className="subtotal">
      <CurrencyFormat
        renderText={(value) => (
          <>
            <p>
              Subtotal ({basket.length} items): <strong>{value}</strong>
            </p>
            <small className="subtotal__gift">
              <input type="checkbox" /> This order contains a gift
            </small>
          </>
        )}
        decimalScale={2}
        value={getTotalValue(basket)}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
      />
      <button onClick={(e) => history("/payment")}>Proced to buy</button>
      {/* <CardElement /> */}
    </div>
  );
}

export default Subtotal;
