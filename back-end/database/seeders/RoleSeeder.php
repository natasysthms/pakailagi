<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            Role::KONSUMEN => 'Konsumen',
            Role::PENJUAL => 'Penjual / Thrift Shop / Organisasi',
            Role::ADMIN => 'Administrator',
        ] as $name => $label) {
            Role::create(['name' => $name, 'label' => $label]);
        }
    }
}
