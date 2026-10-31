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
