<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\VerificationCode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_verification_code_screen_can_be_rendered(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->withSession(['verification_user_id' => $user->id])
            ->get('/verify-code');

        $response->assertStatus(200);
    }

    public function test_verification_code_screen_redirects_if_no_session(): void
    {
        $response = $this->get('/verify-code');

        $response->assertRedirect(route('login', absolute: false));
    }

    public function test_email_can_be_verified_with_code(): void
    {
        Notification::fake();

        $user = User::factory()->unverified()->create();
        $user->generateVerificationCode();
        $user->save();

        $response = $this->withSession(['verification_user_id' => $user->id])
            ->post('/verify-code', [
                'code' => $user->verification_code,
            ]);

        $this->assertAuthenticated();
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_email_is_not_verified_with_wrong_code(): void
    {
        $user = User::factory()->unverified()->create();
        $user->generateVerificationCode();
        $user->save();

        $response = $this->withSession(['verification_user_id' => $user->id])
            ->post('/verify-code', [
                'code' => '000000',
            ]);

        $this->assertGuest();
        $this->assertFalse($user->fresh()->hasVerifiedEmail());
        $response->assertSessionHasErrors('code');
    }

    public function test_email_is_not_verified_with_expired_code(): void
    {
        $user = User::factory()->unverified()->create();
        $user->verification_code = '123456';
        $user->verification_code_expires_at = now()->subMinute();
        $user->save();

        $response = $this->withSession(['verification_user_id' => $user->id])
            ->post('/verify-code', [
                'code' => '123456',
            ]);

        $this->assertGuest();
        $this->assertFalse($user->fresh()->hasVerifiedEmail());
        $response->assertSessionHasErrors('code');
    }

    public function test_code_can_be_resent(): void
    {
        Notification::fake();

        $user = User::factory()->unverified()->create();
        $user->generateVerificationCode();
        $user->save();

        $oldCode = $user->verification_code;

        $response = $this->withSession(['verification_user_id' => $user->id])
            ->post('/verify-code/resend');

        $response->assertSessionHas('status');

        $user->refresh();
        $this->assertNotEquals($oldCode, $user->verification_code);

        Notification::assertSentTo($user, VerificationCode::class);
    }
}
