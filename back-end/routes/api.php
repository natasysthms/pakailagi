<?php

use App\Http\Controllers\Api\V1\Admin;
use App\Http\Controllers\Api\V1\ArtisanController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CareGuideController;
use App\Http\Controllers\Api\V1\DonationController;
use App\Http\Controllers\Api\V1\ImpactController;
use App\Http\Controllers\Api\V1\MasterDataController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\RepairRecordController;
use App\Http\Controllers\Api\V1\TransactionController;
use Illuminate\Support\Facades\Route;

/*
| Semua route di file ini otomatis diawali /api, lalu dikelompokkan ke /api/v1.
|
| Green SE:
| - Route publik yang jarang berubah memakai middleware cache.headers (Cache-Control + ETag).
|   Jika data tidak berubah, server membalas 304 Not Modified tanpa mengirim ulang isi respons.
| - Route privat diperiksa token (auth:sanctum) dan peran (role:...) SEBELUM masuk controller.
*/

Route::prefix('v1')->group(function () {

    // ── Autentikasi (dibatasi 10 percobaan per menit) ───────────────────────────
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('/auth/register', [AuthController::class, 'register']);
        Route::post('/auth/login', [AuthController::class, 'login']);
    });

    // ── Publik: data yang jarang berubah (cache browser 1 jam) ───────────────────
    Route::middleware('cache.headers:public;max_age=3600;etag')->group(function () {
        Route::get('/categories', [MasterDataController::class, 'categories']);
        Route::get('/fabric-types', [MasterDataController::class, 'fabricTypes']);
        Route::get('/care-guides', [CareGuideController::class, 'index']);
        Route::get('/care-guides/{slug}', [CareGuideController::class, 'show']);
        Route::get('/artisans', [ArtisanController::class, 'index']);
        Route::get('/artisans/{repairService}', [ArtisanController::class, 'show']);
        Route::get('/impact/emission-factors', [ImpactController::class, 'emissionFactors']);
    });

    // ── Publik: data yang lebih sering berubah (cache browser 1 menit) ──────────
    Route::middleware('cache.headers:public;max_age=60;etag')->group(function () {
        Route::get('/products', [ProductController::class, 'index']);
        Route::get('/products/featured', [ProductController::class, 'featured']); // harus di atas /products/{id}
        Route::get('/products/{id}', [ProductController::class, 'show']);
        Route::get('/donations/org-needs', [DonationController::class, 'orgNeeds']);
        Route::get('/donations/donor-items', [DonationController::class, 'donorItems']);
        Route::get('/impact/summary', [ImpactController::class, 'summary']);
        Route::get('/impact/scenarios', [ImpactController::class, 'scenarios']);
        Route::get('/impact/scenarios/{key}', [ImpactController::class, 'scenario']);
        Route::get('/impact/categories', [ImpactController::class, 'categories']);
    });

    Route::post('/artisans/register', [ArtisanController::class, 'register'])->middleware('throttle:5,1');

    // ── Wajib login ─────────────────────────────────────────────────────────────
    Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        Route::put('/users/me', [ProfileController::class, 'update']);
        Route::get('/users/me/activity', [ProfileController::class, 'activity']);
        Route::get('/users/me/inventory', [ProfileController::class, 'inventory']);
        Route::get('/users/me/seller-queue', [ProfileController::class, 'sellerQueue']);

        // Konsumen & penjual (admin tidak bertransaksi)
        Route::middleware('role:konsumen,penjual')->group(function () {
            Route::post('/products', [ProductController::class, 'store']);
            Route::post('/products/{garment}/purchase', [ProductController::class, 'purchase']);

            Route::post('/donations/upload', [DonationController::class, 'upload']);
            Route::post('/donations/commit', [DonationController::class, 'commit']);
            Route::post('/donations/request', [DonationController::class, 'requestByBody']);
            Route::post('/donations/{garment}/request', [DonationController::class, 'requestItem']);

            Route::get('/repair-records', [RepairRecordController::class, 'index']);
            Route::post('/repair-records', [RepairRecordController::class, 'store']);
        });

        // Pemilik penawaran (dicek di controller) atau admin.
        // PUT tidak bisa membawa file (keterbatasan PHP), jadi untuk ubah foto pakai POST.
        Route::match(['put', 'post'], '/products/{garment}/update', [ProductController::class, 'update']);
        Route::delete('/products/{garment}', [ProductController::class, 'destroy']);

        Route::get('/transactions', [TransactionController::class, 'index']);
        Route::post('/transactions/{transaction}/approve', [TransactionController::class, 'approve']);
        Route::post('/transactions/{transaction}/reject', [TransactionController::class, 'reject']);
        Route::post('/transactions/{transaction}/complete', [TransactionController::class, 'complete']);
        Route::post('/transactions/{transaction}/cancel', [TransactionController::class, 'cancel']);

        // ── Admin ────────────────────────────────────────────────────────────────
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('/stats', [Admin\DashboardController::class, 'stats']);

            Route::get('/users', [Admin\UserController::class, 'index']);
            Route::patch('/users/{user}/status', [Admin\UserController::class, 'updateStatus']);
            Route::patch('/users/{user}/verify-partner', [Admin\UserController::class, 'verifyPartner']);

            Route::get('/garments', [Admin\GarmentModerationController::class, 'index']);
            Route::patch('/garments/{garment}/archive', [Admin\GarmentModerationController::class, 'archive']);

            Route::get('/emission-factors', [Admin\ParameterController::class, 'emissionFactors']);
            Route::put('/emission-factors/{emissionFactor}', [Admin\ParameterController::class, 'updateEmissionFactor']);
            Route::get('/displacement-scenarios', [Admin\ParameterController::class, 'displacementScenarios']);
            Route::put('/displacement-scenarios/{displacementScenario}', [Admin\ParameterController::class, 'updateDisplacementScenario']);

            Route::post('/care-guides', [Admin\CareGuideController::class, 'store']);
            Route::put('/care-guides/{careGuide}', [Admin\CareGuideController::class, 'update']);
            Route::delete('/care-guides/{careGuide}', [Admin\CareGuideController::class, 'destroy']);

            Route::get('/repair-services', [Admin\RepairServiceController::class, 'index']);
            Route::put('/repair-services/{repairService}', [Admin\RepairServiceController::class, 'update']);
            Route::delete('/repair-services/{repairService}', [Admin\RepairServiceController::class, 'destroy']);
        });
    });
});
