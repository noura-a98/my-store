const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/order');
const Product = require('../models/product');

exports.webhookCheckout = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log('⚠️ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const newOrder = {
      customerName: session.metadata.customerName,
      email: session.customer_email,
      phone: session.metadata.phone,
      shipping: {
        address: session.metadata.address,
        city: session.metadata.city
      },
      product: session.client_reference_id,
      quantity: parseInt(session.metadata.quantity),
      influencerCode: session.metadata.influencerCode,
      stripeSession: session.id
    };

    try {
      await Order.create(newOrder);
      console.log('✅ Order created from webhook');
    } catch (error) {
      console.error('❌ Failed to create order:', error.message);
    }
  }

  res.status(200).json({ received: true });
};
