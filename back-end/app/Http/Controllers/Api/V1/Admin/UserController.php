<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/** Pengelolaan pengguna oleh admin (FR-A5) */
class UserController extends Controller
{
    /** GET /admin/users?role=&q=&page= */
    public function index(Request $request)
    {
        $page = User::query()
            ->with(['role', 'partnerProfile'])
            ->when($request->role, fn ($q, $r) => $q->whereHas('role', fn ($q) => $q->where('name', $r)))
            ->when($request->q, fn ($q, $term) => $q->where(fn ($w) => $w->where('name', 'like', "%{$term}%")->orWhere('email', 'like', "%{$term}%")))
            ->latest()
            ->paginate(20);

        return UserResource::collection($page); // berisi data + meta paginasi
    }

    /** PATCH /admin/users/{user}/status — body: { isActive: true|false } */
    public function updateStatus(Request $request, User $user): JsonResponse
    {
        $data = $request->validate(['isActive' => ['required', 'boolean']]);
        abort_if((int) $user->id === (int) $request->user()->id, 422, 'Admin tidak dapat menonaktifkan akunnya sendiri.');

        $user->update(['is_active' => $data['isActive']]);

        if (! $data['isActive']) {
            $user->tokens()->delete(); // langsung keluar dari semua perangkat
        }

        Cache::forget('admin.stats');

        return response()->json(['success' => true, 'message' => $data['isActive'] ? 'Akun diaktifkan.' : 'Akun dinonaktifkan.']);
    }

    /** PATCH /admin/users/{user}/verify-partner — body: { verified: true|false } */
    public function verifyPartner(Request $request, User $user): JsonResponse
    {
        $data = $request->validate(['verified' => ['required', 'boolean']]);
        abort_unless($user->partnerProfile, 404, 'Pengguna ini tidak memiliki profil mitra.');

        $user->partnerProfile->update(['is_verified' => $data['verified']]);
        Cache::forget('admin.stats');

        return response()->json(['success' => true, 'message' => 'Status verifikasi mitra diperbarui.']);
    }
}
