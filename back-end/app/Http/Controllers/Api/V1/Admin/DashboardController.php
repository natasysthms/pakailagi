<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Garment;
use App\Models\PartnerProfile;
use App\Models\RepairService;
use App\Models\Transaction;
use App\Models\User;
use App\Services\ImpactCalculator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

/** Dashboard admin (FR-E5). Statistik diambil dengan query GROUP BY dan disimpan di cache 5 menit. */
class DashboardController extends Controller
{
    /** GET /admin/stats */
    public function stats(ImpactCalculator $impact): JsonResponse
    {
        $stats = Cache::remember('admin.stats', now()->addMinutes(5), fn () => [
            'usersByRole' => User::query()
                ->join('roles', 'roles.id', '=', 'users.role_id')
                ->selectRaw('roles.name AS role, COUNT(*) AS total')
                ->groupBy('roles.name')
                ->pluck('total', 'role'),
            'inactiveUsers' => User::query()->where('is_active', false)->count(),
            'garmentsByStatus' => Garment::query()
                ->selectRaw("CONCAT(listing_type, '.', status) AS k, COUNT(*) AS total")
                ->groupBy('listing_type', 'status')
                ->pluck('total', 'k'),
            'transactionsByStatus' => Transaction::query()
                ->selectRaw('status, COUNT(*) AS total')
                ->groupBy('status')
                ->pluck('total', 'status'),
            'pendingPartnerVerifications' => PartnerProfile::query()->where('is_verified', false)->count(),
            'pendingRepairServices' => RepairService::query()->where('is_verified', false)->count(),
        ]);

        return response()->json($stats + ['impact' => $impact->summary()]);
    }
}
