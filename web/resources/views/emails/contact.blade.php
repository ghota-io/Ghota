<x-mail::message>
# Novo contacto

Recebeste uma nova mensagem através do formulário de contacto.

**De:** {{ $senderEmail }}

**Mensagem:**

{{ $messageText }}

<x-mail::button :url="'mailto:' . $senderEmail">
Responder a {{ $senderEmail }}
</x-mail::button>

Atenciosamente,<br>
Equipa Ghota
</x-mail::message>
