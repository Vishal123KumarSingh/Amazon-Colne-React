import React, { useEffect, useState } from "react";
import "./Orders.css";
import { db } from "../firebase"
import { collection, onSnapshot } from "firebase/firestore";
import { useStateValue } from "../Stateprovider";
import OrderIndividual from "../OrderIndividual/OrderIndividual"
import { ClassNames } from "@emotion/react";

function Orders() {
  const [{ basket, user }, dispatch] = useStateValue();

  const [Orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      const collectionRef = collection(db, "Users", user?.uid, "orders");
      const unSuubscribe = onSnapshot(collectionRef, (snapshot) => {
        setOrders(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
      });


      return () => {
        unSuubscribe();
      };


      console.log("Order setted here", Orders)
    }
    else {
      setOrders([])
    }
  }, [user])
  return (
    <div className="orders">
      <h2>Your Order.</h2>
      {console.log("This is Order", Orders)}

      {Orders.map((order) => (
        <OrderIndividual order={order} />
      ))}

    </div>);
}

export default Orders;
