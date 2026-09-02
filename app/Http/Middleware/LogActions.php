<?php

namespace App\Http\Middleware;

use App\Models\AdminAuditLog;
use App\Models\UserAuditLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;

class LogActions
{
    /**
     * Log administrative or user actions based on request context.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $isAdmin = $request->is('admin') || $request->is('admin/*');

        if (Auth::guard($isAdmin ? 'admin' : 'web')->check()) {
            if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
                $maskedFields = $isAdmin
                    ? ['password', 'password_confirmation', 'old_password', 'new_password']
                    : ['password', 'password_confirmation', 'old_password', 'new_password', 'card_number', 'cvv'];

                $payload = $this->cleanPayload($request->except($maskedFields));

                $logData = [
                    'action' => $this->getActionDescription($request, $isAdmin),
                    'method' => $request->method(),
                    'url' => $request->fullUrl(),
                    'payload' => $payload,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ];

                if ($isAdmin) {
                    $logData['admin_id'] = Auth::guard('admin')->id();
                    AdminAuditLog::create($logData);
                } else {
                    $logData['user_id'] = Auth::guard('web')->id();
                    UserAuditLog::create($logData);
                }
            }
        }

        return $response;
    }

    private function getActionDescription(Request $request, bool $isAdmin): string
    {
        if (! $isAdmin) {
            return 'User performed '.$request->method().' on '.$request->path();
        }

        $method = $request->method();
        $path = $request->path();
        $segments = explode('/', ltrim($path, '/'));

        if (! empty($segments) && $segments[0] === 'admin') {
            array_shift($segments);
        }

        $resource = ! empty($segments) ? str_replace('-', ' ', ucfirst($segments[0])) : 'System';

        $action = match ($method) {
            'POST' => 'Created new',
            'PUT', 'PATCH' => 'Updated',
            'DELETE' => 'Deleted',
            default => 'Modified',
        };

        if (str_contains($path, 'login')) {
            return 'Logged into the system';
        }
        if (str_contains($path, 'logout')) {
            return 'Logged out of the system';
        }
        if (str_contains($path, 'profile')) {
            return 'Updated profile settings';
        }

        return "{$action} {$resource}";
    }

    private function cleanPayload(array $payload): array
    {
        return array_map(function ($value) {
            if ($value instanceof UploadedFile) {
                return '[File: '.$value->getClientOriginalName().']';
            }
            if (is_array($value)) {
                return $this->cleanPayload($value);
            }
            return $value;
        }, $payload);
    }
}
