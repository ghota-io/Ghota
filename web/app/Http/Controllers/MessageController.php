<?php

namespace App\Http\Controllers;

use App\Events\MessageDeleted;
use App\Events\MessageSent;
use App\Events\MessageUpdated;
use App\Http\Requests\MessageRequest;
use App\Models\Channel;
use App\Models\Membership;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class MessageController extends Controller
{
    private function authorizeChannelAccess(Request $request, Channel $channel): void
    {
        $isMember = Membership::where('community_id', $channel->community_id)
            ->where('user_id', $request->user()->id)
            ->exists();

        abort_unless($isMember, 403);
    }

    public function index(Request $request, Channel $channel): JsonResponse
    {
        $this->authorizeChannelAccess($request, $channel);

        $after = $request->integer("after", 0);

        $messages = $channel->messages()
            ->with("user")
            ->where("id", ">", $after)
            ->latest()
            ->limit(50)
            ->get()
            ->reverse()
            ->values();

        return response()->json($messages);
    }

    public function store(MessageRequest $request, Channel $channel): JsonResponse
    {
        $this->authorizeChannelAccess($request, $channel);

        $key = 'send-message:' . $request->user()->id;

        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json(['message' => 'Muitas mensagens. Aguarda um pouco.'], 429);
        }

        RateLimiter::hit($key, 10);

        $message = $channel->messages()->create([
            "user_id" => $request->user()->id,
            "content" => $request->input("content"),
        ]);

        $message->load("user");

        MessageSent::dispatch($message);

        return response()->json($message, 201);
    }

    public function update(Request $request, Channel $channel, Message $message): JsonResponse
    {
        $this->authorizeChannelAccess($request, $channel);

        abort_if($message->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
        ]);

        $message->update($validated);
        $message->load('user');

        MessageUpdated::dispatch($message);

        return response()->json($message);
    }

    public function destroy(Request $request, Channel $channel, Message $message): JsonResponse
    {
        $this->authorizeChannelAccess($request, $channel);

        abort_if($message->user_id !== $request->user()->id, 403);

        MessageDeleted::dispatch($message);

        $message->delete();

        return response()->json(null, 204);
    }
}
