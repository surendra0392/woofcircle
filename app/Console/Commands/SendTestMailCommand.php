<?php

namespace App\Console\Commands;

use App\Mail\NewsletterWelcomeMail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendTestMailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:test {email? : The recipient email address}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email using the configured SMTP mailer';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email') ?? 'surendra0392@gmail.com';

        $this->info("Sending test luxury email to: {$email}...");

        try {
            Mail::to($email)->send(new NewsletterWelcomeMail('Surendra', $email, 'test-token-' . time()));
            $this->info("✅ Test email sent successfully! Please check your inbox (and spam folder).");
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->error("❌ Failed to send test email: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
