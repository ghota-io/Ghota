<?php

return [
    'key' => env('STRIPE_KEY'),
    'secret' => env('STRIPE_SECRET'),
    'webhook' => [
        'secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],
    'connect' => [
        'client_id' => env('STRIPE_CONNECT_CLIENT_ID'),
    ],
];
