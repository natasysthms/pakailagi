<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SimulationData
{
    public const COMPLETED = [
        // kode kategori => [preloved, donasi, diperbaiki]   (satuan: potong)
        'ATASAN'     => [40, 22, 8],
        'CELANA_ROK' => [30, 12, 5],
        'DENIM'      => [20,  6, 6],
        'OUTERWEAR'  => [16,  6, 4],
        'ANAK'       => [14, 14, 2],
        // Total     => 120, 60, 25
    ];

    /** Transaksi dan reparasi disebar ke rentang hari terakhir ini (agar grafik per periode terisi). */
    public const SPREAD_DAYS = 90;
}