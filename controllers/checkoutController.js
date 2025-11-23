const stripe = require("stripe")(process.env.CHECKOUT_SECRET_KEY);
const { nanoid } = require("nanoid");
const { ObjectId } = require("mongodb");
const { parcelCollection, paymentsCollection } = require("../db.js");

const createCheckout = async (req, res) => {
  const paymentInfo = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
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
      parcel_name: paymentInfo.parcel_name,
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

  const {
    customer_email,
    payment_intent,
    amount_total,
    metadata,
    payment_status,
  } = session || {};

  if (payment_status === "paid") {
    const { parcel_id, parcel_name } = metadata;
    const query = { _id: new ObjectId(parcel_id) };
    const tracking_id = `PRCL-${nanoid()}`;
    const transaction_id = payment_intent;

    const paymentInfo = {
      parcel_name,
      customer_email,
      amount_total: amount_total / 100,
      transaction_id,
      tracking_id,
      paid_at: new Date().toISOString(),
    };

    const update = {
      $set: { payment_status, tracking_id },
    };

    await parcelCollection.updateOne(query, update);
    const result = await paymentsCollection.updateOne(
      { transaction_id },
      { $setOnInsert: paymentInfo },
      { upsert: true }
    );

    if (result.upsertedId) {
      // New payment created
      return res.send({
        success: true,
        customer_email,
        transaction_id,
        tracking_id,
        isNew: true,
      });
    } else {
      // Payment already existed
      const existing = await paymentsCollection.findOne({ transaction_id });
      return res.send({
        success: true,
        customer_email,
        transaction_id,
        tracking_id: existing.tracking_id,
        isNew: false,
      });
    }
  }

  res.send({
    success: false,
  });
};

module.exports = { createCheckout, updatePaymentStatus };
