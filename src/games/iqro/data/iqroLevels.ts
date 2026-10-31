import { IqroBook } from '../../../core/types/gameTypes';

export const IQRO_BOOKS: IqroBook[] = [
  {
    level: 1,
    title: 'Iqro 1',
    subtitle: 'Huruf Tunggal Fathah (A - Ya)',
    color: '#58CC02',
    totalStages: 15,
    units: [
      {
        id: 'iqro1-u1',
        unitNumber: 1,
        title: 'Unit 1: Gerbang Hijaiyah (A, Ba, Ta, Tsa)',
        description: 'Mengenal bentuk dasar garis dan mangkok bertitik',
        themeColor: '#58CC02',
        stages: [
          {
            id: 'iqro1-u1-s1',
            title: 'Kenalan Huruf A & Ba',
            subtitle: 'Dengar dan ketuk kartu huruf yang benar',
            type: 'listen-tap',
            unitNumber: 1,
            stageNumber: 1,
            unlockedByDefault: true,
            lettersCovered: ['اَ', 'بَ'],
            questions: [
              {
                id: 'q1',
                type: 'listen-tap',
                promptText: 'Ayo cari huruf BA!',
                targetLetter: 'بَ',
                targetName: 'Ba',
                options: [
                  { letter: 'بَ', name: 'Ba', isCorrect: true },
                  { letter: 'اَ', name: 'A', isCorrect: false }
                ],
                hint: 'Ba memiliki satu titik mangkok di bawah!'
              },
              {
                id: 'q2',
                type: 'listen-tap',
                promptText: 'Yang mana huruf A?',
                targetLetter: 'اَ',
                targetName: 'A',
                options: [
                  { letter: 'بَ', name: 'Ba', isCorrect: false },
                  { letter: 'اَ', name: 'A', isCorrect: true }
                ],
                hint: 'A berdiri tegak lurus seperti pensil!'
              },
              {
                id: 'q3',
                type: 'tracing',
                promptText: 'Ayo coba tulis huruf BA!',
                targetLetter: 'بَ',
                targetName: 'Ba',
                options: []
              }
            ]
          },
          {
            id: 'iqro1-u1-s2',
            title: 'Keluarga Piring: Ta & Tsa',
            subtitle: 'Hitung titik di atas piring!',
            type: 'listen-tap',
            unitNumber: 1,
            stageNumber: 2,
            lettersCovered: ['تَ', 'ثَ'],
            questions: [
              {
                id: 'q4',
                type: 'listen-tap',
                promptText: 'Cari huruf TA (Dua titik di atas)!',
                targetLetter: 'تَ',
                targetName: 'Ta',
                options: [
                  { letter: 'تَ', name: 'Ta', isCorrect: true },
                  { letter: 'بَ', name: 'Ba', isCorrect: false },
                  { letter: 'اَ', name: 'A', isCorrect: false }
                ]
              },
              {
                id: 'q5',
                type: 'listen-tap',
                promptText: 'Cari huruf TSA (Tiga titik permen)!',
                targetLetter: 'ثَ',
                targetName: 'Tsa',
                options: [
                  { letter: 'ثَ', name: 'Tsa', isCorrect: true },
                  { letter: 'تَ', name: 'Ta', isCorrect: false },
                  { letter: 'بَ', name: 'Ba', isCorrect: false }
                ]
              }
            ]
          },
          {
            id: 'iqro1-u1-s3',
            title: 'Pesta Gelembung Balon',
            subtitle: 'Pecahkan gelembung huruf yang disebutkan!',
            type: 'bubble-pop',
            unitNumber: 1,
            stageNumber: 3,
            lettersCovered: ['اَ', 'بَ', 'تَ', 'ثَ'],
            questions: [
              {
                id: 'q6',
                type: 'bubble-pop',
                promptText: 'Letuskan balon huruf BA!',
                targetLetter: 'بَ',
                targetName: 'Ba',
                options: [
                  { letter: 'بَ', name: 'Ba', isCorrect: true },
                  { letter: 'اَ', name: 'A', isCorrect: false },
                  { letter: 'تَ', name: 'Ta', isCorrect: false },
                  { letter: 'ثَ', name: 'Tsa', isCorrect: false }
                ]
              },
              {
                id: 'q7',
                type: 'bubble-pop',
                promptText: 'Letuskan balon huruf TA!',
                targetLetter: 'تَ',
                targetName: 'Ta',
                options: [
                  { letter: 'اَ', name: 'A', isCorrect: false },
                  { letter: 'تَ', name: 'Ta', isCorrect: true },
                  { letter: 'بَ', name: 'Ba', isCorrect: false }
                ]
              }
            ]
          },
          {
            id: 'iqro1-u1-s4',
            title: 'Tantangan Mahkota Bintang',
            subtitle: 'Uji kemampuan Unit 1!',
            type: 'boss-challenge',
            unitNumber: 1,
            stageNumber: 4,
            lettersCovered: ['اَ', 'بَ', 'تَ', 'ثَ'],
            questions: [
              {
                id: 'q8',
                type: 'listen-tap',
                promptText: 'Pilih huruf A!',
                targetLetter: 'اَ',
                targetName: 'A',
                options: [
                  { letter: 'اَ', name: 'A', isCorrect: true },
                  { letter: 'بَ', name: 'Ba', isCorrect: false },
                  { letter: 'تَ', name: 'Ta', isCorrect: false }
                ]
              },
              {
                id: 'q9',
                type: 'listen-tap',
                promptText: 'Pilih huruf TSA!',
                targetLetter: 'ثَ',
                targetName: 'Tsa',
                options: [
                  { letter: 'ثَ', name: 'Tsa', isCorrect: true },
                  { letter: 'تَ', name: 'Ta', isCorrect: false },
                  { letter: 'بَ', name: 'Ba', isCorrect: false }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'iqro1-u2',
        unitNumber: 2,
        title: 'Unit 2: Tiga Sekawan Bebek (Ja, Ha, Kha)',
        description: 'Mengenal bentuk lengkung berpenghuni',
        themeColor: '#1CB0F6',
        stages: [
          {
            id: 'iqro1-u2-s1',
            title: 'Huruf JA Telur di Perut',
            subtitle: 'Dengarkan suara JA yang mantap',
            type: 'listen-tap',
            unitNumber: 2,
            stageNumber: 1,
            lettersCovered: ['جَ', 'حَ'],
            questions: [
              {
                id: 'q10',
                type: 'listen-tap',
                promptText: 'Cari huruf JA!',
                targetLetter: 'جَ',
                targetName: 'Ja',
                options: [
                  { letter: 'جَ', name: 'Ja', isCorrect: true },
                  { letter: 'حَ', name: 'Ha', isCorrect: false }
                ]
              }
            ]
          },
          {
            id: 'iqro1-u2-s2',
            title: 'Huruf HA Bersih & KHA Topi',
            subtitle: 'Bedakan nafas bersih dan getar tenggorokan',
            type: 'listen-tap',
            unitNumber: 2,
            stageNumber: 2,
            lettersCovered: ['حَ', 'خَ'],
            questions: [
              {
                id: 'q11',
                type: 'listen-tap',
                promptText: 'Cari huruf KHA bertopi!',
                targetLetter: 'خَ',
                targetName: 'Kha',
                options: [
                  { letter: 'خَ', name: 'Kha', isCorrect: true },
                  { letter: 'حَ', name: 'Ha', isCorrect: false }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'iqro1-u3',
        unitNumber: 3,
        title: 'Unit 3: Mulut Buaya & Perosotan (Da, Dza, Ro, Za)',
        description: 'Mengenal huruf tajam dan perosotan meluncur',
        themeColor: '#FF9600',
        stages: [
          {
            id: 'iqro1-u3-s1',
            title: 'Mulut Buaya: Da & Dza',
            subtitle: 'Dengar dan ketuk hurufnya',
            type: 'listen-tap',
            unitNumber: 3,
            stageNumber: 1,
            lettersCovered: ['دَ', 'ذَ'],
            questions: [
              {
                id: 'q12',
                type: 'listen-tap',
                promptText: 'Mana huruf DA?',
                targetLetter: 'دَ',
                targetName: 'Da',
                options: [
                  { letter: 'دَ', name: 'Da', isCorrect: true },
                  { letter: 'ذَ', name: 'Dza', isCorrect: false }
                ]
              },
              {
                id: 'q13',
                type: 'listen-tap',
                promptText: 'Cari huruf DZA!',
                targetLetter: 'ذَ',
                targetName: 'Dza',
                options: [
                  { letter: 'ذَ', name: 'Dza', isCorrect: true },
                  { letter: 'دَ', name: 'Da', isCorrect: false }
                ]
              }
            ]
          },
          {
            id: 'iqro1-u3-s2',
            title: 'Perosotan Meluncur: Ro & Za',
            subtitle: 'Lidah bergetar dan desis lampu di atas',
            type: 'listen-tap',
            unitNumber: 3,
            stageNumber: 2,
            lettersCovered: ['رَ', 'زَ'],
            questions: [
              {
                id: 'q14',
                type: 'listen-tap',
                promptText: 'Ayo cari huruf RO!',
                targetLetter: 'رَ',
                targetName: 'Ro',
                options: [
                  { letter: 'رَ', name: 'Ro', isCorrect: true },
                  { letter: 'زَ', name: 'Za', isCorrect: false }
                ]
              },
              {
                id: 'q15',
                type: 'listen-tap',
                promptText: 'Yang mana huruf ZA?',
                targetLetter: 'زَ',
                targetName: 'Za',
                options: [
                  { letter: 'زَ', name: 'Za', isCorrect: true },
                  { letter: 'رَ', name: 'Ro', isCorrect: false }
                ]
              },
              {
                id: 'q16',
                type: 'tracing',
                promptText: 'Ayo coba tulis huruf RO!',
                targetLetter: 'رَ',
                targetName: 'Ro',
                options: []
              }
            ]
          },
          {
            id: 'iqro1-u3-s3',
            title: 'Pesta Balon Meluncur',
            subtitle: 'Letuskan balon Da, Dza, Ro, dan Za!',
            type: 'bubble-pop',
            unitNumber: 3,
            stageNumber: 3,
            lettersCovered: ['دَ', 'ذَ', 'رَ', 'زَ'],
            questions: [
              {
                id: 'q17',
                type: 'bubble-pop',
                promptText: 'Letuskan balon huruf DA!',
                targetLetter: 'دَ',
                targetName: 'Da',
                options: [
                  { letter: 'دَ', name: 'Da', isCorrect: true },
                  { letter: 'ذَ', name: 'Dza', isCorrect: false },
                  { letter: 'رَ', name: 'Ro', isCorrect: false },
                  { letter: 'زَ', name: 'Za', isCorrect: false }
                ]
              },
              {
                id: 'q18',
                type: 'bubble-pop',
                promptText: 'Letuskan balon huruf ZA!',
                targetLetter: 'زَ',
                targetName: 'Za',
                options: [
                  { letter: 'زَ', name: 'Za', isCorrect: true },
                  { letter: 'رَ', name: 'Ro', isCorrect: false },
                  { letter: 'دَ', name: 'Da', isCorrect: false }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    level: 2,
    title: 'Iqro 2',
    subtitle: 'Huruf Sambung & Bacaan Panjang (Mad Asli)',
    color: '#1CB0F6',
    totalStages: 16,
    units: [
      {
        id: 'iqro2-u1',
        unitNumber: 1,
        title: 'Unit 1: Kereta Huruf Gandeng Dua',
        description: 'Huruf yang bisa disambung di awal dan akhir',
        themeColor: '#1CB0F6',
        stages: [
          {
            id: 'iqro2-u1-s1',
            title: 'Garis Sambung Ba-Ta-Tsa',
            subtitle: 'Melihat perubahan kepala huruf saat digandeng',
            type: 'listen-tap',
            unitNumber: 1,
            stageNumber: 1,
            lettersCovered: ['بَتَ', 'تَبَ'],
            questions: []
          }
        ]
      }
    ]
  },
  {
    level: 3,
    title: 'Iqro 3',
    subtitle: 'Harakat Kasrah (i) & Dhammah (u)',
    color: '#FF9600',
    totalStages: 16,
    units: [
      {
        id: 'iqro3-u1',
        unitNumber: 1,
        title: 'Unit 1: Bunyi A, I, U yang Ceria',
        description: 'Mengenal perosotan kasrah dan kepala dhammah',
        themeColor: '#FF9600',
        stages: []
      }
    ]
  },
  {
    level: 4,
    title: 'Iqro 4',
    subtitle: 'Tanwin, Sukun (Mati) & Qolqolah Membal',
    color: '#CE82FF',
    totalStages: 18,
    units: [
      {
        id: 'iqro4-u1',
        unitNumber: 1,
        title: 'Unit 1: Gemuruh Tanwin (An, In, Un)',
        description: 'Mengenal harakat kembar dua',
        themeColor: '#CE82FF',
        stages: []
      }
    ]
  },
  {
    level: 5,
    title: 'Iqro 5',
    subtitle: 'Tasydid Bertumpuk & Tanda Waqaf Berhenti',
    color: '#EC4899',
    totalStages: 18,
    units: [
      {
        id: 'iqro5-u1',
        unitNumber: 1,
        title: 'Unit 1: Gerigi Tasydid yang Bertenaga',
        description: 'Menekan huruf ganda dengan irama',
        themeColor: '#EC4899',
        stages: []
      }
    ]
  },
  {
    level: 6,
    title: 'Iqro 6',
    subtitle: 'Hukum Tajwid & Siap Membaca Al-Qur\'an',
    color: '#EAB308',
    totalStages: 20,
    units: [
      {
        id: 'iqro6-u1',
        unitNumber: 1,
        title: 'Unit 1: Senandung Dengung Nun & Mim',
        description: 'Membaca potongan ayat suci Al-Qur\'an',
        themeColor: '#EAB308',
        stages: []
      }
    ]
  }
];
