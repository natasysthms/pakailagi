<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\ProfileBuilder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Profil pengguna yang sedang login (FR-A4).
 * Memakai /users/me agar pengguna tidak bisa membuka atau mengubah profil orang lain lewat id.
 */
class ProfileController extends Controller
{
    public function __construct(private ProfileBuilder $profiles)
    {
    }

    /** PUT /users/me — body: name?, phone?, password?, partner{name, city, address, phone, description}? */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'email' => ['sometimes', 'email', 'max:150', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['sometimes', 'string', 'min:8'],
            'partner' => ['sometimes', 'array'],
            'partner.name' => ['sometimes', 'string', 'max:150'],
            'partner.city' => ['sometimes', 'nullable', 'string', 'max:100'],
            'partner.address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'partner.phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'partner.description' => ['sometimes', 'nullable', 'string', 'max:1000'],
        ]);

        $user->update(collect($data)->except('partner')->all());

        if (isset($data['partner']) && $user->partnerProfile) {
            $user->partnerProfile->update($data['partner']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil diperbarui.',
            'user' => new UserResource($user->load(['role', 'partnerProfile'])),
        ]);
    }

    /** GET /users/me/activity */
    public function activity(Request $request): JsonResponse
    {
        return response()->json($this->profiles->activities($request->user()));
    }

    /** GET /users/me/inventory */
    public function inventory(Request $request): JsonResponse
    {
        return response()->json($this->profiles->inventory($request->user()));
    }

    /** GET /users/me/seller-queue — permintaan masuk untuk pakaian milik pengguna */
    public function sellerQueue(Request $request): JsonResponse
    {
        return response()->json($this->profiles->incomingRequests($request->user()));
    }
}
