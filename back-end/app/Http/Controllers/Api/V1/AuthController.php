<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Services\ProfileBuilder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    /** Peran dari front end ('consumer' | 'seller') dipetakan ke tabel roles. */
    private const ROLE_MAP = ['consumer' => Role::KONSUMEN, 'seller' => Role::PENJUAL];

    /** POST /auth/register (FR-A1) */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in(array_keys(self::ROLE_MAP))],
            'phone' => ['nullable', 'string', 'max:20'],
            // opsional untuk penjual/thrift shop/organisasi
            'partnerType' => ['nullable', Rule::in(['thrift_shop', 'organisasi_donasi'])],
            'storeName' => ['nullable', 'string', 'max:150'],
            'city' => ['nullable', 'string', 'max:100'],
        ]);

        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'role_id' => Role::where('name', self::ROLE_MAP[$data['role']])->value('id'),
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => $data['password'], // di-hash otomatis oleh cast 'hashed'
            ]);

            if ($data['role'] === 'seller') {
                $user->partnerProfile()->create([
                    'partner_type' => $data['partnerType'] ?? 'thrift_shop',
                    'name' => $data['storeName'] ?? $data['name'],
                    'city' => $data['city'] ?? null,
                    'phone' => $data['phone'] ?? null,
                    'is_verified' => false, // diverifikasi admin (FR-A5)
                ]);
            }

            return $user;
        });

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil didaftarkan.',
            'token' => $user->createToken('web')->plainTextToken,
            'user' => new UserResource($user->load(['role', 'partnerProfile'])),
        ], 201);
    }

    /** POST /auth/login (FR-A2) */
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::with(['role', 'partnerProfile'])->where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['success' => false, 'message' => 'Email atau kata sandi salah.'], 422);
        }

        if (! $user->is_active) {
            return response()->json(['success' => false, 'message' => 'Akun Anda dinonaktifkan oleh administrator.'], 403);
        }

        return response()->json([
            'success' => true,
            'message' => "Selamat datang kembali, {$user->name}.",
            'token' => $user->createToken('web')->plainTextToken,
            'user' => new UserResource($user),
        ]);
    }

    /** POST /auth/logout — token yang sedang dipakai dihapus */
    public function logout(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    /** GET /auth/me — profil lengkap untuk halaman Profil */
    public function me(Request $request, ProfileBuilder $profiles): JsonResponse
    {
        return response()->json($profiles->build($request->user()));
    }
}
