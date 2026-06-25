<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Http\Requests\MessageRequest;
use App\Models\Channel;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, Channel $channel): JsonResponse
    {
        $after = $request->integer("after", 0);

        $messages = $channel->messages()
            ->with("user")
            ->where("id", ">", $after)
            ->latest()
            ->get()
            ->reverse()
            ->values();

        return response()->json($messages);
    }

    public function store(MessageRequest $request, Channel $channel): JsonResponse
    {
        $message = $channel->messages()->create([
            "user_id" => $request->user()->id,
            "content" => $request->input("content"),
        ]);

        $message->load("user");

        MessageSent::dispatch($message);

        return response()->json($message, 201);
    }
}
