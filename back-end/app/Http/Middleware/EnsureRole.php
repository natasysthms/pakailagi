<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Pemeriksaan peran di awal alur (Green SE, konteks sistem poin h):
 * request tanpa hak akses ditolak sebelum menyentuh controller dan database.
 *
 * Pemakaian di route: ->middleware('role:admin') atau ->middleware('role:konsumen,penjual')
 */
class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! $user->loadMissing('role')->hasRole(...$roles)) {
            return response()->json(['message' => 'Anda tidak memiliki akses ke fitur ini.'], 403);
        }

        return $next($request);
    }
}
