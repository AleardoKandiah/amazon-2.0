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
    }));

    const session = await stripe.checkout.session.create({
        payment_method_types: ["card"],
        shipping_address_collection: {
            allowed_countries: ['GB','US', 'CA'], 
        },
        line_items: trasnformedItems,
        mode: 'payment',
        success_url: `${process.env.HOST}/success`,
        cancel_url: `${process.env.HOST}/cancel`,
        metadata: {
            email,
            images: JSON.stringify(items.map(item => item.image))        
        }
    })
};