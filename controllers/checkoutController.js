const stripe = require("stripe")(process.env.CHECKOUT_SECRET_KEY);
const { ObjectId } = require("mongodb");
const { parcelCollection } = require("../db.js");

const createCheckout = async (req, res) => {
  const paymentInfo = req.body;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: paymentInfo.deliveryCharge * 100,
          product_data: {
            name: paymentInfo.parcel_name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      parcel_id: paymentInfo.parcel_id,
    },
    customer_email: paymentInfo.sender_email,
    success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.SITE_DOMAIN}/dashboard/my-parcels`,
  });

  res.send({ url: session.url });
};

const updatePaymentStatus = async (req, res) => {
  const { session_id } = req.params;
  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status === "paid") {
    const { parcel_id } = session.metadata;
    const query = { _id: new ObjectId(parcel_id) };

    const update = {
      $set: {
        payment_status: "paid",
      },
    };

    const result = await parcelCollection.updateOne(query, update);

    res.send({
      success: true,
      customer_email: session.customer_email,
      ...result,
    });
  }

  res.send({
    success: false,
  });
};

module.exports = { createCheckout, updatePaymentStatus };
