import json

path = 'src/data/catalogue.json'
with open(path, 'r', encoding='utf-8') as f:
    cat = json.load(f)

ja_data = {
    'foods': {
        'pootharekulu': {
            'name': 'プータレクル',
            'desc': '極薄の米粉シートとギー、砂糖で作る繊細なアンドラ州の伝統菓子。',
            'story': 'アトレヤプラムとゴダヴァリ地方に深く根ざしたお菓子です。',
            'variations': 'フィリングには砂糖やジャガリ（黒糖）が使われます。',
            'steps': ['米粉から極薄のシートを作る', 'ギーと砂糖（またはジャガリ）を重ねる', '丁寧に巻き上げて仕上げる']
        },
        'tapeswaram-kaja': {
            'name': 'タペスワラム・カジャ',
            'desc': 'アンドラ州タペスワラム発祥の、シロップに浸した層状の揚げ菓子。',
            'story': '地域の菓子職人によって代々受け継がれてきた名物菓子です。',
            'variations': '生地の層の厚さやシロップの濃度によって食感が変わります。',
            'steps': ['小麦粉の生地を層状に伸ばす', 'きつね色に深く揚げる', '温かいシュガーシロップに漬け込む']
        },
        'bandar-laddu': {
            'name': 'バンダル・ラドゥ',
            'desc': 'マチリパトナム（旧名バンダル）の名物として知られる伝統的なラドゥ。',
            'story': '海岸沿いの街マチリパトナムの歴史ある製法で作られています。',
            'variations': '伝統的な配合と食感が職人技によって守られています。',
            'steps': ['生地を細かく揚げて砕く', 'シロップと混ぜ合わせる', '一口大の球状に丸める']
        },
        'bobbatlu': {
            'name': 'ボッバトル',
            'desc': '甘いフィリングを包んで香ばしく焼き上げた伝統的な平焼き菓子。',
            'story': 'お祭りや家族の集まりで欠かせないお祝いの味です。',
            'variations': 'レンズ豆とジャガリ、またはココナッツのフィリングが使われます。',
            'steps': ['生地と甘いフィリングを準備する', '生地でフィリングを包む', 'ギーを引いた鉄板で香ばしく焼く']
        },
        'ariselu': {
            'name': 'アリセル',
            'desc': '米粉とジャガリで作る、お祝いやお祭りに欠かせない伝統菓子。',
            'story': '収穫祭サンクランティの時期に多くの家庭で作られます。',
            'variations': '厚みやジャガリの配合、ゴマのトッピングに家庭ごとの工夫があります。',
            'steps': ['米粉とジャガリの生地を練る', '丸めてゴマをまぶす', '黄金色に揚げる']
        },
        'qubani-ka-meetha': {
            'name': 'クバニ・カ・ミータ',
            'desc': 'アプリコット（あんず）をじっくり煮込んだハイデラバード風デザート。',
            'story': 'ハイデラバードの宮廷料理文化に起源を持つ贅沢なデザートです。',
            'variations': 'クリームやアイスクリームを添えて楽しまれます。',
            'steps': ['乾燥アプリコットを水で戻す', '砂糖と一緒に柔らかくなるまで煮込む', '冷やしてトッピングを添える']
        },
        'double-ka-meetha': {
            'name': 'ダブル・カ・ミータ',
            'desc': 'パンと甘いミルク、スパイスで作るリッチなハイデラバード風ブレッドプディング。',
            'story': '結婚式や祝祭の宴席で伝統的に振る舞われるデザートです。',
            'variations': 'ドライフルーツやナッツをふんだんにトッピングします。',
            'steps': ['パンを一口大に切ってギーで揚げる', 'サフラン風味の甘いミルクで煮込む', 'ナッツを飾る']
        },
        'sheer-khurma': {
            'name': 'シール・クルマ',
            'desc': 'ミルク、極細パスタ（ヴェルミチェリ）、デーツで作る祝祭のデザート。',
            'story': 'イード（断食明けのお祭り）の日に家族や友人と分かち合う温かいスイーツです。',
            'variations': 'ナッツやドライフルーツの種類は家庭によって異なります。',
            'steps': ['ヴェルミチェリをギーで炒める', 'たっぷりのミルクと砂糖で煮込む', 'デーツとナッツを加える']
        },
        'kakinada-khaja': {
            'name': 'カキナダ・カジャ',
            'desc': '海岸部カキナダ発祥の、管状の空洞を持つジューシーな層状菓子。',
            'story': 'ゴダヴァリ地方の菓子作りの伝統を象徴する有名な一品です。',
            'variations': '外側のサクサク感と中のシロップのバランスが絶妙です。',
            'steps': ['生地を管状に巻き上げる', 'サクサクに揚げる', '甘いシロップをしみ込ませる']
        },
        'sunnundalu': {
            'name': 'スヌンダル',
            'desc': 'ローストしたウルド豆、ジャガリ、純粋なギーで作る栄養豊かなラドゥ。',
            'story': '高タンパクで栄養価が高いため、お祝い事や健康食としても愛されています。',
            'variations': 'カルダモンパウダーや炒った米粉を少し加えることもあります。',
            'steps': ['ウルド豆を香ばしく炒って粉にする', 'ジャガリとギーを混ぜ合わせる', '温かいうちに丸める']
        },
        'sakinalu': {
            'name': 'サキナル',
            'desc': '米粉とゴマで作る、同心円状の美しい幾何学模様のカリカリお菓子。',
            'story': 'テランガーナ州のサンクランティ祭や結婚式に欠かせない伝統スナックです。',
            'variations': 'クミンやアジュワン（キャロムシード）を加える地域もあります。',
            'steps': ['米粉とゴマで生地を作る', '手作業で円形の模様に絞り出す', 'パリッと揚げる']
        },
        'kajjikayalu': {
            'name': 'カジカヤル',
            'desc': 'ココナッツやセモリナの甘いフィリングを包んだ三日月形の揚げ菓子。',
            'story': 'ディワリやサンクランティのお祝いに各家庭で手作りされます。',
            'variations': '炒った豆やドライフルーツなど多様なフィリングがあります。',
            'steps': ['小麦粉の生地を丸く伸ばす', '甘いフィリングを乗せて半分に折る', '端を閉じてきつね色に揚げる']
        },
        'gavvalu': {
            'name': 'ガヴヴァル',
            'desc': '小さな木型を使って貝殻の形に成形し、シロップで絡めた一口菓子。',
            'story': '手作業の細やかな手仕事が光る、家庭的なお祭りの定番おやつです。',
            'variations': 'ジャガリシロップまたは砂糖のクリスタルコーティングが選ばれます。',
            'steps': ['小さな生地を木型で貝殻型に丸める', 'サクッと揚げる', '温かいシロップで絡める']
        }
    },
    'regions': {
        'andhra-pradesh': {'name': 'アンドラ・プラデーシュ州', 'desc': '海岸部の名物、お祭りの伝統菓子が揃う地域。', 'highlights': ['海岸部の特産品', 'お祭りの伝統菓子']},
        'coastal-andhra': {'name': 'コースト・アンドラ', 'desc': '米をベースにした伝統菓子と家庭の祝祭料理が豊かな地方。', 'highlights': ['米ベースのスイーツ', '家庭の伝統']},
        'godavari-region': {'name': 'ゴダヴァリ地方', 'desc': '豊かな水に恵まれ、著名な菓子職人や伝統菓子を輩出する地域。', 'highlights': ['地元の職人', '地域の名産']},
        'telangana': {'name': 'テランガーナ州', 'desc': 'ハイデラバードのデザートやお祭りの伝統が息づく地域。', 'highlights': ['ハイデラバードのデザート', 'お祭りの伝統']},
        'hyderabad': {'name': 'ハイデラバード', 'desc': '宮廷文化を受け継ぐ重層的な食文化と祝祭デザートの街。', 'highlights': ['都市の食文化', 'お祝いのデザート']},
        'machilipatnam': {'name': 'マチリパトナム', 'desc': 'バンダル・ラドゥで有名な歴史ある海岸沿いの街。', 'highlights': ['伝統菓子文化', '海岸部アンドラ']}
    },
    'festivals': {
        'sankranti': {'name': 'サンクランティ', 'desc': '収穫を祝い、地方の特産品や家庭料理を楽しむお祭り。', 'significance': '家族や地域社会の絆を深める大切なお祭りです。'},
        'diwali': {'name': 'ディワリ', 'desc': '家族や友人と甘いお菓子を分かち合う光の祭典。', 'significance': '家中に灯りをともし、お菓子を作り祝います。'},
        'bonalu': {'name': 'ボナール', 'desc': 'テランガーナ州の女神を讃える伝統的な祝祭。', 'significance': '地域固有の文化と食の習慣が受け継がれています。'},
        'eid': {'name': 'イード・アル＝フィトル', 'desc': '断食明けを祝い、特別なデザートを楽しむイスラムの祝祭。', 'significance': 'シール・クルマなどの甘いデザートで祝福します。'}
    },
    'categories': {
        'sweets': {'name': 'スイーツ・伝統菓子'}
    },
    'ingredients': {
        'rice-flour': {'name': '米粉', 'desc': '南インドの伝統菓子やスナックに広く使われる米の粉。'},
        'jaggery': {'name': 'ジャガリ（黒糖）', 'desc': '多くの伝統菓子に深みのある甘みをもたらす未精製糖。'},
        'ghee': {'name': 'ギー', 'desc': '芳醇な香りとコクを加えるために欠かせない精製バター。'},
        'sugar': {'name': '砂糖', 'desc': 'シロップやデザートの甘みを作る基本的な調味料。'},
        'milk': {'name': '牛乳', 'desc': 'ミルキーなデザートやプディングのベースとなる素材。'},
        'apricot': {'name': 'アプリコット（あんず）', 'desc': 'クバニ・カ・ミータの主役となる乾燥果実。'},
        'bread': {'name': 'パン', 'desc': 'ダブル・カ・ミータ（ブレッドプディング）の土台となるパン。'},
        'vermicelli': {'name': 'ヴェルミチェリ', 'desc': 'ミルクデザートに使われる極細のパスタ・麺。'},
        'sesame': {'name': '胡麻（ゴマ）', 'desc': '香ばしさと食感を添える種子。'},
        'semolina': {'name': 'セモリナ', 'desc': 'お菓子やスナックの生地に使われる小麦の粗挽き粉。'},
        'flour': {'name': '小麦粉', 'desc': '揚げ菓子や層状のスイーツの生地に使われる粉。'},
        'urad-dal': {'name': 'ウルド豆', 'desc': 'スヌンダルなどの栄養豊かなお菓子に使われる豆の粉。'}
    },
    'stories': {
        'documenting-local-sweets': {'title': 'すべての伝統菓子には物語がある', 'excerpt': '名前、作り手、材料、地域のバリエーションを正確に記録するためのガイド。', 'body': '地域のお菓子文化を記録することは、知られている事実を大切にし、知識を共有してくれる人々に敬意を払うことから始まります。新しいお菓子を加えるときは、その現地名や歴史的背景を記録することが大切です。', 'author': 'ピండివంటలు 編集部'},
        'respectful-food-photography': {'title': '敬意を持ったフードフォトグラフィー', 'excerpt': 'すべての写真に正確なマッチ、適切なライセンス、詳細な説明が必要な理由。', 'body': '写真は料理を認識する助けになりますが、別の料理を写した写真は誤解を招きます。撮影された料理を確認し、クリエイターに敬意を払いましょう。', 'author': 'ピండివంటలు 編集部'}
    }
}

