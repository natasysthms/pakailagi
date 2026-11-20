<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Front end membaca array/objek JSON langsung, tanpa pembungkus { "data": ... }
        JsonResource::withoutWrapping();

        // Green SE: mencegah N+1 query. Saat development, lazy loading pada koleksi akan memunculkan error
        // sehingga setiap relasi wajib dimuat dengan eager loading (with()).
        Model::preventLazyLoading(! $this->app->isProduction());

        // Batas request per menit untuk route yang memakai throttle:api
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(60)->by($request->user()?->id ?: $request->ip()));
    }
}
