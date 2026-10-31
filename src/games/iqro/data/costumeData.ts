import { CostumeItem } from '../../../core/types/gameTypes';

export const COSTUME_ITEMS: CostumeItem[] = [
  // Topi / Peci
  {
    id: 'hat-default',
    name: 'Peci Hitam Emas',
    category: 'hat',
    price: 0,
    icon: '🎩',
    description: 'Peci klasik Boni yang anggun dan santun.'
  },
  {
    id: 'hat-red',
    name: 'Peci Merah Ceria',
    category: 'hat',
    price: 30,
    icon: '🔴',
    description: 'Peci merah terang yang bersemangat!'
  },
  {
    id: 'hat-gold',
    name: 'Mahkota Emas Juara',
    category: 'hat',
    price: 80,
    icon: '👑',
    description: 'Mahkota kemilau bagi santri cilik berprestasi.'
  },
  {
    id: 'hat-turban',
    name: 'Sorban Putih Bersih',
    category: 'hat',
    price: 120,
    icon: '👳',
    description: 'Sorban putih yang sejuk dan menenangkan.'
  },

  // Kacamata
  {
    id: 'glasses-none',
    name: 'Tanpa Kacamata',
    category: 'glasses',
    price: 0,
    icon: '👀',
    description: 'Mata alami Boni yang jernih dan bulat.'
  },
  {
    id: 'glasses-round',
    name: 'Kacamata Bulat Cerdas',
    category: 'glasses',
    price: 50,
    icon: '👓',
    description: 'Membuat Boni tampak seperti profesor cilik!'
  },
  {
    id: 'glasses-star',
    name: 'Kacamata Bintang Gaul',
    category: 'glasses',
    price: 90,
    icon: '⭐',
    description: 'Kacamata berbentuk bintang kemilau yang asyik.'
  },

  // Jubah
  {
    id: 'cape-none',
    name: 'Tanpa Jubah',
    category: 'cape',
    price: 0,
    icon: '🕊️',
    description: 'Sayap bulbul bebas terbang santai.'
  },
  {
    id: 'cape-hero',
    name: 'Jubah Pahlawan Hijau',
    category: 'cape',
    price: 100,
    icon: '🦸',
    description: 'Jubah pahlawan penuntut ilmu Al-Qur\'an!'
  },
  {
    id: 'cape-rainbow',
    name: 'Jubah Pelangi Berkilau',
    category: 'cape',
    price: 160,
    icon: '🌈',
    description: 'Jubah dengan warna-warni pelangi ceria.'
  }
];
