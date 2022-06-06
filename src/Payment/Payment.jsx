import React, { useEffect, useState } from "react";
import CheckoutProduct from "../CheckoutProduct/CheckoutProduct";
import { useStateValue } from "../Stateprovider";
import "./Payment.css";
import { Link, useNavigate } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import { getTotalValue } from "../reducer";
import axios from "../axios";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";



function Payment() {
  const [{ basket, user }, dispatch] = useStateValue(); //8653998929

  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);

  const [processing, setProcessing] = useState("");
  const [succceded, setSucceded] = useState(false);

  const [clientSecret, setClientSecret] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getClientSecret = async () => {
      const response = await axios({
        method: "post",
        url: `/payments/create/?total=${Math.round(
          getTotalValue(basket) * 100
        )}`,
      });
      setClientSecret(response.data.clientSecret);
    };
    getClientSecret();
    // const result = await getClientSecret();
  }, [basket]);
  console.log("The Secret is --->>>>", clientSecret);
  console.log("the User is ", user);
  console.log("User KA Email Ye HAi", user?.email)

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(async ({ paymentIntent }) => {
        console.log("This is paymentIntent ", paymentIntent)
        const docRef = doc(db, "Users", user?.uid, 'orders', paymentIntent.id);
        setDoc(docRef, {
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created
        }).then(response => { console.log(response) }).catch(error => { console.log("this is error message", error.message) })


        setSucceded(true);
        setError(null);
        setProcessing(false);
        navigate("/orders");
      });
  };

  function handleChange(event) {
    //   // In this function , we have to listend to handleCah ge dunction and
    //   // if customer type any wrong information than we have to show them.
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  }

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout <Link to="/checkout">{basket?.length} items</Link>
        </h1>
        {/*  This is For Address of Deleivery  */}
        <div className="payment__section">
          <div className="payment__title">
            <h2>Delievery Address</h2>
          </div>
          <div className="payment__address">
            <p> This iis Psyment Address</p>
            <p>{user?.email}</p>
            <p>{user?.phone}</p>
            <p>Kewani, Garkha Saran,Bihar </p>
            <p>841311</p>
          </div>
        </div>

        {/* This gonna be for the items in the checkout */}
        <div className="payment__section">
          <div className="payment__title">
            <h2>Review and Delevery</h2>
          </div>
          <div className="payment__item">
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>

        {/* This gonna be for the paying  */}
        <div className="payment__section">
          <div className="payment__title">Payment Method</div>

          <div className="payment__details">
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />

              <div className="payment__print">
                <CurrencyFormat
                  renderText={(value) => (
                    <>
                      <h4>
                        Order Total ({basket.length} items):{" "}
                        <strong>{value}</strong>
                      </h4>
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

                <button disabled={processing || disabled || succceded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>

              {error ? <div>{error}</div> : ""}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
