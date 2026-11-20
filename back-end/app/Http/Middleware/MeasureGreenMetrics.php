<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class MeasureGreenMetrics
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        DB::enableQueryLog();
        $start = hrtime(true);
        $response = $next($request);

        $response->headers->set('X-Query-Count', (string) count(DB::getQueryLog()));
        $response->headers->set('X-Response-Time-Ms', (string) round((hrtime(true) - $start) / 1e6, 1));
        $response->headers->set('X-Payload-Bytes', (string) strlen($response->getContent()));

        return $response;

    }
}
