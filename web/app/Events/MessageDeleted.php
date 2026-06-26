<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $messageId;
    public string $channelName;

    public function __construct(Message $message)
    {
        $this->messageId = $message->id;
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
            "id" => $this->messageId,
        ];
    }

    public function broadcastAs(): string
    {
        return "message.deleted";
    }
}