for food in cat['foods']:
    slug = food['slug']
    if slug in ja_data['foods']:
        j = ja_data['foods'][slug]
        food['name_japanese'] = j['name']
        food['description_japanese'] = j['desc']
        food['cultural_story_japanese'] = j['story']
        food['regional_variations_japanese'] = j['variations']
        food['preparation_steps_japanese'] = j['steps']

for region in cat['regions']:
    slug = region['slug']
    if slug in ja_data['regions']:
        j = ja_data['regions'][slug]
        region['name_japanese'] = j['name']
        region['description_japanese'] = j['desc']
        region['highlights_japanese'] = j['highlights']

for fest in cat['festivals']:
    slug = fest['slug']
    if slug in ja_data['festivals']:
        j = ja_data['festivals'][slug]
        fest['name_japanese'] = j['name']
        fest['description_japanese'] = j['desc']
        fest['significance_japanese'] = j['significance']

for cat_item in cat['categories']:
    slug = cat_item['slug']
    if slug in ja_data['categories']:
        cat_item['name_japanese'] = ja_data['categories'][slug]['name']

for ing in cat['ingredients']:
    slug = ing['slug']
    if slug in ja_data['ingredients']:
        j = ja_data['ingredients'][slug]
        ing['name_japanese'] = j['name']
        ing['description_japanese'] = j['desc']

for story in cat['stories']:
    slug = story['slug']
    if slug in ja_data['stories']:
        j = ja_data['stories'][slug]
        story['title_japanese'] = j['title']
        story['excerpt_japanese'] = j['excerpt']
        story['body_japanese'] = j['body']
        story['author_japanese'] = j['author']

with open(path, 'w', encoding='utf-8') as f:
    json.dump(cat, f, ensure_ascii=False, indent=2)

print('Successfully populated Japanese data for all records!')
