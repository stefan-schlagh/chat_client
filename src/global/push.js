import {makeRequest} from "./requests";

export async function subscribePush(tokens) {
    // ask for permission to send notifications
    const permiss = await Notification.requestPermission();

    if(permiss === 'granted') {

        // Get the server's public key
        const response = await makeRequest('/push/vapidPublicKey', {method: 'get'}, tokens);
        const vapidPublicKey = await response.text();
        // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        await navigator.serviceWorker.register('/push-service-worker.js');

        navigator.serviceWorker.ready.then(registration => {
            if (!registration.pushManager) {
                console.log("Push Unsupported")
                return
            }

            registration.pushManager
                .subscribe({
                    userVisibleOnly: true, //Always display notifications
                    applicationServerKey: convertedVapidKey
                })
                .then(subscription => {
                    return makeRequest('/push/register', {
                        method: 'post',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            subscription: subscription
                        }),
                    }, tokens)
                })
                .catch(err => console.error("Push subscription error: ", err))
        }).catch(err => {
            console.error(err.message, err)
        });
    }else
        unsubscribePush();
}
export function unsubscribePush() {
    if(navigator.serviceWorker)
        navigator.serviceWorker.ready.then(registration => {
            //Find the registered push subscription in the service worker
            registration.pushManager
                .getSubscription()
                .then(subscription => {
                    if (!subscription) {
                        return
                        //If there isn't a subscription, then there's nothing to do
                    }
            subscription
              .unsubscribe()
              .then(() => {})
              .catch(err => console.error(err))
          })
          .catch((err) => console.error(err))
  });
}
// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
function urlBase64ToUint8Array(base64String) {
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