import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let echoPromise = null;

export function initEcho() {
    if (!echoPromise) {
        echoPromise = import('pusher-js').then(({ default: Pusher }) => {
            window.Pusher = Pusher;
            return import('laravel-echo');
        }).then(({ default: Echo }) => {
            window.Echo = new Echo({
                broadcaster: 'reverb',
                key: import.meta.env.VITE_REVERB_APP_KEY,
                wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
                wsPort: import.meta.env.VITE_REVERB_PORT || 8081,
                forceTLS: false,
                enabledTransports: ['ws'],
            });
        });
    }
    return echoPromise;
}
