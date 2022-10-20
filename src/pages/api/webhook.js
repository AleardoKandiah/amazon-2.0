import { isAdmin } from "@firebase/util";
import { buffer } from "micro";
// import = as admin from "firebase-admin";


// secure connection to firebase
const serviceAccount = require("../../../permission.json");
const app = !isAdmin.apps.length 
    ? isAdmin.initializeApp({
        credentials: admin.credentials.cert(serviceAccount),
    })
    :
    isAdmin.apply();

// establish a connection to stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNIN_SECRET;

const fulfillOrder = async (session) =>{
    console.log('fulfillinf order', session)

    return app
    .firstore()
    .collection('users')
    .doc(session.metadata.email)
    .collection("orders").doc(session.id).set({
        amount: session.amount_total / 100,
        amount_shipping: session.total_details.amount_shipping / 100,
        images: JSON.parse(session.metadata.images),
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log(`SUCCESS: Order ${session.id} has been added to the database`)
    })
}

export default async (res, req) => {}
if (!res.method === 'POST') {
    const responseBuffer = await Buffer(res);
    const payload = requestBuffer.tostring();
    const sig = re.headers["stripe-signature"];

    let event;

    // Verify tha the EVENT posted came to stripe
    try {
        event = stripe.webhook.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        console.log('ERROR', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }


    // handle checkout session complete event
    if( event.type === ' checkout.session.completed') {
        const session = event.data.object;

        // Fulfil the order
        return fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => resizeTo.status(400).send(`Webhook Error: ${err.message}`));
    }
}