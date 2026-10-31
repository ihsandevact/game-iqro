import json
import re

units_data = [
    # UNIT 1
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
                "lettersCovered": ["إِ", "بِ", "تِ", "ثِ"],
                "questions": [
                    {
                        "id": "iqro3-u1-s1-q1",
                        "type": "listen-tap",
                        "promptText": "Ayo cari huruf BI!",
                        "targetLetter": "بِ",
                        "targetName": "Bi",
                        "options": [
                            {"letter": "بِ", "name": "Bi", "isCorrect": True},
                            {"letter": "بَ", "name": "Ba", "isCorrect": False}
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
                            {"letter": "إِ", "name": "I", "isCorrect": True},
                            {"letter": "اَ", "name": "A", "isCorrect": False}
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
                            {"letter": "تِ", "name": "Ti", "isCorrect": True},
                            {"letter": "بِ", "name": "Bi", "isCorrect": False},
                            {"letter": "تَ", "name": "Ta", "isCorrect": False}
                        ],
                        "hint": "Dua titik di atas dengan harakat kasrah di bawah!"
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
                "lettersCovered": ["جِ", "حِ", "خِ", "دِ"],
                "questions": [
                    {
                        "id": "iqro3-u1-s2-q1",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon huruf JI!",
                        "targetLetter": "جِ",
                        "targetName": "Ji",
                        "options": [
                            {"letter": "جِ", "name": "Ji", "isCorrect": True},
                            {"letter": "جَ", "name": "Ja", "isCorrect": False},
                            {"letter": "حِ", "name": "Hi", "isCorrect": False},
                            {"letter": "بِ", "name": "Bi", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u1-s2-q2",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon huruf HI!",
                        "targetLetter": "حِ",
                        "targetName": "Hi",
                        "options": [
                            {"letter": "حِ", "name": "Hi", "isCorrect": True},
                            {"letter": "خِ", "name": "Khi", "isCorrect": False},
                            {"letter": "حَ", "name": "Ha", "isCorrect": False},
                            {"letter": "جِ", "name": "Ji", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u1-s2-q3",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon huruf DI!",
                        "targetLetter": "دِ",
                        "targetName": "Di",
                        "options": [
                            {"letter": "دِ", "name": "Di", "isCorrect": True},
                            {"letter": "دَ", "name": "Da", "isCorrect": False},
                            {"letter": "ذِ", "name": "Dzi", "isCorrect": False},
                            {"letter": "تِ", "name": "Ti", "isCorrect": False}
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
                "lettersCovered": ["رِ", "زِ", "سِ"],
                "questions": [
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
                "lettersCovered": ["صِ", "طِ", "عِ", "فِ", "قِ"],
                "questions": [
                    {
                        "id": "iqro3-u1-s4-q1",
                        "type": "listen-tap",
                        "promptText": "Pilih huruf SHI!",
                        "targetLetter": "صِ",
                        "targetName": "Shi",
                        "options": [
                            {"letter": "صِ", "name": "Shi", "isCorrect": True},
                            {"letter": "سِ", "name": "Si", "isCorrect": False},
                            {"letter": "صَ", "name": "Sho", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u1-s4-q2",
                        "type": "listen-tap",
                        "promptText": "Pilih huruf THI!",
                        "targetLetter": "طِ",
                        "targetName": "Thi",
                        "options": [
                            {"letter": "طِ", "name": "Thi", "isCorrect": True},
                            {"letter": "تِ", "name": "Ti", "isCorrect": False},
                            {"letter": "طَ", "name": "Tho", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u1-s4-q3",
                        "type": "listen-tap",
                        "promptText": "Pilih huruf 'I!",
                        "targetLetter": "عِ",
                        "targetName": "'I",
                        "options": [
                            {"letter": "عِ", "name": "'I", "isCorrect": True},
                            {"letter": "إِ", "name": "I", "isCorrect": False},
                            {"letter": "غِ", "name": "Ghi", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u1-s4-q4",
                        "type": "listen-tap",
                        "promptText": "Pilih kata: FI - QI!",
                        "targetLetter": "فِقِ",
                        "targetName": "Fi-Qi",
                        "options": [
                            {"letter": "فِقِ", "name": "Fi-Qi", "isCorrect": True},
                            {"letter": "فَقَ", "name": "Fa-Qo", "isCorrect": False},
                            {"letter": "قِفِ", "name": "Qi-Fi", "isCorrect": False}
                        ]
                    }
                ]
            }
        ]
    },

    # UNIT 2
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
                "lettersCovered": ["أُ", "بُ", "تُ", "ثُ"],
                "questions": [
                    {
                        "id": "iqro3-u2-s1-q1",
                        "type": "listen-tap",
                        "promptText": "Ayo cari huruf BU!",
                        "targetLetter": "بُ",
                        "targetName": "Bu",
                        "options": [
                            {"letter": "بُ", "name": "Bu", "isCorrect": True},
                            {"letter": "بِ", "name": "Bi", "isCorrect": False},
                            {"letter": "بَ", "name": "Ba", "isCorrect": False}
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
                            {"letter": "أُ", "name": "U", "isCorrect": True},
                            {"letter": "إِ", "name": "I", "isCorrect": False},
                            {"letter": "اَ", "name": "A", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u2-s1-q3",
                        "type": "listen-tap",
                        "promptText": "Ayo cari huruf TU!",
                        "targetLetter": "تُ",
                        "targetName": "Tu",
                        "options": [
                            {"letter": "تُ", "name": "Tu", "isCorrect": True},
                            {"letter": "تِ", "name": "Ti", "isCorrect": False},
                            {"letter": "بُ", "name": "Bu", "isCorrect": False}
                        ]
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
                "lettersCovered": ["جُ", "حُ", "خُ", "دُ"],
                "questions": [
                    {
                        "id": "iqro3-u2-s2-q1",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon huruf JU!",
                        "targetLetter": "جُ",
                        "targetName": "Ju",
                        "options": [
                            {"letter": "جُ", "name": "Ju", "isCorrect": True},
                            {"letter": "جِ", "name": "Ji", "isCorrect": False},
                            {"letter": "حُ", "name": "Hu", "isCorrect": False},
                            {"letter": "بُ", "name": "Bu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u2-s2-q2",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon huruf KHU!",
                        "targetLetter": "خُ",
                        "targetName": "Khu",
                        "options": [
                            {"letter": "خُ", "name": "Khu", "isCorrect": True},
                            {"letter": "حُ", "name": "Hu", "isCorrect": False},
                            {"letter": "خِ", "name": "Khi", "isCorrect": False},
                            {"letter": "جُ", "name": "Ju", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u2-s2-q3",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon huruf DU!",
                        "targetLetter": "دُ",
                        "targetName": "Du",
                        "options": [
                            {"letter": "دُ", "name": "Du", "isCorrect": True},
                            {"letter": "دِ", "name": "Di", "isCorrect": False},
                            {"letter": "دَ", "name": "Da", "isCorrect": False},
                            {"letter": "ذُ", "name": "Dzu", "isCorrect": False}
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
                "lettersCovered": ["رُ", "زُ", "سُ"],
                "questions": [
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
                "lettersCovered": ["صُ", "طُ", "عُ", "كُ", "لُ"],
                "questions": [
                    {
                        "id": "iqro3-u2-s4-q1",
                        "type": "listen-tap",
                        "promptText": "Pilih huruf SHU!",
                        "targetLetter": "صُ",
                        "targetName": "Shu",
                        "options": [
                            {"letter": "صُ", "name": "Shu", "isCorrect": True},
                            {"letter": "سُ", "name": "Su", "isCorrect": False},
                            {"letter": "صِ", "name": "Shi", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u2-s4-q2",
                        "type": "listen-tap",
                        "promptText": "Pilih huruf 'U!",
                        "targetLetter": "عُ",
                        "targetName": "'U",
                        "options": [
                            {"letter": "عُ", "name": "'U", "isCorrect": True},
                            {"letter": "أُ", "name": "U", "isCorrect": False},
                            {"letter": "غُ", "name": "Ghu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u2-s4-q3",
                        "type": "listen-tap",
                        "promptText": "Pilih huruf KU!",
                        "targetLetter": "كُ",
                        "targetName": "Ku",
                        "options": [
                            {"letter": "كُ", "name": "Ku", "isCorrect": True},
                            {"letter": "قُ", "name": "Qu", "isCorrect": False},
                            {"letter": "كِ", "name": "Ki", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u2-s4-q4",
                        "type": "listen-tap",
                        "promptText": "Pilih kata: KU - LU!",
                        "targetLetter": "كُلُ",
                        "targetName": "Ku-Lu",
                        "options": [
                            {"letter": "كُلُ", "name": "Ku-Lu", "isCorrect": True},
                            {"letter": "كِلِ", "name": "Ki-Li", "isCorrect": False},
                            {"letter": "كَلَ", "name": "Ka-La", "isCorrect": False}
                        ]
                    }
                ]
            }
        ]
    },

    # UNIT 3
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
                "lettersCovered": ["بَ", "بِ", "بُ", "تَ", "تِ", "تُ"],
                "questions": [
                    {
                        "id": "iqro3-u3-s1-q1",
                        "type": "listen-tap",
                        "promptText": "Yang mana urutan: BA - BI - BU?",
                        "targetLetter": "بَبِبُ",
                        "targetName": "Ba-Bi-Bu",
                        "options": [
                            {"letter": "بَبِبُ", "name": "Ba-Bi-Bu", "isCorrect": True},
                            {"letter": "بُبِبَ", "name": "Bu-Bi-Ba", "isCorrect": False},
                            {"letter": "بِبَبُ", "name": "Bi-Ba-Bu", "isCorrect": False}
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
                            {"letter": "تَتِتُ", "name": "Ta-Ti-Tu", "isCorrect": True},
                            {"letter": "تُتِتَ", "name": "Tu-Ti-Ta", "isCorrect": False},
                            {"letter": "تِتَتُ", "name": "Ti-Ta-Tu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u3-s1-q3",
                        "type": "listen-tap",
                        "promptText": "Yang mana urutan: TSA - TSI - TSU?",
                        "targetLetter": "ثَثِثُ",
                        "targetName": "Tsa-Tsi-Tsu",
                        "options": [
                            {"letter": "ثَثِثُ", "name": "Tsa-Tsi-Tsu", "isCorrect": True},
                            {"letter": "تَتِتُ", "name": "Ta-Ti-Tu", "isCorrect": False},
                            {"letter": "ثُثِثَ", "name": "Tsu-Tsi-Tsa", "isCorrect": False}
                        ]
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
                "lettersCovered": ["جَ", "جِ", "جُ", "دَ", "دِ", "دُ"],
                "questions": [
                    {
                        "id": "iqro3-u3-s2-q1",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon rangkaian: JA - JI - JU!",
                        "targetLetter": "جَجِجُ",
                        "targetName": "Ja-Ji-Ju",
                        "options": [
                            {"letter": "جَجِجُ", "name": "Ja-Ji-Ju", "isCorrect": True},
                            {"letter": "جُجِجَ", "name": "Ju-Ji-Ja", "isCorrect": False},
                            {"letter": "حَحِحُ", "name": "Ha-Hi-Hu", "isCorrect": False},
                            {"letter": "بَبِبُ", "name": "Ba-Bi-Bu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u3-s2-q2",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon rangkaian: DA - DI - DU!",
                        "targetLetter": "دَدِدُ",
                        "targetName": "Da-Di-Du",
                        "options": [
                            {"letter": "دَدِدُ", "name": "Da-Di-Du", "isCorrect": True},
                            {"letter": "دُدِدَ", "name": "Du-Di-Da", "isCorrect": False},
                            {"letter": "ذَذِذُ", "name": "Dza-Dzi-Dzu", "isCorrect": False},
                            {"letter": "رَرِرُ", "name": "Ro-Ri-Ru", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u3-s2-q3",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon rangkaian: RO - RI - RU!",
                        "targetLetter": "رَرِرُ",
                        "targetName": "Ro-Ri-Ru",
                        "options": [
                            {"letter": "رَرِرُ", "name": "Ro-Ri-Ru", "isCorrect": True},
                            {"letter": "زَزِزُ", "name": "Za-Zi-Zu", "isCorrect": False},
                            {"letter": "رُرِرَ", "name": "Ru-Ri-Ro", "isCorrect": False},
                            {"letter": "دَدِدُ", "name": "Da-Di-Du", "isCorrect": False}
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
                "lettersCovered": ["سَ", "سِ", "سُ", "قَ", "قِ", "قُ"],
                "questions": [
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
                "lettersCovered": ["كُتِبَ", "رُسِلَ", "عُلِمَ", "حَسُنَ"],
                "questions": [
                    {
                        "id": "iqro3-u3-s4-q1",
                        "type": "listen-tap",
                        "promptText": "Yang mana kata: KU - TI - BA?",
                        "targetLetter": "كُتِبَ",
                        "targetName": "Ku-Ti-Ba",
                        "options": [
                            {"letter": "كُتِبَ", "name": "Ku-Ti-Ba", "isCorrect": True},
                            {"letter": "كَتَبَ", "name": "Ka-Ta-Ba", "isCorrect": False},
                            {"letter": "كُتُبُ", "name": "Ku-Tu-Bu", "isCorrect": False}
                        ],
                        "hint": "Perhatikan vokal U - I - A: Kaf dhammah, Ta kasrah, Ba fathah!"
                    },
                    {
                        "id": "iqro3-u3-s4-q2",
                        "type": "listen-tap",
                        "promptText": "Yang mana kata: RU - SI - LA?",
                        "targetLetter": "رُسِلَ",
                        "targetName": "Ru-Si-La",
                        "options": [
                            {"letter": "رُسِلَ", "name": "Ru-Si-La", "isCorrect": True},
                            {"letter": "رَسَلَ", "name": "Ro-Sa-La", "isCorrect": False},
                            {"letter": "رُسُلُ", "name": "Ru-Su-Lu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u3-s4-q3",
                        "type": "listen-tap",
                        "promptText": "Yang mana kata: 'U - LI - MA?",
                        "targetLetter": "عُلِمَ",
                        "targetName": "'U-Li-Ma",
                        "options": [
                            {"letter": "عُلِمَ", "name": "'U-Li-Ma", "isCorrect": True},
                            {"letter": "عَلِمَ", "name": "'A-Li-Ma", "isCorrect": False},
                            {"letter": "عُلُمُ", "name": "'U-Lu-Mu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u3-s4-q4",
                        "type": "listen-tap",
                        "promptText": "Yang mana kata: HA - SU - NA?",
                        "targetLetter": "حَسُنَ",
                        "targetName": "Ha-Su-Na",
                        "options": [
                            {"letter": "حَسُنَ", "name": "Ha-Su-Na", "isCorrect": True},
                            {"letter": "حَسَنَ", "name": "Ha-Sa-Na", "isCorrect": False},
                            {"letter": "حُسِنَ", "name": "Hu-Si-Na", "isCorrect": False}
                        ]
                    }
                ]
            }
        ]
    },

    # UNIT 4
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
                "lettersCovered": ["بِيْ", "تِيْ", "ثِيْ"],
                "questions": [
                    {
                        "id": "iqro3-u4-s1-q1",
                        "type": "listen-tap",
                        "promptText": "Yang mana bacaan panjang: BII?",
                        "targetLetter": "بِيْ",
                        "targetName": "Bii",
                        "options": [
                            {"letter": "بِيْ", "name": "Bii", "isCorrect": True},
                            {"letter": "بِ", "name": "Bi", "isCorrect": False}
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
                            {"letter": "تِيْ", "name": "Tii", "isCorrect": True},
                            {"letter": "تِ", "name": "Ti", "isCorrect": False},
                            {"letter": "بِيْ", "name": "Bii", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u4-s1-q3",
                        "type": "listen-tap",
                        "promptText": "Yang mana bacaan panjang: TSII?",
                        "targetLetter": "ثِيْ",
                        "targetName": "Tsii",
                        "options": [
                            {"letter": "ثِيْ", "name": "Tsii", "isCorrect": True},
                            {"letter": "ثِ", "name": "Tsi", "isCorrect": False},
                            {"letter": "تِيْ", "name": "Tii", "isCorrect": False}
                        ]
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
                "lettersCovered": ["جِيْ", "دِيْ", "رِيْ", "سِيْ"],
                "questions": [
                    {
                        "id": "iqro3-u4-s2-q1",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon bacaan panjang: JII!",
                        "targetLetter": "جِيْ",
                        "targetName": "Jii",
                        "options": [
                            {"letter": "جِيْ", "name": "Jii", "isCorrect": True},
                            {"letter": "جِ", "name": "Ji", "isCorrect": False},
                            {"letter": "حِيْ", "name": "Hii", "isCorrect": False},
                            {"letter": "بِيْ", "name": "Bii", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u4-s2-q2",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon bacaan panjang: DII!",
                        "targetLetter": "دِيْ",
                        "targetName": "Dii",
                        "options": [
                            {"letter": "دِيْ", "name": "Dii", "isCorrect": True},
                            {"letter": "دِ", "name": "Di", "isCorrect": False},
                            {"letter": "ذِيْ", "name": "Dzii", "isCorrect": False},
                            {"letter": "تِيْ", "name": "Tii", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u4-s2-q3",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon bacaan panjang: RII!",
                        "targetLetter": "رِيْ",
                        "targetName": "Rii",
                        "options": [
                            {"letter": "رِيْ", "name": "Rii", "isCorrect": True},
                            {"letter": "رِ", "name": "Ri", "isCorrect": False},
                            {"letter": "زِيْ", "name": "Zii", "isCorrect": False},
                            {"letter": "دِيْ", "name": "Dii", "isCorrect": False}
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
                "lettersCovered": ["فِيْ", "قِيْ"],
                "questions": [
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
                "lettersCovered": ["دِ", "دِيْ", "دِيْنِيْ", "فِيْهِ"],
                "questions": [
                    {
                        "id": "iqro3-u4-s4-q1",
                        "type": "listen-tap",
                        "promptText": "Pilih bacaan pendek: DI!",
                        "targetLetter": "دِ",
                        "targetName": "Di",
                        "options": [
                            {"letter": "دِ", "name": "Di", "isCorrect": True},
                            {"letter": "دِيْ", "name": "Dii", "isCorrect": False}
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
                            {"letter": "دِيْ", "name": "Dii", "isCorrect": True},
                            {"letter": "دِ", "name": "Di", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u4-s4-q3",
                        "type": "listen-tap",
                        "promptText": "Pilih kata dua panjang: DII - NII!",
                        "targetLetter": "دِيْنِيْ",
                        "targetName": "Dii-Nii",
                        "options": [
                            {"letter": "دِيْنِيْ", "name": "Dii-Nii", "isCorrect": True},
                            {"letter": "دِنِ", "name": "Di-Ni", "isCorrect": False},
                            {"letter": "دِيْنِ", "name": "Dii-Ni", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u4-s4-q4",
                        "type": "listen-tap",
                        "promptText": "Pilih kata panjang-pendek: FII - HI!",
                        "targetLetter": "فِيْهِ",
                        "targetName": "Fii-Hii",
                        "options": [
                            {"letter": "فِيْهِ", "name": "Fii-Hii", "isCorrect": True},
                            {"letter": "فِهِ", "name": "Fi-Hii", "isCorrect": False},
                            {"letter": "فِيْهِيْ", "name": "Fii-Hii", "isCorrect": False}
                        ]
                    }
                ]
            }
        ]
    },

    # UNIT 5
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
                "lettersCovered": ["بُوْ", "تُوْ", "ثُوْ"],
                "questions": [
                    {
                        "id": "iqro3-u5-s1-q1",
                        "type": "listen-tap",
                        "promptText": "Yang mana bacaan panjang: BUU?",
                        "targetLetter": "بُوْ",
                        "targetName": "Buu",
                        "options": [
                            {"letter": "بُوْ", "name": "Buu", "isCorrect": True},
                            {"letter": "بُ", "name": "Bu", "isCorrect": False}
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
                            {"letter": "تُوْ", "name": "Tuu", "isCorrect": True},
                            {"letter": "تُ", "name": "Tu", "isCorrect": False},
                            {"letter": "بُوْ", "name": "Buu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u5-s1-q3",
                        "type": "listen-tap",
                        "promptText": "Yang mana bacaan panjang: TSUU?",
                        "targetLetter": "ثُوْ",
                        "targetName": "Tsuu",
                        "options": [
                            {"letter": "ثُوْ", "name": "Tsuu", "isCorrect": True},
                            {"letter": "ثُ", "name": "Tsu", "isCorrect": False},
                            {"letter": "تُوْ", "name": "Tuu", "isCorrect": False}
                        ]
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
                "lettersCovered": ["دُوْ", "رُوْ", "سُوْ", "فُوْ"],
                "questions": [
                    {
                        "id": "iqro3-u5-s2-q1",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon bacaan panjang: DUU!",
                        "targetLetter": "دُوْ",
                        "targetName": "Duu",
                        "options": [
                            {"letter": "دُوْ", "name": "Duu", "isCorrect": True},
                            {"letter": "دُ", "name": "Du", "isCorrect": False},
                            {"letter": "ذُوْ", "name": "Dzuu", "isCorrect": False},
                            {"letter": "بُوْ", "name": "Buu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u5-s2-q2",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon bacaan panjang: RUU!",
                        "targetLetter": "رُوْ",
                        "targetName": "Ruu",
                        "options": [
                            {"letter": "رُوْ", "name": "Ruu", "isCorrect": True},
                            {"letter": "رُ", "name": "Ru", "isCorrect": False},
                            {"letter": "زُوْ", "name": "Zuu", "isCorrect": False},
                            {"letter": "دُوْ", "name": "Duu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u5-s2-q3",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon bacaan panjang: SUU!",
                        "targetLetter": "سُوْ",
                        "targetName": "Suu",
                        "options": [
                            {"letter": "سُوْ", "name": "Suu", "isCorrect": True},
                            {"letter": "سُ", "name": "Su", "isCorrect": False},
                            {"letter": "صُوْ", "name": "Shuu", "isCorrect": False},
                            {"letter": "رُوْ", "name": "Ruu", "isCorrect": False}
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
                "lettersCovered": ["قُوْ", "كُوْ"],
                "questions": [
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
                "lettersCovered": ["تُ", "تُوْ", "كُ", "كُوْ", "يَقُوْلُ"],
                "questions": [
                    {
                        "id": "iqro3-u5-s4-q1",
                        "type": "listen-tap",
                        "promptText": "Pilih bacaan pendek: TU!",
                        "targetLetter": "تُ",
                        "targetName": "Tu",
                        "options": [
                            {"letter": "تُ", "name": "Tu", "isCorrect": True},
                            {"letter": "تُوْ", "name": "Tuu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u5-s4-q2",
                        "type": "listen-tap",
                        "promptText": "Pilih bacaan panjang: TUU!",
                        "targetLetter": "تُوْ",
                        "targetName": "Tuu",
                        "options": [
                            {"letter": "تُوْ", "name": "Tuu", "isCorrect": True},
                            {"letter": "تُ", "name": "Tu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u5-s4-q3",
                        "type": "listen-tap",
                        "promptText": "Pilih kata: YA - QUU - LU!",
                        "targetLetter": "يَقُوْلُ",
                        "targetName": "Ya-Quu-Lu",
                        "options": [
                            {"letter": "يَقُوْلُ", "name": "Ya-Quu-Lu", "isCorrect": True},
                            {"letter": "يَقُلُ", "name": "Ya-Qu-Lu", "isCorrect": False},
                            {"letter": "يَقُوْلُوْ", "name": "Ya-Quu-Luu", "isCorrect": False}
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
                            {"letter": "يَثُوْبُ", "name": "Ya-Tsuu-Bu", "isCorrect": True},
                            {"letter": "يَثُبُ", "name": "Ya-Tsu-Bu", "isCorrect": False},
                            {"letter": "يَتُوْبُ", "name": "Ya-Tuu-Bu", "isCorrect": False}
                        ]
                    }
                ]
            }
        ]
    },

    # UNIT 6
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
                "lettersCovered": ["بَا", "بِيْ", "بُوْ", "تَا", "تِيْ", "تُوْ"],
                "questions": [
                    {
                        "id": "iqro3-u6-s1-q1",
                        "type": "listen-tap",
                        "promptText": "Yang mana trio mad: BAA - BII - BUU?",
                        "targetLetter": "بَابِيْبُوْ",
                        "targetName": "Baa-Bii-Buu",
                        "options": [
                            {"letter": "بَابِيْبُوْ", "name": "Baa-Bii-Buu", "isCorrect": True},
                            {"letter": "بَبِبُ", "name": "Ba-Bi-Bu", "isCorrect": False},
                            {"letter": "بُوْبِيْبَا", "name": "Buu-Bii-Baa", "isCorrect": False}
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
                            {"letter": "تَاتِيْتُوْ", "name": "Taa-Tii-Tuu", "isCorrect": True},
                            {"letter": "تَتِتُ", "name": "Ta-Ti-Tu", "isCorrect": False},
                            {"letter": "بَابِيْبُوْ", "name": "Baa-Bii-Buu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u6-s1-q3",
                        "type": "listen-tap",
                        "promptText": "Yang mana trio mad: JAA - JII - JUU?",
                        "targetLetter": "جَاجِيْجُوْ",
                        "targetName": "Jaa-Jii-Juu",
                        "options": [
                            {"letter": "جَاجِيْجُوْ", "name": "Jaa-Jii-Juu", "isCorrect": True},
                            {"letter": "جَجِجُ", "name": "Ja-Ji-Ju", "isCorrect": False},
                            {"letter": "حَاحِيْحُوْ", "name": "Haa-Hii-Huu", "isCorrect": False}
                        ]
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
                "lettersCovered": ["دَا", "دِيْ", "دُوْ", "قَا", "قِيْ", "قُوْ"],
                "questions": [
                    {
                        "id": "iqro3-u6-s2-q1",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon trio mad: DAA - DII - DUU!",
                        "targetLetter": "دَادِيْدُوْ",
                        "targetName": "Daa-Dii-Duu",
                        "options": [
                            {"letter": "دَادِيْدُوْ", "name": "Daa-Dii-Duu", "isCorrect": True},
                            {"letter": "دَدِدُ", "name": "Da-Di-Du", "isCorrect": False},
                            {"letter": "ذَاذِيْذُوْ", "name": "Dzaa-Dzii-Dzuu", "isCorrect": False},
                            {"letter": "رَارِيْرُوْ", "name": "Raa-Rii-Ruu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u6-s2-q2",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon trio mad: QOO - QII - QUU!",
                        "targetLetter": "قَاقِيْقُوْ",
                        "targetName": "Qoo-Qii-Quu",
                        "options": [
                            {"letter": "قَاقِيْقُوْ", "name": "Qoo-Qii-Quu", "isCorrect": True},
                            {"letter": "قَقِقُ", "name": "Qo-Qi-Qu", "isCorrect": False},
                            {"letter": "كَاكِيْكُوْ", "name": "Kaa-Kii-Kuu", "isCorrect": False},
                            {"letter": "فَافِيْفُوْ", "name": "Faa-Fii-Fuu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u6-s2-q3",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon trio mad: SAA - SII - SUU!",
                        "targetLetter": "سَاسِيْسُوْ",
                        "targetName": "Saa-Sii-Suu",
                        "options": [
                            {"letter": "سَاسِيْسُوْ", "name": "Saa-Sii-Suu", "isCorrect": True},
                            {"letter": "سَسِسُ", "name": "Sa-Si-Su", "isCorrect": False},
                            {"letter": "صَاصِيْصُوْ", "name": "Shoo-Shii-Shuu", "isCorrect": False},
                            {"letter": "دَادِيْدُوْ", "name": "Daa-Dii-Duu", "isCorrect": False}
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
                "lettersCovered": ["نَا", "نِيْ", "نُوْ", "كَانَ"],
                "questions": [
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
                "lettersCovered": ["هِ", "هُ", "بِهِ", "لَهُ"],
                "questions": [
                    {
                        "id": "iqro3-u6-s4-q1",
                        "type": "listen-tap",
                        "promptText": "Pilih huruf Ha simpul kasrah: HI!",
                        "targetLetter": "هِ",
                        "targetName": "Hii",
                        "options": [
                            {"letter": "هِ", "name": "Hii", "isCorrect": True},
                            {"letter": "هُ", "name": "Huu", "isCorrect": False},
                            {"letter": "حِ", "name": "Hi", "isCorrect": False}
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
                            {"letter": "هُ", "name": "Huu", "isCorrect": True},
                            {"letter": "هِ", "name": "Hii", "isCorrect": False},
                            {"letter": "حُ", "name": "Hu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u6-s4-q3",
                        "type": "listen-tap",
                        "promptText": "Pilih kata: BI - HI!",
                        "targetLetter": "بِهِ",
                        "targetName": "Bi-Hii",
                        "options": [
                            {"letter": "بِهِ", "name": "Bi-Hii", "isCorrect": True},
                            {"letter": "بِهَ", "name": "Bi-Haa", "isCorrect": False},
                            {"letter": "بُهُ", "name": "Bu-Huu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u6-s4-q4",
                        "type": "listen-tap",
                        "promptText": "Pilih kata: LA - HU!",
                        "targetLetter": "لَهُ",
                        "targetName": "La-Huu",
                        "options": [
                            {"letter": "لَهُ", "name": "La-Huu", "isCorrect": True},
                            {"letter": "لَهِ", "name": "La-Hii", "isCorrect": False},
                            {"letter": "لَهَا", "name": "La-Haa", "isCorrect": False}
                        ]
                    }
                ]
            }
        ]
    },

    # UNIT 7
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
                "lettersCovered": ["حَسُنَ", "عَظُمَ", "صَلُحَ"],
                "questions": [
                    {
                        "id": "iqro3-u7-s1-q1",
                        "type": "listen-tap",
                        "promptText": "Yang mana kata: HA - SU - NA?",
                        "targetLetter": "حَسُنَ",
                        "targetName": "Ha-Su-Na",
                        "options": [
                            {"letter": "حَسُنَ", "name": "Ha-Su-Na", "isCorrect": True},
                            {"letter": "حَسَنَ", "name": "Ha-Sa-Na", "isCorrect": False},
                            {"letter": "حُسِنَ", "name": "Hu-Si-Na", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u7-s1-q2",
                        "type": "listen-tap",
                        "promptText": "Yang mana kata: 'A - ZHU - MA?",
                        "targetLetter": "عَظُمَ",
                        "targetName": "'A-Zhu-Ma",
                        "options": [
                            {"letter": "عَظُمَ", "name": "'A-Zhu-Ma", "isCorrect": True},
                            {"letter": "عَظَمَ", "name": "'A-Zha-Ma", "isCorrect": False},
                            {"letter": "عُظِمَ", "name": "'U-Zhi-Ma", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u7-s1-q3",
                        "type": "listen-tap",
                        "promptText": "Yang mana kata: SHO - LU - HA?",
                        "targetLetter": "صَلُحَ",
                        "targetName": "Sho-Lu-Ha",
                        "options": [
                            {"letter": "صَلُحَ", "name": "Sho-Lu-Ha", "isCorrect": True},
                            {"letter": "صَلَحَ", "name": "Sho-La-Ha", "isCorrect": False},
                            {"letter": "صُلِحَ", "name": "Sho-Lu-Hi", "isCorrect": False}
                        ]
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
                "lettersCovered": ["سَمِعَ", "عَلِمَ", "شَهِدَ"],
                "questions": [
                    {
                        "id": "iqro3-u7-s2-q1",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon kata: SA - MI - 'A!",
                        "targetLetter": "سَمِعَ",
                        "targetName": "Sa-Mi-'A",
                        "options": [
                            {"letter": "سَمِعَ", "name": "Sa-Mi-'A", "isCorrect": True},
                            {"letter": "سَمَعَ", "name": "Sa-Ma-'A", "isCorrect": False},
                            {"letter": "عَلِمَ", "name": "'A-Li-Ma", "isCorrect": False},
                            {"letter": "شَهِدَ", "name": "Syi-Hi-Da", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u7-s2-q2",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon kata: 'A - LI - MA!",
                        "targetLetter": "عَلِمَ",
                        "targetName": "'A-Li-Ma",
                        "options": [
                            {"letter": "عَلِمَ", "name": "'A-Li-Ma", "isCorrect": True},
                            {"letter": "عَلَمَ", "name": "'A-La-Ma", "isCorrect": False},
                            {"letter": "سَمِعَ", "name": "Sa-Mi-'A", "isCorrect": False},
                            {"letter": "عُلِمَ", "name": "'U-Li-Ma", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u7-s2-q3",
                        "type": "bubble-pop",
                        "promptText": "Letuskan balon kata: SYA - HI - DA!",
                        "targetLetter": "شَهِدَ",
                        "targetName": "Sya-Hi-Da",
                        "options": [
                            {"letter": "شَهِدَ", "name": "Sya-Hi-Da", "isCorrect": True},
                            {"letter": "شَهَدَ", "name": "Sya-Ha-Da", "isCorrect": False},
                            {"letter": "سَمِعَ", "name": "Sa-Mi-'A", "isCorrect": False},
                            {"letter": "عَلِمَ", "name": "'A-Li-Ma", "isCorrect": False}
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
                "lettersCovered": ["كُتِبَ", "رُسِلَ"],
                "questions": [
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
                "lettersCovered": ["كُتِبَ", "دِيْنِيْ", "يَقُوْلُ", "سَمِعَ"],
                "questions": [
                    {
                        "id": "iqro3-u7-s4-q1",
                        "type": "listen-tap",
                        "promptText": "Ujian 1: Yang mana kata gabungan vokal: KU - TI - BA?",
                        "targetLetter": "كُتِبَ",
                        "targetName": "Ku-Ti-Ba",
                        "options": [
                            {"letter": "كُتِبَ", "name": "Ku-Ti-Ba", "isCorrect": True},
                            {"letter": "كَتَبَ", "name": "Ka-Ta-Ba", "isCorrect": False},
                            {"letter": "كُتُبُ", "name": "Ku-Tu-Bu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u7-s4-q2",
                        "type": "listen-tap",
                        "promptText": "Ujian 2: Yang mana kata mad kasrah: DII - NII?",
                        "targetLetter": "دِيْنِيْ",
                        "targetName": "Dii-Nii",
                        "options": [
                            {"letter": "دِيْنِيْ", "name": "Dii-Nii", "isCorrect": True},
                            {"letter": "دِنِ", "name": "Di-Ni", "isCorrect": False},
                            {"letter": "دِيْنِ", "name": "Dii-Ni", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u7-s4-q3",
                        "type": "listen-tap",
                        "promptText": "Ujian 3: Yang mana kata mad dhammah: YA - QUU - LU?",
                        "targetLetter": "يَقُوْلُ",
                        "targetName": "Ya-Quu-Lu",
                        "options": [
                            {"letter": "يَقُوْلُ", "name": "Ya-Quu-Lu", "isCorrect": True},
                            {"letter": "يَقُلُ", "name": "Ya-Qu-Lu", "isCorrect": False},
                            {"letter": "يَقُوْلُوْ", "name": "Ya-Quu-Luu", "isCorrect": False}
                        ]
                    },
                    {
                        "id": "iqro3-u7-s4-q4",
                        "type": "listen-tap",
                        "promptText": "Ujian 4: Yang mana kata: SA - MI - 'A?",
                        "targetLetter": "سَمِعَ",
                        "targetName": "Sa-Mi-'A",
                        "options": [
                            {"letter": "سَمِعَ", "name": "Sa-Mi-'A", "isCorrect": True},
                            {"letter": "سَمَعَ", "name": "Sa-Ma-'A", "isCorrect": False},
                            {"letter": "سُمِعَ", "name": "Su-Mi-'A", "isCorrect": False}
                        ],
                        "hint": "Selamat! Selesaikan pertanyaan ini untuk lulus Iqro 3 dan membuka Iqro 4!"
                    }
                ]
            }
        ]
    }
]

# Convert units_data to TypeScript object notation
def to_ts(val, indent=0):
    spaces = ' ' * indent
    if isinstance(val, dict):
        lines = ['{\n']
        for k, v in val.items():
            lines.append(f"{spaces}  {k}: {to_ts(v, indent + 2)},\n")
        lines.append(f"{spaces}}}")
        return ''.join(lines)
    elif isinstance(val, list):
        if len(val) == 0:
            return '[]'
        if all(isinstance(x, str) for x in val):
            return '[' + ', '.join(f"'{x}'" for x in val) + ']'
        lines = ['[\n']
        for item in val:
            lines.append(f"{spaces}  {to_ts(item, indent + 2)},\n")
        lines.append(f"{spaces}]")
        return ''.join(lines)
    elif isinstance(val, bool):
        return 'true' if val else 'false'
    elif isinstance(val, (int, float)):
        return str(val)
    elif isinstance(val, str):
        escaped = val.replace('\\', '\\\\').replace("'", "\\'")
        return f"'{escaped}'"
    return 'null'

iqro3_ts = f"""  {{
    level: 3,
    title: 'Iqro 3',
    subtitle: 'Harakat Kasrah (-i), Dhammah (-u) & Mad Asli',
    color: '#FF9600',
    totalStages: 28,
    units: {to_ts(units_data, indent=4)}
  }},"""

print(f"Generated IQRO 3 TS with {len(units_data)} units and {sum(len(u['stages']) for u in units_data)} stages.")

target_file = 'src/games/iqro/data/iqroLevels.ts'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the Iqro 3 block
pattern = r'  \{\s*level:\s*3,[\s\S]*?units:\s*\[[\s\S]*?\]\s*\},'
match = re.search(pattern, content)
if not match:
    print("Could not find Iqro 3 block with regex!")
    exit(1)

new_content = content[:match.start()] + iqro3_ts + content[match.end():]

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully updated src/games/iqro/data/iqroLevels.ts with complete Iqro 3 curriculum!")
