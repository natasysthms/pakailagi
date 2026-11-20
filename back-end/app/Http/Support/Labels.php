<?php

namespace App\Support;

/** Label status yang ditampilkan front end (bahasa Indonesia). */
class Labels
{
    public static function garmentStatus(string $status, string $pathway = 'preloved'): string
    {
        return match ($status) {
            'tersedia' => 'Tersedia',
            'dipesan' => $pathway === 'donasi' ? 'Menunggu Pengambilan' : 'Dipesan',
            'selesai' => $pathway === 'donasi' ? 'Tersalurkan' : 'Terjual',
            'diarsipkan' => 'Diarsipkan',
            default => ucfirst($status),
        };
    }

    public static function transactionStatus(string $status): string
    {
        return match ($status) {
            'diajukan' => 'MENUNGGU RESPON',
            'disepakati' => 'DISEPAKATI (SIAP SERAH TERIMA)',
            'selesai' => 'SELESAI',
            'dibatalkan' => 'DIBATALKAN',
            default => strtoupper($status),
        };
    }

    /** statusType dipakai front end untuk warna badge */
    public static function transactionStatusType(string $status): string
    {
        return match ($status) {
            'diajukan' => 'pending',
            'disepakati' => 'agreed',
            'selesai' => 'completed',
            default => 'cancelled',
        };
    }

    public static function initials(string $name): string
    {
        return collect(preg_split('/\s+/', trim($name)))
            ->filter()
            ->map(fn ($word) => mb_strtoupper(mb_substr($word, 0, 1)))
            ->take(2)
            ->implode('');
    }

    public static function kg(float $value): string
    {
        return number_format($value, 1, ',', '.');
    }
}
