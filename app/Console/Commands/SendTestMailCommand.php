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
    protected $description = 'Send a real-time test email using the configured SMTP mailer';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email') ?? 'surendrakoneru0392@gmail.com';

        $this->info("SMTP Host: " . config('mail.mailers.smtp.host') . ":" . config('mail.mailers.smtp.port') . " (" . config('mail.mailers.smtp.scheme', config('mail.mailers.smtp.encryption')) . ")");
        $this->info("From Address: " . config('mail.from.address') . " (" . config('mail.from.name') . ")");
        $this->info("Sending instant test email to: {$email}...");

        try {
            // Send synchronously in real-time bypassing queue
            Mail::to($email)->sendNow(new NewsletterWelcomeMail('Surendra', $email, 'test-token-' . time()));
            $this->info("✅ Test email sent successfully to {$email}! Please check your inbox (and spam folder).");
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->error("❌ SMTP Error: " . $e->getMessage());
            $this->line("File: " . $e->getFile() . ":" . $e->getLine());
            return Command::FAILURE;
        }
    }
}
