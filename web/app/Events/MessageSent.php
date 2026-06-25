<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Message $message;
    public string $channelName;

    public function __construct(Message $message)
    {
        $this->message = $message->load("user");
        $this->channelName = "chat." . $message->channel_id;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel($this->channelName),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            "id" => $this->message->id,
            "channel_id" => $this->message->channel_id,
            "user_id" => $this->message->user_id,
            "content" => $this->message->content,
            "created_at" => $this->message->created_at,
            "user" => [
                "id" => $this->message->user->id,
                "name" => $this->message->user->name,
            ],
        ];
    }

    public function broadcastAs(): string
    {
        return "message.sent";
    }
}
