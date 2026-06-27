<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\JoinCommunityController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\StripeWebhookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $communities = \App\Models\Community::where('is_visible', true)
        ->with('owner')
        ->with('plans')
        ->withCount('memberships')
        ->latest()
        ->take(6)
        ->get();

    return Inertia::render('Public/Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'communities' => $communities,
    ]);
});



Route::get('/privacidade', function () {
    return Inertia::render('Public/Privacy');
})->name('privacy');

Route::get('/termos', function () {
    return Inertia::render('Public/Terms');
})->name('terms');

Route::get('/recursos', function () {
    return Inertia::render('Public/Features');
})->name('features');

Route::get('/precos', function () {
    return Inertia::render('Public/Pricing');
})->name('pricing');

Route::get('/precos/personalizar', function () {
    return Inertia::render('Public/Customize');
})->name('pricing.customize');

Route::get('/ajuda', function () {
    return Inertia::render('Public/Help');
})->name('help');

Route::get('/contacto', [ContactController::class, 'show'])->name('contact');
Route::post('/contacto', [ContactController::class, 'send'])->name('contact.send');

Route::get('/dashboard', function () {
    $user = request()->user();
    $owned = $user->communities()->with('owner')->withCount('memberships')->get();
    $memberCommunities = $user->memberships()
        ->with('community.owner')
        ->get()
        ->pluck('community')
        ->unique('id')
        ->where('owner_id', '!=', $user->id)
        ->values();
    return Inertia::render('Dashboard', [
        'ownedCommunities' => $owned,
        'memberCommunities' => $memberCommunities,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/theme', [ProfileController::class, 'updateTheme'])->name('profile.theme');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Communities — público
Route::get('/comunidades', [CommunityController::class, 'index'])->name('communities.index');

// Rotas fixas antes do wildcard {community}
Route::get('/comunidades/criar', [CommunityController::class, 'create'])->middleware('auth')->name('communities.create');
Route::get('/comunidades/{community}', [CommunityController::class, 'show'])->name('communities.show');

// Stripe webhook (sem auth, sem CSRF)
Route::post('/stripe/webhook', StripeWebhookController::class)->name('stripe.webhook');

// Communities — autenticado
Route::middleware('auth')->group(function () {
    Route::post('/comunidades', [CommunityController::class, 'store'])->name('communities.store');
    Route::get('/comunidades/{community}/editar', [CommunityController::class, 'edit'])->name('communities.edit');
    Route::put('/comunidades/{community}', [CommunityController::class, 'update'])->name('communities.update');
    Route::delete('/comunidades/{community}', [CommunityController::class, 'destroy'])->name('communities.destroy');

    Route::get('/comunidades/{community}/entrar', [CommunityController::class, 'joinForm'])->name('communities.join');
    Route::post('/comunidades/{community}/entrar', JoinCommunityController::class)->name('communities.join.store');

    Route::get('/comunidades/{community}/pagamento-sucesso', [CommunityController::class, 'paymentSuccess'])->name('communities.payment.success');

    Route::get('/comunidades/{community}/gerir', [CommunityController::class, 'manage'])->name('communities.manage');
    Route::delete('/comunidades/{community}/membros/{user}', [CommunityController::class, 'removeMember'])->name('communities.members.remove');
    Route::put('/comunidades/{community}/membros/{user}/cargo', [CommunityController::class, 'changeMemberRole'])->name('communities.members.role');

    Route::post('/comunidades/{community}/roles', [CommunityController::class, 'storeRole'])->name('communities.roles.store');
    Route::put('/comunidades/{community}/roles/{role}', [CommunityController::class, 'updateRole'])->name('communities.roles.update');
    Route::delete('/comunidades/{community}/roles/{role}', [CommunityController::class, 'destroyRole'])->name('communities.roles.destroy');

    Route::post('/categorias', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categorias/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categorias/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Community internal — unified app layout
    Route::get('/comunidades/{community}/app/{section?}/{sub?}', [CommunityController::class, 'app'])->name('communities.app');

    // Community internal — channel view
    Route::get('/comunidades/{community}/c/{canal}', [CommunityController::class, 'channel'])->name('communities.channel');

    // Channel CRUD
    Route::post('/canais', [ChannelController::class, 'store'])->name('channels.store');
    Route::put('/canais/{channel}', [ChannelController::class, 'update'])->name('channels.update');
    Route::delete('/canais/{channel}', [ChannelController::class, 'destroy'])->name('channels.destroy');

    // Message CRUD
    Route::get('/canais/{channel}/mensagens', [MessageController::class, 'index'])->name('messages.index');
    Route::post('/canais/{channel}/mensagens', [MessageController::class, 'store'])->name('messages.store');
    Route::put('/canais/{channel}/mensagens/{message}', [MessageController::class, 'update'])->name('messages.update');
    Route::delete('/canais/{channel}/mensagens/{message}', [MessageController::class, 'destroy'])->name('messages.destroy');
});

require __DIR__.'/auth.php';
