import { IqroBook } from '../../../core/types/gameTypes';

export const IQRO_BOOKS: IqroBook[] = [
  {
    level: 1,
    title: 'Iqro 1',
    subtitle: 'Huruf Tunggal Fathah (A - Ya)',
    color: '#58CC02',
    totalStages: 22,
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
      },
      {
        id: 'iqro1-u4',
        unitNumber: 4,
        title: 'Unit 4: Gigi Sisir & Balon Ajaib (Sa, Sya, Sho, Dho)',
        description: 'Mengenal gerigi desis tajam dan balon lonjong berekor mangkok',
        themeColor: '#3B82F6',
        stages: [
          {
            id: 'iqro1-u4-s1',
            title: 'Gerigi Sisir: Sa & Sya',
            subtitle: 'Desis halus dan tiga bintang di atas',
            type: 'listen-tap',
            unitNumber: 4,
            stageNumber: 1,
            lettersCovered: ['سَ', 'شَ'],
            questions: [
              {
                id: 'q19',
                type: 'listen-tap',
                promptText: 'Ayo cari huruf SA!',
                targetLetter: 'سَ',
                targetName: 'Sa',
                options: [
                  { letter: 'سَ', name: 'Sa', isCorrect: true },
                  { letter: 'شَ', name: 'Sya', isCorrect: false },
                  { letter: 'زَ', name: 'Za', isCorrect: false }
                ],
                hint: 'Sa memiliki 3 gerigi sisir tanpa titik!'
              },
              {
                id: 'q20',
                type: 'listen-tap',
                promptText: 'Yang mana huruf SYA?',
                targetLetter: 'شَ',
                targetName: 'Sya',
                options: [
                  { letter: 'شَ', name: 'Sya', isCorrect: true },
                  { letter: 'سَ', name: 'Sa', isCorrect: false },
                  { letter: 'ثَ', name: 'Tsa', isCorrect: false }
                ],
                hint: 'Sya punya 3 titik bintang di atas gerigi!'
              },
              {
                id: 'q21',
                type: 'tracing',
                promptText: 'Ayo coba tulis huruf SA!',
                targetLetter: 'سَ',
                targetName: 'Sa',
                options: []
              }
            ]
          },
          {
            id: 'iqro1-u4-s2',
            title: 'Balon Berbalut Mangkok: Sho & Dho',
            subtitle: 'Suara tebal bertekanan mantap',
            type: 'listen-tap',
            unitNumber: 4,
            stageNumber: 2,
            lettersCovered: ['صَ', 'ضَ'],
            questions: [
              {
                id: 'q22',
                type: 'listen-tap',
                promptText: 'Cari huruf SHO!',
                targetLetter: 'صَ',
                targetName: 'Sho',
                options: [
                  { letter: 'صَ', name: 'Sho', isCorrect: true },
                  { letter: 'ضَ', name: 'Dho', isCorrect: false },
                  { letter: 'سَ', name: 'Sa', isCorrect: false }
                ],
                hint: 'Sho bentuknya seperti balon lonjong berekor mangkok!'
              },
              {
                id: 'q23',
                type: 'listen-tap',
                promptText: 'Yang mana huruf DHO?',
                targetLetter: 'ضَ',
                targetName: 'Dho',
                options: [
                  { letter: 'ضَ', name: 'Dho', isCorrect: true },
                  { letter: 'صَ', name: 'Sho', isCorrect: false },
                  { letter: 'شَ', name: 'Sya', isCorrect: false }
                ],
                hint: 'Dho adalah balon lonjong bermahkota satu titik!'
              },
              {
                id: 'q24',
                type: 'tracing',
                promptText: 'Ayo coba tulis huruf SHO!',
                targetLetter: 'صَ',
                targetName: 'Sho',
                options: []
              }
            ]
          },
          {
            id: 'iqro1-u4-s3',
            title: 'Pesta Balon Sisir & Balon',
            subtitle: 'Letuskan gelembung Sa, Sya, Sho, dan Dho!',
            type: 'bubble-pop',
            unitNumber: 4,
            stageNumber: 3,
            lettersCovered: ['سَ', 'شَ', 'صَ', 'ضَ'],
            questions: [
              {
                id: 'q25',
                type: 'bubble-pop',
                promptText: 'Letuskan balon huruf SYA!',
                targetLetter: 'شَ',
                targetName: 'Sya',
                options: [
                  { letter: 'شَ', name: 'Sya', isCorrect: true },
                  { letter: 'سَ', name: 'Sa', isCorrect: false },
                  { letter: 'صَ', name: 'Sho', isCorrect: false },
                  { letter: 'ضَ', name: 'Dho', isCorrect: false }
                ]
              },
              {
                id: 'q26',
                type: 'bubble-pop',
                promptText: 'Letuskan balon huruf DHO!',
                targetLetter: 'ضَ',
                targetName: 'Dho',
                options: [
                  { letter: 'ضَ', name: 'Dho', isCorrect: true },
                  { letter: 'صَ', name: 'Sho', isCorrect: false },
                  { letter: 'سَ', name: 'Sa', isCorrect: false }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'iqro1-u5',
        unitNumber: 5,
        title: 'Unit 5: Tongkat Bendera & Lengkungan Unik (Tho, Zho, \'Ain, Ghoin)',
        description: 'Mengenal huruf tongkat kokoh dan lengkungan angka terbuka',
        themeColor: '#84CC16',
        stages: [
          {
            id: 'iqro1-u5-s1',
            title: 'Tongkat Bendera: Tho & Zho',
            subtitle: 'Tongkat tegak berdiri gagah',
            type: 'listen-tap',
            unitNumber: 5,
            stageNumber: 1,
            lettersCovered: ['طَ', 'ظَ'],
            questions: [
              {
                id: 'q27',
                type: 'listen-tap',
                promptText: 'Ayo cari huruf THO!',
                targetLetter: 'طَ',
                targetName: 'Tho',
                options: [
                  { letter: 'طَ', name: 'Tho', isCorrect: true },
                  { letter: 'ظَ', name: 'Zho', isCorrect: false },
                  { letter: 'صَ', name: 'Sho', isCorrect: false }
                ],
                hint: 'Tho memiliki tongkat tegak berdiri tanpa titik!'
              },
              {
                id: 'q28',
                type: 'listen-tap',
                promptText: 'Yang mana huruf ZHO?',
                targetLetter: 'ظَ',
                targetName: 'Zho',
                options: [
                  { letter: 'ظَ', name: 'Zho', isCorrect: true },
                  { letter: 'طَ', name: 'Tho', isCorrect: false },
                  { letter: 'ضَ', name: 'Dho', isCorrect: false }
                ],
                hint: 'Zho memiliki tongkat dengan satu titik di sampingnya!'
              },
              {
                id: 'q29',
                type: 'tracing',
                promptText: 'Ayo coba tulis huruf THO!',
                targetLetter: 'طَ',
                targetName: 'Tho',
                options: []
              }
            ]
          },
          {
            id: 'iqro1-u5-s2',
            title: 'Lengkungan Bersih: \'Ain & Ghoin',
            subtitle: 'Suara tenggorokan bersih dan berkumur lembut',
            type: 'listen-tap',
            unitNumber: 5,
            stageNumber: 2,
            lettersCovered: ['عَ', 'غَ'],
            questions: [
              {
                id: 'q30',
                type: 'listen-tap',
                promptText: 'Ayo cari huruf \'AIN!',
                targetLetter: 'عَ',
                targetName: "'A",
                options: [
                  { letter: 'عَ', name: "'A", isCorrect: true },
                  { letter: 'غَ', name: 'Gho', isCorrect: false },
                  { letter: 'حَ', name: 'Ha', isCorrect: false }
                ],
                hint: "'Ain berbentuk seperti angka terbalik yang bersih!"
              },
              {
                id: 'q31',
                type: 'listen-tap',
                promptText: 'Yang mana huruf GHOIN?',
                targetLetter: 'غَ',
                targetName: 'Gho',
                options: [
                  { letter: 'غَ', name: 'Gho', isCorrect: true },
                  { letter: 'عَ', name: "'A", isCorrect: false },
                  { letter: 'خَ', name: 'Kho', isCorrect: false }
                ],
                hint: 'Ghoin memiliki mahkota satu titik di atas kepalanya!'
              },
              {
                id: 'q32',
                type: 'tracing',
                promptText: 'Ayo coba tulis huruf \'AIN!',
                targetLetter: 'عَ',
                targetName: "'A",
                options: []
              }
            ]
          },
          {
            id: 'iqro1-u5-s3',
            title: 'Tantangan Tongkat & Lengkungan',
            subtitle: 'Letuskan balon Tho, Zho, \'Ain, dan Ghoin!',
            type: 'bubble-pop',
            unitNumber: 5,
            stageNumber: 3,
            lettersCovered: ['طَ', 'ظَ', 'عَ', 'غَ'],
            questions: [
              {
                id: 'q33',
                type: 'bubble-pop',
                promptText: 'Letuskan balon huruf THO!',
                targetLetter: 'طَ',
                targetName: 'Tho',
                options: [
                  { letter: 'طَ', name: 'Tho', isCorrect: true },
                  { letter: 'ظَ', name: 'Zho', isCorrect: false },
                  { letter: 'عَ', name: "'A", isCorrect: false },
                  { letter: 'غَ', name: 'Gho', isCorrect: false }
                ]
              },
              {
                id: 'q34',
                type: 'bubble-pop',
                promptText: 'Letuskan balon huruf GHOIN!',
                targetLetter: 'غَ',
                targetName: 'Gho',
                options: [
                  { letter: 'غَ', name: 'Gho', isCorrect: true },
                  { letter: 'عَ', name: "'A", isCorrect: false },
                  { letter: 'طَ', name: 'Tho', isCorrect: false }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'iqro1-u6',
        unitNumber: 6,
        title: 'Unit 6: Perahu Layar & Gagang Payung (Fa, Qof, Kaf, Lam)',
        description: 'Mengenal mangkok berleher, kursi nyaman, dan payung melengkung',
        themeColor: '#A855F7',
        stages: [
          {
            id: 'iqro1-u6-s1',
            title: 'Mangkok Berleher: Fa & Qof',
            subtitle: 'Satu titik piring dan dua titik mangkok dalam',
            type: 'listen-tap',
            unitNumber: 6,
            stageNumber: 1,
            lettersCovered: ['فَ', 'قَ'],
            questions: [
              {
                id: 'q35',
                type: 'listen-tap',
                promptText: 'Ayo cari huruf FA!',
                targetLetter: 'فَ',
                targetName: 'Fa',
                options: [
                  { letter: 'فَ', name: 'Fa', isCorrect: true },
                  { letter: 'قَ', name: 'Qo', isCorrect: false },
                  { letter: 'بَ', name: 'Ba', isCorrect: false }
                ],
                hint: 'Fa memiliki leher melengkung dengan 1 titik di atas!'
              },
              {
                id: 'q36',
                type: 'listen-tap',
                promptText: 'Yang mana huruf QOF?',
                targetLetter: 'قَ',
                targetName: 'Qo',
                options: [
                  { letter: 'قَ', name: 'Qo', isCorrect: true },
                  { letter: 'فَ', name: 'Fa', isCorrect: false },
                  { letter: 'تَ', name: 'Ta', isCorrect: false }
                ],
                hint: 'Qof mangkoknya lebih dalam dengan 2 titik di atas!'
              },
              {
                id: 'q37',
                type: 'tracing',
                promptText: 'Ayo coba tulis huruf FA!',
                targetLetter: 'فَ',
                targetName: 'Fa',
                options: []
              }
            ]
          },
          {
            id: 'iqro1-u6-s2',
            title: 'Kursi Nyaman & Gagang Payung: Kaf & Lam',
            subtitle: 'Kursi berhamzah kecil dan gagang payung tinggi',
            type: 'listen-tap',
            unitNumber: 6,
            stageNumber: 2,
            lettersCovered: ['كَ', 'لَ'],
            questions: [
              {
                id: 'q38',
                type: 'listen-tap',
                promptText: 'Ayo cari huruf KAF!',
                targetLetter: 'كَ',
                targetName: 'Ka',
                options: [
                  { letter: 'كَ', name: 'Ka', isCorrect: true },
                  { letter: 'لَ', name: 'La', isCorrect: false },
                  { letter: 'اَ', name: 'A', isCorrect: false }
                ],
                hint: 'Kaf seperti kursi bersandar yang punya hiasan kecil di dalamnya!'
              },
              {
                id: 'q39',
                type: 'listen-tap',
                promptText: 'Yang mana huruf LAM?',
                targetLetter: 'لَ',
                targetName: 'La',
                options: [
                  { letter: 'لَ', name: 'La', isCorrect: true },
                  { letter: 'كَ', name: 'Ka', isCorrect: false },
                  { letter: 'اَ', name: 'A', isCorrect: false }
                ],
                hint: 'Lam melengkung ke bawah seperti gagang payung!'
              },
              {
                id: 'q40',
                type: 'tracing',
                promptText: 'Ayo coba tulis huruf LAM!',
                targetLetter: 'لَ',
                targetName: 'La',
                options: []
              }
            ]
          },
          {
            id: 'iqro1-u6-s3',
            title: 'Pesta Balon Pelaut Cilik',
            subtitle: 'Letuskan gelembung Fa, Qof, Kaf, dan Lam!',
            type: 'bubble-pop',
            unitNumber: 6,
            stageNumber: 3,
            lettersCovered: ['فَ', 'قَ', 'كَ', 'لَ'],
            questions: [
              {
                id: 'q41',
                type: 'bubble-pop',
                promptText: 'Pecahkan balon huruf QOF!',
                targetLetter: 'قَ',
                targetName: 'Qo',
                options: [
                  { letter: 'قَ', name: 'Qo', isCorrect: true },
                  { letter: 'فَ', name: 'Fa', isCorrect: false },
                  { letter: 'كَ', name: 'Ka', isCorrect: false },
                  { letter: 'لَ', name: 'La', isCorrect: false }
                ]
              },
              {
                id: 'q42',
                type: 'bubble-pop',
                promptText: 'Pecahkan balon huruf KAF!',
                targetLetter: 'كَ',
                targetName: 'Ka',
                options: [
                  { letter: 'كَ', name: 'Ka', isCorrect: true },
                  { letter: 'لَ', name: 'La', isCorrect: false },
                  { letter: 'قَ', name: 'Qo', isCorrect: false }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'iqro1-u7',
        unitNumber: 7,
        title: 'Unit 7: Istana Akhir & Wisuda Hijaiyah (Mim, Nun, Wau, Ha, Ya)',
        description: 'Menuntaskan seluruh 28 huruf hijaiyah dan menyambut mahkota kelulusan!',
        themeColor: '#FFB800',
        stages: [
          {
            id: 'iqro1-u7-s1',
            title: 'Sendok & Mangkuk Mutiara: Mim & Nun',
            subtitle: 'Sendok melengkung dan mangkuk telur di tengah',
            type: 'listen-tap',
            unitNumber: 7,
            stageNumber: 1,
            lettersCovered: ['مَ', 'نَ'],
            questions: [
              {
                id: 'q43',
                type: 'listen-tap',
                promptText: 'Ayo cari huruf MIM!',
                targetLetter: 'مَ',
                targetName: 'Ma',
                options: [
                  { letter: 'مَ', name: 'Ma', isCorrect: true },
                  { letter: 'نَ', name: 'Na', isCorrect: false },
                  { letter: 'وَ', name: 'Wa', isCorrect: false }
                ],
                hint: 'Mim melingkar di kepala seperti sendok terbalik!'
              },
              {
                id: 'q44',
                type: 'listen-tap',
                promptText: 'Yang mana huruf NUN?',
                targetLetter: 'نَ',
                targetName: 'Na',
                options: [
                  { letter: 'نَ', name: 'Na', isCorrect: true },
                  { letter: 'مَ', name: 'Ma', isCorrect: false },
                  { letter: 'بَ', name: 'Ba', isCorrect: false }
                ],
                hint: 'Nun mangkok bulat dengan 1 butir mutiara di tengahnya!'
              },
              {
                id: 'q45',
                type: 'tracing',
                promptText: 'Ayo coba tulis huruf MIM!',
                targetLetter: 'مَ',
                targetName: 'Ma',
                options: []
              }
            ]
          },
          {
            id: 'iqro1-u7-s2',
            title: 'Roda Lingkar: Wau & Ha',
            subtitle: 'Angka sembilan melingkar dan donat bundar',
            type: 'listen-tap',
            unitNumber: 7,
            stageNumber: 2,
            lettersCovered: ['وَ', 'هَ'],
            questions: [
              {
                id: 'q46',
                type: 'listen-tap',
                promptText: 'Ayo cari huruf WAU!',
                targetLetter: 'وَ',
                targetName: 'Wa',
                options: [
                  { letter: 'وَ', name: 'Wa', isCorrect: true },
                  { letter: 'هَ', name: 'Ha', isCorrect: false },
                  { letter: 'رَ', name: 'Ro', isCorrect: false }
                ],
                hint: 'Wau kepalanya melingkar seperti angka sembilan!'
              },
              {
                id: 'q47',
                type: 'listen-tap',
                promptText: 'Yang mana huruf HA (Besar)?',
                targetLetter: 'هَ',
                targetName: 'Ha',
                options: [
                  { letter: 'هَ', name: 'Ha', isCorrect: true },
                  { letter: 'وَ', name: 'Wa', isCorrect: false },
                  { letter: 'حَ', name: 'Ha', isCorrect: false }
                ],
                hint: 'Ha besar bentuknya melingkar manis seperti donat!'
              },
              {
                id: 'q48',
                type: 'tracing',
                promptText: 'Ayo coba tulis huruf WAU!',
                targetLetter: 'وَ',
                targetName: 'Wa',
                options: []
              }
            ]
          },
          {
            id: 'iqro1-u7-s3',
            title: 'Bebek Berenang: Huruf YA',
            subtitle: 'Huruf pamungkas penutup ke-28 hijaiyah',
            type: 'listen-tap',
            unitNumber: 7,
            stageNumber: 3,
            lettersCovered: ['يَ'],
            questions: [
              {
                id: 'q49',
                type: 'listen-tap',
                promptText: 'Ayo cari huruf YA!',
                targetLetter: 'يَ',
                targetName: 'Ya',
                options: [
                  { letter: 'يَ', name: 'Ya', isCorrect: true },
                  { letter: 'بَ', name: 'Ba', isCorrect: false },
                  { letter: 'تَ', name: 'Ta', isCorrect: false }
                ],
                hint: 'Ya berbentuk bebek berenang dengan 2 titik di bawah!'
              },
              {
                id: 'q50',
                type: 'tracing',
                promptText: 'Ayo coba tulis huruf YA!',
                targetLetter: 'يَ',
                targetName: 'Ya',
                options: []
              }
            ]
          },
          {
            id: 'iqro1-u7-s4',
            title: 'Pesta Wisuda Akbar 28 Hijaiyah!',
            subtitle: 'Uji pamungkas kelulusan santri cilik bintang emas',
            type: 'bubble-pop',
            unitNumber: 7,
            stageNumber: 4,
            lettersCovered: ['اَ', 'جَ', 'سَ', 'طَ', 'قَ', 'مَ', 'يَ'],
            questions: [
              {
                id: 'q51',
                type: 'bubble-pop',
                promptText: 'Wisuda! Pecahkan huruf pertama: Huruf A!',
                targetLetter: 'اَ',
                targetName: 'A',
                options: [
                  { letter: 'اَ', name: 'A', isCorrect: true },
                  { letter: 'بَ', name: 'Ba', isCorrect: false },
                  { letter: 'تَ', name: 'Ta', isCorrect: false },
                  { letter: 'ثَ', name: 'Tsa', isCorrect: false }
                ]
              },
              {
                id: 'q52',
                type: 'bubble-pop',
                promptText: 'Hebat! Sekarang letuskan huruf MIM!',
                targetLetter: 'مَ',
                targetName: 'Ma',
                options: [
                  { letter: 'مَ', name: 'Ma', isCorrect: true },
                  { letter: 'نَ', name: 'Na', isCorrect: false },
                  { letter: 'وَ', name: 'Wa', isCorrect: false },
                  { letter: 'هَ', name: 'Ha', isCorrect: false }
                ]
              },
              {
                id: 'q53',
                type: 'bubble-pop',
                promptText: 'Luar biasa! Pecahkan huruf pamungkas: Huruf YA!',
                targetLetter: 'يَ',
                targetName: 'Ya',
                options: [
                  { letter: 'يَ', name: 'Ya', isCorrect: true },
                  { letter: 'هَ', name: 'Ha', isCorrect: false },
                  { letter: 'وَ', name: 'Wa', isCorrect: false },
                  { letter: 'نَ', name: 'Na', isCorrect: false }
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
    totalStages: 28,
    units: [
      {
        id: 'iqro2-u1',
        unitNumber: 1,
        title: 'Unit 1: Kereta Gerbong Ba-Ta-Tsa-Nun-Ya',
        description: 'Mengenal huruf bertitik yang mirip saat dirangkai bersambung',
        themeColor: '#1CB0F6',
        stages: [
          {
            id: 'iqro2-u1-s1',
            title: 'Garis Sambung: Ba & Ta',
            subtitle: 'Melihat perubahan kepala huruf saat digandeng dua',
            type: 'listen-tap',
            unitNumber: 1,
            stageNumber: 1,
            unlockedByDefault: true,
            lettersCovered: ['بَتَ', 'تَبَ'],
            questions: [
              {
                id: 'q201',
                type: 'listen-tap',
                promptText: 'Ayo cari bacaan: BA - TA!',
                targetLetter: 'بَتَ',
                targetName: 'Ba-Ta',
                options: [
                  { letter: 'بَتَ', name: 'Ba-Ta', isCorrect: true },
                  { letter: 'تَبَ', name: 'Ta-Ba', isCorrect: false },
                  { letter: 'ثَبَ', name: 'Tsa-Ba', isCorrect: false }
                ],
                hint: 'Ba di depan titiknya di bawah, Ta di belakang dua titik di atas!'
              },
              {
                id: 'q202',
                type: 'listen-tap',
                promptText: 'Yang mana bacaan: TA - BA?',
                targetLetter: 'تَبَ',
                targetName: 'Ta-Ba',
                options: [
                  { letter: 'تَبَ', name: 'Ta-Ba', isCorrect: true },
                  { letter: 'بَتَ', name: 'Ba-Ta', isCorrect: false },
                  { letter: 'ثَتَ', name: 'Tsa-Ta', isCorrect: false }
                ],
                hint: 'Ta di depan dua titik di atas, Ba di belakang titiknya di bawah!'
              },
              {
                id: 'q203',
                type: 'tracing',
                promptText: 'Ayo coba tulis sambung: BA - TA!',
                targetLetter: 'بَتَ',
                targetName: 'Ba-Ta',
                options: []
              }
            ]
          },
          {
            id: 'iqro2-u1-s2',
            title: 'Sahabat Masuk: Nun & Ya',
            subtitle: 'Mangkuk Nun dan Bebek Ya berubah menjadi gigi sambung',
            type: 'listen-tap',
            unitNumber: 1,
            stageNumber: 2,
            lettersCovered: ['نَبَ', 'يَتَ'],
            questions: [
              {
                id: 'q204',
                type: 'listen-tap',
                promptText: 'Cari bacaan: NA - BA!',
                targetLetter: 'نَبَ',
                targetName: 'Na-Ba',
                options: [
                  { letter: 'نَبَ', name: 'Na-Ba', isCorrect: true },
                  { letter: 'بَنَ', name: 'Ba-Na', isCorrect: false },
                  { letter: 'يَتَ', name: 'Ya-Ta', isCorrect: false }
                ],
                hint: 'Nun di awal punya satu titik di atas gerigi!'
              },
              {
                id: 'q205',
                type: 'listen-tap',
                promptText: 'Yang mana bacaan: YA - TA?',
                targetLetter: 'يَتَ',
                targetName: 'Ya-Ta',
                options: [
                  { letter: 'يَتَ', name: 'Ya-Ta', isCorrect: true },
                  { letter: 'تَيَ', name: 'Ta-Ya', isCorrect: false },
                  { letter: 'نَتَ', name: 'Na-Ta', isCorrect: false }
                ],
                hint: 'Ya saat di awal punya dua titik di bawah gerigi!'
              },
              {
                id: 'q206',
                type: 'tracing',
                promptText: 'Ayo tulis sambung: YA - TA!',
                targetLetter: 'يَتَ',
                targetName: 'Ya-Ta',
                options: []
              }
            ]
          },
          {
            id: 'iqro2-u1-s3',
            title: 'Rangkaian Tiga Gerbong',
            subtitle: 'Menggandeng 3 huruf sekaligus dalam satu kata',
            type: 'listen-tap',
            unitNumber: 1,
            stageNumber: 3,
            lettersCovered: ['بَتَثَ', 'ثَبَتَ'],
            questions: [
              {
                id: 'q207',
                type: 'listen-tap',
                promptText: 'Cari kata tiga huruf: BA - TA - TSA!',
                targetLetter: 'بَتَثَ',
                targetName: 'Ba-Ta-Tsa',
                options: [
                  { letter: 'بَتَثَ', name: 'Ba-Ta-Tsa', isCorrect: true },
                  { letter: 'ثَبَتَ', name: 'Tsa-Ba-Ta', isCorrect: false },
                  { letter: 'تَبَثَ', name: 'Ta-Ba-Tsa', isCorrect: false }
                ],
                hint: 'Perhatikan urutan titik: bawah (Ba), dua atas (Ta), tiga permen (Tsa)!'
              },
              {
                id: 'q208',
                type: 'listen-tap',
                promptText: 'Yang mana kata: TSA - BA - TA?',
                targetLetter: 'ثَبَتَ',
                targetName: 'Tsa-Ba-Ta',
                options: [
                  { letter: 'ثَبَتَ', name: 'Tsa-Ba-Ta', isCorrect: true },
                  { letter: 'بَتَثَ', name: 'Ba-Ta-Tsa', isCorrect: false },
                  { letter: 'نَبَتَ', name: 'Na-Ba-Ta', isCorrect: false }
                ],
                hint: 'Tsa di depan bertitik tiga, Ba di tengah, Ta di belakang!'
              }
            ]
          },
          {
            id: 'iqro2-u1-s4',
            title: 'Pesta Balon Kereta Sambung',
            subtitle: 'Uji refleks menangkap kata bersambung',
            type: 'bubble-pop',
            unitNumber: 1,
            stageNumber: 4,
            lettersCovered: ['بَنَ', 'يَبَ', 'نَتَ'],
            questions: [
              {
                id: 'q209',
                type: 'bubble-pop',
                promptText: 'Pecahkan balon bacaan: BA - NA!',
                targetLetter: 'بَنَ',
                targetName: 'Ba-Na',
                options: [
                  { letter: 'بَنَ', name: 'Ba-Na', isCorrect: true },
                  { letter: 'نَبَ', name: 'Na-Ba', isCorrect: false },
                  { letter: 'تَبَ', name: 'Ta-Ba', isCorrect: false },
                  { letter: 'يَبَ', name: 'Ya-Ba', isCorrect: false }
                ]
              },
              {
                id: 'q210',
                type: 'bubble-pop',
                promptText: 'Letuskan balon bacaan: YA - BA!',
                targetLetter: 'يَبَ',
                targetName: 'Ya-Ba',
                options: [
                  { letter: 'يَبَ', name: 'Ya-Ba', isCorrect: true },
                  { letter: 'بَيَ', name: 'Ba-Ya', isCorrect: false },
                  { letter: 'تَيَ', name: 'Ta-Ya', isCorrect: false },
                  { letter: 'نَيَ', name: 'Na-Ya', isCorrect: false }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'iqro2-u2',
        unitNumber: 2,
        title: 'Unit 2: Ekor Bebek yang Bersembunyi',
        description: 'Ja, Ha, Kho kepalanya menggandeng dan ekornya terpotong di awal/tengah',
        themeColor: '#FF9600',
        stages: [
          {
            id: 'iqro2-u2-s1',
            title: 'Kepala Bebek Menggandeng: Ja & Ha',
            subtitle: 'Kepala bebek menyambung ke huruf berikutnya',
            type: 'listen-tap',
            unitNumber: 2,
            stageNumber: 1,
            lettersCovered: ['جَبَ', 'حَتَ'],
            questions: [
              {
                id: 'q211',
                type: 'listen-tap',
                promptText: 'Ayo cari bacaan: JA - BA!',
                targetLetter: 'جَبَ',
                targetName: 'Ja-Ba',
                options: [
                  { letter: 'جَبَ', name: 'Ja-Ba', isCorrect: true },
                  { letter: 'حَبَ', name: 'Ha-Ba', isCorrect: false },
                  { letter: 'خَبَ', name: 'Kho-Ba', isCorrect: false }
                ],
                hint: 'Ja di depan punya telur satu di bawahnya!'
              },
              {
                id: 'q212',
                type: 'listen-tap',
                promptText: 'Yang mana bacaan: HA - TA?',
                targetLetter: 'حَتَ',
                targetName: 'Ha-Ta',
                options: [
                  { letter: 'حَتَ', name: 'Ha-Ta', isCorrect: true },
                  { letter: 'جَتَ', name: 'Ja-Ta', isCorrect: false },
                  { letter: 'خَتَ', name: 'Kho-Ta', isCorrect: false }
                ],
                hint: 'Ha bersih tanpa titik sama sekali!'
              },
              {
                id: 'q213',
                type: 'tracing',
                promptText: 'Ayo coba tulis: JA - BA!',
                targetLetter: 'جَبَ',
                targetName: 'Ja-Ba',
                options: []
              }
            ]
          },
          {
            id: 'iqro2-u2-s2',
            title: 'Topi Mahkota: Kho di Awal & Tengah',
            subtitle: 'Bebek bertopi satu titik di atas kepala',
            type: 'listen-tap',
            unitNumber: 2,
            stageNumber: 2,
            lettersCovered: ['خَدَ', 'سَخَ'],
            questions: [
              {
                id: 'q214',
                type: 'listen-tap',
                promptText: 'Cari bacaan: KHO - DA!',
                targetLetter: 'خَدَ',
                targetName: 'Kho-Da',
                options: [
                  { letter: 'خَدَ', name: 'Kho-Da', isCorrect: true },
                  { letter: 'حَدَ', name: 'Ha-Da', isCorrect: false },
                  { letter: 'جَدَ', name: 'Ja-Da', isCorrect: false }
                ],
                hint: 'Kho memakai mahkota satu titik di atasnya!'
              },
              {
                id: 'q215',
                type: 'listen-tap',
                promptText: 'Yang mana bacaan: SA - KHO?',
                targetLetter: 'سَخَ',
                targetName: 'Sa-Kho',
                options: [
                  { letter: 'سَخَ', name: 'Sa-Kho', isCorrect: true },
                  { letter: 'سَحَ', name: 'Sa-Ha', isCorrect: false },
                  { letter: 'سَجَ', name: 'Sa-Ja', isCorrect: false }
                ],
                hint: 'Kho di akhir kembali memiliki ekor perut yang utuh!'
              },
              {
                id: 'q216',
                type: 'tracing',
                promptText: 'Ayo coba tulis: KHO - DA!',
                targetLetter: 'خَدَ',
                targetName: 'Kho-Da',
                options: []
              }
            ]
          },
          {
            id: 'iqro2-u2-s3',
            title: 'Kata 3 Huruf Bebek Bersambung',
            subtitle: 'Membaca kata utuh: Khoroja dan Najaha',
            type: 'listen-tap',
            unitNumber: 2,
            stageNumber: 3,
            lettersCovered: ['خَرَجَ', 'نَجَحَ'],
            questions: [
              {
                id: 'q217',
                type: 'listen-tap',
                promptText: 'Cari kata tiga huruf: KHO - RO - JA!',
                targetLetter: 'خَرَجَ',
                targetName: 'Kho-Ro-Ja',
                options: [
                  { letter: 'خَرَجَ', name: 'Kho-Ro-Ja', isCorrect: true },
                  { letter: 'دَخَلَ', name: 'Da-Kho-La', isCorrect: false },
                  { letter: 'نَجَحَ', name: 'Na-Ja-Ha', isCorrect: false }
                ],
                hint: 'Kho di awal, Ro meluncur di tengah, Ja berekor di akhir!'
              },
              {
                id: 'q218',
                type: 'listen-tap',
                promptText: 'Yang mana kata: NA - JA - HA?',
                targetLetter: 'نَجَحَ',
                targetName: 'Na-Ja-Ha',
                options: [
                  { letter: 'نَجَحَ', name: 'Na-Ja-Ha', isCorrect: true },
                  { letter: 'خَرَجَ', name: 'Kho-Ro-Ja', isCorrect: false },
                  { letter: 'جَعَلَ', name: 'Ja-\'A-La', isCorrect: false }
                ],
                hint: 'Nun di awal, Ja di tengah, Ha di akhir!'
              }
            ]
          },
          {
            id: 'iqro2-u2-s4',
            title: 'Pesta Balon Bebek Sambung',
            subtitle: 'Letuskan gelembung kata keluarga bebek',
            type: 'bubble-pop',
            unitNumber: 2,
            stageNumber: 4,
            lettersCovered: ['جَعَلَ', 'حَسَدَ', 'خَلَقَ'],
            questions: [
              {
                id: 'q219',
                type: 'bubble-pop',
                promptText: 'Letuskan balon kata: JA - \'A - LA!',
                targetLetter: 'جَعَلَ',
                targetName: 'Ja-\'A-La',
                options: [
                  { letter: 'جَعَلَ', name: 'Ja-\'A-La', isCorrect: true },
                  { letter: 'خَرَجَ', name: 'Kho-Ro-Ja', isCorrect: false },
                  { letter: 'نَجَحَ', name: 'Na-Ja-Ha', isCorrect: false },
                  { letter: 'حَسَدَ', name: 'Ha-Sa-Da', isCorrect: false }
                ]
              },
              {
                id: 'q220',
                type: 'bubble-pop',
                promptText: 'Letuskan balon kata: HA - SA - DA!',
                targetLetter: 'حَسَدَ',
                targetName: 'Ha-Sa-Da',
                options: [
                  { letter: 'حَسَدَ', name: 'Ha-Sa-Da', isCorrect: true },
                  { letter: 'جَعَلَ', name: 'Ja-\'A-La', isCorrect: false },
                  { letter: 'خَلَقَ', name: 'Kho-La-Qo', isCorrect: false },
                  { letter: 'نَجَحَ', name: 'Na-Ja-Ha', isCorrect: false }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'iqro2-u3',
        unitNumber: 3,
        title: 'Unit 3: Enam Huruf Mandiri',
        description: 'Alif, Da, Dza, Ro, Za, Wau hanya bisa disambung dari kanan',
        themeColor: '#06B6D4',
        stages: [
          {
            id: 'iqro2-u3-s1',
            title: 'Si Keras Kepala: Da & Dza',
            subtitle: 'Bisa digandeng dari belakang, pantang gandeng ke depan',
            type: 'listen-tap',
            unitNumber: 3,
            stageNumber: 1,
            lettersCovered: ['دَرَ', 'ذَهَ'],
            questions: [
              {
                id: 'q221',
                type: 'listen-tap',
                promptText: 'Ayo cari bacaan: DA - RO!',
                targetLetter: 'دَرَ',
                targetName: 'Da-Ro',
                options: [
                  { letter: 'دَرَ', name: 'Da-Ro', isCorrect: true },
                  { letter: 'ذَرَ', name: 'Dza-Ro', isCorrect: false },
                  { letter: 'رَدَ', name: 'Ro-Da', isCorrect: false }
                ],
                hint: 'Da tidak menyambung ke Ro karena huruf Da mandiri!'
              },
              {
                id: 'q222',
                type: 'listen-tap',
                promptText: 'Yang mana bacaan: DZA - HA?',
                targetLetter: 'ذَهَ',
                targetName: 'Dza-Ha',
                options: [
                  { letter: 'ذَهَ', name: 'Dza-Ha', isCorrect: true },
                  { letter: 'دَهَ', name: 'Da-Ha', isCorrect: false },
                  { letter: 'زَهَ', name: 'Za-Ha', isCorrect: false }
                ],
                hint: 'Dza memiliki satu titik di atasnya!'
              },
              {
                id: 'q223',
                type: 'tracing',
                promptText: 'Ayo coba tulis: DA - RO!',
                targetLetter: 'دَرَ',
                targetName: 'Da-Ro',
                options: []
              }
            ]
          },
          {
            id: 'iqro2-u3-s2',
            title: 'Perosotan Meluncur: Ro & Za Mandiri',
            subtitle: 'Meluncur bebas tanpa gandengan ke kiri',
            type: 'listen-tap',
            unitNumber: 3,
            stageNumber: 2,
            lettersCovered: ['رَزَ', 'زَرَ'],
            questions: [
              {
                id: 'q224',
                type: 'listen-tap',
                promptText: 'Cari bacaan: RO - ZA!',
                targetLetter: 'رَزَ',
                targetName: 'Ro-Za',
                options: [
                  { letter: 'رَزَ', name: 'Ro-Za', isCorrect: true },
                  { letter: 'زَرَ', name: 'Za-Ro', isCorrect: false },
                  { letter: 'دَرَ', name: 'Da-Ro', isCorrect: false }
                ],
                hint: 'Ro di depan tanpa titik, Za di belakang punya lampu titik!'
              },
              {
                id: 'q225',
                type: 'listen-tap',
                promptText: 'Yang mana bacaan: ZA - RO?',
                targetLetter: 'زَرَ',
                targetName: 'Za-Ro',
                options: [
                  { letter: 'زَرَ', name: 'Za-Ro', isCorrect: true },
                  { letter: 'رَزَ', name: 'Ro-Za', isCorrect: false },
                  { letter: 'ذَرَ', name: 'Dza-Ro', isCorrect: false }
                ],
                hint: 'Za di depan bertitik, Ro di belakang polos!'
              },
              {
                id: 'q226',
                type: 'tracing',
                promptText: 'Ayo coba tulis: RO - ZA!',
                targetLetter: 'رَزَ',
                targetName: 'Ro-Za',
                options: []
              }
            ]
          },
          {
            id: 'iqro2-u3-s3',
            title: 'Roda Wau & Alif Mandiri',
            subtitle: 'Angka 9 dan tiang lurus yang mandiri',
            type: 'listen-tap',
            unitNumber: 3,
            stageNumber: 3,
            lettersCovered: ['وَزَ', 'اَدَ'],
            questions: [
              {
                id: 'q227',
                type: 'listen-tap',
                promptText: 'Cari bacaan: WA - ZA!',
                targetLetter: 'وَزَ',
                targetName: 'Wa-Za',
                options: [
                  { letter: 'وَزَ', name: 'Wa-Za', isCorrect: true },
                  { letter: 'زَوَ', name: 'Za-Wa', isCorrect: false },
                  { letter: 'دَوَ', name: 'Da-Wa', isCorrect: false }
                ],
                hint: 'Wau melingkar kepalanya, lalu Za berdiri mandiri!'
              },
              {
                id: 'q228',
                type: 'listen-tap',
                promptText: 'Yang mana bacaan: A - DA?',
                targetLetter: 'اَدَ',
                targetName: 'A-Da',
                options: [
                  { letter: 'اَدَ', name: 'A-Da', isCorrect: true },
                  { letter: 'دَا', name: 'Daa', isCorrect: false },
                  { letter: 'اَذَ', name: 'A-Dza', isCorrect: false }
                ],
                hint: 'Alif berdiri lurus di depan, Da di belakang!'
              }
            ]
          },
          {
            id: 'iqro2-u3-s4',
            title: 'Petualangan Balon Huruf Mandiri',
            subtitle: 'Letuskan balon kata berhuruf mandiri',
            type: 'bubble-pop',
            unitNumber: 3,
            stageNumber: 4,
            lettersCovered: ['دَرَسَ', 'وَزَنَ', 'زَرَعَ'],
            questions: [
              {
                id: 'q229',
                type: 'bubble-pop',
                promptText: 'Letuskan balon kata: DA - RO - SA!',
                targetLetter: 'دَرَسَ',
                targetName: 'Da-Ro-Sa',
                options: [
                  { letter: 'دَرَسَ', name: 'Da-Ro-Sa', isCorrect: true },
                  { letter: 'وَزَنَ', name: 'Wa-Za-Na', isCorrect: false },
                  { letter: 'زَرَعَ', name: 'Za-Ro-\'A', isCorrect: false },
                  { letter: 'رَدَفَ', name: 'Ro-Da-Fa', isCorrect: false }
                ]
              },
              {
                id: 'q230',
                type: 'bubble-pop',
                promptText: 'Letuskan balon kata: WA - ZA - NA!',
                targetLetter: 'وَزَنَ',
                targetName: 'Wa-Za-Na',
                options: [
                  { letter: 'وَزَنَ', name: 'Wa-Za-Na', isCorrect: true },
                  { letter: 'دَرَسَ', name: 'Da-Ro-Sa', isCorrect: false },
                  { letter: 'زَرَعَ', name: 'Za-Ro-\'A', isCorrect: false },
                  { letter: 'رَزَقَ', name: 'Ro-Za-Qo', isCorrect: false }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'iqro2-u4',
        unitNumber: 4,
        title: 'Unit 4: Gigi Sisir, Balon & Tongkat',
        description: 'Mengenal sambungan Sa, Sya, Sho, Dho, Tho, dan Zho',
        themeColor: '#3B82F6',
        stages: [
          {
            id: 'iqro2-u4-s1',
            title: 'Sisir Menggandeng: Sa & Sya',
            subtitle: 'Ekor mangkuk hilang, gerigi siap menggandeng',
            type: 'listen-tap',
            unitNumber: 4,
            stageNumber: 1,
            lettersCovered: ['سَبَ', 'شَكَ'],
            questions: [
              {
                id: 'q231',
                type: 'listen-tap',
                promptText: 'Ayo cari bacaan: SA - BA!',
                targetLetter: 'سَبَ',
                targetName: 'Sa-Ba',
                options: [
                  { letter: 'سَبَ', name: 'Sa-Ba', isCorrect: true },
                  { letter: 'شَبَ', name: 'Sya-Ba', isCorrect: false },
                  { letter: 'صَبَ', name: 'Sho-Ba', isCorrect: false }
                ],
                hint: 'Sa tiga gerigi tanpa titik menyambung ke Ba!'
              },
              {
                id: 'q232',
                type: 'listen-tap',
                promptText: 'Yang mana bacaan: SYA - KA?',
                targetLetter: 'شَكَ',
                targetName: 'Sya-Ka',
                options: [
                  { letter: 'شَكَ', name: 'Sya-Ka', isCorrect: true },
                  { letter: 'سَكَ', name: 'Sa-Ka', isCorrect: false },
                  { letter: 'صَكَ', name: 'Sho-Ka', isCorrect: false }
                ],
                hint: 'Sya punya tiga titik bintang di atas gerigi!'
              },
              {
                id: 'q233',
                type: 'tracing',
                promptText: 'Ayo coba tulis: SA - BA!',
                targetLetter: 'سَبَ',
                targetName: 'Sa-Ba',
                options: []
              }
            ]
          },
          {
            id: 'iqro2-u4-s2',
            title: 'Balon & Tongkat: Sho, Dho, Tho, Zho',
            subtitle: 'Bentuk kokoh bertekanan tebal',
            type: 'listen-tap',
            unitNumber: 4,
            stageNumber: 2,
            lettersCovered: ['صَبَ', 'طَلَ'],
            questions: [
              {
                id: 'q234',
                type: 'listen-tap',
                promptText: 'Cari bacaan: SHO - BA!',
                targetLetter: 'صَبَ',
                targetName: 'Sho-Ba',
                options: [
                  { letter: 'صَبَ', name: 'Sho-Ba', isCorrect: true },
                  { letter: 'ضَبَ', name: 'Dho-Ba', isCorrect: false },
                  { letter: 'سَبَ', name: 'Sa-Ba', isCorrect: false }
                ],
                hint: 'Sho bentuknya lonjong menggandeng ke Ba!'
              },
              {
                id: 'q235',
                type: 'listen-tap',
                promptText: 'Yang mana bacaan: THO - LA?',
                targetLetter: 'طَلَ',
                targetName: 'Tho-La',
                options: [
                  { letter: 'طَلَ', name: 'Tho-La', isCorrect: true },
                  { letter: 'ظَلَ', name: 'Zho-La', isCorrect: false },
                  { letter: 'صَلَ', name: 'Sho-La', isCorrect: false }
                ],
                hint: 'Tho tongkatnya tegak berdiri kokoh!'
              },
              {
                id: 'q236',
                type: 'tracing',
                promptText: 'Ayo coba tulis: THO - LA!',
                targetLetter: 'طَلَ',
                targetName: 'Tho-La',
                options: []
              }
            ]
          },
          {
            id: 'iqro2-u4-s3',
            title: 'Kata 3 Huruf Penuh Ketangkasan',
            subtitle: 'Shobaro dan Nazhoro berirama fasih',
            type: 'listen-tap',
            unitNumber: 4,
            stageNumber: 3,
            lettersCovered: ['صَبَرَ', 'نَظَرَ'],
            questions: [
              {
                id: 'q237',
                type: 'listen-tap',
                promptText: 'Cari kata tiga huruf: SHO - BA - RO!',
                targetLetter: 'صَبَرَ',
                targetName: 'Sho-Ba-Ro',
                options: [
                  { letter: 'صَبَرَ', name: 'Sho-Ba-Ro', isCorrect: true },
                  { letter: 'شَكَرَ', name: 'Sya-Ka-Ro', isCorrect: false },
                  { letter: 'طَلَبَ', name: 'Tho-La-Ba', isCorrect: false }
                ],
                hint: 'Sho di depan, Ba di tengah, Ro meluncur di akhir!'
              },
              {
                id: 'q238',
                type: 'listen-tap',
                promptText: 'Yang mana kata: NA - ZHO - RO?',
                targetLetter: 'نَظَرَ',
                targetName: 'Na-Zho-Ro',
                options: [
                  { letter: 'نَظَرَ', name: 'Na-Zho-Ro', isCorrect: true },
                  { letter: 'طَلَبَ', name: 'Tho-La-Ba', isCorrect: false },
                  { letter: 'صَبَرَ', name: 'Sho-Ba-Ro', isCorrect: false }
                ],
                hint: 'Nun di awal, Zho bertongkat titik di tengah, Ro di akhir!'
              }
            ]
          },
          {
            id: 'iqro2-u4-s4',
            title: 'Pesta Balon Sisir & Tongkat',
            subtitle: 'Letuskan gelembung kata penuh semangat',
            type: 'bubble-pop',
            unitNumber: 4,
            stageNumber: 4,
            lettersCovered: ['شَكَرَ', 'طَلَبَ'],
            questions: [
              {
                id: 'q239',
                type: 'bubble-pop',
                promptText: 'Letuskan balon kata: SYA - KA - RO!',
                targetLetter: 'شَكَرَ',
                targetName: 'Sya-Ka-Ro',
                options: [
                  { letter: 'شَكَرَ', name: 'Sya-Ka-Ro', isCorrect: true },
                  { letter: 'صَبَرَ', name: 'Sho-Ba-Ro', isCorrect: false },
                  { letter: 'نَظَرَ', name: 'Na-Zho-Ro', isCorrect: false },
                  { letter: 'طَلَبَ', name: 'Tho-La-Ba', isCorrect: false }
                ]
              },
              {
                id: 'q240',
                type: 'bubble-pop',
                promptText: 'Letuskan balon kata: THO - LA - BA!',
                targetLetter: 'طَلَبَ',
                targetName: 'Tho-La-Ba',
                options: [
                  { letter: 'طَلَبَ', name: 'Tho-La-Ba', isCorrect: true },
                  { letter: 'نَظَرَ', name: 'Na-Zho-Ro', isCorrect: false },
                  { letter: 'شَكَرَ', name: 'Sya-Ka-Ro', isCorrect: false },
                  { letter: 'صَبَرَ', name: 'Sho-Ba-Ro', isCorrect: false }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'iqro2-u5',
        unitNumber: 5,
        title: 'Unit 5: Perubahan Bentuk Ajaib',
        description: 'Kaf petir, Lam payung, \'Ain segitiga, dan Ha pita kupu-kupu',
        themeColor: '#8B5CF6',
        stages: [
          {
            id: 'iqro2-u5-s1',
            title: 'Petir Ajaib & Payung: Kaf & Lam',
            subtitle: 'Kaf berubah bentuk miring dan Lam meliuk anggun',
            type: 'listen-tap',
            unitNumber: 5,
            stageNumber: 1,
            lettersCovered: ['كَتَ', 'لَبَ'],
            questions: [
              {
                id: 'q241',
                type: 'listen-tap',
                promptText: 'Ayo cari bacaan: KA - TA!',
                targetLetter: 'كَتَ',
                targetName: 'Ka-Ta',
                options: [
                  { letter: 'كَتَ', name: 'Ka-Ta', isCorrect: true },
                  { letter: 'لَتَ', name: 'La-Ta', isCorrect: false },
                  { letter: 'فَتَ', name: 'Fa-Ta', isCorrect: false }
                ],
                hint: 'Kaf saat di awal berbentuk garis miring bersimpul!'
              },
              {
                id: 'q242',
                type: 'listen-tap',
                promptText: 'Yang mana bacaan: LA - BA?',
                targetLetter: 'لَبَ',
                targetName: 'La-Ba',
                options: [
                  { letter: 'لَبَ', name: 'La-Ba', isCorrect: true },
                  { letter: 'كَبَ', name: 'Ka-Ba', isCorrect: false },
                  { letter: 'اَبَ', name: 'A-Ba', isCorrect: false }
                ],
                hint: 'Lam tinggi tegak menyambung ke huruf Ba!'
              },
              {
                id: 'q243',
                type: 'tracing',
                promptText: 'Ayo coba tulis sambung: KA - TA!',
                targetLetter: 'كَتَ',
                targetName: 'Ka-Ta',
                options: []
              }
            ]
          },
          {
            id: 'iqro2-u5-s2',
            title: 'Segitiga & Pita Kupu-Kupu: \'Ain & Ha',
            subtitle: '\'Ain di tengah jadi segitiga dan Ha jadi simpul pita',
            type: 'listen-tap',
            unitNumber: 5,
            stageNumber: 2,
            lettersCovered: ['مَعَ', 'فَهَ'],
            questions: [
              {
                id: 'q244',
                type: 'listen-tap',
                promptText: 'Cari bacaan: MA - \'A!',
                targetLetter: 'مَعَ',
                targetName: "Ma-'A",
                options: [
                  { letter: 'مَعَ', name: "Ma-'A", isCorrect: true },
                  { letter: 'مَغَ', name: 'Ma-Gho', isCorrect: false },
                  { letter: 'مَحَ', name: 'Ma-Ha', isCorrect: false }
                ],
                hint: "'Ain di akhir berbentuk segitiga lengkung tanpa titik!"
              },
              {
                id: 'q245',
                type: 'listen-tap',
                promptText: 'Yang mana bacaan: FA - HA?',
                targetLetter: 'فَهَ',
                targetName: 'Fa-Ha',
                options: [
                  { letter: 'فَهَ', name: 'Fa-Ha', isCorrect: true },
                  { letter: 'قَهَ', name: 'Qo-Ha', isCorrect: false },
                  { letter: 'لَهَ', name: 'La-Ha', isCorrect: false }
                ],
                hint: 'Ha di tengah membentuk simpul pita seperti kupu-kupu!'
              },
              {
                id: 'q246',
                type: 'tracing',
                promptText: 'Ayo coba tulis: MA - \'A!',
                targetLetter: 'مَعَ',
                targetName: "Ma-'A",
                options: []
              }
            ]
          },
          {
            id: 'iqro2-u5-s3',
            title: 'Perahu Ceria: Fa & Qof Sambung',
            subtitle: 'Kata Fataha dan Kataba yang mashur',
            type: 'listen-tap',
            unitNumber: 5,
            stageNumber: 3,
            lettersCovered: ['فَتَحَ', 'كَتَبَ'],
            questions: [
              {
                id: 'q247',
                type: 'listen-tap',
                promptText: 'Cari kata tiga huruf: FA - TA - HA!',
                targetLetter: 'فَتَحَ',
                targetName: 'Fa-Ta-Ha',
                options: [
                  { letter: 'فَتَحَ', name: 'Fa-Ta-Ha', isCorrect: true },
                  { letter: 'قَرَأَ', name: 'Qo-Ro-A', isCorrect: false },
                  { letter: 'كَتَبَ', name: 'Ka-Ta-Ba', isCorrect: false }
                ],
                hint: 'Fa bertitik satu di awal, Ta di tengah, Ha di akhir!'
              },
              {
                id: 'q248',
                type: 'listen-tap',
                promptText: 'Yang mana kata: KA - TA - BA?',
                targetLetter: 'كَتَبَ',
                targetName: 'Ka-Ta-Ba',
                options: [
                  { letter: 'كَتَبَ', name: 'Ka-Ta-Ba', isCorrect: true },
                  { letter: 'فَتَحَ', name: 'Fa-Ta-Ha', isCorrect: false },
                  { letter: 'لَعِبَ', name: 'La-\'I-Ba', isCorrect: false }
                ],
                hint: 'Kaf bersimpul di awal, Ta di tengah, Ba di akhir!'
              }
            ]
          },
          {
            id: 'iqro2-u5-s4',
            title: 'Tantangan Balon Bentuk Ajaib',
            subtitle: 'Pecahkan balon kata Fahima dan Balagho',
            type: 'bubble-pop',
            unitNumber: 5,
            stageNumber: 4,
            lettersCovered: ['فَهِمَ', 'بَلَغَ'],
            questions: [
              {
                id: 'q249',
                type: 'bubble-pop',
                promptText: 'Pecahkan balon kata: FA - HA - MA!',
                targetLetter: 'فَهِمَ',
                targetName: 'Fa-Ha-Ma',
                options: [
                  { letter: 'فَهِمَ', name: 'Fa-Ha-Ma', isCorrect: true },
                  { letter: 'كَتَبَ', name: 'Ka-Ta-Ba', isCorrect: false },
                  { letter: 'فَتَحَ', name: 'Fa-Ta-Ha', isCorrect: false },
                  { letter: 'بَلَغَ', name: 'Ba-La-Gho', isCorrect: false }
                ]
              },
              {
                id: 'q250',
                type: 'bubble-pop',
                promptText: 'Pecahkan balon kata: BA - LA - GHO!',
                targetLetter: 'بَلَغَ',
                targetName: 'Ba-La-Gho',
                options: [
                  { letter: 'بَلَغَ', name: 'Ba-La-Gho', isCorrect: true },
                  { letter: 'فَهِمَ', name: 'Fa-Ha-Ma', isCorrect: false },
                  { letter: 'كَتَبَ', name: 'Ka-Ta-Ba', isCorrect: false },
                  { letter: 'فَتَحَ', name: 'Fa-Ta-Ha', isCorrect: false }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'iqro2-u6',
        unitNumber: 6,
        title: 'Unit 6: Rahasia Mad Asli (Dua Harakat)',
        description: 'Mengenal harakat fathah yang diikuti Alif dibaca panjang 2 ketukan',
        themeColor: '#EC4899',
        stages: [
          {
            id: 'iqro2-u6-s1',
            title: 'Ayunan Pertama: Baa, Taa, Tsaa',
            subtitle: 'Alif membuat bacaan diayun panjang 2 harakat',
            type: 'listen-tap',
            unitNumber: 6,
            stageNumber: 1,
            lettersCovered: ['بَا', 'تَا', 'ثَا'],
            questions: [
              {
                id: 'q251',
                type: 'listen-tap',
                promptText: 'Ayo cari bacaan PANJANG 2 harakat: BAA!',
                targetLetter: 'بَا',
                targetName: 'Baa',
                options: [
                  { letter: 'بَا', name: 'Baa', isCorrect: true },
                  { letter: 'بَ', name: 'Ba', isCorrect: false },
                  { letter: 'تَا', name: 'Taa', isCorrect: false }
                ],
                hint: 'Baa ada huruf Alif di sampingnya sehingga dibaca panjang 2 ayunan!'
              },
              {
                id: 'q252',
                type: 'listen-tap',
                promptText: 'Yang mana bacaan PANJANG 2 harakat: TAA?',
                targetLetter: 'تَا',
                targetName: 'Taa',
                options: [
                  { letter: 'تَا', name: 'Taa', isCorrect: true },
                  { letter: 'تَ', name: 'Ta', isCorrect: false },
                  { letter: 'ثَا', name: 'Tsaa', isCorrect: false }
                ],
                hint: 'Ta berfathah diikuti Alif dibaca panjang Taa!'
              },
              {
                id: 'q253',
                type: 'tracing',
                promptText: 'Ayo coba tulis bacaan panjang: BAA!',
                targetLetter: 'بَا',
                targetName: 'Baa',
                options: []
              }
            ]
          },
          {
            id: 'iqro2-u6-s2',
            title: 'Detektif Pendek vs Panjang',
            subtitle: 'Membedakan 1 ketukan vs 2 ketukan dengan cermat',
            type: 'listen-tap',
            unitNumber: 6,
            stageNumber: 2,
            lettersCovered: ['بَتَ', 'بَاتَا'],
            questions: [
              {
                id: 'q254',
                type: 'listen-tap',
                promptText: 'Dengar baik-baik! Yang mana dibaca PANJANG: BAA - TAA?',
                targetLetter: 'بَاتَا',
                targetName: 'Baa-Taa',
                options: [
                  { letter: 'بَاتَا', name: 'Baa-Taa', isCorrect: true },
                  { letter: 'بَتَ', name: 'Ba-Ta', isCorrect: false },
                  { letter: 'تَبَ', name: 'Ta-Ba', isCorrect: false }
                ],
                hint: 'Baa-Taa memiliki Alif panjang di setiap hurufnya!'
              },
              {
                id: 'q255',
                type: 'listen-tap',
                promptText: 'Cari yang dibaca PENDEK: BA - TA!',
                targetLetter: 'بَتَ',
                targetName: 'Ba-Ta',
                options: [
                  { letter: 'بَتَ', name: 'Ba-Ta', isCorrect: true },
                  { letter: 'بَاتَا', name: 'Baa-Taa', isCorrect: false },
                  { letter: 'بَاتَ', name: 'Baa-Ta', isCorrect: false }
                ],
                hint: 'Ba-Ta tidak punya Alif sehingga dibaca pendek 1 ketukan!'
              }
            ]
          },
          {
            id: 'iqro2-u6-s3',
            title: 'Kata Populer Mad Asli 2 Harakat',
            subtitle: 'Membaca kata Qoola dan Kaana dengan fasih',
            type: 'listen-tap',
            unitNumber: 6,
            stageNumber: 3,
            lettersCovered: ['قَالَ', 'كَانَ'],
            questions: [
              {
                id: 'q256',
                type: 'listen-tap',
                promptText: 'Cari kata: QOO - LA!',
                targetLetter: 'قَالَ',
                targetName: 'Qoo-La',
                options: [
                  { letter: 'قَالَ', name: 'Qoo-La', isCorrect: true },
                  { letter: 'قَلَ', name: 'Qo-La', isCorrect: false },
                  { letter: 'كَانَ', name: 'Kaa-Na', isCorrect: false }
                ],
                hint: 'Qoola huruf Qof-nya panjang 2 harakat!'
              },
              {
                id: 'q257',
                type: 'listen-tap',
                promptText: 'Yang mana kata: KAA - NA?',
                targetLetter: 'كَانَ',
                targetName: 'Kaa-Na',
                options: [
                  { letter: 'كَانَ', name: 'Kaa-Na', isCorrect: true },
                  { letter: 'كَنَ', name: 'Ka-Na', isCorrect: false },
                  { letter: 'قَالَ', name: 'Qoo-La', isCorrect: false }
                ],
                hint: 'Kaana huruf Kaf-nya panjang 2 harakat!'
              },
              {
                id: 'q258',
                type: 'tracing',
                promptText: 'Ayo coba tulis kata mad: QOO - LA!',
                targetLetter: 'قَالَ',
                targetName: 'Qoo-La',
                options: []
              }
            ]
          },
          {
            id: 'iqro2-u6-s4',
            title: 'Pesta Balon Mad Asli',
            subtitle: 'Uji refleks menangkap kata 2 harakat',
            type: 'bubble-pop',
            unitNumber: 6,
            stageNumber: 4,
            lettersCovered: ['تَابَ', 'كَانَ'],
            questions: [
              {
                id: 'q259',
                type: 'bubble-pop',
                promptText: 'Letuskan balon kata panjang: TAA - BA!',
                targetLetter: 'تَابَ',
                targetName: 'Taa-Ba',
                options: [
                  { letter: 'تَابَ', name: 'Taa-Ba', isCorrect: true },
                  { letter: 'تَبَ', name: 'Ta-Ba', isCorrect: false },
                  { letter: 'قَالَ', name: 'Qoo-La', isCorrect: false },
                  { letter: 'كَانَ', name: 'Kaa-Na', isCorrect: false }
                ]
              },
              {
                id: 'q260',
                type: 'bubble-pop',
                promptText: 'Letuskan balon kata panjang: KAA - NA!',
                targetLetter: 'كَانَ',
                targetName: 'Kaa-Na',
                options: [
                  { letter: 'كَانَ', name: 'Kaa-Na', isCorrect: true },
                  { letter: 'قَالَ', name: 'Qoo-La', isCorrect: false },
                  { letter: 'تَابَ', name: 'Taa-Ba', isCorrect: false },
                  { letter: 'صَابَرَ', name: 'Shoo-Ba-Ro', isCorrect: false }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'iqro2-u7',
        unitNumber: 7,
        title: 'Unit 7: Istana Kelulusan & Wisuda Iqro 2',
        description: 'Uji pamungkas ketangkasan membaca huruf sambung dan mad asli',
        themeColor: '#FFB800',
        stages: [
          {
            id: 'iqro2-u7-s1',
            title: 'Uji Kata Sambung Awal & Tengah',
            subtitle: 'Menguji kelancaran membaca tiga huruf bersambung',
            type: 'listen-tap',
            unitNumber: 7,
            stageNumber: 1,
            lettersCovered: ['خَلَقَ', 'جَعَلَ'],
            questions: [
              {
                id: 'q261',
                type: 'listen-tap',
                promptText: 'Cari kata: KHO - LA - QO!',
                targetLetter: 'خَلَقَ',
                targetName: 'Kho-La-Qo',
                options: [
                  { letter: 'خَلَقَ', name: 'Kho-La-Qo', isCorrect: true },
                  { letter: 'جَعَلَ', name: 'Ja-\'A-La', isCorrect: false },
                  { letter: 'حَسَدَ', name: 'Ha-Sa-Da', isCorrect: false }
                ],
                hint: 'Kho di awal, Lam di tengah, Qof di akhir!'
              },
              {
                id: 'q262',
                type: 'listen-tap',
                promptText: 'Yang mana kata: JA - \'A - LA?',
                targetLetter: 'جَعَلَ',
                targetName: 'Ja-\'A-La',
                options: [
                  { letter: 'جَعَلَ', name: 'Ja-\'A-La', isCorrect: true },
                  { letter: 'خَلَقَ', name: 'Kho-La-Qo', isCorrect: false },
                  { letter: 'نَجَحَ', name: 'Na-Ja-Ha', isCorrect: false }
                ],
                hint: 'Ja di depan bertelur, \'Ain segitiga di tengah, Lam di akhir!'
              }
            ]
          },
          {
            id: 'iqro2-u7-s2',
            title: 'Uji Kata Mad Asli 2 Harakat',
            subtitle: 'Menguji kelancaran membaca kata berayun panjang',
            type: 'listen-tap',
            unitNumber: 7,
            stageNumber: 2,
            lettersCovered: ['صَابَرَ', 'جَاهَدَ'],
            questions: [
              {
                id: 'q263',
                type: 'listen-tap',
                promptText: 'Cari kata ber-mad: SHOO - BA - RO!',
                targetLetter: 'صَابَرَ',
                targetName: 'Shoo-Ba-Ro',
                options: [
                  { letter: 'صَابَرَ', name: 'Shoo-Ba-Ro', isCorrect: true },
                  { letter: 'صَبَرَ', name: 'Sho-Ba-Ro', isCorrect: false },
                  { letter: 'جَاهَدَ', name: 'Jaa-Ha-Da', isCorrect: false }
                ],
                hint: 'Shoo panjang dua harakat ber-Alif!'
              },
              {
                id: 'q264',
                type: 'listen-tap',
                promptText: 'Yang mana kata ber-mad: JAA - HA - DA?',
                targetLetter: 'جَاهَدَ',
                targetName: 'Jaa-Ha-Da',
                options: [
                  { letter: 'جَاهَدَ', name: 'Jaa-Ha-Da', isCorrect: true },
                  { letter: 'جَهَدَ', name: 'Ja-Ha-Da', isCorrect: false },
                  { letter: 'شَاهَدَ', name: 'Syaa-Ha-Da', isCorrect: false }
                ],
                hint: 'Jaa panjang dua harakat diikuti Alif!'
              }
            ]
          },
          {
            id: 'iqro2-u7-s3',
            title: 'Uji Ketelitian Panjang-Pendek',
            subtitle: 'Telinga santri cilik membedakan 1 vs 2 harakat',
            type: 'listen-tap',
            unitNumber: 7,
            stageNumber: 3,
            lettersCovered: ['قَتَلَ', 'قَاتَلَ'],
            questions: [
              {
                id: 'q265',
                type: 'listen-tap',
                promptText: 'Telinga jeli! Pilih kata PENDEK: QO - TA - LA!',
                targetLetter: 'قَتَلَ',
                targetName: 'Qo-Ta-La',
                options: [
                  { letter: 'قَتَلَ', name: 'Qo-Ta-La', isCorrect: true },
                  { letter: 'قَاتَلَ', name: 'Qoo-Ta-La', isCorrect: false },
                  { letter: 'قَالَ', name: 'Qoo-La', isCorrect: false }
                ],
                hint: 'Semua hurufnya dibaca pendek 1 ketukan tanpa Alif!'
              },
              {
                id: 'q266',
                type: 'listen-tap',
                promptText: 'Sekarang pilih kata PANJANG: QOO - TA - LA!',
                targetLetter: 'قَاتَلَ',
                targetName: 'Qoo-Ta-La',
                options: [
                  { letter: 'قَاتَلَ', name: 'Qoo-Ta-La', isCorrect: true },
                  { letter: 'قَتَلَ', name: 'Qo-Ta-La', isCorrect: false },
                  { letter: 'قَالَ', name: 'Qoo-La', isCorrect: false }
                ],
                hint: 'Huruf Qof di depan panjang 2 harakat ber-Alif!'
              }
            ]
          },
          {
            id: 'iqro2-u7-s4',
            title: 'Wisuda Akbar Kelulusan Iqro 2!',
            subtitle: 'Uji pamungkas kelulusan bintang emas Iqro 2',
            type: 'bubble-pop',
            unitNumber: 7,
            stageNumber: 4,
            lettersCovered: ['خَلَقَ', 'قَالَ', 'جَاهَدَ'],
            questions: [
              {
                id: 'q267',
                type: 'bubble-pop',
                promptText: 'Wisuda Iqro 2! Pecahkan kata: KHO - LA - QO!',
                targetLetter: 'خَلَقَ',
                targetName: 'Kho-La-Qo',
                options: [
                  { letter: 'خَلَقَ', name: 'Kho-La-Qo', isCorrect: true },
                  { letter: 'جَعَلَ', name: 'Ja-\'A-La', isCorrect: false },
                  { letter: 'قَاتَلَ', name: 'Qoo-Ta-La', isCorrect: false },
                  { letter: 'صَابَرَ', name: 'Shoo-Ba-Ro', isCorrect: false }
                ]
              },
              {
                id: 'q268',
                type: 'bubble-pop',
                promptText: 'Hebat! Sekarang letuskan kata mad: QOO - LA!',
                targetLetter: 'قَالَ',
                targetName: 'Qoo-La',
                options: [
                  { letter: 'قَالَ', name: 'Qoo-La', isCorrect: true },
                  { letter: 'قَتَلَ', name: 'Qo-Ta-La', isCorrect: false },
                  { letter: 'كَانَ', name: 'Kaa-Na', isCorrect: false },
                  { letter: 'تَابَ', name: 'Taa-Ba', isCorrect: false }
                ]
              },
              {
                id: 'q269',
                type: 'bubble-pop',
                promptText: 'Luar biasa! Pecahkan kata pamungkas: JAA - HA - DA!',
                targetLetter: 'جَاهَدَ',
                targetName: 'Jaa-Ha-Da',
                options: [
                  { letter: 'جَاهَدَ', name: 'Jaa-Ha-Da', isCorrect: true },
                  { letter: 'صَابَرَ', name: 'Shoo-Ba-Ro', isCorrect: false },
                  { letter: 'خَلَقَ', name: 'Kho-La-Qo', isCorrect: false },
                  { letter: 'كَانَ', name: 'Kaa-Na', isCorrect: false }
                ]
              }
            ]
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
