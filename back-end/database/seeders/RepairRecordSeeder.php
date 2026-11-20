<?php

namespace Database\Seeders;

use App\Models\GarmentCategory;
use App\Models\RepairRecord;
use App\Models\RepairService;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Membuat catatan pakaian yang diperbaiki sesuai kolom "Diperbaiki" di Tabel 4.1 (SimulationData::COMPLETED).
 * Hanya indikator di dashboard, tidak masuk perhitungan CO2e.
 */
class RepairRecordSeeder extends Seeder
{
    public function run(): void
    {
        $categories = GarmentCategory::pluck('id', 'code');
        $consumers = User::whereHas('role', fn ($q) => $q->where('name', 'konsumen'))->orderBy('id')->pluck('id')->all();
        $services = RepairService::where('is_verified', true)->orderBy('id')->pluck('id')->all();

        $sequence = 0;
        foreach (SimulationData::COMPLETED as $code => [, , $repairCount]) {
            for ($i = 1; $i <= $repairCount; $i++, $sequence++) {
                $selfRepair = $sequence % 3 === 2 || ! $services; // sebagian diperbaiki sendiri

                RepairRecord::create([
                    'user_id' => $consumers[$sequence % count($consumers)],
                    'garment_category_id' => $categories[$code],
                    'repair_service_id' => $selfRepair ? null : $services[$sequence % count($services)],
                    'repaired_at' => now()->subDays(($sequence * 5) % SimulationData::SPREAD_DAYS + 1)->toDateString(),
                    'notes' => $selfRepair ? 'Diperbaiki sendiri (simulasi)' : 'Reparasi di layanan mitra (simulasi)',
                ]);
            }
        }
    }
}
