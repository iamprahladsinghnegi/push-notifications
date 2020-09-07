const applicationServerPublicKey = 'BBEoCPeQcwG4HwCuMvYkLwMrX0tB97N_j65JyTpGLEPzCphn7RgA5JvR53BKb1s7KrWSP8yIVHG8C2io317_hpw';

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker.register('sw.js', {
        scope: '/'
    }).then(function (swReg) {
        console.log('Service Worker is registered', swReg);

        // swRegistration = swReg;
        subscribePushManager(swReg)
    }).catch(function (error) {
        console.error('Service Worker Error', error);
    });
} else {
    console.warn('Push messaging is not supported');
}


function subscribePushManager(swRegistration) {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    }).then((subscription) => {
        console.log('Push Manager subscribed', subscription)
        sendPushsubcription(subscription)
    }).catch(err => {
        console.log('err', err)
        unsubscribeUser(swRegistration)
    })

}

function sendPushsubcription(subscription) {
    fetch("/subscribe", {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => {
        console.log('Push sent', res)
    }).catch(err => {
        console.log('unable to send push', err)
    })
}

function unsubscribeUser(swRegistration) {
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            if (subscription) {
                // TODO: Tell application server to delete subscription
                return subscription.unsubscribe();
            }
        })
        .catch(function (error) {
            console.log('Error unsubscribing', error);
        })

}