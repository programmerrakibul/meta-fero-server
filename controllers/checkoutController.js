const stripe = require("stripe")(process.env.CHECKOUT_SECRET_KEY);
const { ObjectId } = require("mongodb");
const { parcelCollection, paymentsCollection } = require("../db.js");
const { trackingLog } = require("../utilities/trackingLog.js");

const createCheckout = async (req, res) => {
  const { deliveryCharge, parcel_name, parcel_id, sender_email, tracking_id } =
    req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: deliveryCharge * 100,
          product_data: {
            name: parcel_name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      parcel_id,
      parcel_name,
      tracking_id,
    },
    customer_email: sender_email,
    success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.SITE_DOMAIN}/dashboard/my-parcels`,
  });

  res.send({ url: session.url });
};

const updatePaymentStatus = async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(
    req.params.session_id
  );

  const {
    customer_email,
    payment_intent,
    amount_total,
    metadata: { parcel_id, parcel_name, tracking_id },
    payment_status,
  } = session || {};

  if (payment_status === "paid") {
    const query = { _id: new ObjectId(parcel_id) };
    const transaction_id = payment_intent;

    const paymentInfo = {
      parcel_name,
      customer_email,
      tracking_id,
      transaction_id,
      amount_total: amount_total / 100,
      paid_at: new Date().toISOString(),
    };

    const delivery_status = "pending_pickup";

    const update = {
      $set: { payment_status, delivery_status },
    };

    await parcelCollection.updateOne(query, update);
    const result = await paymentsCollection.updateOne(
      { transaction_id },
      { $setOnInsert: paymentInfo },
      { upsert: true }
    );

    if (result.upsertedId) {
      await trackingLog(delivery_status, tracking_id);

      return res.send({
        success: true,
        customer_email,
        transaction_id,
        tracking_id,
        isNew: true,
      });
    } else {
      return res.send({
        success: true,
        customer_email,
        transaction_id,
        tracking_id,
        isNew: false,
      });
    }
  }

  res.send({
    success: false,
  });
};

module.exports = { createCheckout, updatePaymentStatus };
