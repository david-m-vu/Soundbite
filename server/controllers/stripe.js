import stripe from "stripe";
stripe(process.env.STRIPE_PRIVATE_KEY);

const subscriptionItems = new Map([
    [1, { priceInCents: 399, name: "Platina Subscription"}]
])

export const createCheckoutSession = async (req, res) => {
    try {
        const session = await stripe.Checkout.SessionsResource.create({
            payment_method_types: ['card'],
            mode: "subscription",
            line_items: req.body.items.map(subscription => {
                const subscriptionItem = subscriptionItems.get(subscription.id);
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: subscriptionItem.name
                        },
                        unit_amount: subscriptionItem.priceInCents
                    },
                    quantity: subscription.quanity
                }
            }),
            success_url: "",
            cancel_url: ""
        })
        res.json({ url: session.url })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}