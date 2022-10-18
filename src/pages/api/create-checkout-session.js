const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
    const { items, email } = req.body;


    const trasnformedItems = items.map(item => ({
        description: item.description,
        quantity: 1,
        price_data: {
            currency: 'gbp',
            unit_amount: item.price * 100,
            product_data: {
                name: item.title,
                images: [item.image]
            },
        }
    }))
};