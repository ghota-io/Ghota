<?php

namespace App\Console\Commands;

use App\Models\Message;
use App\Models\MessageArchive;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ArchiveOldMessages extends Command
{
    protected $signature = "messages:archive";
    protected $description = "Archive messages older than 30 days to message_archives table";

    public function handle(): void
    {
        $cutoff = now()->subDays(30);

        $count = 0;

        Message::where("created_at", "<", $cutoff)
            ->chunk(100, function ($messages) use (&$count) {
                DB::transaction(function () use ($messages, &$count) {
                    foreach ($messages as $msg) {
                        MessageArchive::create([
                            "channel_id" => $msg->channel_id,
                            "user_id" => $msg->user_id,
                            "content" => $msg->content,
                            "created_at" => $msg->created_at,
                            "updated_at" => $msg->updated_at,
                        ]);
                        $msg->delete();
                        $count++;
                    }
                });
            });

        $this->info("Arquivadas {$count} mensagens.");
    }
}
