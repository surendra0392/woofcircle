<?php

namespace Tests\Feature;

use App\Models\NewsletterSubscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsletterTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_subscribe_to_newsletter()
    {
        $response = $this->post('/newsletter/subscribe', [
            'email' => 'test@example.com',
            'name'  => 'Test User'
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Thanks for subscribing to our newsletter!');

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'test@example.com',
            'name'  => 'Test User'
        ]);
    }

    public function test_existing_user_cannot_subscribe_twice_but_gets_success_message()
    {
        NewsletterSubscriber::create([
            'email' => 'existing@example.com',
            'name'  => 'Existing User',
            'subscribed_at' => now()
        ]);

        $response = $this->post('/newsletter/subscribe', [
            'email' => 'existing@example.com'
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'You are already subscribed to our newsletter.');
    }

    public function test_user_can_unsubscribe_via_token()
    {
        $subscriber = NewsletterSubscriber::create([
            'email' => 'unsub@example.com',
            'name'  => 'Unsub User',
            'subscribed_at' => now()
        ]);

        $this->assertNull($subscriber->unsubscribed_at);
        $this->assertNotNull($subscriber->token);

        $response = $this->get('/newsletter/unsubscribe/' . $subscriber->token);

        $response->assertOk();

        $this->assertNotNull($subscriber->fresh()->unsubscribed_at);
    }
}
