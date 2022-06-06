const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { response, request } = require("express");
const stripe = require("stripe")(
  "sk_test_51KvEVkSGdeu0s1fWKAM2U5q5iTkkzG0qrngftRNb1okhKbeqN1ghaT1L8tPDIvnPneWm9cjoSdmUlwBcYbohxEhD00nwPRNBzL"
);

// API

const app = express();

// Middlewares

app.use(cors({ origin: true }));
app.use(express.json());
// const bodyParser = require("body-parser");
// const cors = require("cors");

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.use(cors());

// API Routes
app.get("/", (request, response) =>
  response
    .status(200)
    .send(
      "THis is My World and this is also payment bnjmkmlkjn nhbju bhhg ghbb"
    )
);

app.post("/payments/create", async (request, response)=>{
  const total = request.query.total;

  console.log("We have received payment request of this amount---->>>", total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total, //This amount here received will be in Sub unit of Currency
    currency: "inr",
    payment_method_types: ["card"],
    description: "amazon payment",
  });

  console.log("This is  the paymentIntent of Index", paymentIntent);

  response.status(201).send(
    // {
    //   paymentIntent: paymentIntent,
    // }
    {
      clientSecret: paymentIntent.client_secret,
    }
  );
  //   console.log("Send to desired place.........................");
});

// After This Listen the command
exports.api = functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
