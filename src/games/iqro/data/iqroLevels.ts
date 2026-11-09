import { IqroBook } from '../../../core/types/gameTypes';

export const IQRO_BOOKS: IqroBook[] = [
  {
    "level": 1,
    "title": "Iqro 1",
    "subtitle": "Huruf Tunggal Fathah (A - Ya)",
    "color": "#58CC02",
    "totalStages": 22,
    "units": [
      {
        "id": "iqro1-u1",
        "unitNumber": 1,
        "title": "Unit 1: Gerbang Hijaiyah (A, Ba, Ta, Tsa)",
        "description": "Mengenal bentuk dasar garis dan mangkok bertitik",
        "themeColor": "#58CC02",
        "stages": [
          {
            "id": "iqro1-u1-s1",
            "title": "Kenalan Huruf A & Ba",
            "subtitle": "Dengar dan ketuk kartu huruf yang benar",
            "type": "listen-tap",
            "unitNumber": 1,
            "stageNumber": 1,
            "unlockedByDefault": true,
            "lettersCovered": [
              "اَ",
              "بَ"
            ],
            "questions": [
              {
                "id": "q1",
                "type": "listen-tap",
                "promptText": "Ayo cari huruf BA!",
                "targetLetter": "بَ",
                "targetName": "Ba",
                "options": [
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": true
                  },
                  {
                    "letter": "اَ",
                    "name": "A",
                    "isCorrect": false
                  }
                ],
                "hint": "Ba memiliki satu titik mangkok di bawah!"
              },
              {
                "id": "q2",
                "type": "listen-tap",
                "promptText": "Yang mana huruf A?",
                "targetLetter": "اَ",
                "targetName": "A",
                "options": [
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "اَ",
                    "name": "A",
                    "isCorrect": true
                  }
                ],
                "hint": "A berdiri tegak lurus seperti pensil!"
              },
              {
                "id": "q3_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "بَ",
                "targetName": "Ba",
                "options": []
              },
              {
                "id": "q3",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf BA!",
                "targetLetter": "بَ",
                "targetName": "Ba",
                "options": []
              }
            ]
          },
          {
            "id": "iqro1-u1-s2",
            "title": "Keluarga Piring: Ta & Tsa",
            "subtitle": "Hitung titik di atas piring!",
            "type": "listen-tap",
            "unitNumber": 1,
            "stageNumber": 2,
            "lettersCovered": [
              "تَ",
              "ثَ"
            ],
            "questions": [
              {
                "id": "q4",
                "type": "listen-tap",
                "promptText": "Cari huruf TA (Dua titik di atas)!",
                "targetLetter": "تَ",
                "targetName": "Ta",
                "options": [
                  {
                    "letter": "تَ",
                    "name": "Ta",
                    "isCorrect": true
                  },
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "اَ",
                    "name": "A",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q5_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "تَ",
                "targetName": "Ta",
                "options": []
              },
              {
                "id": "q5",
                "type": "listen-tap",
                "promptText": "Cari huruf TSA (Tiga titik permen)!",
                "targetLetter": "ثَ",
                "targetName": "Tsa",
                "options": [
                  {
                    "letter": "ثَ",
                    "name": "Tsa",
                    "isCorrect": true
                  },
                  {
                    "letter": "تَ",
                    "name": "Ta",
                    "isCorrect": false
                  },
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q5_trace",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf TA!",
                "targetLetter": "تَ",
                "targetName": "Ta",
                "options": []
              }
            ]
          },
          {
            "id": "iqro1-u1-s3",
            "title": "Pesta Gelembung Balon",
            "subtitle": "Pecahkan gelembung huruf yang disebutkan!",
            "type": "bubble-pop",
            "unitNumber": 1,
            "stageNumber": 3,
            "lettersCovered": [
              "اَ",
              "بَ",
              "تَ",
              "ثَ"
            ],
            "questions": [
              {
                "id": "q6",
                "type": "bubble-pop",
                "promptText": "Letuskan balon huruf BA!",
                "targetLetter": "بَ",
                "targetName": "Ba",
                "options": [
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": true
                  },
                  {
                    "letter": "اَ",
                    "name": "A",
                    "isCorrect": false
                  },
                  {
                    "letter": "تَ",
                    "name": "Ta",
                    "isCorrect": false
                  },
                  {
                    "letter": "ثَ",
                    "name": "Tsa",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q7",
                "type": "bubble-pop",
                "promptText": "Letuskan balon huruf TA!",
                "targetLetter": "تَ",
                "targetName": "Ta",
                "options": [
                  {
                    "letter": "اَ",
                    "name": "A",
                    "isCorrect": false
                  },
                  {
                    "letter": "تَ",
                    "name": "Ta",
                    "isCorrect": true
                  },
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "iqro1-u1-s4",
            "title": "Tantangan Mahkota Bintang",
            "subtitle": "Uji kemampuan Unit 1!",
            "type": "boss-challenge",
            "unitNumber": 1,
            "stageNumber": 4,
            "lettersCovered": [
              "اَ",
              "بَ",
              "تَ",
              "ثَ"
            ],
            "questions": [
              {
                "id": "q8",
                "type": "listen-tap",
                "promptText": "Pilih huruf A!",
                "targetLetter": "اَ",
                "targetName": "A",
                "options": [
                  {
                    "letter": "اَ",
                    "name": "A",
                    "isCorrect": true
                  },
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "تَ",
                    "name": "Ta",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q9_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "ثَ",
                "targetName": "Tsa",
                "options": []
              },
              {
                "id": "q9",
                "type": "listen-tap",
                "promptText": "Pilih huruf TSA!",
                "targetLetter": "ثَ",
                "targetName": "Tsa",
                "options": [
                  {
                    "letter": "ثَ",
                    "name": "Tsa",
                    "isCorrect": true
                  },
                  {
                    "letter": "تَ",
                    "name": "Ta",
                    "isCorrect": false
                  },
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro1-u2",
        "unitNumber": 2,
        "title": "Unit 2: Tiga Sekawan Bebek (Ja, Ha, Kho)",
        "description": "Mengenal bentuk lengkung berpenghuni",
        "themeColor": "#1CB0F6",
        "stages": [
          {
            "id": "iqro1-u2-s1",
            "title": "Huruf JA Telur di Perut",
            "subtitle": "Dengarkan suara JA yang mantap",
            "type": "listen-tap",
            "unitNumber": 2,
            "stageNumber": 1,
            "lettersCovered": [
              "جَ",
              "حَ"
            ],
            "questions": [
              {
                "id": "q10_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "جَ",
                "targetName": "Ja",
                "options": []
              },
              {
                "id": "q10",
                "type": "listen-tap",
                "promptText": "Cari huruf JA!",
                "targetLetter": "جَ",
                "targetName": "Ja",
                "options": [
                  {
                    "letter": "جَ",
                    "name": "Ja",
                    "isCorrect": true
                  },
                  {
                    "letter": "حَ",
                    "name": "Ha",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q10_trace",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf JA!",
                "targetLetter": "جَ",
                "targetName": "Ja",
                "options": []
              }
            ]
          },
          {
            "id": "iqro1-u2-s2",
            "title": "Huruf HA Bersih & KHO Topi",
            "subtitle": "Bedakan nafas bersih dan getar tenggorokan",
            "type": "listen-tap",
            "unitNumber": 2,
            "stageNumber": 2,
            "lettersCovered": [
              "حَ",
              "خَ"
            ],
            "questions": [
              {
                "id": "q11_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "خَ",
                "targetName": "Kho",
                "options": []
              },
              {
                "id": "q11",
                "type": "listen-tap",
                "promptText": "Cari huruf KHO bertopi!",
                "targetLetter": "خَ",
                "targetName": "Kho",
                "options": [
                  {
                    "letter": "خَ",
                    "name": "Kho",
                    "isCorrect": true
                  },
                  {
                    "letter": "حَ",
                    "name": "Ha",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q11_trace",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf KHO!",
                "targetLetter": "خَ",
                "targetName": "Kho",
                "options": []
              }
            ]
          }
        ]
      },
      {
        "id": "iqro1-u3",
        "unitNumber": 3,
        "title": "Unit 3: Mulut Buaya & Perosotan (Da, Dza, Ro, Za)",
        "description": "Mengenal huruf tajam dan perosotan meluncur",
        "themeColor": "#FF9600",
        "stages": [
          {
            "id": "iqro1-u3-s1",
            "title": "Mulut Buaya: Da & Dza",
            "subtitle": "Dengar dan ketuk hurufnya",
            "type": "listen-tap",
            "unitNumber": 3,
            "stageNumber": 1,
            "lettersCovered": [
              "دَ",
              "ذَ"
            ],
            "questions": [
              {
                "id": "q12",
                "type": "listen-tap",
                "promptText": "Mana huruf DA?",
                "targetLetter": "دَ",
                "targetName": "Da",
                "options": [
                  {
                    "letter": "دَ",
                    "name": "Da",
                    "isCorrect": true
                  },
                  {
                    "letter": "ذَ",
                    "name": "Dza",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q13",
                "type": "listen-tap",
                "promptText": "Cari huruf DZA!",
                "targetLetter": "ذَ",
                "targetName": "Dza",
                "options": [
                  {
                    "letter": "ذَ",
                    "name": "Dza",
                    "isCorrect": true
                  },
                  {
                    "letter": "دَ",
                    "name": "Da",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q12_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "دَ",
                "targetName": "Da",
                "options": []
              },
              {
                "id": "q12_trace",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf DA!",
                "targetLetter": "دَ",
                "targetName": "Da",
                "options": []
              }
            ]
          },
          {
            "id": "iqro1-u3-s2",
            "title": "Perosotan Meluncur: Ro & Za",
            "subtitle": "Lidah bergetar dan desis lampu di atas",
            "type": "listen-tap",
            "unitNumber": 3,
            "stageNumber": 2,
            "lettersCovered": [
              "رَ",
              "زَ"
            ],
            "questions": [
              {
                "id": "q14",
                "type": "listen-tap",
                "promptText": "Ayo cari huruf RO!",
                "targetLetter": "رَ",
                "targetName": "Ro",
                "options": [
                  {
                    "letter": "رَ",
                    "name": "Ro",
                    "isCorrect": true
                  },
                  {
                    "letter": "زَ",
                    "name": "Za",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q15",
                "type": "listen-tap",
                "promptText": "Yang mana huruf ZA?",
                "targetLetter": "زَ",
                "targetName": "Za",
                "options": [
                  {
                    "letter": "زَ",
                    "name": "Za",
                    "isCorrect": true
                  },
                  {
                    "letter": "رَ",
                    "name": "Ro",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q16_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "رَ",
                "targetName": "Ro",
                "options": []
              },
              {
                "id": "q16",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf RO!",
                "targetLetter": "رَ",
                "targetName": "Ro",
                "options": []
              }
            ]
          },
          {
            "id": "iqro1-u3-s3",
            "title": "Pesta Balon Meluncur",
            "subtitle": "Letuskan balon Da, Dza, Ro, dan Za!",
            "type": "bubble-pop",
            "unitNumber": 3,
            "stageNumber": 3,
            "lettersCovered": [
              "دَ",
              "ذَ",
              "رَ",
              "زَ"
            ],
            "questions": [
              {
                "id": "q17",
                "type": "bubble-pop",
                "promptText": "Letuskan balon huruf DA!",
                "targetLetter": "دَ",
                "targetName": "Da",
                "options": [
                  {
                    "letter": "دَ",
                    "name": "Da",
                    "isCorrect": true
                  },
                  {
                    "letter": "ذَ",
                    "name": "Dza",
                    "isCorrect": false
                  },
                  {
                    "letter": "رَ",
                    "name": "Ro",
                    "isCorrect": false
                  },
                  {
                    "letter": "زَ",
                    "name": "Za",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q18",
                "type": "bubble-pop",
                "promptText": "Letuskan balon huruf ZA!",
                "targetLetter": "زَ",
                "targetName": "Za",
                "options": [
                  {
                    "letter": "زَ",
                    "name": "Za",
                    "isCorrect": true
                  },
                  {
                    "letter": "رَ",
                    "name": "Ro",
                    "isCorrect": false
                  },
                  {
                    "letter": "دَ",
                    "name": "Da",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro1-u4",
        "unitNumber": 4,
        "title": "Unit 4: Gigi Sisir & Balon Ajaib (Sa, Sya, Sho, Dho)",
        "description": "Mengenal gerigi desis tajam dan balon lonjong berekor mangkok",
        "themeColor": "#3B82F6",
        "stages": [
          {
            "id": "iqro1-u4-s1",
            "title": "Gerigi Sisir: Sa & Sya",
            "subtitle": "Desis halus dan tiga bintang di atas",
            "type": "listen-tap",
            "unitNumber": 4,
            "stageNumber": 1,
            "lettersCovered": [
              "سَ",
              "شَ"
            ],
            "questions": [
              {
                "id": "q19",
                "type": "listen-tap",
                "promptText": "Ayo cari huruf SA!",
                "targetLetter": "سَ",
                "targetName": "Sa",
                "options": [
                  {
                    "letter": "سَ",
                    "name": "Sa",
                    "isCorrect": true
                  },
                  {
                    "letter": "شَ",
                    "name": "Sya",
                    "isCorrect": false
                  },
                  {
                    "letter": "زَ",
                    "name": "Za",
                    "isCorrect": false
                  }
                ],
                "hint": "Sa memiliki 3 gerigi sisir tanpa titik!"
              },
              {
                "id": "q20",
                "type": "listen-tap",
                "promptText": "Yang mana huruf SYA?",
                "targetLetter": "شَ",
                "targetName": "Sya",
                "options": [
                  {
                    "letter": "شَ",
                    "name": "Sya",
                    "isCorrect": true
                  },
                  {
                    "letter": "سَ",
                    "name": "Sa",
                    "isCorrect": false
                  },
                  {
                    "letter": "ثَ",
                    "name": "Tsa",
                    "isCorrect": false
                  }
                ],
                "hint": "Sya punya 3 titik bintang di atas gerigi!"
              },
              {
                "id": "q21_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "سَ",
                "targetName": "Sa",
                "options": []
              },
              {
                "id": "q21",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf SA!",
                "targetLetter": "سَ",
                "targetName": "Sa",
                "options": []
              }
            ]
          },
          {
            "id": "iqro1-u4-s2",
            "title": "Balon Berbalut Mangkok: Sho & Dho",
            "subtitle": "Suara tebal bertekanan mantap",
            "type": "listen-tap",
            "unitNumber": 4,
            "stageNumber": 2,
            "lettersCovered": [
              "صَ",
              "ضَ"
            ],
            "questions": [
              {
                "id": "q22",
                "type": "listen-tap",
                "promptText": "Cari huruf SHO!",
                "targetLetter": "صَ",
                "targetName": "Sho",
                "options": [
                  {
                    "letter": "صَ",
                    "name": "Sho",
                    "isCorrect": true
                  },
                  {
                    "letter": "ضَ",
                    "name": "Dho",
                    "isCorrect": false
                  },
                  {
                    "letter": "سَ",
                    "name": "Sa",
                    "isCorrect": false
                  }
                ],
                "hint": "Sho bentuknya seperti balon lonjong berekor mangkok!"
              },
              {
                "id": "q23",
                "type": "listen-tap",
                "promptText": "Yang mana huruf DHO?",
                "targetLetter": "ضَ",
                "targetName": "Dho",
                "options": [
                  {
                    "letter": "ضَ",
                    "name": "Dho",
                    "isCorrect": true
                  },
                  {
                    "letter": "صَ",
                    "name": "Sho",
                    "isCorrect": false
                  },
                  {
                    "letter": "شَ",
                    "name": "Sya",
                    "isCorrect": false
                  }
                ],
                "hint": "Dho adalah balon lonjong bermahkota satu titik!"
              },
              {
                "id": "q24_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "صَ",
                "targetName": "Sho",
                "options": []
              },
              {
                "id": "q24",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf SHO!",
                "targetLetter": "صَ",
                "targetName": "Sho",
                "options": []
              }
            ]
          },
          {
            "id": "iqro1-u4-s3",
            "title": "Pesta Balon Sisir & Balon",
            "subtitle": "Letuskan gelembung Sa, Sya, Sho, dan Dho!",
            "type": "bubble-pop",
            "unitNumber": 4,
            "stageNumber": 3,
            "lettersCovered": [
              "سَ",
              "شَ",
              "صَ",
              "ضَ"
            ],
            "questions": [
              {
                "id": "q25",
                "type": "bubble-pop",
                "promptText": "Letuskan balon huruf SYA!",
                "targetLetter": "شَ",
                "targetName": "Sya",
                "options": [
                  {
                    "letter": "شَ",
                    "name": "Sya",
                    "isCorrect": true
                  },
                  {
                    "letter": "سَ",
                    "name": "Sa",
                    "isCorrect": false
                  },
                  {
                    "letter": "صَ",
                    "name": "Sho",
                    "isCorrect": false
                  },
                  {
                    "letter": "ضَ",
                    "name": "Dho",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q26",
                "type": "bubble-pop",
                "promptText": "Letuskan balon huruf DHO!",
                "targetLetter": "ضَ",
                "targetName": "Dho",
                "options": [
                  {
                    "letter": "ضَ",
                    "name": "Dho",
                    "isCorrect": true
                  },
                  {
                    "letter": "صَ",
                    "name": "Sho",
                    "isCorrect": false
                  },
                  {
                    "letter": "سَ",
                    "name": "Sa",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro1-u5",
        "unitNumber": 5,
        "title": "Unit 5: Tongkat Bendera & Lengkungan Unik (Tho, Zho, 'A, Gho)",
        "description": "Mengenal huruf tongkat kokoh dan lengkungan angka terbuka",
        "themeColor": "#84CC16",
        "stages": [
          {
            "id": "iqro1-u5-s1",
            "title": "Tongkat Bendera: Tho & Zho",
            "subtitle": "Tongkat tegak berdiri gagah",
            "type": "listen-tap",
            "unitNumber": 5,
            "stageNumber": 1,
            "lettersCovered": [
              "طَ",
              "ظَ"
            ],
            "questions": [
              {
                "id": "q27",
                "type": "listen-tap",
                "promptText": "Ayo cari huruf THO!",
                "targetLetter": "طَ",
                "targetName": "Tho",
                "options": [
                  {
                    "letter": "طَ",
                    "name": "Tho",
                    "isCorrect": true
                  },
                  {
                    "letter": "ظَ",
                    "name": "Zho",
                    "isCorrect": false
                  },
                  {
                    "letter": "صَ",
                    "name": "Sho",
                    "isCorrect": false
                  }
                ],
                "hint": "Tho memiliki tongkat tegak berdiri tanpa titik!"
              },
              {
                "id": "q28",
                "type": "listen-tap",
                "promptText": "Yang mana huruf ZHO?",
                "targetLetter": "ظَ",
                "targetName": "Zho",
                "options": [
                  {
                    "letter": "ظَ",
                    "name": "Zho",
                    "isCorrect": true
                  },
                  {
                    "letter": "طَ",
                    "name": "Tho",
                    "isCorrect": false
                  },
                  {
                    "letter": "ضَ",
                    "name": "Dho",
                    "isCorrect": false
                  }
                ],
                "hint": "Zho memiliki tongkat dengan satu titik di sampingnya!"
              },
              {
                "id": "q29_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "طَ",
                "targetName": "Tho",
                "options": []
              },
              {
                "id": "q29",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf THO!",
                "targetLetter": "طَ",
                "targetName": "Tho",
                "options": []
              }
            ]
          },
          {
            "id": "iqro1-u5-s2",
            "title": "Lengkungan Bersih: 'A & Gho",
            "subtitle": "Suara tenggorokan bersih dan berkumur lembut",
            "type": "listen-tap",
            "unitNumber": 5,
            "stageNumber": 2,
            "lettersCovered": [
              "عَ",
              "غَ"
            ],
            "questions": [
              {
                "id": "q30",
                "type": "listen-tap",
                "promptText": "Ayo cari huruf 'A!",
                "targetLetter": "عَ",
                "targetName": "'A",
                "options": [
                  {
                    "letter": "عَ",
                    "name": "'A",
                    "isCorrect": true
                  },
                  {
                    "letter": "غَ",
                    "name": "Gho",
                    "isCorrect": false
                  },
                  {
                    "letter": "حَ",
                    "name": "Ha",
                    "isCorrect": false
                  }
                ],
                "hint": "'A berbentuk seperti angka terbalik yang bersih!"
              },
              {
                "id": "q31",
                "type": "listen-tap",
                "promptText": "Yang mana huruf GHO?",
                "targetLetter": "غَ",
                "targetName": "Gho",
                "options": [
                  {
                    "letter": "غَ",
                    "name": "Gho",
                    "isCorrect": true
                  },
                  {
                    "letter": "عَ",
                    "name": "'A",
                    "isCorrect": false
                  },
                  {
                    "letter": "خَ",
                    "name": "Kho",
                    "isCorrect": false
                  }
                ],
                "hint": "Gho memiliki mahkota satu titik di atas kepalanya!"
              },
              {
                "id": "q32_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "عَ",
                "targetName": "'A",
                "options": []
              },
              {
                "id": "q32",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf 'A!",
                "targetLetter": "عَ",
                "targetName": "'A",
                "options": []
              }
            ]
          },
          {
            "id": "iqro1-u5-s3",
            "title": "Tantangan Tongkat & Lengkungan",
            "subtitle": "Letuskan balon Tho, Zho, 'A, dan Gho!",
            "type": "bubble-pop",
            "unitNumber": 5,
            "stageNumber": 3,
            "lettersCovered": [
              "طَ",
              "ظَ",
              "عَ",
              "غَ"
            ],
            "questions": [
              {
                "id": "q33",
                "type": "bubble-pop",
                "promptText": "Letuskan balon huruf THO!",
                "targetLetter": "طَ",
                "targetName": "Tho",
                "options": [
                  {
                    "letter": "طَ",
                    "name": "Tho",
                    "isCorrect": true
                  },
                  {
                    "letter": "ظَ",
                    "name": "Zho",
                    "isCorrect": false
                  },
                  {
                    "letter": "عَ",
                    "name": "'A",
                    "isCorrect": false
                  },
                  {
                    "letter": "غَ",
                    "name": "Gho",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q34",
                "type": "bubble-pop",
                "promptText": "Letuskan balon huruf GHO!",
                "targetLetter": "غَ",
                "targetName": "Gho",
                "options": [
                  {
                    "letter": "غَ",
                    "name": "Gho",
                    "isCorrect": true
                  },
                  {
                    "letter": "عَ",
                    "name": "'A",
                    "isCorrect": false
                  },
                  {
                    "letter": "طَ",
                    "name": "Tho",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro1-u6",
        "unitNumber": 6,
        "title": "Unit 6: Perahu Layar & Gagang Payung (Fa, Qo, Ka, La)",
        "description": "Mengenal mangkok berleher, kursi nyaman, dan payung melengkung",
        "themeColor": "#A855F7",
        "stages": [
          {
            "id": "iqro1-u6-s1",
            "title": "Mangkok Berleher: Fa & Qo",
            "subtitle": "Satu titik piring dan dua titik mangkok dalam",
            "type": "listen-tap",
            "unitNumber": 6,
            "stageNumber": 1,
            "lettersCovered": [
              "فَ",
              "قَ"
            ],
            "questions": [
              {
                "id": "q35",
                "type": "listen-tap",
                "promptText": "Ayo cari huruf FA!",
                "targetLetter": "فَ",
                "targetName": "Fa",
                "options": [
                  {
                    "letter": "فَ",
                    "name": "Fa",
                    "isCorrect": true
                  },
                  {
                    "letter": "قَ",
                    "name": "Qo",
                    "isCorrect": false
                  },
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": false
                  }
                ],
                "hint": "Fa memiliki leher melengkung dengan 1 titik di atas!"
              },
              {
                "id": "q36",
                "type": "listen-tap",
                "promptText": "Yang mana huruf QO?",
                "targetLetter": "قَ",
                "targetName": "Qo",
                "options": [
                  {
                    "letter": "قَ",
                    "name": "Qo",
                    "isCorrect": true
                  },
                  {
                    "letter": "فَ",
                    "name": "Fa",
                    "isCorrect": false
                  },
                  {
                    "letter": "تَ",
                    "name": "Ta",
                    "isCorrect": false
                  }
                ],
                "hint": "Qo mangkoknya lebih dalam dengan 2 titik di atas!"
              },
              {
                "id": "q37_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "فَ",
                "targetName": "Fa",
                "options": []
              },
              {
                "id": "q37",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf FA!",
                "targetLetter": "فَ",
                "targetName": "Fa",
                "options": []
              }
            ]
          },
          {
            "id": "iqro1-u6-s2",
            "title": "Kursi Nyaman & Gagang Payung: Ka & La",
            "subtitle": "Kursi berhamzah kecil dan gagang payung tinggi",
            "type": "listen-tap",
            "unitNumber": 6,
            "stageNumber": 2,
            "lettersCovered": [
              "كَ",
              "لَ"
            ],
            "questions": [
              {
                "id": "q38",
                "type": "listen-tap",
                "promptText": "Ayo cari huruf KA!",
                "targetLetter": "كَ",
                "targetName": "Ka",
                "options": [
                  {
                    "letter": "كَ",
                    "name": "Ka",
                    "isCorrect": true
                  },
                  {
                    "letter": "لَ",
                    "name": "La",
                    "isCorrect": false
                  },
                  {
                    "letter": "اَ",
                    "name": "A",
                    "isCorrect": false
                  }
                ],
                "hint": "Ka seperti kursi bersandar yang punya hiasan kecil di dalamnya!"
              },
              {
                "id": "q39",
                "type": "listen-tap",
                "promptText": "Yang mana huruf LA?",
                "targetLetter": "لَ",
                "targetName": "La",
                "options": [
                  {
                    "letter": "لَ",
                    "name": "La",
                    "isCorrect": true
                  },
                  {
                    "letter": "كَ",
                    "name": "Ka",
                    "isCorrect": false
                  },
                  {
                    "letter": "اَ",
                    "name": "A",
                    "isCorrect": false
                  }
                ],
                "hint": "La melengkung ke bawah seperti gagang payung!"
              },
              {
                "id": "q40_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "لَ",
                "targetName": "La",
                "options": []
              },
              {
                "id": "q40",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf LA!",
                "targetLetter": "لَ",
                "targetName": "La",
                "options": []
              }
            ]
          },
          {
            "id": "iqro1-u6-s3",
            "title": "Pesta Balon Pelaut Cilik",
            "subtitle": "Letuskan gelembung Fa, Qo, Ka, dan La!",
            "type": "bubble-pop",
            "unitNumber": 6,
            "stageNumber": 3,
            "lettersCovered": [
              "فَ",
              "قَ",
              "كَ",
              "لَ"
            ],
            "questions": [
              {
                "id": "q41",
                "type": "bubble-pop",
                "promptText": "Pecahkan balon huruf QO!",
                "targetLetter": "قَ",
                "targetName": "Qo",
                "options": [
                  {
                    "letter": "قَ",
                    "name": "Qo",
                    "isCorrect": true
                  },
                  {
                    "letter": "فَ",
                    "name": "Fa",
                    "isCorrect": false
                  },
                  {
                    "letter": "كَ",
                    "name": "Ka",
                    "isCorrect": false
                  },
                  {
                    "letter": "لَ",
                    "name": "La",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q42",
                "type": "bubble-pop",
                "promptText": "Pecahkan balon huruf KA!",
                "targetLetter": "كَ",
                "targetName": "Ka",
                "options": [
                  {
                    "letter": "كَ",
                    "name": "Ka",
                    "isCorrect": true
                  },
                  {
                    "letter": "لَ",
                    "name": "La",
                    "isCorrect": false
                  },
                  {
                    "letter": "قَ",
                    "name": "Qo",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro1-u7",
        "unitNumber": 7,
        "title": "Unit 7: Istana Akhir & Wisuda Hijaiyah (Ma, Na, Wa, Ha, Ya)",
        "description": "Menuntaskan seluruh 28 huruf hijaiyah dan menyambut mahkota kelulusan!",
        "themeColor": "#FFB800",
        "stages": [
          {
            "id": "iqro1-u7-s1",
            "title": "Sendok & Mangkuk Mutiara: Ma & Na",
            "subtitle": "Sendok melengkung dan mangkuk telur di tengah",
            "type": "listen-tap",
            "unitNumber": 7,
            "stageNumber": 1,
            "lettersCovered": [
              "مَ",
              "نَ"
            ],
            "questions": [
              {
                "id": "q43",
                "type": "listen-tap",
                "promptText": "Ayo cari huruf MA!",
                "targetLetter": "مَ",
                "targetName": "Ma",
                "options": [
                  {
                    "letter": "مَ",
                    "name": "Ma",
                    "isCorrect": true
                  },
                  {
                    "letter": "نَ",
                    "name": "Na",
                    "isCorrect": false
                  },
                  {
                    "letter": "وَ",
                    "name": "Wa",
                    "isCorrect": false
                  }
                ],
                "hint": "Ma melingkar di kepala seperti sendok terbalik!"
              },
              {
                "id": "q44",
                "type": "listen-tap",
                "promptText": "Yang mana huruf NA?",
                "targetLetter": "نَ",
                "targetName": "Na",
                "options": [
                  {
                    "letter": "نَ",
                    "name": "Na",
                    "isCorrect": true
                  },
                  {
                    "letter": "مَ",
                    "name": "Ma",
                    "isCorrect": false
                  },
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": false
                  }
                ],
                "hint": "Na mangkok bulat dengan 1 butir mutiara di tengahnya!"
              },
              {
                "id": "q45_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "مَ",
                "targetName": "Ma",
                "options": []
              },
              {
                "id": "q45",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf MA!",
                "targetLetter": "مَ",
                "targetName": "Ma",
                "options": []
              }
            ]
          },
          {
            "id": "iqro1-u7-s2",
            "title": "Roda Lingkar: Wa & Ha",
            "subtitle": "Angka sembilan melingkar dan donat bundar",
            "type": "listen-tap",
            "unitNumber": 7,
            "stageNumber": 2,
            "lettersCovered": [
              "وَ",
              "هَ"
            ],
            "questions": [
              {
                "id": "q46",
                "type": "listen-tap",
                "promptText": "Ayo cari huruf WA!",
                "targetLetter": "وَ",
                "targetName": "Wa",
                "options": [
                  {
                    "letter": "وَ",
                    "name": "Wa",
                    "isCorrect": true
                  },
                  {
                    "letter": "هَ",
                    "name": "Ha",
                    "isCorrect": false
                  },
                  {
                    "letter": "رَ",
                    "name": "Ro",
                    "isCorrect": false
                  }
                ],
                "hint": "Wa kepalanya melingkar seperti angka sembilan!"
              },
              {
                "id": "q47",
                "type": "listen-tap",
                "promptText": "Yang mana huruf HA (Besar)?",
                "targetLetter": "هَ",
                "targetName": "Ha",
                "options": [
                  {
                    "letter": "هَ",
                    "name": "Ha",
                    "isCorrect": true
                  },
                  {
                    "letter": "وَ",
                    "name": "Wa",
                    "isCorrect": false
                  },
                  {
                    "letter": "حَ",
                    "name": "Ha",
                    "isCorrect": false
                  }
                ],
                "hint": "Ha besar bentuknya melingkar manis seperti donat!"
              },
              {
                "id": "q48_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "وَ",
                "targetName": "Wa",
                "options": []
              },
              {
                "id": "q48",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf WA!",
                "targetLetter": "وَ",
                "targetName": "Wa",
                "options": []
              }
            ]
          },
          {
            "id": "iqro1-u7-s3",
            "title": "Bebek Berenang: Huruf YA",
            "subtitle": "Huruf pamungkas penutup ke-28 hijaiyah",
            "type": "listen-tap",
            "unitNumber": 7,
            "stageNumber": 3,
            "lettersCovered": [
              "يَ"
            ],
            "questions": [
              {
                "id": "q49",
                "type": "listen-tap",
                "promptText": "Ayo cari huruf YA!",
                "targetLetter": "يَ",
                "targetName": "Ya",
                "options": [
                  {
                    "letter": "يَ",
                    "name": "Ya",
                    "isCorrect": true
                  },
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "تَ",
                    "name": "Ta",
                    "isCorrect": false
                  }
                ],
                "hint": "Ya berbentuk bebek berenang dengan 2 titik di bawah!"
              },
              {
                "id": "q50_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "يَ",
                "targetName": "Ya",
                "options": []
              },
              {
                "id": "q50",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf YA!",
                "targetLetter": "يَ",
                "targetName": "Ya",
                "options": []
              }
            ]
          },
          {
            "id": "iqro1-u7-s4",
            "title": "Pesta Wisuda Akbar 28 Hijaiyah!",
            "subtitle": "Uji pamungkas kelulusan santri cilik bintang emas",
            "type": "bubble-pop",
            "unitNumber": 7,
            "stageNumber": 4,
            "lettersCovered": [
              "اَ",
              "جَ",
              "سَ",
              "طَ",
              "قَ",
              "مَ",
              "يَ"
            ],
            "questions": [
              {
                "id": "q51",
                "type": "bubble-pop",
                "promptText": "Wisuda! Pecahkan huruf pertama: Huruf A!",
                "targetLetter": "اَ",
                "targetName": "A",
                "options": [
                  {
                    "letter": "اَ",
                    "name": "A",
                    "isCorrect": true
                  },
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "تَ",
                    "name": "Ta",
                    "isCorrect": false
                  },
                  {
                    "letter": "ثَ",
                    "name": "Tsa",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q52",
                "type": "bubble-pop",
                "promptText": "Hebat! Sekarang letuskan huruf MA!",
                "targetLetter": "مَ",
                "targetName": "Ma",
                "options": [
                  {
                    "letter": "مَ",
                    "name": "Ma",
                    "isCorrect": true
                  },
                  {
                    "letter": "نَ",
                    "name": "Na",
                    "isCorrect": false
                  },
                  {
                    "letter": "وَ",
                    "name": "Wa",
                    "isCorrect": false
                  },
                  {
                    "letter": "هَ",
                    "name": "Ha",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q53",
                "type": "bubble-pop",
                "promptText": "Luar biasa! Pecahkan huruf pamungkas: Huruf YA!",
                "targetLetter": "يَ",
                "targetName": "Ya",
                "options": [
                  {
                    "letter": "يَ",
                    "name": "Ya",
                    "isCorrect": true
                  },
                  {
                    "letter": "هَ",
                    "name": "Ha",
                    "isCorrect": false
                  },
                  {
                    "letter": "وَ",
                    "name": "Wa",
                    "isCorrect": false
                  },
                  {
                    "letter": "نَ",
                    "name": "Na",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "level": 2,
    "title": "Iqro 2",
    "subtitle": "Huruf Sambung & Bacaan Panjang (Mad Asli)",
    "color": "#1CB0F6",
    "totalStages": 28,
    "units": [
      {
        "id": "iqro2-u1",
        "unitNumber": 1,
        "title": "Unit 1: Kereta Gerbong Ba-Ta-Tsa-Na-Ya",
        "description": "Mengenal huruf bertitik yang mirip saat dirangkai bersambung",
        "themeColor": "#1CB0F6",
        "stages": [
          {
            "id": "iqro2-u1-s1",
            "title": "Garis Sambung: Ba & Ta",
            "subtitle": "Melihat perubahan kepala huruf saat digandeng dua",
            "type": "listen-tap",
            "unitNumber": 1,
            "stageNumber": 1,
            "unlockedByDefault": true,
            "lettersCovered": [
              "بَتَ",
              "تَبَ"
            ],
            "questions": [
              {
                "id": "q201",
                "type": "listen-tap",
                "promptText": "Ayo cari bacaan: BA - TA!",
                "targetLetter": "بَتَ",
                "targetName": "Ba-Ta",
                "options": [
                  {
                    "letter": "بَتَ",
                    "name": "Ba-Ta",
                    "isCorrect": true
                  },
                  {
                    "letter": "تَبَ",
                    "name": "Ta-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "ثَبَ",
                    "name": "Tsa-Ba",
                    "isCorrect": false
                  }
                ],
                "hint": "Ba di depan titiknya di bawah, Ta di belakang dua titik di atas!"
              },
              {
                "id": "q202",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan: TA - BA?",
                "targetLetter": "تَبَ",
                "targetName": "Ta-Ba",
                "options": [
                  {
                    "letter": "تَبَ",
                    "name": "Ta-Ba",
                    "isCorrect": true
                  },
                  {
                    "letter": "بَتَ",
                    "name": "Ba-Ta",
                    "isCorrect": false
                  },
                  {
                    "letter": "ثَتَ",
                    "name": "Tsa-Ta",
                    "isCorrect": false
                  }
                ],
                "hint": "Ta di depan dua titik di atas, Ba di belakang titiknya di bawah!"
              },
              {
                "id": "q203_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "بَتَ",
                "targetName": "Ba-Ta",
                "options": []
              },
              {
                "id": "q203",
                "type": "tracing",
                "promptText": "Ayo coba tulis sambung: BA - TA!",
                "targetLetter": "بَتَ",
                "targetName": "Ba-Ta",
                "options": []
              }
            ]
          },
          {
            "id": "iqro2-u1-s2",
            "title": "Sahabat Masuk: Na & Ya",
            "subtitle": "Mangkuk Na dan Bebek Ya berubah menjadi gigi sambung",
            "type": "listen-tap",
            "unitNumber": 1,
            "stageNumber": 2,
            "lettersCovered": [
              "نَبَ",
              "يَتَ"
            ],
            "questions": [
              {
                "id": "q204",
                "type": "listen-tap",
                "promptText": "Cari bacaan: NA - BA!",
                "targetLetter": "نَبَ",
                "targetName": "Na-Ba",
                "options": [
                  {
                    "letter": "نَبَ",
                    "name": "Na-Ba",
                    "isCorrect": true
                  },
                  {
                    "letter": "بَنَ",
                    "name": "Ba-Na",
                    "isCorrect": false
                  },
                  {
                    "letter": "يَتَ",
                    "name": "Ya-Ta",
                    "isCorrect": false
                  }
                ],
                "hint": "Na di awal punya satu titik di atas gerigi!"
              },
              {
                "id": "q205",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan: YA - TA?",
                "targetLetter": "يَتَ",
                "targetName": "Ya-Ta",
                "options": [
                  {
                    "letter": "يَتَ",
                    "name": "Ya-Ta",
                    "isCorrect": true
                  },
                  {
                    "letter": "تَيَ",
                    "name": "Ta-Ya",
                    "isCorrect": false
                  },
                  {
                    "letter": "نَتَ",
                    "name": "Na-Ta",
                    "isCorrect": false
                  }
                ],
                "hint": "Ya saat di awal punya dua titik di bawah gerigi!"
              },
              {
                "id": "q206_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "يَتَ",
                "targetName": "Ya-Ta",
                "options": []
              },
              {
                "id": "q206",
                "type": "tracing",
                "promptText": "Ayo tulis sambung: YA - TA!",
                "targetLetter": "يَتَ",
                "targetName": "Ya-Ta",
                "options": []
              }
            ]
          },
          {
            "id": "iqro2-u1-s3",
            "title": "Rangkaian Tiga Gerbong",
            "subtitle": "Menggandeng 3 huruf sekaligus dalam satu kata",
            "type": "listen-tap",
            "unitNumber": 1,
            "stageNumber": 3,
            "lettersCovered": [
              "بَتَثَ",
              "ثَبَتَ"
            ],
            "questions": [
              {
                "id": "q207",
                "type": "listen-tap",
                "promptText": "Cari kata tiga huruf: BA - TA - TSA!",
                "targetLetter": "بَتَثَ",
                "targetName": "Ba-Ta-Tsa",
                "options": [
                  {
                    "letter": "بَتَثَ",
                    "name": "Ba-Ta-Tsa",
                    "isCorrect": true
                  },
                  {
                    "letter": "ثَبَتَ",
                    "name": "Tsa-Ba-Ta",
                    "isCorrect": false
                  },
                  {
                    "letter": "تَبَثَ",
                    "name": "Ta-Ba-Tsa",
                    "isCorrect": false
                  }
                ],
                "hint": "Perhatikan urutan titik: bawah (Ba), dua atas (Ta), tiga permen (Tsa)!"
              },
              {
                "id": "q208",
                "type": "listen-tap",
                "promptText": "Yang mana kata: TSA - BA - TA?",
                "targetLetter": "ثَبَتَ",
                "targetName": "Tsa-Ba-Ta",
                "options": [
                  {
                    "letter": "ثَبَتَ",
                    "name": "Tsa-Ba-Ta",
                    "isCorrect": true
                  },
                  {
                    "letter": "بَتَثَ",
                    "name": "Ba-Ta-Tsa",
                    "isCorrect": false
                  },
                  {
                    "letter": "نَبَتَ",
                    "name": "Na-Ba-Ta",
                    "isCorrect": false
                  }
                ],
                "hint": "Tsa di depan bertitik tiga, Ba di tengah, Ta di belakang!"
              }
            ]
          },
          {
            "id": "iqro2-u1-s4",
            "title": "Pesta Balon Kereta Sambung",
            "subtitle": "Uji refleks menangkap kata bersambung",
            "type": "bubble-pop",
            "unitNumber": 1,
            "stageNumber": 4,
            "lettersCovered": [
              "بَنَ",
              "يَبَ",
              "نَتَ"
            ],
            "questions": [
              {
                "id": "q209",
                "type": "bubble-pop",
                "promptText": "Pecahkan balon bacaan: BA - NA!",
                "targetLetter": "بَنَ",
                "targetName": "Ba-Na",
                "options": [
                  {
                    "letter": "بَنَ",
                    "name": "Ba-Na",
                    "isCorrect": true
                  },
                  {
                    "letter": "نَبَ",
                    "name": "Na-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "تَبَ",
                    "name": "Ta-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "يَبَ",
                    "name": "Ya-Ba",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q210",
                "type": "bubble-pop",
                "promptText": "Letuskan balon bacaan: YA - BA!",
                "targetLetter": "يَبَ",
                "targetName": "Ya-Ba",
                "options": [
                  {
                    "letter": "يَبَ",
                    "name": "Ya-Ba",
                    "isCorrect": true
                  },
                  {
                    "letter": "بَيَ",
                    "name": "Ba-Ya",
                    "isCorrect": false
                  },
                  {
                    "letter": "تَيَ",
                    "name": "Ta-Ya",
                    "isCorrect": false
                  },
                  {
                    "letter": "نَيَ",
                    "name": "Na-Ya",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro2-u2",
        "unitNumber": 2,
        "title": "Unit 2: Ekor Bebek yang Bersembunyi",
        "description": "Ja, Ha, Kho kepalanya menggandeng dan ekornya terpotong di awal/tengah",
        "themeColor": "#FF9600",
        "stages": [
          {
            "id": "iqro2-u2-s1",
            "title": "Kepala Bebek Menggandeng: Ja & Ha",
            "subtitle": "Kepala bebek menyambung ke huruf berikutnya",
            "type": "listen-tap",
            "unitNumber": 2,
            "stageNumber": 1,
            "lettersCovered": [
              "جَبَ",
              "حَتَ"
            ],
            "questions": [
              {
                "id": "q211",
                "type": "listen-tap",
                "promptText": "Ayo cari bacaan: JA - BA!",
                "targetLetter": "جَبَ",
                "targetName": "Ja-Ba",
                "options": [
                  {
                    "letter": "جَبَ",
                    "name": "Ja-Ba",
                    "isCorrect": true
                  },
                  {
                    "letter": "حَبَ",
                    "name": "Ha-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "خَبَ",
                    "name": "Kho-Ba",
                    "isCorrect": false
                  }
                ],
                "hint": "Ja di depan punya telur satu di bawahnya!"
              },
              {
                "id": "q212",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan: HA - TA?",
                "targetLetter": "حَتَ",
                "targetName": "Ha-Ta",
                "options": [
                  {
                    "letter": "حَتَ",
                    "name": "Ha-Ta",
                    "isCorrect": true
                  },
                  {
                    "letter": "جَتَ",
                    "name": "Ja-Ta",
                    "isCorrect": false
                  },
                  {
                    "letter": "خَتَ",
                    "name": "Kho-Ta",
                    "isCorrect": false
                  }
                ],
                "hint": "Ha bersih tanpa titik sama sekali!"
              },
              {
                "id": "q213_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "جَبَ",
                "targetName": "Ja-Ba",
                "options": []
              },
              {
                "id": "q213",
                "type": "tracing",
                "promptText": "Ayo coba tulis: JA - BA!",
                "targetLetter": "جَبَ",
                "targetName": "Ja-Ba",
                "options": []
              }
            ]
          },
          {
            "id": "iqro2-u2-s2",
            "title": "Topi Mahkota: Kho di Awal & Tengah",
            "subtitle": "Bebek bertopi satu titik di atas kepala",
            "type": "listen-tap",
            "unitNumber": 2,
            "stageNumber": 2,
            "lettersCovered": [
              "خَدَ",
              "سَخَ"
            ],
            "questions": [
              {
                "id": "q214",
                "type": "listen-tap",
                "promptText": "Cari bacaan: KHO - DA!",
                "targetLetter": "خَدَ",
                "targetName": "Kho-Da",
                "options": [
                  {
                    "letter": "خَدَ",
                    "name": "Kho-Da",
                    "isCorrect": true
                  },
                  {
                    "letter": "حَدَ",
                    "name": "Ha-Da",
                    "isCorrect": false
                  },
                  {
                    "letter": "جَدَ",
                    "name": "Ja-Da",
                    "isCorrect": false
                  }
                ],
                "hint": "Kho memakai mahkota satu titik di atasnya!"
              },
              {
                "id": "q215",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan: SA - KHO?",
                "targetLetter": "سَخَ",
                "targetName": "Sa-Kho",
                "options": [
                  {
                    "letter": "سَخَ",
                    "name": "Sa-Kho",
                    "isCorrect": true
                  },
                  {
                    "letter": "سَحَ",
                    "name": "Sa-Ha",
                    "isCorrect": false
                  },
                  {
                    "letter": "سَجَ",
                    "name": "Sa-Ja",
                    "isCorrect": false
                  }
                ],
                "hint": "Kho di akhir kembali memiliki ekor perut yang utuh!"
              },
              {
                "id": "q216_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "خَدَ",
                "targetName": "Kho-Da",
                "options": []
              },
              {
                "id": "q216",
                "type": "tracing",
                "promptText": "Ayo coba tulis: KHO - DA!",
                "targetLetter": "خَدَ",
                "targetName": "Kho-Da",
                "options": []
              }
            ]
          },
          {
            "id": "iqro2-u2-s3",
            "title": "Kata 3 Huruf Bebek Bersambung",
            "subtitle": "Membaca kata utuh: Khoroja dan Najaha",
            "type": "listen-tap",
            "unitNumber": 2,
            "stageNumber": 3,
            "lettersCovered": [
              "خَرَجَ",
              "نَجَحَ"
            ],
            "questions": [
              {
                "id": "q217",
                "type": "listen-tap",
                "promptText": "Cari kata tiga huruf: KHO - RO - JA!",
                "targetLetter": "خَرَجَ",
                "targetName": "Kho-Ro-Ja",
                "options": [
                  {
                    "letter": "خَرَجَ",
                    "name": "Kho-Ro-Ja",
                    "isCorrect": true
                  },
                  {
                    "letter": "دَخَلَ",
                    "name": "Da-Kho-La",
                    "isCorrect": false
                  },
                  {
                    "letter": "نَجَحَ",
                    "name": "Na-Ja-Ha",
                    "isCorrect": false
                  }
                ],
                "hint": "Kho di awal, Ro meluncur di tengah, Ja berekor di akhir!"
              },
              {
                "id": "q218",
                "type": "listen-tap",
                "promptText": "Yang mana kata: NA - JA - HA?",
                "targetLetter": "نَجَحَ",
                "targetName": "Na-Ja-Ha",
                "options": [
                  {
                    "letter": "نَجَحَ",
                    "name": "Na-Ja-Ha",
                    "isCorrect": true
                  },
                  {
                    "letter": "خَرَجَ",
                    "name": "Kho-Ro-Ja",
                    "isCorrect": false
                  },
                  {
                    "letter": "جَعَلَ",
                    "name": "Ja-'A-La",
                    "isCorrect": false
                  }
                ],
                "hint": "Na di awal, Ja di tengah, Ha di akhir!"
              }
            ]
          },
          {
            "id": "iqro2-u2-s4",
            "title": "Pesta Balon Bebek Sambung",
            "subtitle": "Letuskan gelembung kata keluarga bebek",
            "type": "bubble-pop",
            "unitNumber": 2,
            "stageNumber": 4,
            "lettersCovered": [
              "جَعَلَ",
              "حَسَدَ",
              "خَلَقَ"
            ],
            "questions": [
              {
                "id": "q219",
                "type": "bubble-pop",
                "promptText": "Letuskan balon kata: JA - 'A - LA!",
                "targetLetter": "جَعَلَ",
                "targetName": "Ja-'A-La",
                "options": [
                  {
                    "letter": "جَعَلَ",
                    "name": "Ja-'A-La",
                    "isCorrect": true
                  },
                  {
                    "letter": "خَرَجَ",
                    "name": "Kho-Ro-Ja",
                    "isCorrect": false
                  },
                  {
                    "letter": "نَجَحَ",
                    "name": "Na-Ja-Ha",
                    "isCorrect": false
                  },
                  {
                    "letter": "حَسَدَ",
                    "name": "Ha-Sa-Da",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q220",
                "type": "bubble-pop",
                "promptText": "Letuskan balon kata: HA - SA - DA!",
                "targetLetter": "حَسَدَ",
                "targetName": "Ha-Sa-Da",
                "options": [
                  {
                    "letter": "حَسَدَ",
                    "name": "Ha-Sa-Da",
                    "isCorrect": true
                  },
                  {
                    "letter": "جَعَلَ",
                    "name": "Ja-'A-La",
                    "isCorrect": false
                  },
                  {
                    "letter": "خَلَقَ",
                    "name": "Kho-La-Qo",
                    "isCorrect": false
                  },
                  {
                    "letter": "نَجَحَ",
                    "name": "Na-Ja-Ha",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro2-u3",
        "unitNumber": 3,
        "title": "Unit 3: Enam Huruf Mandiri",
        "description": "Alif, Da, Dza, Ro, Za, Wa hanya bisa disambung dari kanan",
        "themeColor": "#06B6D4",
        "stages": [
          {
            "id": "iqro2-u3-s1",
            "title": "Si Keras Kepala: Da & Dza",
            "subtitle": "Bisa digandeng dari belakang, pantang gandeng ke depan",
            "type": "listen-tap",
            "unitNumber": 3,
            "stageNumber": 1,
            "lettersCovered": [
              "دَرَ",
              "ذَهَ"
            ],
            "questions": [
              {
                "id": "q221",
                "type": "listen-tap",
                "promptText": "Ayo cari bacaan: DA - RO!",
                "targetLetter": "دَرَ",
                "targetName": "Da-Ro",
                "options": [
                  {
                    "letter": "دَرَ",
                    "name": "Da-Ro",
                    "isCorrect": true
                  },
                  {
                    "letter": "ذَرَ",
                    "name": "Dza-Ro",
                    "isCorrect": false
                  },
                  {
                    "letter": "رَدَ",
                    "name": "Ro-Da",
                    "isCorrect": false
                  }
                ],
                "hint": "Da tidak menyambung ke Ro karena huruf Da mandiri!"
              },
              {
                "id": "q222",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan: DZA - HA?",
                "targetLetter": "ذَهَ",
                "targetName": "Dza-Ha",
                "options": [
                  {
                    "letter": "ذَهَ",
                    "name": "Dza-Ha",
                    "isCorrect": true
                  },
                  {
                    "letter": "دَهَ",
                    "name": "Da-Ha",
                    "isCorrect": false
                  },
                  {
                    "letter": "زَهَ",
                    "name": "Za-Ha",
                    "isCorrect": false
                  }
                ],
                "hint": "Dza memiliki satu titik di atasnya!"
              },
              {
                "id": "q223_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "دَرَ",
                "targetName": "Da-Ro",
                "options": []
              },
              {
                "id": "q223",
                "type": "tracing",
                "promptText": "Ayo coba tulis: DA - RO!",
                "targetLetter": "دَرَ",
                "targetName": "Da-Ro",
                "options": []
              }
            ]
          },
          {
            "id": "iqro2-u3-s2",
            "title": "Perosotan Meluncur: Ro & Za Mandiri",
            "subtitle": "Meluncur bebas tanpa gandengan ke kiri",
            "type": "listen-tap",
            "unitNumber": 3,
            "stageNumber": 2,
            "lettersCovered": [
              "رَزَ",
              "زَرَ"
            ],
            "questions": [
              {
                "id": "q224",
                "type": "listen-tap",
                "promptText": "Cari bacaan: RO - ZA!",
                "targetLetter": "رَزَ",
                "targetName": "Ro-Za",
                "options": [
                  {
                    "letter": "رَزَ",
                    "name": "Ro-Za",
                    "isCorrect": true
                  },
                  {
                    "letter": "زَرَ",
                    "name": "Za-Ro",
                    "isCorrect": false
                  },
                  {
                    "letter": "دَرَ",
                    "name": "Da-Ro",
                    "isCorrect": false
                  }
                ],
                "hint": "Ro di depan tanpa titik, Za di belakang punya lampu titik!"
              },
              {
                "id": "q225",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan: ZA - RO?",
                "targetLetter": "زَرَ",
                "targetName": "Za-Ro",
                "options": [
                  {
                    "letter": "زَرَ",
                    "name": "Za-Ro",
                    "isCorrect": true
                  },
                  {
                    "letter": "رَزَ",
                    "name": "Ro-Za",
                    "isCorrect": false
                  },
                  {
                    "letter": "ذَرَ",
                    "name": "Dza-Ro",
                    "isCorrect": false
                  }
                ],
                "hint": "Za di depan bertitik, Ro di belakang polos!"
              },
              {
                "id": "q226_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "رَزَ",
                "targetName": "Ro-Za",
                "options": []
              },
              {
                "id": "q226",
                "type": "tracing",
                "promptText": "Ayo coba tulis: RO - ZA!",
                "targetLetter": "رَزَ",
                "targetName": "Ro-Za",
                "options": []
              }
            ]
          },
          {
            "id": "iqro2-u3-s3",
            "title": "Roda Wa & Alif Mandiri",
            "subtitle": "Angka 9 dan tiang lurus yang mandiri",
            "type": "listen-tap",
            "unitNumber": 3,
            "stageNumber": 3,
            "lettersCovered": [
              "وَزَ",
              "اَدَ"
            ],
            "questions": [
              {
                "id": "q227",
                "type": "listen-tap",
                "promptText": "Cari bacaan: WA - ZA!",
                "targetLetter": "وَزَ",
                "targetName": "Wa-Za",
                "options": [
                  {
                    "letter": "وَزَ",
                    "name": "Wa-Za",
                    "isCorrect": true
                  },
                  {
                    "letter": "زَوَ",
                    "name": "Za-Wa",
                    "isCorrect": false
                  },
                  {
                    "letter": "دَوَ",
                    "name": "Da-Wa",
                    "isCorrect": false
                  }
                ],
                "hint": "Wa melingkar kepalanya, lalu Za berdiri mandiri!"
              },
              {
                "id": "q228",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan: A - DA?",
                "targetLetter": "اَدَ",
                "targetName": "A-Da",
                "options": [
                  {
                    "letter": "اَدَ",
                    "name": "A-Da",
                    "isCorrect": true
                  },
                  {
                    "letter": "دَا",
                    "name": "Daa",
                    "isCorrect": false
                  },
                  {
                    "letter": "اَذَ",
                    "name": "A-Dza",
                    "isCorrect": false
                  }
                ],
                "hint": "Alif berdiri lurus di depan, Da di belakang!"
              }
            ]
          },
          {
            "id": "iqro2-u3-s4",
            "title": "Petualangan Balon Huruf Mandiri",
            "subtitle": "Letuskan balon kata berhuruf mandiri",
            "type": "bubble-pop",
            "unitNumber": 3,
            "stageNumber": 4,
            "lettersCovered": [
              "دَرَسَ",
              "وَزَنَ",
              "زَرَعَ"
            ],
            "questions": [
              {
                "id": "q229",
                "type": "bubble-pop",
                "promptText": "Letuskan balon kata: DA - RO - SA!",
                "targetLetter": "دَرَسَ",
                "targetName": "Da-Ro-Sa",
                "options": [
                  {
                    "letter": "دَرَسَ",
                    "name": "Da-Ro-Sa",
                    "isCorrect": true
                  },
                  {
                    "letter": "وَزَنَ",
                    "name": "Wa-Za-Na",
                    "isCorrect": false
                  },
                  {
                    "letter": "زَرَعَ",
                    "name": "Za-Ro-'A",
                    "isCorrect": false
                  },
                  {
                    "letter": "رَدَفَ",
                    "name": "Ro-Da-Fa",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q230",
                "type": "bubble-pop",
                "promptText": "Letuskan balon kata: WA - ZA - NA!",
                "targetLetter": "وَزَنَ",
                "targetName": "Wa-Za-Na",
                "options": [
                  {
                    "letter": "وَزَنَ",
                    "name": "Wa-Za-Na",
                    "isCorrect": true
                  },
                  {
                    "letter": "دَرَسَ",
                    "name": "Da-Ro-Sa",
                    "isCorrect": false
                  },
                  {
                    "letter": "زَرَعَ",
                    "name": "Za-Ro-'A",
                    "isCorrect": false
                  },
                  {
                    "letter": "رَزَقَ",
                    "name": "Ro-Za-Qo",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro2-u4",
        "unitNumber": 4,
        "title": "Unit 4: Gigi Sisir, Balon & Tongkat",
        "description": "Mengenal sambungan Sa, Sya, Sho, Dho, Tho, dan Zho",
        "themeColor": "#3B82F6",
        "stages": [
          {
            "id": "iqro2-u4-s1",
            "title": "Sisir Menggandeng: Sa & Sya",
            "subtitle": "Ekor mangkuk hilang, gerigi siap menggandeng",
            "type": "listen-tap",
            "unitNumber": 4,
            "stageNumber": 1,
            "lettersCovered": [
              "سَبَ",
              "شَكَ"
            ],
            "questions": [
              {
                "id": "q231",
                "type": "listen-tap",
                "promptText": "Ayo cari bacaan: SA - BA!",
                "targetLetter": "سَبَ",
                "targetName": "Sa-Ba",
                "options": [
                  {
                    "letter": "سَبَ",
                    "name": "Sa-Ba",
                    "isCorrect": true
                  },
                  {
                    "letter": "شَبَ",
                    "name": "Sya-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "صَبَ",
                    "name": "Sho-Ba",
                    "isCorrect": false
                  }
                ],
                "hint": "Sa tiga gerigi tanpa titik menyambung ke Ba!"
              },
              {
                "id": "q232",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan: SYA - KA?",
                "targetLetter": "شَكَ",
                "targetName": "Sya-Ka",
                "options": [
                  {
                    "letter": "شَكَ",
                    "name": "Sya-Ka",
                    "isCorrect": true
                  },
                  {
                    "letter": "سَكَ",
                    "name": "Sa-Ka",
                    "isCorrect": false
                  },
                  {
                    "letter": "صَكَ",
                    "name": "Sho-Ka",
                    "isCorrect": false
                  }
                ],
                "hint": "Sya punya tiga titik bintang di atas gerigi!"
              },
              {
                "id": "q233_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "سَبَ",
                "targetName": "Sa-Ba",
                "options": []
              },
              {
                "id": "q233",
                "type": "tracing",
                "promptText": "Ayo coba tulis: SA - BA!",
                "targetLetter": "سَبَ",
                "targetName": "Sa-Ba",
                "options": []
              }
            ]
          },
          {
            "id": "iqro2-u4-s2",
            "title": "Balon & Tongkat: Sho, Dho, Tho, Zho",
            "subtitle": "Bentuk kokoh bertekanan tebal",
            "type": "listen-tap",
            "unitNumber": 4,
            "stageNumber": 2,
            "lettersCovered": [
              "صَبَ",
              "طَلَ"
            ],
            "questions": [
              {
                "id": "q234",
                "type": "listen-tap",
                "promptText": "Cari bacaan: SHO - BA!",
                "targetLetter": "صَبَ",
                "targetName": "Sho-Ba",
                "options": [
                  {
                    "letter": "صَبَ",
                    "name": "Sho-Ba",
                    "isCorrect": true
                  },
                  {
                    "letter": "ضَبَ",
                    "name": "Dho-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "سَبَ",
                    "name": "Sa-Ba",
                    "isCorrect": false
                  }
                ],
                "hint": "Sho bentuknya lonjong menggandeng ke Ba!"
              },
              {
                "id": "q235",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan: THO - LA?",
                "targetLetter": "طَلَ",
                "targetName": "Tho-La",
                "options": [
                  {
                    "letter": "طَلَ",
                    "name": "Tho-La",
                    "isCorrect": true
                  },
                  {
                    "letter": "ظَلَ",
                    "name": "Zho-La",
                    "isCorrect": false
                  },
                  {
                    "letter": "صَلَ",
                    "name": "Sho-La",
                    "isCorrect": false
                  }
                ],
                "hint": "Tho tongkatnya tegak berdiri kokoh!"
              },
              {
                "id": "q236_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "طَلَ",
                "targetName": "Tho-La",
                "options": []
              },
              {
                "id": "q236",
                "type": "tracing",
                "promptText": "Ayo coba tulis: THO - LA!",
                "targetLetter": "طَلَ",
                "targetName": "Tho-La",
                "options": []
              }
            ]
          },
          {
            "id": "iqro2-u4-s3",
            "title": "Kata 3 Huruf Penuh Ketangkasan",
            "subtitle": "Shobaro dan Nazhoro berirama fasih",
            "type": "listen-tap",
            "unitNumber": 4,
            "stageNumber": 3,
            "lettersCovered": [
              "صَبَرَ",
              "نَظَرَ"
            ],
            "questions": [
              {
                "id": "q237",
                "type": "listen-tap",
                "promptText": "Cari kata tiga huruf: SHO - BA - RO!",
                "targetLetter": "صَبَرَ",
                "targetName": "Sho-Ba-Ro",
                "options": [
                  {
                    "letter": "صَبَرَ",
                    "name": "Sho-Ba-Ro",
                    "isCorrect": true
                  },
                  {
                    "letter": "شَكَرَ",
                    "name": "Sya-Ka-Ro",
                    "isCorrect": false
                  },
                  {
                    "letter": "طَلَبَ",
                    "name": "Tho-La-Ba",
                    "isCorrect": false
                  }
                ],
                "hint": "Sho di depan, Ba di tengah, Ro meluncur di akhir!"
              },
              {
                "id": "q238",
                "type": "listen-tap",
                "promptText": "Yang mana kata: NA - ZHO - RO?",
                "targetLetter": "نَظَرَ",
                "targetName": "Na-Zho-Ro",
                "options": [
                  {
                    "letter": "نَظَرَ",
                    "name": "Na-Zho-Ro",
                    "isCorrect": true
                  },
                  {
                    "letter": "طَلَبَ",
                    "name": "Tho-La-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "صَبَرَ",
                    "name": "Sho-Ba-Ro",
                    "isCorrect": false
                  }
                ],
                "hint": "Na di awal, Zho bertongkat titik di tengah, Ro di akhir!"
              }
            ]
          },
          {
            "id": "iqro2-u4-s4",
            "title": "Pesta Balon Sisir & Tongkat",
            "subtitle": "Letuskan gelembung kata penuh semangat",
            "type": "bubble-pop",
            "unitNumber": 4,
            "stageNumber": 4,
            "lettersCovered": [
              "شَكَرَ",
              "طَلَبَ"
            ],
            "questions": [
              {
                "id": "q239",
                "type": "bubble-pop",
                "promptText": "Letuskan balon kata: SYA - KA - RO!",
                "targetLetter": "شَكَرَ",
                "targetName": "Sya-Ka-Ro",
                "options": [
                  {
                    "letter": "شَكَرَ",
                    "name": "Sya-Ka-Ro",
                    "isCorrect": true
                  },
                  {
                    "letter": "صَبَرَ",
                    "name": "Sho-Ba-Ro",
                    "isCorrect": false
                  },
                  {
                    "letter": "نَظَرَ",
                    "name": "Na-Zho-Ro",
                    "isCorrect": false
                  },
                  {
                    "letter": "طَلَبَ",
                    "name": "Tho-La-Ba",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q240",
                "type": "bubble-pop",
                "promptText": "Letuskan balon kata: THO - LA - BA!",
                "targetLetter": "طَلَبَ",
                "targetName": "Tho-La-Ba",
                "options": [
                  {
                    "letter": "طَلَبَ",
                    "name": "Tho-La-Ba",
                    "isCorrect": true
                  },
                  {
                    "letter": "نَظَرَ",
                    "name": "Na-Zho-Ro",
                    "isCorrect": false
                  },
                  {
                    "letter": "شَكَرَ",
                    "name": "Sya-Ka-Ro",
                    "isCorrect": false
                  },
                  {
                    "letter": "صَبَرَ",
                    "name": "Sho-Ba-Ro",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro2-u5",
        "unitNumber": 5,
        "title": "Unit 5: Perubahan Bentuk Ajaib",
        "description": "Ka petir, La payung, 'A segitiga, dan Ha pita kupu-kupu",
        "themeColor": "#8B5CF6",
        "stages": [
          {
            "id": "iqro2-u5-s1",
            "title": "Petir Ajaib & Payung: Ka & La",
            "subtitle": "Ka berubah bentuk miring dan La meliuk anggun",
            "type": "listen-tap",
            "unitNumber": 5,
            "stageNumber": 1,
            "lettersCovered": [
              "كَتَ",
              "لَبَ"
            ],
            "questions": [
              {
                "id": "q241",
                "type": "listen-tap",
                "promptText": "Ayo cari bacaan: KA - TA!",
                "targetLetter": "كَتَ",
                "targetName": "Ka-Ta",
                "options": [
                  {
                    "letter": "كَتَ",
                    "name": "Ka-Ta",
                    "isCorrect": true
                  },
                  {
                    "letter": "لَتَ",
                    "name": "La-Ta",
                    "isCorrect": false
                  },
                  {
                    "letter": "فَتَ",
                    "name": "Fa-Ta",
                    "isCorrect": false
                  }
                ],
                "hint": "Ka saat di awal berbentuk garis miring bersimpul!"
              },
              {
                "id": "q242",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan: LA - BA?",
                "targetLetter": "لَبَ",
                "targetName": "La-Ba",
                "options": [
                  {
                    "letter": "لَبَ",
                    "name": "La-Ba",
                    "isCorrect": true
                  },
                  {
                    "letter": "كَبَ",
                    "name": "Ka-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "اَبَ",
                    "name": "A-Ba",
                    "isCorrect": false
                  }
                ],
                "hint": "La tinggi tegak menyambung ke huruf Ba!"
              },
              {
                "id": "q243_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "كَتَ",
                "targetName": "Ka-Ta",
                "options": []
              },
              {
                "id": "q243",
                "type": "tracing",
                "promptText": "Ayo coba tulis sambung: KA - TA!",
                "targetLetter": "كَتَ",
                "targetName": "Ka-Ta",
                "options": []
              }
            ]
          },
          {
            "id": "iqro2-u5-s2",
            "title": "Segitiga & Pita Kupu-Kupu: 'A & Ha",
            "subtitle": "'A di tengah jadi segitiga dan Ha jadi simpul pita",
            "type": "listen-tap",
            "unitNumber": 5,
            "stageNumber": 2,
            "lettersCovered": [
              "مَعَ",
              "فَهَ"
            ],
            "questions": [
              {
                "id": "q244",
                "type": "listen-tap",
                "promptText": "Cari bacaan: MA - 'A!",
                "targetLetter": "مَعَ",
                "targetName": "Ma-'A",
                "options": [
                  {
                    "letter": "مَعَ",
                    "name": "Ma-'A",
                    "isCorrect": true
                  },
                  {
                    "letter": "مَغَ",
                    "name": "Ma-Gho",
                    "isCorrect": false
                  },
                  {
                    "letter": "مَحَ",
                    "name": "Ma-Ha",
                    "isCorrect": false
                  }
                ],
                "hint": "'A di akhir berbentuk segitiga lengkung tanpa titik!"
              },
              {
                "id": "q245",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan: FA - HA?",
                "targetLetter": "فَهَ",
                "targetName": "Fa-Ha",
                "options": [
                  {
                    "letter": "فَهَ",
                    "name": "Fa-Ha",
                    "isCorrect": true
                  },
                  {
                    "letter": "قَهَ",
                    "name": "Qo-Ha",
                    "isCorrect": false
                  },
                  {
                    "letter": "لَهَ",
                    "name": "La-Ha",
                    "isCorrect": false
                  }
                ],
                "hint": "Ha di tengah membentuk simpul pita seperti kupu-kupu!"
              },
              {
                "id": "q246_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "مَعَ",
                "targetName": "Ma-'A",
                "options": []
              },
              {
                "id": "q246",
                "type": "tracing",
                "promptText": "Ayo coba tulis: MA - 'A!",
                "targetLetter": "مَعَ",
                "targetName": "Ma-'A",
                "options": []
              }
            ]
          },
          {
            "id": "iqro2-u5-s3",
            "title": "Perahu Ceria: Fa & Qo Sambung",
            "subtitle": "Kata Fataha dan Kataba yang mashur",
            "type": "listen-tap",
            "unitNumber": 5,
            "stageNumber": 3,
            "lettersCovered": [
              "فَتَحَ",
              "كَتَبَ"
            ],
            "questions": [
              {
                "id": "q247",
                "type": "listen-tap",
                "promptText": "Cari kata tiga huruf: FA - TA - HA!",
                "targetLetter": "فَتَحَ",
                "targetName": "Fa-Ta-Ha",
                "options": [
                  {
                    "letter": "فَتَحَ",
                    "name": "Fa-Ta-Ha",
                    "isCorrect": true
                  },
                  {
                    "letter": "قَرَأَ",
                    "name": "Qo-Ro-A",
                    "isCorrect": false
                  },
                  {
                    "letter": "كَتَبَ",
                    "name": "Ka-Ta-Ba",
                    "isCorrect": false
                  }
                ],
                "hint": "Fa bertitik satu di awal, Ta di tengah, Ha di akhir!"
              },
              {
                "id": "q248",
                "type": "listen-tap",
                "promptText": "Yang mana kata: KA - TA - BA?",
                "targetLetter": "كَتَبَ",
                "targetName": "Ka-Ta-Ba",
                "options": [
                  {
                    "letter": "كَتَبَ",
                    "name": "Ka-Ta-Ba",
                    "isCorrect": true
                  },
                  {
                    "letter": "فَتَحَ",
                    "name": "Fa-Ta-Ha",
                    "isCorrect": false
                  },
                  {
                    "letter": "لَعِبَ",
                    "name": "La-'I-Ba",
                    "isCorrect": false
                  }
                ],
                "hint": "Ka bersimpul di awal, Ta di tengah, Ba di akhir!"
              }
            ]
          },
          {
            "id": "iqro2-u5-s4",
            "title": "Tantangan Balon Bentuk Ajaib",
            "subtitle": "Pecahkan balon kata Fahima dan Balagho",
            "type": "bubble-pop",
            "unitNumber": 5,
            "stageNumber": 4,
            "lettersCovered": [
              "فَهِمَ",
              "بَلَغَ"
            ],
            "questions": [
              {
                "id": "q249",
                "type": "bubble-pop",
                "promptText": "Pecahkan balon kata: FA - HA - MA!",
                "targetLetter": "فَهِمَ",
                "targetName": "Fa-Ha-Ma",
                "options": [
                  {
                    "letter": "فَهِمَ",
                    "name": "Fa-Ha-Ma",
                    "isCorrect": true
                  },
                  {
                    "letter": "كَتَبَ",
                    "name": "Ka-Ta-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "فَتَحَ",
                    "name": "Fa-Ta-Ha",
                    "isCorrect": false
                  },
                  {
                    "letter": "بَلَغَ",
                    "name": "Ba-La-Gho",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q250",
                "type": "bubble-pop",
                "promptText": "Pecahkan balon kata: BA - LA - GHO!",
                "targetLetter": "بَلَغَ",
                "targetName": "Ba-La-Gho",
                "options": [
                  {
                    "letter": "بَلَغَ",
                    "name": "Ba-La-Gho",
                    "isCorrect": true
                  },
                  {
                    "letter": "فَهِمَ",
                    "name": "Fa-Ha-Ma",
                    "isCorrect": false
                  },
                  {
                    "letter": "كَتَبَ",
                    "name": "Ka-Ta-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "فَتَحَ",
                    "name": "Fa-Ta-Ha",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro2-u6",
        "unitNumber": 6,
        "title": "Unit 6: Rahasia Mad Asli (Dua Harakat)",
        "description": "Mengenal harakat fathah yang diikuti Alif dibaca panjang 2 ketukan",
        "themeColor": "#EC4899",
        "stages": [
          {
            "id": "iqro2-u6-s1",
            "title": "Ayunan Pertama: Baa, Taa, Tsaa",
            "subtitle": "Alif membuat bacaan diayun panjang 2 harakat",
            "type": "listen-tap",
            "unitNumber": 6,
            "stageNumber": 1,
            "lettersCovered": [
              "بَا",
              "تَا",
              "ثَا"
            ],
            "questions": [
              {
                "id": "q251",
                "type": "listen-tap",
                "promptText": "Ayo cari bacaan PANJANG 2 harakat: BAA!",
                "targetLetter": "بَا",
                "targetName": "Baa",
                "options": [
                  {
                    "letter": "بَا",
                    "name": "Baa",
                    "isCorrect": true
                  },
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "تَا",
                    "name": "Taa",
                    "isCorrect": false
                  }
                ],
                "hint": "Baa ada huruf Alif di sampingnya sehingga dibaca panjang 2 ayunan!"
              },
              {
                "id": "q252",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan PANJANG 2 harakat: TAA?",
                "targetLetter": "تَا",
                "targetName": "Taa",
                "options": [
                  {
                    "letter": "تَا",
                    "name": "Taa",
                    "isCorrect": true
                  },
                  {
                    "letter": "تَ",
                    "name": "Ta",
                    "isCorrect": false
                  },
                  {
                    "letter": "ثَا",
                    "name": "Tsaa",
                    "isCorrect": false
                  }
                ],
                "hint": "Ta berfathah diikuti Alif dibaca panjang Taa!"
              },
              {
                "id": "q253_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "بَا",
                "targetName": "Baa",
                "options": []
              },
              {
                "id": "q253",
                "type": "tracing",
                "promptText": "Ayo coba tulis bacaan panjang: BAA!",
                "targetLetter": "بَا",
                "targetName": "Baa",
                "options": []
              }
            ]
          },
          {
            "id": "iqro2-u6-s2",
            "title": "Detektif Pendek vs Panjang",
            "subtitle": "Membedakan 1 ketukan vs 2 ketukan dengan cermat",
            "type": "listen-tap",
            "unitNumber": 6,
            "stageNumber": 2,
            "lettersCovered": [
              "بَتَ",
              "بَاتَا"
            ],
            "questions": [
              {
                "id": "q254",
                "type": "listen-tap",
                "promptText": "Dengar baik-baik! Yang mana dibaca PANJANG: BAA - TAA?",
                "targetLetter": "بَاتَا",
                "targetName": "Baa-Taa",
                "options": [
                  {
                    "letter": "بَاتَا",
                    "name": "Baa-Taa",
                    "isCorrect": true
                  },
                  {
                    "letter": "بَتَ",
                    "name": "Ba-Ta",
                    "isCorrect": false
                  },
                  {
                    "letter": "تَبَ",
                    "name": "Ta-Ba",
                    "isCorrect": false
                  }
                ],
                "hint": "Baa-Taa memiliki Alif panjang di setiap hurufnya!"
              },
              {
                "id": "q255",
                "type": "listen-tap",
                "promptText": "Cari yang dibaca PENDEK: BA - TA!",
                "targetLetter": "بَتَ",
                "targetName": "Ba-Ta",
                "options": [
                  {
                    "letter": "بَتَ",
                    "name": "Ba-Ta",
                    "isCorrect": true
                  },
                  {
                    "letter": "بَاتَا",
                    "name": "Baa-Taa",
                    "isCorrect": false
                  },
                  {
                    "letter": "بَاتَ",
                    "name": "Baa-Ta",
                    "isCorrect": false
                  }
                ],
                "hint": "Ba-Ta tidak punya Alif sehingga dibaca pendek 1 ketukan!"
              }
            ]
          },
          {
            "id": "iqro2-u6-s3",
            "title": "Kata Populer Mad Asli 2 Harakat",
            "subtitle": "Membaca kata Qoola dan Kaana dengan fasih",
            "type": "listen-tap",
            "unitNumber": 6,
            "stageNumber": 3,
            "lettersCovered": [
              "قَالَ",
              "كَانَ"
            ],
            "questions": [
              {
                "id": "q256",
                "type": "listen-tap",
                "promptText": "Cari kata: QOO - LA!",
                "targetLetter": "قَالَ",
                "targetName": "Qoo-La",
                "options": [
                  {
                    "letter": "قَالَ",
                    "name": "Qoo-La",
                    "isCorrect": true
                  },
                  {
                    "letter": "قَلَ",
                    "name": "Qo-La",
                    "isCorrect": false
                  },
                  {
                    "letter": "كَانَ",
                    "name": "Kaa-Na",
                    "isCorrect": false
                  }
                ],
                "hint": "Qoola huruf Qo-nya panjang 2 harakat!"
              },
              {
                "id": "q257",
                "type": "listen-tap",
                "promptText": "Yang mana kata: KAA - NA?",
                "targetLetter": "كَانَ",
                "targetName": "Kaa-Na",
                "options": [
                  {
                    "letter": "كَانَ",
                    "name": "Kaa-Na",
                    "isCorrect": true
                  },
                  {
                    "letter": "كَنَ",
                    "name": "Ka-Na",
                    "isCorrect": false
                  },
                  {
                    "letter": "قَالَ",
                    "name": "Qoo-La",
                    "isCorrect": false
                  }
                ],
                "hint": "Kaana huruf Ka-nya panjang 2 harakat!"
              },
              {
                "id": "q258_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "قَالَ",
                "targetName": "Qoo-La",
                "options": []
              },
              {
                "id": "q258",
                "type": "tracing",
                "promptText": "Ayo coba tulis kata mad: QOO - LA!",
                "targetLetter": "قَالَ",
                "targetName": "Qoo-La",
                "options": []
              }
            ]
          },
          {
            "id": "iqro2-u6-s4",
            "title": "Pesta Balon Mad Asli",
            "subtitle": "Uji refleks menangkap kata 2 harakat",
            "type": "bubble-pop",
            "unitNumber": 6,
            "stageNumber": 4,
            "lettersCovered": [
              "تَابَ",
              "كَانَ"
            ],
            "questions": [
              {
                "id": "q259",
                "type": "bubble-pop",
                "promptText": "Letuskan balon kata panjang: TAA - BA!",
                "targetLetter": "تَابَ",
                "targetName": "Taa-Ba",
                "options": [
                  {
                    "letter": "تَابَ",
                    "name": "Taa-Ba",
                    "isCorrect": true
                  },
                  {
                    "letter": "تَبَ",
                    "name": "Ta-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "قَالَ",
                    "name": "Qoo-La",
                    "isCorrect": false
                  },
                  {
                    "letter": "كَانَ",
                    "name": "Kaa-Na",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q260",
                "type": "bubble-pop",
                "promptText": "Letuskan balon kata panjang: KAA - NA!",
                "targetLetter": "كَانَ",
                "targetName": "Kaa-Na",
                "options": [
                  {
                    "letter": "كَانَ",
                    "name": "Kaa-Na",
                    "isCorrect": true
                  },
                  {
                    "letter": "قَالَ",
                    "name": "Qoo-La",
                    "isCorrect": false
                  },
                  {
                    "letter": "تَابَ",
                    "name": "Taa-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "صَابَرَ",
                    "name": "Shoo-Ba-Ro",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro2-u7",
        "unitNumber": 7,
        "title": "Unit 7: Istana Kelulusan & Wisuda Iqro 2",
        "description": "Uji pamungkas ketangkasan membaca huruf sambung dan mad asli",
        "themeColor": "#FFB800",
        "stages": [
          {
            "id": "iqro2-u7-s1",
            "title": "Uji Kata Sambung Awal & Tengah",
            "subtitle": "Menguji kelancaran membaca tiga huruf bersambung",
            "type": "listen-tap",
            "unitNumber": 7,
            "stageNumber": 1,
            "lettersCovered": [
              "خَلَقَ",
              "جَعَلَ"
            ],
            "questions": [
              {
                "id": "q261",
                "type": "listen-tap",
                "promptText": "Cari kata: KHO - LA - QO!",
                "targetLetter": "خَلَقَ",
                "targetName": "Kho-La-Qo",
                "options": [
                  {
                    "letter": "خَلَقَ",
                    "name": "Kho-La-Qo",
                    "isCorrect": true
                  },
                  {
                    "letter": "جَعَلَ",
                    "name": "Ja-'A-La",
                    "isCorrect": false
                  },
                  {
                    "letter": "حَسَدَ",
                    "name": "Ha-Sa-Da",
                    "isCorrect": false
                  }
                ],
                "hint": "Kho di awal, La di tengah, Qo di akhir!"
              },
              {
                "id": "q262",
                "type": "listen-tap",
                "promptText": "Yang mana kata: JA - 'A - LA?",
                "targetLetter": "جَعَلَ",
                "targetName": "Ja-'A-La",
                "options": [
                  {
                    "letter": "جَعَلَ",
                    "name": "Ja-'A-La",
                    "isCorrect": true
                  },
                  {
                    "letter": "خَلَقَ",
                    "name": "Kho-La-Qo",
                    "isCorrect": false
                  },
                  {
                    "letter": "نَجَحَ",
                    "name": "Na-Ja-Ha",
                    "isCorrect": false
                  }
                ],
                "hint": "Ja di depan bertelur, 'A segitiga di tengah, La di akhir!"
              },
              {
                "id": "q261_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "خَلَقَ",
                "targetName": "Kho-La-Qo",
                "options": []
              },
              {
                "id": "q261_trace",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf KHO-LA-QO!",
                "targetLetter": "خَلَقَ",
                "targetName": "Kho-La-Qo",
                "options": []
              }
            ]
          },
          {
            "id": "iqro2-u7-s2",
            "title": "Uji Kata Mad Asli 2 Harakat",
            "subtitle": "Menguji kelancaran membaca kata berayun panjang",
            "type": "listen-tap",
            "unitNumber": 7,
            "stageNumber": 2,
            "lettersCovered": [
              "صَابَرَ",
              "جَاهَدَ"
            ],
            "questions": [
              {
                "id": "q263",
                "type": "listen-tap",
                "promptText": "Cari kata ber-mad: SHOO - BA - RO!",
                "targetLetter": "صَابَرَ",
                "targetName": "Shoo-Ba-Ro",
                "options": [
                  {
                    "letter": "صَابَرَ",
                    "name": "Shoo-Ba-Ro",
                    "isCorrect": true
                  },
                  {
                    "letter": "صَبَرَ",
                    "name": "Sho-Ba-Ro",
                    "isCorrect": false
                  },
                  {
                    "letter": "جَاهَدَ",
                    "name": "Jaa-Ha-Da",
                    "isCorrect": false
                  }
                ],
                "hint": "Shoo panjang dua harakat ber-Alif!"
              },
              {
                "id": "q264",
                "type": "listen-tap",
                "promptText": "Yang mana kata ber-mad: JAA - HA - DA?",
                "targetLetter": "جَاهَدَ",
                "targetName": "Jaa-Ha-Da",
                "options": [
                  {
                    "letter": "جَاهَدَ",
                    "name": "Jaa-Ha-Da",
                    "isCorrect": true
                  },
                  {
                    "letter": "جَهَدَ",
                    "name": "Ja-Ha-Da",
                    "isCorrect": false
                  },
                  {
                    "letter": "شَاهَدَ",
                    "name": "Syaa-Ha-Da",
                    "isCorrect": false
                  }
                ],
                "hint": "Jaa panjang dua harakat diikuti Alif!"
              }
            ]
          },
          {
            "id": "iqro2-u7-s3",
            "title": "Uji Ketelitian Panjang-Pendek",
            "subtitle": "Telinga santri cilik membedakan 1 vs 2 harakat",
            "type": "listen-tap",
            "unitNumber": 7,
            "stageNumber": 3,
            "lettersCovered": [
              "قَتَلَ",
              "قَاتَلَ"
            ],
            "questions": [
              {
                "id": "q265",
                "type": "listen-tap",
                "promptText": "Telinga jeli! Pilih kata PENDEK: QO - TA - LA!",
                "targetLetter": "قَتَلَ",
                "targetName": "Qo-Ta-La",
                "options": [
                  {
                    "letter": "قَتَلَ",
                    "name": "Qo-Ta-La",
                    "isCorrect": true
                  },
                  {
                    "letter": "قَاتَلَ",
                    "name": "Qoo-Ta-La",
                    "isCorrect": false
                  },
                  {
                    "letter": "قَالَ",
                    "name": "Qoo-La",
                    "isCorrect": false
                  }
                ],
                "hint": "Semua hurufnya dibaca pendek 1 ketukan tanpa Alif!"
              },
              {
                "id": "q266",
                "type": "listen-tap",
                "promptText": "Sekarang pilih kata PANJANG: QOO - TA - LA!",
                "targetLetter": "قَاتَلَ",
                "targetName": "Qoo-Ta-La",
                "options": [
                  {
                    "letter": "قَاتَلَ",
                    "name": "Qoo-Ta-La",
                    "isCorrect": true
                  },
                  {
                    "letter": "قَتَلَ",
                    "name": "Qo-Ta-La",
                    "isCorrect": false
                  },
                  {
                    "letter": "قَالَ",
                    "name": "Qoo-La",
                    "isCorrect": false
                  }
                ],
                "hint": "Huruf Qo di depan panjang 2 harakat ber-Alif!"
              }
            ]
          },
          {
            "id": "iqro2-u7-s4",
            "title": "Wisuda Akbar Kelulusan Iqro 2!",
            "subtitle": "Uji pamungkas kelulusan bintang emas Iqro 2",
            "type": "bubble-pop",
            "unitNumber": 7,
            "stageNumber": 4,
            "lettersCovered": [
              "خَلَقَ",
              "قَالَ",
              "جَاهَدَ"
            ],
            "questions": [
              {
                "id": "q267",
                "type": "bubble-pop",
                "promptText": "Wisuda Iqro 2! Pecahkan kata: KHO - LA - QO!",
                "targetLetter": "خَلَقَ",
                "targetName": "Kho-La-Qo",
                "options": [
                  {
                    "letter": "خَلَقَ",
                    "name": "Kho-La-Qo",
                    "isCorrect": true
                  },
                  {
                    "letter": "جَعَلَ",
                    "name": "Ja-'A-La",
                    "isCorrect": false
                  },
                  {
                    "letter": "قَاتَلَ",
                    "name": "Qoo-Ta-La",
                    "isCorrect": false
                  },
                  {
                    "letter": "صَابَرَ",
                    "name": "Shoo-Ba-Ro",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q268",
                "type": "bubble-pop",
                "promptText": "Hebat! Sekarang letuskan kata mad: QOO - LA!",
                "targetLetter": "قَالَ",
                "targetName": "Qoo-La",
                "options": [
                  {
                    "letter": "قَالَ",
                    "name": "Qoo-La",
                    "isCorrect": true
                  },
                  {
                    "letter": "قَتَلَ",
                    "name": "Qo-Ta-La",
                    "isCorrect": false
                  },
                  {
                    "letter": "كَانَ",
                    "name": "Kaa-Na",
                    "isCorrect": false
                  },
                  {
                    "letter": "تَابَ",
                    "name": "Taa-Ba",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "q269",
                "type": "bubble-pop",
                "promptText": "Luar biasa! Pecahkan kata pamungkas: JAA - HA - DA!",
                "targetLetter": "جَاهَدَ",
                "targetName": "Jaa-Ha-Da",
                "options": [
                  {
                    "letter": "جَاهَدَ",
                    "name": "Jaa-Ha-Da",
                    "isCorrect": true
                  },
                  {
                    "letter": "صَابَرَ",
                    "name": "Shoo-Ba-Ro",
                    "isCorrect": false
                  },
                  {
                    "letter": "خَلَقَ",
                    "name": "Kho-La-Qo",
                    "isCorrect": false
                  },
                  {
                    "letter": "كَانَ",
                    "name": "Kaa-Na",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "level": 3,
    "title": "Iqro 3",
    "subtitle": "Harakat Kasrah (-i), Dhammah (-u) & Mad Asli",
    "color": "#FF9600",
    "totalStages": 28,
    "units": [
      {
        "id": "iqro3-u1",
        "unitNumber": 1,
        "title": "Unit 1: Mengenal Kasrah (-i)",
        "description": "Mengenal garis miring bawah berbunyi I yang ceria",
        "themeColor": "#FF9600",
        "stages": [
          {
            "id": "iqro3-u1-s1",
            "title": "Kenalan Kasrah Garis Bawah",
            "subtitle": "Dengar dan ketuk kartu suara kasrah",
            "type": "listen-tap",
            "unitNumber": 1,
            "stageNumber": 1,
            "lettersCovered": [
              "إِ",
              "بِ",
              "تِ",
              "ثِ"
            ],
            "questions": [
              {
                "id": "iqro3-u1-s1-q1",
                "type": "listen-tap",
                "promptText": "Ayo cari huruf BI!",
                "targetLetter": "بِ",
                "targetName": "Bi",
                "options": [
                  {
                    "letter": "بِ",
                    "name": "Bi",
                    "isCorrect": true
                  },
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": false
                  }
                ],
                "hint": "Kasrah adalah garis miring di bawah huruf, dibaca I!"
              },
              {
                "id": "iqro3-u1-s1-q2",
                "type": "listen-tap",
                "promptText": "Yang mana huruf I?",
                "targetLetter": "إِ",
                "targetName": "I",
                "options": [
                  {
                    "letter": "إِ",
                    "name": "I",
                    "isCorrect": true
                  },
                  {
                    "letter": "اَ",
                    "name": "A",
                    "isCorrect": false
                  }
                ],
                "hint": "Alif dengan garis di bawah berbunyi I!"
              },
              {
                "id": "iqro3-u1-s1-q3",
                "type": "listen-tap",
                "promptText": "Ayo cari huruf TI!",
                "targetLetter": "تِ",
                "targetName": "Ti",
                "options": [
                  {
                    "letter": "تِ",
                    "name": "Ti",
                    "isCorrect": true
                  },
                  {
                    "letter": "بِ",
                    "name": "Bi",
                    "isCorrect": false
                  },
                  {
                    "letter": "تَ",
                    "name": "Ta",
                    "isCorrect": false
                  }
                ],
                "hint": "Dua titik di atas dengan harakat kasrah di bawah!"
              },
              {
                "id": "iqro3-u1-s1-speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "بِ",
                "targetName": "Bi",
                "options": []
              }
            ]
          },
          {
            "id": "iqro3-u1-s2",
            "title": "Letuskan Balon Suara I",
            "subtitle": "Pecahkan balon dengan bunyi kasrah yang benar",
            "type": "bubble-pop",
            "unitNumber": 1,
            "stageNumber": 2,
            "lettersCovered": [
              "جِ",
              "حِ",
              "خِ",
              "دِ"
            ],
            "questions": [
              {
                "id": "iqro3-u1-s2-q1",
                "type": "bubble-pop",
                "promptText": "Letuskan balon huruf JI!",
                "targetLetter": "جِ",
                "targetName": "Ji",
                "options": [
                  {
                    "letter": "جِ",
                    "name": "Ji",
                    "isCorrect": true
                  },
                  {
                    "letter": "جَ",
                    "name": "Ja",
                    "isCorrect": false
                  },
                  {
                    "letter": "حِ",
                    "name": "Hi",
                    "isCorrect": false
                  },
                  {
                    "letter": "بِ",
                    "name": "Bi",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u1-s2-q2",
                "type": "bubble-pop",
                "promptText": "Letuskan balon huruf HI!",
                "targetLetter": "حِ",
                "targetName": "Hi",
                "options": [
                  {
                    "letter": "حِ",
                    "name": "Hi",
                    "isCorrect": true
                  },
                  {
                    "letter": "خِ",
                    "name": "Khi",
                    "isCorrect": false
                  },
                  {
                    "letter": "حَ",
                    "name": "Ha",
                    "isCorrect": false
                  },
                  {
                    "letter": "جِ",
                    "name": "Ji",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u1-s2-q3",
                "type": "bubble-pop",
                "promptText": "Letuskan balon huruf DI!",
                "targetLetter": "دِ",
                "targetName": "Di",
                "options": [
                  {
                    "letter": "دِ",
                    "name": "Di",
                    "isCorrect": true
                  },
                  {
                    "letter": "دَ",
                    "name": "Da",
                    "isCorrect": false
                  },
                  {
                    "letter": "ذِ",
                    "name": "Dzi",
                    "isCorrect": false
                  },
                  {
                    "letter": "تِ",
                    "name": "Ti",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "iqro3-u1-s3",
            "title": "Menulis Garis Kasrah",
            "subtitle": "Tulis huruf berharakat kasrah dengan rapi",
            "type": "tracing",
            "unitNumber": 1,
            "stageNumber": 3,
            "lettersCovered": [
              "رِ",
              "زِ",
              "سِ"
            ],
            "questions": [
              {
                "id": "iqro3-u1-s3-q1_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "رِ",
                "targetName": "Ri",
                "options": []
              },
              {
                "id": "iqro3-u1-s3-q1",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf: RI!",
                "targetLetter": "رِ",
                "targetName": "Ri",
                "options": []
              },
              {
                "id": "iqro3-u1-s3-q2",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf: ZI!",
                "targetLetter": "زِ",
                "targetName": "Zi",
                "options": []
              },
              {
                "id": "iqro3-u1-s3-q3",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf: SI!",
                "targetLetter": "سِ",
                "targetName": "Si",
                "options": []
              }
            ]
          },
          {
            "id": "iqro3-u1-s4",
            "title": "Tantangan Mahkota Kasrah",
            "subtitle": "Uji kemahiran membaca harakat kasrah",
            "type": "boss-challenge",
            "unitNumber": 1,
            "stageNumber": 4,
            "lettersCovered": [
              "صِ",
              "طِ",
              "عِ",
              "فِ",
              "قِ"
            ],
            "questions": [
              {
                "id": "iqro3-u1-s4-q1",
                "type": "listen-tap",
                "promptText": "Pilih huruf SHI!",
                "targetLetter": "صِ",
                "targetName": "Shi",
                "options": [
                  {
                    "letter": "صِ",
                    "name": "Shi",
                    "isCorrect": true
                  },
                  {
                    "letter": "سِ",
                    "name": "Si",
                    "isCorrect": false
                  },
                  {
                    "letter": "صَ",
                    "name": "Sho",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u1-s4-q2",
                "type": "listen-tap",
                "promptText": "Pilih huruf THI!",
                "targetLetter": "طِ",
                "targetName": "Thi",
                "options": [
                  {
                    "letter": "طِ",
                    "name": "Thi",
                    "isCorrect": true
                  },
                  {
                    "letter": "تِ",
                    "name": "Ti",
                    "isCorrect": false
                  },
                  {
                    "letter": "طَ",
                    "name": "Tho",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u1-s4-q3",
                "type": "listen-tap",
                "promptText": "Pilih huruf 'I!",
                "targetLetter": "عِ",
                "targetName": "'I",
                "options": [
                  {
                    "letter": "عِ",
                    "name": "'I",
                    "isCorrect": true
                  },
                  {
                    "letter": "إِ",
                    "name": "I",
                    "isCorrect": false
                  },
                  {
                    "letter": "غِ",
                    "name": "Ghi",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u1-s4-q4",
                "type": "listen-tap",
                "promptText": "Pilih kata: FI - QI!",
                "targetLetter": "فِقِ",
                "targetName": "Fi-Qi",
                "options": [
                  {
                    "letter": "فِقِ",
                    "name": "Fi-Qi",
                    "isCorrect": true
                  },
                  {
                    "letter": "فَقَ",
                    "name": "Fa-Qo",
                    "isCorrect": false
                  },
                  {
                    "letter": "قِفِ",
                    "name": "Qi-Fi",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro3-u2",
        "unitNumber": 2,
        "title": "Unit 2: Mengenal Dhammah (-u)",
        "description": "Mengenal mahkota melengkung berbunyi U yang lucu",
        "themeColor": "#FF4B4B",
        "stages": [
          {
            "id": "iqro3-u2-s1",
            "title": "Mahkota Melengkung Dhammah",
            "subtitle": "Dengar dan ketuk kartu suara dhammah",
            "type": "listen-tap",
            "unitNumber": 2,
            "stageNumber": 1,
            "lettersCovered": [
              "أُ",
              "بُ",
              "تُ",
              "ثُ"
            ],
            "questions": [
              {
                "id": "iqro3-u2-s1-q1",
                "type": "listen-tap",
                "promptText": "Ayo cari huruf BU!",
                "targetLetter": "بُ",
                "targetName": "Bu",
                "options": [
                  {
                    "letter": "بُ",
                    "name": "Bu",
                    "isCorrect": true
                  },
                  {
                    "letter": "بِ",
                    "name": "Bi",
                    "isCorrect": false
                  },
                  {
                    "letter": "بَ",
                    "name": "Ba",
                    "isCorrect": false
                  }
                ],
                "hint": "Dhammah berbentuk seperti angka sembilan kecil di atas huruf berbunyi U!"
              },
              {
                "id": "iqro3-u2-s1-q2",
                "type": "listen-tap",
                "promptText": "Yang mana huruf U?",
                "targetLetter": "أُ",
                "targetName": "U",
                "options": [
                  {
                    "letter": "أُ",
                    "name": "U",
                    "isCorrect": true
                  },
                  {
                    "letter": "إِ",
                    "name": "I",
                    "isCorrect": false
                  },
                  {
                    "letter": "اَ",
                    "name": "A",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u2-s1-q3",
                "type": "listen-tap",
                "promptText": "Ayo cari huruf TU!",
                "targetLetter": "تُ",
                "targetName": "Tu",
                "options": [
                  {
                    "letter": "تُ",
                    "name": "Tu",
                    "isCorrect": true
                  },
                  {
                    "letter": "تِ",
                    "name": "Ti",
                    "isCorrect": false
                  },
                  {
                    "letter": "بُ",
                    "name": "Bu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u2-s1-speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "بُ",
                "targetName": "Bu",
                "options": []
              }
            ]
          },
          {
            "id": "iqro3-u2-s2",
            "title": "Balon Meluncur Bunyi U",
            "subtitle": "Pecahkan balon berbunyi dhammah",
            "type": "bubble-pop",
            "unitNumber": 2,
            "stageNumber": 2,
            "lettersCovered": [
              "جُ",
              "حُ",
              "خُ",
              "دُ"
            ],
            "questions": [
              {
                "id": "iqro3-u2-s2-q1",
                "type": "bubble-pop",
                "promptText": "Letuskan balon huruf JU!",
                "targetLetter": "جُ",
                "targetName": "Ju",
                "options": [
                  {
                    "letter": "جُ",
                    "name": "Ju",
                    "isCorrect": true
                  },
                  {
                    "letter": "جِ",
                    "name": "Ji",
                    "isCorrect": false
                  },
                  {
                    "letter": "حُ",
                    "name": "Hu",
                    "isCorrect": false
                  },
                  {
                    "letter": "بُ",
                    "name": "Bu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u2-s2-q2",
                "type": "bubble-pop",
                "promptText": "Letuskan balon huruf KHU!",
                "targetLetter": "خُ",
                "targetName": "Khu",
                "options": [
                  {
                    "letter": "خُ",
                    "name": "Khu",
                    "isCorrect": true
                  },
                  {
                    "letter": "حُ",
                    "name": "Hu",
                    "isCorrect": false
                  },
                  {
                    "letter": "خِ",
                    "name": "Khi",
                    "isCorrect": false
                  },
                  {
                    "letter": "جُ",
                    "name": "Ju",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u2-s2-q3",
                "type": "bubble-pop",
                "promptText": "Letuskan balon huruf DU!",
                "targetLetter": "دُ",
                "targetName": "Du",
                "options": [
                  {
                    "letter": "دُ",
                    "name": "Du",
                    "isCorrect": true
                  },
                  {
                    "letter": "دِ",
                    "name": "Di",
                    "isCorrect": false
                  },
                  {
                    "letter": "دَ",
                    "name": "Da",
                    "isCorrect": false
                  },
                  {
                    "letter": "ذُ",
                    "name": "Dzu",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "iqro3-u2-s3",
            "title": "Menulis Lengkung Dhammah",
            "subtitle": "Tulis huruf berharakat dhammah dengan mahkota kecil",
            "type": "tracing",
            "unitNumber": 2,
            "stageNumber": 3,
            "lettersCovered": [
              "رُ",
              "زُ",
              "سُ"
            ],
            "questions": [
              {
                "id": "iqro3-u2-s3-q1_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "رُ",
                "targetName": "Ru",
                "options": []
              },
              {
                "id": "iqro3-u2-s3-q1",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf: RU!",
                "targetLetter": "رُ",
                "targetName": "Ru",
                "options": []
              },
              {
                "id": "iqro3-u2-s3-q2",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf: ZU!",
                "targetLetter": "زُ",
                "targetName": "Zu",
                "options": []
              },
              {
                "id": "iqro3-u2-s3-q3",
                "type": "tracing",
                "promptText": "Ayo coba tulis huruf: SU!",
                "targetLetter": "سُ",
                "targetName": "Su",
                "options": []
              }
            ]
          },
          {
            "id": "iqro3-u2-s4",
            "title": "Tantangan Mahkota Dhammah",
            "subtitle": "Kuasai huruf dan kata berharakat dhammah",
            "type": "boss-challenge",
            "unitNumber": 2,
            "stageNumber": 4,
            "lettersCovered": [
              "صُ",
              "طُ",
              "عُ",
              "كُ",
              "لُ"
            ],
            "questions": [
              {
                "id": "iqro3-u2-s4-q1",
                "type": "listen-tap",
                "promptText": "Pilih huruf SHU!",
                "targetLetter": "صُ",
                "targetName": "Shu",
                "options": [
                  {
                    "letter": "صُ",
                    "name": "Shu",
                    "isCorrect": true
                  },
                  {
                    "letter": "سُ",
                    "name": "Su",
                    "isCorrect": false
                  },
                  {
                    "letter": "صِ",
                    "name": "Shi",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u2-s4-q2",
                "type": "listen-tap",
                "promptText": "Pilih huruf 'U!",
                "targetLetter": "عُ",
                "targetName": "'U",
                "options": [
                  {
                    "letter": "عُ",
                    "name": "'U",
                    "isCorrect": true
                  },
                  {
                    "letter": "أُ",
                    "name": "U",
                    "isCorrect": false
                  },
                  {
                    "letter": "غُ",
                    "name": "Ghu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u2-s4-q3",
                "type": "listen-tap",
                "promptText": "Pilih huruf KU!",
                "targetLetter": "كُ",
                "targetName": "Ku",
                "options": [
                  {
                    "letter": "كُ",
                    "name": "Ku",
                    "isCorrect": true
                  },
                  {
                    "letter": "قُ",
                    "name": "Qu",
                    "isCorrect": false
                  },
                  {
                    "letter": "كِ",
                    "name": "Ki",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u2-s4-q4",
                "type": "listen-tap",
                "promptText": "Pilih kata: KU - LU!",
                "targetLetter": "كُلُ",
                "targetName": "Ku-Lu",
                "options": [
                  {
                    "letter": "كُلُ",
                    "name": "Ku-Lu",
                    "isCorrect": true
                  },
                  {
                    "letter": "كِلِ",
                    "name": "Ki-Li",
                    "isCorrect": false
                  },
                  {
                    "letter": "كَلَ",
                    "name": "Ka-La",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro3-u3",
        "unitNumber": 3,
        "title": "Unit 3: Harmoni Tiga Bunyi (A - I - U)",
        "description": "Menggabungkan tiga vokal fathah, kasrah, dan dhammah dalam satu kata",
        "themeColor": "#2B70C9",
        "stages": [
          {
            "id": "iqro3-u3-s1",
            "title": "Senandung Trio A - I - U",
            "subtitle": "Dengar perubahan vokal A, I, dan U",
            "type": "listen-tap",
            "unitNumber": 3,
            "stageNumber": 1,
            "lettersCovered": [
              "بَ",
              "بِ",
              "بُ",
              "تَ",
              "تِ",
              "تُ"
            ],
            "questions": [
              {
                "id": "iqro3-u3-s1-q1",
                "type": "listen-tap",
                "promptText": "Yang mana urutan: BA - BI - BU?",
                "targetLetter": "بَبِبُ",
                "targetName": "Ba-Bi-Bu",
                "options": [
                  {
                    "letter": "بَبِبُ",
                    "name": "Ba-Bi-Bu",
                    "isCorrect": true
                  },
                  {
                    "letter": "بُبِبَ",
                    "name": "Bu-Bi-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "بِبَبُ",
                    "name": "Bi-Ba-Bu",
                    "isCorrect": false
                  }
                ],
                "hint": "Perhatikan urutan: Fathah (A), Kasrah (I), Dhammah (U)!"
              },
              {
                "id": "iqro3-u3-s1-q2",
                "type": "listen-tap",
                "promptText": "Yang mana urutan: TA - TI - TU?",
                "targetLetter": "تَتِتُ",
                "targetName": "Ta-Ti-Tu",
                "options": [
                  {
                    "letter": "تَتِتُ",
                    "name": "Ta-Ti-Tu",
                    "isCorrect": true
                  },
                  {
                    "letter": "تُتِتَ",
                    "name": "Tu-Ti-Ta",
                    "isCorrect": false
                  },
                  {
                    "letter": "تِتَتُ",
                    "name": "Ti-Ta-Tu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u3-s1-q3",
                "type": "listen-tap",
                "promptText": "Yang mana urutan: TSA - TSI - TSU?",
                "targetLetter": "ثَثِثُ",
                "targetName": "Tsa-Tsi-Tsu",
                "options": [
                  {
                    "letter": "ثَثِثُ",
                    "name": "Tsa-Tsi-Tsu",
                    "isCorrect": true
                  },
                  {
                    "letter": "تَتِتُ",
                    "name": "Ta-Ti-Tu",
                    "isCorrect": false
                  },
                  {
                    "letter": "ثُثِثَ",
                    "name": "Tsu-Tsi-Tsa",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u3-s1-speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "بَبِبُ",
                "targetName": "Ba-Bi-Bu",
                "options": []
              }
            ]
          },
          {
            "id": "iqro3-u3-s2",
            "title": "Balon Pelangi Trio Vokal",
            "subtitle": "Pecahkan balon berisi tiga nada vokal",
            "type": "bubble-pop",
            "unitNumber": 3,
            "stageNumber": 2,
            "lettersCovered": [
              "جَ",
              "جِ",
              "جُ",
              "دَ",
              "دِ",
              "دُ"
            ],
            "questions": [
              {
                "id": "iqro3-u3-s2-q1",
                "type": "bubble-pop",
                "promptText": "Letuskan balon rangkaian: JA - JI - JU!",
                "targetLetter": "جَجِجُ",
                "targetName": "Ja-Ji-Ju",
                "options": [
                  {
                    "letter": "جَجِجُ",
                    "name": "Ja-Ji-Ju",
                    "isCorrect": true
                  },
                  {
                    "letter": "جُجِجَ",
                    "name": "Ju-Ji-Ja",
                    "isCorrect": false
                  },
                  {
                    "letter": "حَحِحُ",
                    "name": "Ha-Hi-Hu",
                    "isCorrect": false
                  },
                  {
                    "letter": "بَبِبُ",
                    "name": "Ba-Bi-Bu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u3-s2-q2",
                "type": "bubble-pop",
                "promptText": "Letuskan balon rangkaian: DA - DI - DU!",
                "targetLetter": "دَدِدُ",
                "targetName": "Da-Di-Du",
                "options": [
                  {
                    "letter": "دَدِدُ",
                    "name": "Da-Di-Du",
                    "isCorrect": true
                  },
                  {
                    "letter": "دُدِدَ",
                    "name": "Du-Di-Da",
                    "isCorrect": false
                  },
                  {
                    "letter": "ذَذِذُ",
                    "name": "Dza-Dzi-Dzu",
                    "isCorrect": false
                  },
                  {
                    "letter": "رَرِرُ",
                    "name": "Ro-Ri-Ru",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u3-s2-q3",
                "type": "bubble-pop",
                "promptText": "Letuskan balon rangkaian: RO - RI - RU!",
                "targetLetter": "رَرِرُ",
                "targetName": "Ro-Ri-Ru",
                "options": [
                  {
                    "letter": "رَرِرُ",
                    "name": "Ro-Ri-Ru",
                    "isCorrect": true
                  },
                  {
                    "letter": "زَزِزُ",
                    "name": "Za-Zi-Zu",
                    "isCorrect": false
                  },
                  {
                    "letter": "رُرِرَ",
                    "name": "Ru-Ri-Ro",
                    "isCorrect": false
                  },
                  {
                    "letter": "دَدِدُ",
                    "name": "Da-Di-Du",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "iqro3-u3-s3",
            "title": "Menulis Trio Suara Sambung",
            "subtitle": "Tulis rangkaian tiga huruf dengan harakat berbeda",
            "type": "tracing",
            "unitNumber": 3,
            "stageNumber": 3,
            "lettersCovered": [
              "سَ",
              "سِ",
              "سُ",
              "قَ",
              "قِ",
              "قُ"
            ],
            "questions": [
              {
                "id": "iqro3-u3-s3-q1_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "سَسِسُ",
                "targetName": "Sa-Si-Su",
                "options": []
              },
              {
                "id": "iqro3-u3-s3-q1",
                "type": "tracing",
                "promptText": "Ayo coba tulis rangkaian: SA - SI - SU!",
                "targetLetter": "سَسِسُ",
                "targetName": "Sa-Si-Su",
                "options": []
              },
              {
                "id": "iqro3-u3-s3-q2",
                "type": "tracing",
                "promptText": "Ayo coba tulis rangkaian: QO - QI - QU!",
                "targetLetter": "قَقِقُ",
                "targetName": "Qo-Qi-Qu",
                "options": []
              }
            ]
          },
          {
            "id": "iqro3-u3-s4",
            "title": "Petualangan Tiga Vokal Sambung",
            "subtitle": "Membaca kata tiga huruf gabungan vokal A-I-U",
            "type": "boss-challenge",
            "unitNumber": 3,
            "stageNumber": 4,
            "lettersCovered": [
              "كُتِبَ",
              "رُسِلَ",
              "عُلِمَ",
              "حَسُنَ"
            ],
            "questions": [
              {
                "id": "iqro3-u3-s4-q1",
                "type": "listen-tap",
                "promptText": "Yang mana kata: KU - TI - BA?",
                "targetLetter": "كُتِبَ",
                "targetName": "Ku-Ti-Ba",
                "options": [
                  {
                    "letter": "كُتِبَ",
                    "name": "Ku-Ti-Ba",
                    "isCorrect": true
                  },
                  {
                    "letter": "كَتَبَ",
                    "name": "Ka-Ta-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "كُتُبُ",
                    "name": "Ku-Tu-Bu",
                    "isCorrect": false
                  }
                ],
                "hint": "Perhatikan vokal U - I - A: Ka dhammah, Ta kasrah, Ba fathah!"
              },
              {
                "id": "iqro3-u3-s4-q2",
                "type": "listen-tap",
                "promptText": "Yang mana kata: RU - SI - LA?",
                "targetLetter": "رُسِلَ",
                "targetName": "Ru-Si-La",
                "options": [
                  {
                    "letter": "رُسِلَ",
                    "name": "Ru-Si-La",
                    "isCorrect": true
                  },
                  {
                    "letter": "رَسَلَ",
                    "name": "Ro-Sa-La",
                    "isCorrect": false
                  },
                  {
                    "letter": "رُسُلُ",
                    "name": "Ru-Su-Lu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u3-s4-q3",
                "type": "listen-tap",
                "promptText": "Yang mana kata: 'U - LI - MA?",
                "targetLetter": "عُلِمَ",
                "targetName": "'U-Li-Ma",
                "options": [
                  {
                    "letter": "عُلِمَ",
                    "name": "'U-Li-Ma",
                    "isCorrect": true
                  },
                  {
                    "letter": "عَلِمَ",
                    "name": "'A-Li-Ma",
                    "isCorrect": false
                  },
                  {
                    "letter": "عُلُمُ",
                    "name": "'U-Lu-Mu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u3-s4-q4",
                "type": "listen-tap",
                "promptText": "Yang mana kata: HA - SU - NA?",
                "targetLetter": "حَسُنَ",
                "targetName": "Ha-Su-Na",
                "options": [
                  {
                    "letter": "حَسُنَ",
                    "name": "Ha-Su-Na",
                    "isCorrect": true
                  },
                  {
                    "letter": "حَسَنَ",
                    "name": "Ha-Sa-Na",
                    "isCorrect": false
                  },
                  {
                    "letter": "حُسِنَ",
                    "name": "Hu-Si-Na",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro3-u4",
        "unitNumber": 4,
        "title": "Unit 4: Mad Asli Kasrah (Panjang -ii)",
        "description": "Mengenal kasrah bertemu Ya sukun dibaca panjang 2 harakat",
        "themeColor": "#1CB0F6",
        "stages": [
          {
            "id": "iqro3-u4-s1",
            "title": "Kereta Panjang Ya Sukun",
            "subtitle": "Dengar dan bedakan bunyi pendek dan panjang -ii",
            "type": "listen-tap",
            "unitNumber": 4,
            "stageNumber": 1,
            "lettersCovered": [
              "بِيْ",
              "تِيْ",
              "ثِيْ"
            ],
            "questions": [
              {
                "id": "iqro3-u4-s1-q1",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan panjang: BII?",
                "targetLetter": "بِيْ",
                "targetName": "Bii",
                "options": [
                  {
                    "letter": "بِيْ",
                    "name": "Bii",
                    "isCorrect": true
                  },
                  {
                    "letter": "بِ",
                    "name": "Bi",
                    "isCorrect": false
                  }
                ],
                "hint": "Kasrah bertemu Ya sukun dibaca panjang 2 harakat: Bii!"
              },
              {
                "id": "iqro3-u4-s1-q2",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan panjang: TII?",
                "targetLetter": "تِيْ",
                "targetName": "Tii",
                "options": [
                  {
                    "letter": "تِيْ",
                    "name": "Tii",
                    "isCorrect": true
                  },
                  {
                    "letter": "تِ",
                    "name": "Ti",
                    "isCorrect": false
                  },
                  {
                    "letter": "بِيْ",
                    "name": "Bii",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u4-s1-q3",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan panjang: TSII?",
                "targetLetter": "ثِيْ",
                "targetName": "Tsii",
                "options": [
                  {
                    "letter": "ثِيْ",
                    "name": "Tsii",
                    "isCorrect": true
                  },
                  {
                    "letter": "ثِ",
                    "name": "Tsi",
                    "isCorrect": false
                  },
                  {
                    "letter": "تِيْ",
                    "name": "Tii",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u4-s1-speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "بِيْ",
                "targetName": "Bii",
                "options": []
              }
            ]
          },
          {
            "id": "iqro3-u4-s2",
            "title": "Balon Mengapung Panjang",
            "subtitle": "Pecahkan balon bacaan panjang -ii",
            "type": "bubble-pop",
            "unitNumber": 4,
            "stageNumber": 2,
            "lettersCovered": [
              "جِيْ",
              "دِيْ",
              "رِيْ",
              "سِيْ"
            ],
            "questions": [
              {
                "id": "iqro3-u4-s2-q1",
                "type": "bubble-pop",
                "promptText": "Letuskan balon bacaan panjang: JII!",
                "targetLetter": "جِيْ",
                "targetName": "Jii",
                "options": [
                  {
                    "letter": "جِيْ",
                    "name": "Jii",
                    "isCorrect": true
                  },
                  {
                    "letter": "جِ",
                    "name": "Ji",
                    "isCorrect": false
                  },
                  {
                    "letter": "حِيْ",
                    "name": "Hii",
                    "isCorrect": false
                  },
                  {
                    "letter": "بِيْ",
                    "name": "Bii",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u4-s2-q2",
                "type": "bubble-pop",
                "promptText": "Letuskan balon bacaan panjang: DII!",
                "targetLetter": "دِيْ",
                "targetName": "Dii",
                "options": [
                  {
                    "letter": "دِيْ",
                    "name": "Dii",
                    "isCorrect": true
                  },
                  {
                    "letter": "دِ",
                    "name": "Di",
                    "isCorrect": false
                  },
                  {
                    "letter": "ذِيْ",
                    "name": "Dzii",
                    "isCorrect": false
                  },
                  {
                    "letter": "تِيْ",
                    "name": "Tii",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u4-s2-q3",
                "type": "bubble-pop",
                "promptText": "Letuskan balon bacaan panjang: RII!",
                "targetLetter": "رِيْ",
                "targetName": "Rii",
                "options": [
                  {
                    "letter": "رِيْ",
                    "name": "Rii",
                    "isCorrect": true
                  },
                  {
                    "letter": "رِ",
                    "name": "Ri",
                    "isCorrect": false
                  },
                  {
                    "letter": "زِيْ",
                    "name": "Zii",
                    "isCorrect": false
                  },
                  {
                    "letter": "دِيْ",
                    "name": "Dii",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "iqro3-u4-s3",
            "title": "Menulis Mad Asli Kasrah",
            "subtitle": "Tulis huruf kasrah yang bersambung dengan Ya sukun",
            "type": "tracing",
            "unitNumber": 4,
            "stageNumber": 3,
            "lettersCovered": [
              "فِيْ",
              "قِيْ"
            ],
            "questions": [
              {
                "id": "iqro3-u4-s3-q1_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "فِيْ",
                "targetName": "Fii",
                "options": []
              },
              {
                "id": "iqro3-u4-s3-q1",
                "type": "tracing",
                "promptText": "Ayo coba tulis bacaan panjang: FII!",
                "targetLetter": "فِيْ",
                "targetName": "Fii",
                "options": []
              },
              {
                "id": "iqro3-u4-s3-q2",
                "type": "tracing",
                "promptText": "Ayo coba tulis bacaan panjang: QII!",
                "targetLetter": "قِيْ",
                "targetName": "Qii",
                "options": []
              }
            ]
          },
          {
            "id": "iqro3-u4-s4",
            "title": "Tantangan Pendek vs Panjang -ii",
            "subtitle": "Latih ketajaman telinga membedakan ketukan mad",
            "type": "boss-challenge",
            "unitNumber": 4,
            "stageNumber": 4,
            "lettersCovered": [
              "دِ",
              "دِيْ",
              "دِيْنِيْ",
              "فِيْهِ"
            ],
            "questions": [
              {
                "id": "iqro3-u4-s4-q1",
                "type": "listen-tap",
                "promptText": "Pilih bacaan pendek: DI!",
                "targetLetter": "دِ",
                "targetName": "Di",
                "options": [
                  {
                    "letter": "دِ",
                    "name": "Di",
                    "isCorrect": true
                  },
                  {
                    "letter": "دِيْ",
                    "name": "Dii",
                    "isCorrect": false
                  }
                ],
                "hint": "Hati-hati! Tanpa ya mati dibaca pendek 1 ketukan: Di!"
              },
              {
                "id": "iqro3-u4-s4-q2",
                "type": "listen-tap",
                "promptText": "Pilih bacaan panjang: DII!",
                "targetLetter": "دِيْ",
                "targetName": "Dii",
                "options": [
                  {
                    "letter": "دِيْ",
                    "name": "Dii",
                    "isCorrect": true
                  },
                  {
                    "letter": "دِ",
                    "name": "Di",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u4-s4-q3",
                "type": "listen-tap",
                "promptText": "Pilih kata dua panjang: DII - NII!",
                "targetLetter": "دِيْنِيْ",
                "targetName": "Dii-Nii",
                "options": [
                  {
                    "letter": "دِيْنِيْ",
                    "name": "Dii-Nii",
                    "isCorrect": true
                  },
                  {
                    "letter": "دِنِ",
                    "name": "Di-Ni",
                    "isCorrect": false
                  },
                  {
                    "letter": "دِيْنِ",
                    "name": "Dii-Ni",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u4-s4-q4",
                "type": "listen-tap",
                "promptText": "Pilih kata panjang-pendek: FII - HI!",
                "targetLetter": "فِيْهِ",
                "targetName": "Fii-Hii",
                "options": [
                  {
                    "letter": "فِيْهِ",
                    "name": "Fii-Hii",
                    "isCorrect": true
                  },
                  {
                    "letter": "فِهِ",
                    "name": "Fi-Hii",
                    "isCorrect": false
                  },
                  {
                    "letter": "فِيْهِيْ",
                    "name": "Fii-Hii",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro3-u5",
        "unitNumber": 5,
        "title": "Unit 5: Mad Asli Dhammah (Panjang -uu)",
        "description": "Mengenal dhammah bertemu Wawu sukun dibaca panjang 2 harakat",
        "themeColor": "#CE82FF",
        "stages": [
          {
            "id": "iqro3-u5-s1",
            "title": "Kereta Panjang Wawu Sukun",
            "subtitle": "Dengar dan kenali alun nada panjang -uu",
            "type": "listen-tap",
            "unitNumber": 5,
            "stageNumber": 1,
            "lettersCovered": [
              "بُوْ",
              "تُوْ",
              "ثُوْ"
            ],
            "questions": [
              {
                "id": "iqro3-u5-s1-q1",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan panjang: BUU?",
                "targetLetter": "بُوْ",
                "targetName": "Buu",
                "options": [
                  {
                    "letter": "بُوْ",
                    "name": "Buu",
                    "isCorrect": true
                  },
                  {
                    "letter": "بُ",
                    "name": "Bu",
                    "isCorrect": false
                  }
                ],
                "hint": "Dhammah bertemu Wawu sukun dibaca panjang 2 harakat: Buu!"
              },
              {
                "id": "iqro3-u5-s1-q2",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan panjang: TUU?",
                "targetLetter": "تُوْ",
                "targetName": "Tuu",
                "options": [
                  {
                    "letter": "تُوْ",
                    "name": "Tuu",
                    "isCorrect": true
                  },
                  {
                    "letter": "تُ",
                    "name": "Tu",
                    "isCorrect": false
                  },
                  {
                    "letter": "بُوْ",
                    "name": "Buu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u5-s1-q3",
                "type": "listen-tap",
                "promptText": "Yang mana bacaan panjang: TSUU?",
                "targetLetter": "ثُوْ",
                "targetName": "Tsuu",
                "options": [
                  {
                    "letter": "ثُوْ",
                    "name": "Tsuu",
                    "isCorrect": true
                  },
                  {
                    "letter": "ثُ",
                    "name": "Tsu",
                    "isCorrect": false
                  },
                  {
                    "letter": "تُوْ",
                    "name": "Tuu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u5-s1-speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "بُوْ",
                "targetName": "Buu",
                "options": []
              }
            ]
          },
          {
            "id": "iqro3-u5-s2",
            "title": "Balon Mengapung Panjang U-U",
            "subtitle": "Pecahkan balon bacaan panjang -uu",
            "type": "bubble-pop",
            "unitNumber": 5,
            "stageNumber": 2,
            "lettersCovered": [
              "دُوْ",
              "رُوْ",
              "سُوْ",
              "فُوْ"
            ],
            "questions": [
              {
                "id": "iqro3-u5-s2-q1",
                "type": "bubble-pop",
                "promptText": "Letuskan balon bacaan panjang: DUU!",
                "targetLetter": "دُوْ",
                "targetName": "Duu",
                "options": [
                  {
                    "letter": "دُوْ",
                    "name": "Duu",
                    "isCorrect": true
                  },
                  {
                    "letter": "دُ",
                    "name": "Du",
                    "isCorrect": false
                  },
                  {
                    "letter": "ذُوْ",
                    "name": "Dzuu",
                    "isCorrect": false
                  },
                  {
                    "letter": "بُوْ",
                    "name": "Buu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u5-s2-q2",
                "type": "bubble-pop",
                "promptText": "Letuskan balon bacaan panjang: RUU!",
                "targetLetter": "رُوْ",
                "targetName": "Ruu",
                "options": [
                  {
                    "letter": "رُوْ",
                    "name": "Ruu",
                    "isCorrect": true
                  },
                  {
                    "letter": "رُ",
                    "name": "Ru",
                    "isCorrect": false
                  },
                  {
                    "letter": "زُوْ",
                    "name": "Zuu",
                    "isCorrect": false
                  },
                  {
                    "letter": "دُوْ",
                    "name": "Duu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u5-s2-q3",
                "type": "bubble-pop",
                "promptText": "Letuskan balon bacaan panjang: SUU!",
                "targetLetter": "سُوْ",
                "targetName": "Suu",
                "options": [
                  {
                    "letter": "سُوْ",
                    "name": "Suu",
                    "isCorrect": true
                  },
                  {
                    "letter": "سُ",
                    "name": "Su",
                    "isCorrect": false
                  },
                  {
                    "letter": "صُوْ",
                    "name": "Shuu",
                    "isCorrect": false
                  },
                  {
                    "letter": "رُوْ",
                    "name": "Ruu",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "iqro3-u5-s3",
            "title": "Menulis Mad Asli Dhammah",
            "subtitle": "Tulis huruf dhammah bersambung Wawu sukun",
            "type": "tracing",
            "unitNumber": 5,
            "stageNumber": 3,
            "lettersCovered": [
              "قُوْ",
              "كُوْ"
            ],
            "questions": [
              {
                "id": "iqro3-u5-s3-q1_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "قُوْ",
                "targetName": "Quu",
                "options": []
              },
              {
                "id": "iqro3-u5-s3-q1",
                "type": "tracing",
                "promptText": "Ayo coba tulis bacaan panjang: QUU!",
                "targetLetter": "قُوْ",
                "targetName": "Quu",
                "options": []
              },
              {
                "id": "iqro3-u5-s3-q2",
                "type": "tracing",
                "promptText": "Ayo coba tulis bacaan panjang: KUU!",
                "targetLetter": "كُوْ",
                "targetName": "Kuu",
                "options": []
              }
            ]
          },
          {
            "id": "iqro3-u5-s4",
            "title": "Tantangan Pendek vs Panjang -uu",
            "subtitle": "Uji ketepatan membedakan panjang pendek dalam kata",
            "type": "boss-challenge",
            "unitNumber": 5,
            "stageNumber": 4,
            "lettersCovered": [
              "تُ",
              "تُوْ",
              "كُ",
              "كُوْ",
              "يَقُوْلُ"
            ],
            "questions": [
              {
                "id": "iqro3-u5-s4-q1",
                "type": "listen-tap",
                "promptText": "Pilih bacaan pendek: TU!",
                "targetLetter": "تُ",
                "targetName": "Tu",
                "options": [
                  {
                    "letter": "تُ",
                    "name": "Tu",
                    "isCorrect": true
                  },
                  {
                    "letter": "تُوْ",
                    "name": "Tuu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u5-s4-q2",
                "type": "listen-tap",
                "promptText": "Pilih bacaan panjang: TUU!",
                "targetLetter": "تُوْ",
                "targetName": "Tuu",
                "options": [
                  {
                    "letter": "تُوْ",
                    "name": "Tuu",
                    "isCorrect": true
                  },
                  {
                    "letter": "تُ",
                    "name": "Tu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u5-s4-q3",
                "type": "listen-tap",
                "promptText": "Pilih kata: YA - QUU - LU!",
                "targetLetter": "يَقُوْلُ",
                "targetName": "Ya-Quu-Lu",
                "options": [
                  {
                    "letter": "يَقُوْلُ",
                    "name": "Ya-Quu-Lu",
                    "isCorrect": true
                  },
                  {
                    "letter": "يَقُلُ",
                    "name": "Ya-Qu-Lu",
                    "isCorrect": false
                  },
                  {
                    "letter": "يَقُوْلُوْ",
                    "name": "Ya-Quu-Luu",
                    "isCorrect": false
                  }
                ],
                "hint": "Tengahnya panjang 2 harakat: Ya-Quu-Lu!"
              },
              {
                "id": "iqro3-u5-s4-q4",
                "type": "listen-tap",
                "promptText": "Pilih kata: YA - TSUU - BU!",
                "targetLetter": "يَثُوْبُ",
                "targetName": "Ya-Tsuu-Bu",
                "options": [
                  {
                    "letter": "يَثُوْبُ",
                    "name": "Ya-Tsuu-Bu",
                    "isCorrect": true
                  },
                  {
                    "letter": "يَثُبُ",
                    "name": "Ya-Tsu-Bu",
                    "isCorrect": false
                  },
                  {
                    "letter": "يَتُوْبُ",
                    "name": "Ya-Tuu-Bu",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro3-u6",
        "unitNumber": 6,
        "title": "Unit 6: Harmoni 3 Mad Asli & Ha Simpul",
        "description": "Harmonisasi Mad Alif (-aa), Mad Ya (-ii), Mad Wawu (-uu), dan Ha bulat/simpul",
        "themeColor": "#00CD9C",
        "stages": [
          {
            "id": "iqro3-u6-s1",
            "title": "Orkestra Tiga Mad Asli",
            "subtitle": "Dengar harmoni bacaan panjang -aa, -ii, dan -uu",
            "type": "listen-tap",
            "unitNumber": 6,
            "stageNumber": 1,
            "lettersCovered": [
              "بَا",
              "بِيْ",
              "بُوْ",
              "تَا",
              "تِيْ",
              "تُوْ"
            ],
            "questions": [
              {
                "id": "iqro3-u6-s1-q1",
                "type": "listen-tap",
                "promptText": "Yang mana trio mad: BAA - BII - BUU?",
                "targetLetter": "بَابِيْبُوْ",
                "targetName": "Baa-Bii-Buu",
                "options": [
                  {
                    "letter": "بَابِيْبُوْ",
                    "name": "Baa-Bii-Buu",
                    "isCorrect": true
                  },
                  {
                    "letter": "بَبِبُ",
                    "name": "Ba-Bi-Bu",
                    "isCorrect": false
                  },
                  {
                    "letter": "بُوْبِيْبَا",
                    "name": "Buu-Bii-Baa",
                    "isCorrect": false
                  }
                ],
                "hint": "Semuanya dibaca panjang 2 harakat: Baa - Bii - Buu!"
              },
              {
                "id": "iqro3-u6-s1-q2",
                "type": "listen-tap",
                "promptText": "Yang mana trio mad: TAA - TII - TUU?",
                "targetLetter": "تَاتِيْتُوْ",
                "targetName": "Taa-Tii-Tuu",
                "options": [
                  {
                    "letter": "تَاتِيْتُوْ",
                    "name": "Taa-Tii-Tuu",
                    "isCorrect": true
                  },
                  {
                    "letter": "تَتِتُ",
                    "name": "Ta-Ti-Tu",
                    "isCorrect": false
                  },
                  {
                    "letter": "بَابِيْبُوْ",
                    "name": "Baa-Bii-Buu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u6-s1-q3",
                "type": "listen-tap",
                "promptText": "Yang mana trio mad: JAA - JII - JUU?",
                "targetLetter": "جَاجِيْجُوْ",
                "targetName": "Jaa-Jii-Juu",
                "options": [
                  {
                    "letter": "جَاجِيْجُوْ",
                    "name": "Jaa-Jii-Juu",
                    "isCorrect": true
                  },
                  {
                    "letter": "جَجِجُ",
                    "name": "Ja-Ji-Ju",
                    "isCorrect": false
                  },
                  {
                    "letter": "حَاحِيْحُوْ",
                    "name": "Haa-Hii-Huu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u6-s1-speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "بَابِيْبُوْ",
                "targetName": "Baa-Bii-Buu",
                "options": []
              }
            ]
          },
          {
            "id": "iqro3-u6-s2",
            "title": "Balon Trio Mad Asli",
            "subtitle": "Pecahkan balon harmoni panjang 2 harakat",
            "type": "bubble-pop",
            "unitNumber": 6,
            "stageNumber": 2,
            "lettersCovered": [
              "دَا",
              "دِيْ",
              "دُوْ",
              "قَا",
              "قِيْ",
              "قُوْ"
            ],
            "questions": [
              {
                "id": "iqro3-u6-s2-q1",
                "type": "bubble-pop",
                "promptText": "Letuskan balon trio mad: DAA - DII - DUU!",
                "targetLetter": "دَادِيْدُوْ",
                "targetName": "Daa-Dii-Duu",
                "options": [
                  {
                    "letter": "دَادِيْدُوْ",
                    "name": "Daa-Dii-Duu",
                    "isCorrect": true
                  },
                  {
                    "letter": "دَدِدُ",
                    "name": "Da-Di-Du",
                    "isCorrect": false
                  },
                  {
                    "letter": "ذَاذِيْذُوْ",
                    "name": "Dzaa-Dzii-Dzuu",
                    "isCorrect": false
                  },
                  {
                    "letter": "رَارِيْرُوْ",
                    "name": "Raa-Rii-Ruu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u6-s2-q2",
                "type": "bubble-pop",
                "promptText": "Letuskan balon trio mad: QOO - QII - QUU!",
                "targetLetter": "قَاقِيْقُوْ",
                "targetName": "Qoo-Qii-Quu",
                "options": [
                  {
                    "letter": "قَاقِيْقُوْ",
                    "name": "Qoo-Qii-Quu",
                    "isCorrect": true
                  },
                  {
                    "letter": "قَقِقُ",
                    "name": "Qo-Qi-Qu",
                    "isCorrect": false
                  },
                  {
                    "letter": "كَاكِيْكُوْ",
                    "name": "Kaa-Kii-Kuu",
                    "isCorrect": false
                  },
                  {
                    "letter": "فَافِيْفُوْ",
                    "name": "Faa-Fii-Fuu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u6-s2-q3",
                "type": "bubble-pop",
                "promptText": "Letuskan balon trio mad: SAA - SII - SUU!",
                "targetLetter": "سَاسِيْسُوْ",
                "targetName": "Saa-Sii-Suu",
                "options": [
                  {
                    "letter": "سَاسِيْسُوْ",
                    "name": "Saa-Sii-Suu",
                    "isCorrect": true
                  },
                  {
                    "letter": "سَسِسُ",
                    "name": "Sa-Si-Su",
                    "isCorrect": false
                  },
                  {
                    "letter": "صَاصِيْصُوْ",
                    "name": "Shoo-Shii-Shuu",
                    "isCorrect": false
                  },
                  {
                    "letter": "دَادِيْدُوْ",
                    "name": "Daa-Dii-Duu",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "iqro3-u6-s3",
            "title": "Menulis Trio Mad Asli",
            "subtitle": "Tulis rangkaian huruf panjang dan kata mad",
            "type": "tracing",
            "unitNumber": 6,
            "stageNumber": 3,
            "lettersCovered": [
              "نَا",
              "نِيْ",
              "نُوْ",
              "كَانَ"
            ],
            "questions": [
              {
                "id": "iqro3-u6-s3-q1_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "نَانِيْنُوْ",
                "targetName": "Naa-Nii-Nuu",
                "options": []
              },
              {
                "id": "iqro3-u6-s3-q1",
                "type": "tracing",
                "promptText": "Ayo coba tulis rangkaian mad: NAA - NII - NUU!",
                "targetLetter": "نَانِيْنُوْ",
                "targetName": "Naa-Nii-Nuu",
                "options": []
              },
              {
                "id": "iqro3-u6-s3-q2",
                "type": "tracing",
                "promptText": "Ayo coba tulis kata mad: KAA - NA!",
                "targetLetter": "كَانَ",
                "targetName": "Kaa-Na",
                "options": []
              }
            ]
          },
          {
            "id": "iqro3-u6-s4",
            "title": "Mengenal Ha Simpul & Kata Sambung",
            "subtitle": "Mengenal bentuk Ha bulat dan Ha simpul di akhir kata",
            "type": "boss-challenge",
            "unitNumber": 6,
            "stageNumber": 4,
            "lettersCovered": [
              "هِ",
              "هُ",
              "بِهِ",
              "لَهُ"
            ],
            "questions": [
              {
                "id": "iqro3-u6-s4-q1",
                "type": "listen-tap",
                "promptText": "Pilih huruf Ha simpul kasrah: HI!",
                "targetLetter": "هِ",
                "targetName": "Hii",
                "options": [
                  {
                    "letter": "هِ",
                    "name": "Hii",
                    "isCorrect": true
                  },
                  {
                    "letter": "هُ",
                    "name": "Huu",
                    "isCorrect": false
                  },
                  {
                    "letter": "حِ",
                    "name": "Hi",
                    "isCorrect": false
                  }
                ],
                "hint": "Ha bulat atau simpul dengan garis di bawah dibaca Hi!"
              },
              {
                "id": "iqro3-u6-s4-q2",
                "type": "listen-tap",
                "promptText": "Pilih huruf Ha simpul dhammah: HU!",
                "targetLetter": "هُ",
                "targetName": "Huu",
                "options": [
                  {
                    "letter": "هُ",
                    "name": "Huu",
                    "isCorrect": true
                  },
                  {
                    "letter": "هِ",
                    "name": "Hii",
                    "isCorrect": false
                  },
                  {
                    "letter": "حُ",
                    "name": "Hu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u6-s4-q3",
                "type": "listen-tap",
                "promptText": "Pilih kata: BI - HI!",
                "targetLetter": "بِهِ",
                "targetName": "Bi-Hii",
                "options": [
                  {
                    "letter": "بِهِ",
                    "name": "Bi-Hii",
                    "isCorrect": true
                  },
                  {
                    "letter": "بِهَ",
                    "name": "Bi-Haa",
                    "isCorrect": false
                  },
                  {
                    "letter": "بُهُ",
                    "name": "Bu-Huu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u6-s4-q4",
                "type": "listen-tap",
                "promptText": "Pilih kata: LA - HU!",
                "targetLetter": "لَهُ",
                "targetName": "La-Huu",
                "options": [
                  {
                    "letter": "لَهُ",
                    "name": "La-Huu",
                    "isCorrect": true
                  },
                  {
                    "letter": "لَهِ",
                    "name": "La-Hii",
                    "isCorrect": false
                  },
                  {
                    "letter": "لَهَا",
                    "name": "La-Haa",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "iqro3-u7",
        "unitNumber": 7,
        "title": "Unit 7: Tantangan Kata & Ujian Kelulusan Iqro 3",
        "description": "Evaluasi membaca kata 3 huruf berharakat lengkap dan ujian kelulusan",
        "themeColor": "#FFD700",
        "stages": [
          {
            "id": "iqro3-u7-s1",
            "title": "Membaca Rangkaian 3 Harakat",
            "subtitle": "Uji kelancaran membaca kata 3 huruf berharakat beda",
            "type": "listen-tap",
            "unitNumber": 7,
            "stageNumber": 1,
            "lettersCovered": [
              "حَسُنَ",
              "عَظُمَ",
              "صَلُحَ"
            ],
            "questions": [
              {
                "id": "iqro3-u7-s1-q1",
                "type": "listen-tap",
                "promptText": "Yang mana kata: HA - SU - NA?",
                "targetLetter": "حَسُنَ",
                "targetName": "Ha-Su-Na",
                "options": [
                  {
                    "letter": "حَسُنَ",
                    "name": "Ha-Su-Na",
                    "isCorrect": true
                  },
                  {
                    "letter": "حَسَنَ",
                    "name": "Ha-Sa-Na",
                    "isCorrect": false
                  },
                  {
                    "letter": "حُسِنَ",
                    "name": "Hu-Si-Na",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u7-s1-q2",
                "type": "listen-tap",
                "promptText": "Yang mana kata: 'A - ZHU - MA?",
                "targetLetter": "عَظُمَ",
                "targetName": "'A-Zhu-Ma",
                "options": [
                  {
                    "letter": "عَظُمَ",
                    "name": "'A-Zhu-Ma",
                    "isCorrect": true
                  },
                  {
                    "letter": "عَظَمَ",
                    "name": "'A-Zha-Ma",
                    "isCorrect": false
                  },
                  {
                    "letter": "عُظِمَ",
                    "name": "'U-Zhi-Ma",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u7-s1-q3",
                "type": "listen-tap",
                "promptText": "Yang mana kata: SHO - LU - HA?",
                "targetLetter": "صَلُحَ",
                "targetName": "Sho-Lu-Ha",
                "options": [
                  {
                    "letter": "صَلُحَ",
                    "name": "Sho-Lu-Ha",
                    "isCorrect": true
                  },
                  {
                    "letter": "صَلَحَ",
                    "name": "Sho-La-Ha",
                    "isCorrect": false
                  },
                  {
                    "letter": "صُلِحَ",
                    "name": "Sho-Lu-Hi",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u7-s1-speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "حَسُنَ",
                "targetName": "Ha-Su-Na",
                "options": []
              }
            ]
          },
          {
            "id": "iqro3-u7-s2",
            "title": "Balon Kata Cepat Iqro 3",
            "subtitle": "Pecahkan balon kata dengan sigap dan tepat",
            "type": "bubble-pop",
            "unitNumber": 7,
            "stageNumber": 2,
            "lettersCovered": [
              "سَمِعَ",
              "عَلِمَ",
              "شَهِدَ"
            ],
            "questions": [
              {
                "id": "iqro3-u7-s2-q1",
                "type": "bubble-pop",
                "promptText": "Letuskan balon kata: SA - MI - 'A!",
                "targetLetter": "سَمِعَ",
                "targetName": "Sa-Mi-'A",
                "options": [
                  {
                    "letter": "سَمِعَ",
                    "name": "Sa-Mi-'A",
                    "isCorrect": true
                  },
                  {
                    "letter": "سَمَعَ",
                    "name": "Sa-Ma-'A",
                    "isCorrect": false
                  },
                  {
                    "letter": "عَلِمَ",
                    "name": "'A-Li-Ma",
                    "isCorrect": false
                  },
                  {
                    "letter": "شَهِدَ",
                    "name": "Syi-Hi-Da",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u7-s2-q2",
                "type": "bubble-pop",
                "promptText": "Letuskan balon kata: 'A - LI - MA!",
                "targetLetter": "عَلِمَ",
                "targetName": "'A-Li-Ma",
                "options": [
                  {
                    "letter": "عَلِمَ",
                    "name": "'A-Li-Ma",
                    "isCorrect": true
                  },
                  {
                    "letter": "عَلَمَ",
                    "name": "'A-La-Ma",
                    "isCorrect": false
                  },
                  {
                    "letter": "سَمِعَ",
                    "name": "Sa-Mi-'A",
                    "isCorrect": false
                  },
                  {
                    "letter": "عُلِمَ",
                    "name": "'U-Li-Ma",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u7-s2-q3",
                "type": "bubble-pop",
                "promptText": "Letuskan balon kata: SYA - HI - DA!",
                "targetLetter": "شَهِدَ",
                "targetName": "Sya-Hi-Da",
                "options": [
                  {
                    "letter": "شَهِدَ",
                    "name": "Sya-Hi-Da",
                    "isCorrect": true
                  },
                  {
                    "letter": "شَهَدَ",
                    "name": "Sya-Ha-Da",
                    "isCorrect": false
                  },
                  {
                    "letter": "سَمِعَ",
                    "name": "Sa-Mi-'A",
                    "isCorrect": false
                  },
                  {
                    "letter": "عَلِمَ",
                    "name": "'A-Li-Ma",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "iqro3-u7-s3",
            "title": "Menulis Kata Indah Iqro 3",
            "subtitle": "Tulis kata tiga huruf berharakat lengkap",
            "type": "tracing",
            "unitNumber": 7,
            "stageNumber": 3,
            "lettersCovered": [
              "كُتِبَ",
              "رُسِلَ"
            ],
            "questions": [
              {
                "id": "iqro3-u7-s3-q1_speak",
                "type": "pronounce",
                "promptText": "Ucapkan huruf di bawah ini!",
                "targetLetter": "كُتِبَ",
                "targetName": "Ku-Ti-Ba",
                "options": []
              },
              {
                "id": "iqro3-u7-s3-q1",
                "type": "tracing",
                "promptText": "Ayo coba tulis kata: KU - TI - BA!",
                "targetLetter": "كُتِبَ",
                "targetName": "Ku-Ti-Ba",
                "options": []
              },
              {
                "id": "iqro3-u7-s3-q2",
                "type": "tracing",
                "promptText": "Ayo coba tulis kata: RU - SI - LA!",
                "targetLetter": "رُسِلَ",
                "targetName": "Ru-Si-La",
                "options": []
              }
            ]
          },
          {
            "id": "iqro3-u7-s4",
            "title": "Ujian Kelulusan Iqro 3 (Ebta)",
            "subtitle": "Selesaikan ujian pamungkas untuk lulus dan membuka Buku Iqro 4!",
            "type": "boss-challenge",
            "unitNumber": 7,
            "stageNumber": 4,
            "lettersCovered": [
              "كُتِبَ",
              "دِيْنِيْ",
              "يَقُوْلُ",
              "سَمِعَ"
            ],
            "questions": [
              {
                "id": "iqro3-u7-s4-q1",
                "type": "listen-tap",
                "promptText": "Ujian 1: Yang mana kata gabungan vokal: KU - TI - BA?",
                "targetLetter": "كُتِبَ",
                "targetName": "Ku-Ti-Ba",
                "options": [
                  {
                    "letter": "كُتِبَ",
                    "name": "Ku-Ti-Ba",
                    "isCorrect": true
                  },
                  {
                    "letter": "كَتَبَ",
                    "name": "Ka-Ta-Ba",
                    "isCorrect": false
                  },
                  {
                    "letter": "كُتُبُ",
                    "name": "Ku-Tu-Bu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u7-s4-q2",
                "type": "listen-tap",
                "promptText": "Ujian 2: Yang mana kata mad kasrah: DII - NII?",
                "targetLetter": "دِيْنِيْ",
                "targetName": "Dii-Nii",
                "options": [
                  {
                    "letter": "دِيْنِيْ",
                    "name": "Dii-Nii",
                    "isCorrect": true
                  },
                  {
                    "letter": "دِنِ",
                    "name": "Di-Ni",
                    "isCorrect": false
                  },
                  {
                    "letter": "دِيْنِ",
                    "name": "Dii-Ni",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u7-s4-q3",
                "type": "listen-tap",
                "promptText": "Ujian 3: Yang mana kata mad dhammah: YA - QUU - LU?",
                "targetLetter": "يَقُوْلُ",
                "targetName": "Ya-Quu-Lu",
                "options": [
                  {
                    "letter": "يَقُوْلُ",
                    "name": "Ya-Quu-Lu",
                    "isCorrect": true
                  },
                  {
                    "letter": "يَقُلُ",
                    "name": "Ya-Qu-Lu",
                    "isCorrect": false
                  },
                  {
                    "letter": "يَقُوْلُوْ",
                    "name": "Ya-Quu-Luu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "iqro3-u7-s4-q4",
                "type": "listen-tap",
                "promptText": "Ujian 4: Yang mana kata: SA - MI - 'A?",
                "targetLetter": "سَمِعَ",
                "targetName": "Sa-Mi-'A",
                "options": [
                  {
                    "letter": "سَمِعَ",
                    "name": "Sa-Mi-'A",
                    "isCorrect": true
                  },
                  {
                    "letter": "سَمَعَ",
                    "name": "Sa-Ma-'A",
                    "isCorrect": false
                  },
                  {
                    "letter": "سُمِعَ",
                    "name": "Su-Mi-'A",
                    "isCorrect": false
                  }
                ],
                "hint": "Selamat! Selesaikan pertanyaan ini untuk lulus Iqro 3 dan membuka Iqro 4!"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "level": 4,
    "title": "Iqro 4",
    "subtitle": "Tanwin, Sukun (Mati) & Qolqolah Membal",
    "color": "#CE82FF",
    "totalStages": 18,
    "units": [
      {
        "id": "iqro4-u1",
        "unitNumber": 1,
        "title": "Unit 1: Gemuruh Tanwin (An, In, Un)",
        "description": "Mengenal harakat kembar dua",
        "themeColor": "#CE82FF",
        "stages": []
      }
    ]
  },
  {
    "level": 5,
    "title": "Iqro 5",
    "subtitle": "Tasydid Bertumpuk & Tanda Waqaf Berhenti",
    "color": "#EC4899",
    "totalStages": 18,
    "units": [
      {
        "id": "iqro5-u1",
        "unitNumber": 1,
        "title": "Unit 1: Gerigi Tasydid yang Bertenaga",
        "description": "Menekan huruf ganda dengan irama",
        "themeColor": "#EC4899",
        "stages": []
      }
    ]
  },
  {
    "level": 6,
    "title": "Iqro 6",
    "subtitle": "Hukum Tajwid & Siap Membaca Al-Qur'an",
    "color": "#EAB308",
    "totalStages": 20,
    "units": [
      {
        "id": "iqro6-u1",
        "unitNumber": 1,
        "title": "Unit 1: Senandung Dengung Na & Ma",
        "description": "Membaca potongan ayat suci Al-Qur'an",
        "themeColor": "#EAB308",
        "stages": []
      }
    ]
  }
];
