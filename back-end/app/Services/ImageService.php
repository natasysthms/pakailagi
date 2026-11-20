<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

/**
 * Pemroses Gambar (konteks sistem 3.2.3, poin d).
 * Foto diproses SEKALI saat diunggah: diperkecil, dikonversi ke WebP, dan dibuatkan thumbnail.
 * Katalog hanya memakai thumbnail; gambar penuh hanya dimuat di halaman detail.
 *
 * Butuh: composer require intervention/image:^3  (ekstensi PHP GD aktif)
 */
class ImageService
{
    private const FULL_MAX_WIDTH = 1200;
    private const FULL_QUALITY = 75;
    private const THUMB_SIZE = 400;
    private const THUMB_QUALITY = 70;

    private ImageManager $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * @return array{path: string, thumbnail_path: string}
     */
    public function storeGarmentImage(UploadedFile $file): array
    {
        $name = Str::uuid()->toString();
        $path = "garments/{$name}.webp";
        $thumbnailPath = "garments/thumbs/{$name}.webp";

        $full = $this->manager->read($file->getRealPath())
            ->scaleDown(width: self::FULL_MAX_WIDTH)
            ->toWebp(quality: self::FULL_QUALITY);

        $thumbnail = $this->manager->read($file->getRealPath())
            ->cover(self::THUMB_SIZE, self::THUMB_SIZE)
            ->toWebp(quality: self::THUMB_QUALITY);

        Storage::disk('public')->put($path, (string) $full);
        Storage::disk('public')->put($thumbnailPath, (string) $thumbnail);

        return ['path' => $path, 'thumbnail_path' => $thumbnailPath];
    }

    public function delete(?string ...$paths): void
    {
        foreach ($paths as $path) {
            if ($path && ! str_starts_with($path, 'http')) {
                Storage::disk('public')->delete($path);
            }
        }
    }

    /** Ubah path penyimpanan menjadi URL publik. URL eksternal (data dummy) dikembalikan apa adanya. */
    public static function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return str_starts_with($path, 'http') ? $path : Storage::disk('public')->url($path);
    }
}
