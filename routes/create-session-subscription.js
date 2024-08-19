const express = require("express");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2022-08-01",
});

const router = express.Router();

router.post("/", async function (req, res) {
  const { priceId, customerEmail, type } = req.body;

  let telegramLink = "https://t.me/+l_3GRBqNFLszOTY9";
  switch (type) {
    case "diamond":
      telegramLink = "https://t.me/+L4dQ7IRfKTNlNDA9";
      break;
    case "gold":
      telegramLink = "https://t.me/+J9RlNeCaMXRlOTk1";
      break;
    case "silver":
      telegramLink = "https://t.me/+Jif8H9cexEszNjI1";
      break;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_collection: "if_required",
      mode: "subscription",
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 1,
      },
      success_url: `https://expoxtrading.info//success?session_id={CHECKOUT_SESSION_ID}&telegroup=${encodeURIComponent(
        telegramLink
      )}`,
      cancel_url: `https://expoxtrading.info//cancel`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
