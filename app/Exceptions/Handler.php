<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types that should not be reported.
     */
    protected $dontReport = [
        AuthenticationException::class,
        ModelNotFoundException::class,
        ThrottleRequestsException::class,
        ValidationException::class,
    ];

    /**
     * A list of the inputs that are never flashed on validation exceptions.
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     */
    public function report(Throwable $e): void
    {
        if ($this->shouldReport($e)) {
            $context = $this->buildLogContext($e);

            Log::error($e->getMessage(), $context);
        }

        parent::report($e);
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e): Response|JsonResponse|RedirectResponse
    {
        // If the request expects JSON (API routes), return structured JSON
        if ($request->expectsJson()) {
            return $this->renderJsonResponse($request, $e);
        }

        // Custom 404 pages for Inertia or Blade
        if ($e instanceof NotFoundHttpException) {
            return $this->renderNotFoundPage($request);
        }

        // Custom 403 for Inertia
        if ($e instanceof HttpExceptionInterface && $e->getStatusCode() === 403) {
            return $this->renderForbiddenPage($request);
        }

        return parent::render($request, $e);
    }

    /**
     * Build a structured log context for an exception.
     */
    private function buildLogContext(Throwable $e): array
    {
        $context = [
            'exception' => get_class($e),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ];

        if (request()->hasHeader('X-Request-Id')) {
            $context['request_id'] = request()->header('X-Request-Id');
        }

        if ($userId = request()->user()?->id) {
            $context['user_id'] = $userId;
        }

        return $context;
    }

    /**
     * Render a JSON error response for API routes.
     */
    private function renderJsonResponse(Request $request, Throwable $e): JsonResponse
    {
        $status = $this->isHttpException($e)
            ? $e->getStatusCode()
            : 500;

        $response = [
            'error' => true,
            'message' => $this->getErrorMessage($e),
            'status' => $status,
        ];

        // Include validation errors if applicable
        if ($e instanceof ValidationException) {
            $response['errors'] = $e->errors();
        }

        // Include debug details in non-production environments
        if (! app()->environment('production')) {
            $response['exception'] = get_class($e);
            $response['file'] = $e->getFile();
            $response['line'] = $e->getLine();
        }

        return response()->json($response, $status);
    }

    /**
     * Render a user-friendly 404 page supporting Inertia or Blade fallback.
     */
    private function renderNotFoundPage(Request $request): Response|JsonResponse|RedirectResponse
    {
        // If the request is an Inertia visit, return a 404 Inertia response
        if ($request->header('X-Inertia')) {
            return response()->json([
                'message' => 'Not Found.',
            ], 404);
        }

        // Fallback to a plain 404 response
        return response()->view('errors.404', [], 404);
    }

    /**
     * Render a user-friendly 403 page supporting Inertia or Blade fallback.
     */
    private function renderForbiddenPage(Request $request): Response|JsonResponse|RedirectResponse
    {
        if ($request->header('X-Inertia')) {
            return response()->json([
                'message' => 'Forbidden.',
            ], 403);
        }

        return response()->view('errors.403', [], 403);
    }

    /**
     * Get a user-facing error message based on the exception type and environment.
     */
    private function getErrorMessage(Throwable $e): string
    {
        if ($e instanceof NotFoundHttpException) {
            return 'Resource not found.';
        }

        if ($e instanceof ModelNotFoundException) {
            return 'Resource not found.';
        }

        if ($e instanceof AuthenticationException) {
            return 'Unauthenticated.';
        }

        if ($e instanceof ThrottleRequestsException) {
            return 'Too many requests. Please try again later.';
        }

        if ($e instanceof ValidationException) {
            return 'The given data was invalid.';
        }

        if ($this->isHttpException($e) && $e->getStatusCode() === 403) {
            return 'This action is unauthorized.';
        }

        // In production, don't expose internal error details
        if (app()->environment('production')) {
            return 'An unexpected error occurred. Please try again later.';
        }

        return $e->getMessage();
    }
}
