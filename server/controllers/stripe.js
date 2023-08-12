import stripe from "stripe";
stripe(process.env.STRIPE_PRIVATE_KEY);

const priceID = "price_1NYKgkGJReRCK7tcj2MMju0W"

export const createCheckoutSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [
                {
                    price: priceID,
                    quantity: 1
                }
            ],
            success_url: "",
            cancel_url: ""
        })
        
        res.json({ url: session.url })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}