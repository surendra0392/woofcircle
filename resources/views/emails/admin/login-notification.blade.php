<x-mail::message>
# Admin Login Detected

Hello,

A successful login to the Admin Panel was detected for your account.

**Details:**
- **Account:** {{ $admin->email }}
- **IP Address:** {{ $ip }}
- **Time:** {{ $time }}
- **Browser:** {{ $userAgent }}

If this was not you, please reset your password immediately and contact technical support.

<x-mail::button :url="config('app.url') . '/admin/dashboard'">
Go to Dashboard
</x-mail::button>

Thanks,<br>
{{ config('app.name') }} Security Team
</x-mail::message>
