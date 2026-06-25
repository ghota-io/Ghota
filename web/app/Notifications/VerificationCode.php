<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerificationCode extends Notification
{
    use Queueable;

    public function __construct(
        public string $code
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Código de verificação — Ghota')
            ->greeting('Olá!')
            ->line('O teu código de verificação é:')
            ->line($this->code)
            ->line('Este código expira em 30 minutos.')
            ->salutation('Equipa Ghota');
    }
}
