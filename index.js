const express = require('express');
const webpush = require('web-push');
const path = require('path');
const bodyParser = require('body-parser');


const app = express();

app.use(express.static(path.join(__dirname, "client")))

app.use(bodyParser.json());

// const vapidKeys = webpush.generateVAPIDKeys();
const vapidKeys = {
    publicKey: 'BBEoCPeQcwG4HwCuMvYkLwMrX0tB97N_j65JyTpGLEPzCphn7RgA5JvR53BKb1s7KrWSP8yIVHG8C2io317_hpw',
    privateKey: 'AB8Or_s1-dLNKwi37do4SEW7F-XY6PGcWalVba6EPXA'
}
console.log('vapidKeys', vapidKeys)
// webpush.setGCMAPIKey('<Your GCM API Key Here>');
webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

app.post('/subscribe', (req, res) => {
    const subscription = req.body
    console.log('subscription', subscription)
    // Send 201 - resource created
    res.status(201).json({});
    const payload = JSON.stringify({
        title: 'First Push Notification',
        body: 'Testing'
    })
    webpush.sendNotification(subscription, payload).catch(err => {
        console.log(err)
    })
})

const portN = 33333;
app.listen(portN, () => {
    console.log('Server started', portN)
});