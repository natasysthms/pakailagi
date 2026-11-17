export const mockImpactScenarios = {
  konservatif: {
    rateText: '25%',
    rateNumber: 25,
    label: 'Skenario Konservatif',
    emission: '9.280',
    metricTotal: '9.280 KG',
    desc: 'Mengasumsikan hanya 25% pembeli sirkular yang mengurungkan niat membeli busana baru di toko retail.',
    equiv: 'Setara ~38.700 km perjalanan mobil bensin konvensional',
    trees: '~464 Bibit Dewasa / Tahun'
  },
  standar: {
    rateText: '45%',
    rateNumber: 45,
    label: 'Skenario Dasar (Default)',
    emission: '14.850',
    metricTotal: '14.850 KG',
    desc: 'Mengasumsikan 45% sirkulasi pakaian bekas secara riil menunda produksi garmen baru yang membutuhkan pasokan air masif dan energi fosil.',
    equiv: 'Setara ~62.000 km perjalanan mobil bensin konvensional',
    trees: '~742 Bibit Dewasa / Tahun'
  },
  optimis: {
    rateText: '70%',
    rateNumber: 70,
    label: 'Skenario Optimis',
    emission: '23.100',
    metricTotal: '23.100 KG',
    desc: 'Mengasumsikan 70% sirkulasi garmen preloved sukses mensubstitusi kebutuhan konsumsi fast-fashion baru.',
    equiv: 'Setara ~96.500 km perjalanan mobil bensin konvensional',
    trees: '~1.155 Bibit Dewasa / Tahun'
  }
};

export const mockImpactCategories = [
  {
    name: 'Denim & Celana Tebal',
    emission: '5.640 kg CO₂e',
    percentage: 38,
    colorClass: 'bg-primary-container',
    dotColor: '#01472e'
  },
  {
    name: 'Atasan Katun & Kemeja',
    emission: '4.820 kg CO₂e',
    percentage: 32,
    colorClass: 'bg-secondary',
    dotColor: '#566342'
  },
  {
    name: 'Outerwear & Jaket',
    emission: '2.980 kg CO₂e',
    percentage: 20,
    colorClass: 'bg-on-secondary-container',
    dotColor: '#5a6745'
  },
  {
    name: 'Gaun & Busana Lainnya',
    emission: '1.410 kg CO₂e',
    percentage: 10,
    colorClass: 'bg-secondary-fixed-dim',
    dotColor: '#becca3'
  }
];

export const mockTextileEmissionFactors = [
  { material: 'Denim', value: '15.2 kg CO₂e/kg' },
  { material: 'Katun', value: '8.5 kg CO₂e/kg' },
  { material: 'Poliester', value: '6.4 kg CO₂e/kg' }
];
