const express = require("express");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2022-08-01",
});

const router = express.Router();

router.post("/", async function (req, res) {
  const { priceId, customerEmail } = req.body;

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
      success_url: `https://expoxtrading.info//success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://expoxtrading.info//cancel`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
