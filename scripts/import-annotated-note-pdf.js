#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const sourcePdf = process.argv[2];
const day = Number(process.argv[3]);
const overwrite = process.argv.includes('--overwrite');

const CONFIG = {
  31: {
    date: '2026-07-20',
    answers: 'CDBACBACCCADCBD',
    groups: [
      ['畏首畏尾、谨小慎微、首鼠两端、如履薄冰、举步维艰', ['畏首畏尾', '谨小慎微', '首鼠两端', '如履薄冰', '举步维艰']],
      ['耳濡目染、潜移默化、春风化雨、润物无声、和风细雨', ['耳濡目染', '潜移默化', '春风化雨', '润物无声', '和风细雨']],
      ['开源节流、量入为出、精打细算、细水长流、节衣缩食', ['开源节流', '量入为出', '精打细算', '细水长流', '节衣缩食']],
      ['耳熟能详、脍炙人口、喜闻乐见、交口称赞、家喻户晓', ['耳熟能详', '脍炙人口', '喜闻乐见', '交口称赞', '家喻户晓']],
    ],
  },
  32: {
    date: '2026-07-21',
    answers: 'ACABBDDDBADDCBB',
    groups: [
      ['大浪淘沙、披沙拣金、精挑细选、优胜劣汰、弱肉强食', ['大浪淘沙', '披沙拣金', '精挑细选', '优胜劣汰', '弱肉强食']],
      ['力不从心、力有不逮、无能为力、黔驴技穷、独木难支', ['力不从心', '力有不逮', '无能为力', '黔驴技穷', '独木难支']],
      ['海纳百川、兼收并蓄、博采众长、虚怀若谷、闻过则喜', ['海纳百川', '兼收并蓄', '博采众长', '虚怀若谷', '闻过则喜']],
      ['杂乱无章、错综复杂、盘根错节、千头万绪、千丝万缕', ['杂乱无章', '错综复杂', '盘根错节', '千头万绪', '千丝万缕']],
    ],
  },
  33: {
    date: '2026-07-21',
    answers: 'CBCABAADDCCBBDB',
    quizGroups: [4, 7, 11, 15],
    type: 'words',
    groups: [
      ['引领、引导、指引、指导、指点、指示', ['引领', '引导', '指引', '指导', '指点', '指示']],
      ['制定、制订、拟定、拟订、缔结', ['制定', '制订', '拟定', '拟订', '缔结']],
      ['保障、保证、保护、维护、支撑', ['保障', '保证', '保护', '维护', '支撑']],
      ['漠视、忽视、无视、轻视、蔑视', ['漠视', '忽视', '无视', '轻视', '蔑视']],
    ],
  },
  34: {
    date: '2026-07-23',
    answers: 'CCBADDDDDAABDCDB',
    quizGroups: [4, 7, 12, 16],
    groups: [
      {
        name: '借鉴、借镜、学习、效仿、沿袭、复刻、照搬',
        type: 'words',
        entries: [
          ['借鉴', '用镜子照看。比喻参考他人的经验或教训来对照改进自己。'],
          ['借镜', '照他人经验以改进自身。'],
          ['学习', '通过阅读、实践等方式获取知识或技能。'],
          ['效仿', '模仿别人的做法，照着去做。'],
          ['沿袭', '照旧有的传统、制度或做法，继续照做下去，不加改变。'],
          ['复刻', '依照原样重新制作一份，力求一模一样。'],
          ['照搬', '原封不动地搬用别人的经验、方法或理论，不加任何改变。'],
        ],
      },
      {
        name: '弱化、退化、淡化、削弱',
        type: 'words',
        entries: [
          ['弱化', '使力量或程度减弱。'],
          ['退化', '指器官、机能、能力、素质或水平等由复杂到简单、由强到弱、由好变差。'],
          ['淡化', '指浓度、颜色、味道，或情感、印象、记忆、观念、矛盾、界限等由浓转淡、由重转轻。'],
          ['削弱', '力量、势力减弱；使变弱，侧重由于外力介入导致力量变弱。'],
        ],
      },
      {
        name: '狗尾续貂、东施效颦、照猫画虎、随波逐流、拾人牙慧',
        type: 'idioms',
        entries: [
          ['狗尾续貂', '好的开头后面接了差得多的续作或后继部分，前后质量悬殊。'],
          ['东施效颦', '盲目模仿别人，尤其模仿外在姿态或样子，结果适得其反。'],
          ['照猫画虎', '只学表面皮毛，依样画葫芦，不得精髓。'],
          ['随波逐流', '没有主见，顺应大流、盲目跟风。'],
          ['拾人牙慧', '捡取别人说过的话、观点、见解当作自己的，缺乏原创。'],
        ],
      },
      {
        name: '一以贯之、亘古不变、一成不变、始终如一、一气呵成',
        type: 'idioms',
        entries: [
          ['一以贯之', '用一个原则、精神或做法贯穿始终，侧重长期坚持不改。'],
          ['亘古不变', '从远古到现在从未改变，强调时间跨度极长、恒定。'],
          ['一成不变', '一经形成就固定不变，强调固定僵化、不知变通。'],
          ['始终如一', '从开始到结束都一样，没有变化。'],
          ['一气呵成', '一口气完成、不间断，也形容文章气势连贯。'],
        ],
      },
    ],
  },
  35: {
    date: '2026-07-28',
    answers: ['BBDCB', 'BABCC', 'BADBA', 'AC'].join(''),
    groups: [
      ['不相上下、旗鼓相当、分庭抗礼、平分秋色', ['不相上下', '旗鼓相当', '分庭抗礼', '平分秋色']],
      ['刚愎自用、独断专行、我行我素、特立独行', ['刚愎自用', '独断专行', '我行我素', '特立独行']],
      ['纷至沓来、接踵而至、络绎不绝、层出不穷', ['纷至沓来', '接踵而至', '络绎不绝', '层出不穷']],
      ['孤注一掷、铤而走险、破釜沉舟、壮士断腕', ['孤注一掷', '铤而走险', '破釜沉舟', '壮士断腕']],
      ['厚积薄发、蓄势待发、韬光养晦、卧薪尝胆', ['厚积薄发', '蓄势待发', '韬光养晦', '卧薪尝胆']],
    ],
  },
  36: {
    date: '2026-07-29',
    answers: ['BCDDD', 'DDCDC', 'BCDBA', 'CC'].join(''),
    type: 'words',
    groups: [
      ['篡改、窜改、伪造、杜撰、虚构', ['篡改', '窜改', '伪造', '杜撰', '虚构']],
      ['识别、辨别、鉴别、甄别', ['识别', '辨别', '鉴别', '甄别']],
      ['倒逼、迫使、驱使、驱动', ['倒逼', '迫使', '驱使', '驱动']],
      ['酝酿、孕育、培育、培养', ['酝酿', '孕育', '培育', '培养']],
      ['接续、延续、继承、传承', ['接续', '延续', '继承', '传承']],
    ],
  },
  37: {
    date: '2026-08-01',
    answers: ['DABAD', 'DBABB', 'BAACC', 'DCBA'].join(''),
    groups: [
      { name: '望而生畏、望而却步、望洋兴叹、望尘莫及', type: 'idioms', terms: ['望而生畏', '望而却步', '望洋兴叹', '望尘莫及'] },
      { name: '不刊之论、不易之论、不根之论、齿牙余论', type: 'idioms', terms: ['不刊之论', '不易之论', '不根之论', '齿牙余论'] },
      { name: '一蹴而就、一朝一夕、立竿见影', type: 'idioms', terms: ['一蹴而就', '一朝一夕', '立竿见影'] },
      { name: '门庭若市、门可罗雀、络绎不绝', type: 'idioms', terms: ['门庭若市', '门可罗雀', '络绎不绝'] },
      { name: '大有可为、大有裨益、大有作为', type: 'idioms', terms: ['大有可为', '大有裨益', '大有作为'] },
      { name: '昭示、告知、传递、传播', type: 'words', terms: ['昭示', '告知', '传递', '传播'] },
    ],
  },
  38: {
    date: '2026-08-02',
    answers: ['DCBDD', 'BBDDB', 'ACBA'].join(''),
    groups: [
      ['移花接木、偷梁换柱、张冠李戴、掩耳盗铃、自欺欺人', ['移花接木', '偷梁换柱', '张冠李戴', '掩耳盗铃', '自欺欺人']],
      ['充耳不闻、置若罔闻、熟视无睹、不以为意、不以为然', ['充耳不闻', '置若罔闻', '熟视无睹', '不以为意', '不以为然']],
      ['阳春白雪、曲高和寡、孤芳自赏、雅俗共赏、通俗易懂', ['阳春白雪', '曲高和寡', '孤芳自赏', '雅俗共赏', '通俗易懂']],
      ['与众不同、独一无二、不可或缺、缺一不可、举足轻重', ['与众不同', '独一无二', '不可或缺', '缺一不可', '举足轻重']],
    ],
  },
  39: {
    date: '2026-08-03',
    answers: ['CBACB', 'DAAAD', 'ACDBD', 'C'].join(''),
    type: 'words',
    groups: [
      ['更迭、更新、升级、深化', ['更迭', '更新', '升级', '深化']],
      ['涌现、浮现、显现、展现、凸显、突显', ['涌现', '浮现', '显现', '展现', '凸显', '突显']],
      ['筛选、搜集、提炼、归纳', ['筛选', '搜集', '提炼', '归纳']],
      ['贯穿、渗透、融入、融汇', ['贯穿', '渗透', '融入', '融汇']],
      ['盲区、瓶颈、漏洞、短板', ['盲区', '瓶颈', '漏洞', '短板']],
    ],
  },
  40: {
    date: '2026-08-04',
    answers: ['BABAB', 'DABBB', 'BDCAD', 'DBCDD'].join(''),
    groups: [
      ['不折不扣、彻头彻尾', ['不折不扣', '彻头彻尾']],
      ['本末倒置、舍本逐末、竭泽而渔、拔苗助长、得不偿失、因小失大', ['本末倒置', '舍本逐末', '竭泽而渔', '拔苗助长', '得不偿失', '因小失大']],
      ['削足适履、生搬硬套、水土不服、千篇一律', ['削足适履', '生搬硬套', '水土不服', '千篇一律']],
      ['难以为继、举步维艰、后继无人、青黄不接', ['难以为继', '举步维艰', '后继无人', '青黄不接']],
      ['哗众取宠、夸大其词、华而不实、花拳绣腿', ['哗众取宠', '夸大其词', '华而不实', '花拳绣腿']],
      ['亦步亦趋、一拥而上、蜂拥而至、争先恐后、趋之若鹜', ['亦步亦趋', '一拥而上', '蜂拥而至', '争先恐后', '趋之若鹜']],
    ],
  },
  41: {
    date: '2026-08-05',
    answers: ['ABCBD', 'ADDBA', 'ABBDD', 'D'].join(''),
    groups: [
      ['交相辉映、遥相呼应、相映成趣、相得益彰', ['交相辉映', '遥相呼应', '相映成趣', '相得益彰']],
      ['浑然一体、浑然天成、水乳交融、同舟共济、休戚与共', ['浑然一体', '浑然天成', '水乳交融', '同舟共济', '休戚与共']],
      ['不计其数、不胜枚举、形形色色、比比皆是、五花八门', ['不计其数', '不胜枚举', '形形色色', '比比皆是', '五花八门']],
      ['老生常谈、陈词滥调', ['老生常谈', '陈词滥调']],
      ['淋漓尽致、酣畅淋漓、入木三分', ['淋漓尽致', '酣畅淋漓', '入木三分']],
      ['一清二楚、一目了然、一览无遗、一览无余', ['一清二楚', '一目了然', '一览无遗', '一览无余']],
    ],
  },
  42: {
    date: '2026-08-06', answers: 'BBDCCBAABABABAAAA', quizGroups: [4, 8, 12, 17],
    groups: [
      { name: '蔓延、漫延、泛滥、扩散、滋生、延伸', type: 'words', terms: ['蔓延', '漫延', '泛滥', '扩散', '滋生', '延伸'] },
      { name: '植入、嵌入、融入', type: 'words', terms: ['植入', '嵌入', '融入'] },
      { name: '裹挟、夹杂、挟持', type: 'words', terms: ['裹挟', '夹杂', '挟持'] },
      { name: '细枝末节、蛛丝马迹、风吹草动、一鳞半爪、细致入微', type: 'idioms', terms: ['细枝末节', '蛛丝马迹', '风吹草动', '一鳞半爪', '细致入微'] },
      { name: '千帆竞发、龙争虎斗、后来居上、百家争鸣', type: 'idioms', terms: ['千帆竞发', '龙争虎斗', '后来居上', '百家争鸣'] },
    ],
  },
  43: {
    date: '2026-08-10', answers: 'CBBCCABCCAACCBCB', quizGroups: [4, 8, 12, 16],
    groups: [
      { name: '审视、审察、审查、检视、核查', type: 'words', terms: ['审视', '审察', '审查', '检视', '核查'] },
      { name: '规范、规划、校正、校准、扭转、逆转', type: 'words', terms: ['规范', '规划', '校正', '校准', '扭转', '逆转'] },
      { name: '卷帙浩繁、博大精深、长盛不衰、奔流不息、波涛汹涌、气势磅礴', type: 'idioms', terms: ['卷帙浩繁', '博大精深', '长盛不衰', '奔流不息', '波涛汹涌', '气势磅礴'] },
      { name: '与生俱来、天赋异禀、得天独厚、出类拔萃、卓尔不群', type: 'idioms', terms: ['与生俱来', '天赋异禀', '得天独厚', '出类拔萃', '卓尔不群'] },
    ],
  },
  44: {
    date: '2026-08-11', answers: 'CCBABABABDBDDDDDAB', quizGroups: [5, 9, 12, 15, 18],
    groups: [
      ['分道扬镳、各行其是、针锋相对、格格不入、水火不容', ['分道扬镳', '各行其是', '针锋相对', '格格不入', '水火不容']],
      ['秣马厉兵、枕戈待旦、金戈铁马、披坚执锐、背水一战', ['秣马厉兵', '枕戈待旦', '金戈铁马', '披坚执锐', '背水一战']],
      ['前功尽弃、功亏一篑、半途而废、虎头蛇尾、功败垂成', ['前功尽弃', '功亏一篑', '半途而废', '虎头蛇尾', '功败垂成']],
      ['危在旦夕、危如累卵、岌岌可危、危若朝露、危机四伏', ['危在旦夕', '危如累卵', '岌岌可危', '危若朝露', '危机四伏']],
      ['无孔不入、无处不在、铺天盖地', ['无孔不入', '无处不在', '铺天盖地']],
    ],
  },
  45: {
    date: '2026-08-12', answers: 'BBBBDCBDABDDBDDCB', quizGroups: [5, 10, 17], type: 'words',
    groups: [
      ['风靡、遍及、享誉、席卷、融通', ['风靡', '遍及', '享誉', '席卷', '融通']],
      ['快车道、通行证、万金油、敲门砖、硬通货、试金石、晴雨表、定盘星、助推器、总开关', ['快车道', '通行证', '万金油', '敲门砖', '硬通货', '试金石', '晴雨表', '定盘星', '助推器', '总开关']],
      ['复兴、恢复、回归、回望、还原', ['复兴', '恢复', '回归', '回望', '还原']],
    ],
  },
  46: {
    date: '2026-08-14', answers: 'ACBBACAABCBBDAAA', quizGroups: [4, 8, 12, 16],
    groups: [
      ['小题大做、捕风捉影、患得患失、谈虎色变、噤若寒蝉', ['小题大做', '捕风捉影', '患得患失', '谈虎色变', '噤若寒蝉']],
      ['听之任之、却之不恭、视而不见、含糊其辞、不闻不问', ['听之任之', '却之不恭', '视而不见', '含糊其辞', '不闻不问']],
      ['原汁原味、原封不动、一板一眼、照本宣科、如法炮制', ['原汁原味', '原封不动', '一板一眼', '照本宣科', '如法炮制']],
      ['约定俗成、天经地义、心照不宣、众所周知、郑重其事', ['约定俗成', '天经地义', '心照不宣', '众所周知', '郑重其事']],
    ],
  },
  47: {
    date: '2026-08-18', answers: 'ABAAADABABCCCCDACBB', quizGroups: [5, 10, 15, 19],
    groups: [
      { name: '情有独钟、津津乐道、念念不忘、趋之若鹜、不屑一顾、退避三舍', type: 'idioms', terms: ['情有独钟', '津津乐道', '念念不忘', '趋之若鹜', '不屑一顾', '退避三舍'] },
      { name: '先发制人、攻其不备、出奇制胜、以逸待劳、守株待兔、坐享其成', type: 'idioms', terms: ['先发制人', '攻其不备', '出奇制胜', '以逸待劳', '守株待兔', '坐享其成'] },
      { name: '隐蔽性、复杂性、滞后性、周期性、阶段性', type: 'words', terms: ['隐蔽性', '复杂性', '滞后性', '周期性', '阶段性'] },
      { name: '范式、范本、蓝图、蓝本、写照', type: 'words', terms: ['范式', '范本', '蓝图', '蓝本', '写照'] },
    ],
  },
  48: {
    date: '2026-08-19', answers: 'AACCCBCDBADDADCCDBB', quizGroups: [5, 10, 15, 19], preferLastQuestion: true,
    groups: [
      { name: '强强联合、抱团取暖、守望相助、互通有无、齐心协力', type: 'idioms', terms: ['强强联合', '抱团取暖', '守望相助', '互通有无', '齐心协力'] },
      { name: '遥遥领先、不可替代、独具一格、独具匠心、黯然失色', type: 'idioms', terms: ['遥遥领先', '不可替代', '独具一格', '独具匠心', '黯然失色'] },
      { name: '载体、标杆、源头、抓手', type: 'words', terms: ['载体', '标杆', '源头', '抓手'] },
      { name: '生命力、亲和力、吸引力、影响力', type: 'words', terms: ['生命力', '亲和力', '吸引力', '影响力'] },
    ],
  },
  49: {
    date: '2026-08-21', answers: 'CACBCCDDBCBACAB', quizGroups: [4, 7, 9, 12, 15],
    groups: [
      ['水涨船高、居高不下、节节攀升、日甚一日', ['水涨船高', '居高不下', '节节攀升', '日甚一日']],
      ['画龙点睛、神来之笔、脱胎换骨、点石成金', ['画龙点睛', '神来之笔', '脱胎换骨', '点石成金']],
      ['跃跃欲试、摩拳擦掌、蠢蠢欲动、闻风而动', ['跃跃欲试', '摩拳擦掌', '蠢蠢欲动', '闻风而动']],
      ['退无可退、山穷水尽、不进则退、知难而退', ['退无可退', '山穷水尽', '不进则退', '知难而退']],
      ['林林总总、方方面面、点点滴滴、零零碎碎', ['林林总总', '方方面面', '点点滴滴', '零零碎碎']],
    ],
  },
  50: {
    date: '2026-08-29', answers: 'BCCBDCCDAAAABCCCBB', quizGroups: [5, 8, 11, 14, 18],
    groups: [
      ['恣意妄为、放任自流、天马行空、向壁虚造', ['恣意妄为', '放任自流', '天马行空', '向壁虚造']],
      ['畅通无阻、环环相扣、严丝合缝', ['畅通无阻', '环环相扣', '严丝合缝']],
      ['镜花水月、水中捞月、雾里看花、海市蜃楼', ['镜花水月', '水中捞月', '雾里看花', '海市蜃楼']],
      ['江河日下、每况愈下、日渐式微、日薄西山', ['江河日下', '每况愈下', '日渐式微', '日薄西山']],
      ['东山再起、沉渣泛起、卷土重来、死灰复燃、凤凰涅槃、浴火重生', ['东山再起', '沉渣泛起', '卷土重来', '死灰复燃', '凤凰涅槃', '浴火重生']],
    ],
  },
};

function clean(value) {
  return value
    .replace(/\f/g, '\n')
    .replace(/\n\s*\d{1,2}\s*\n/g, '\n')
    .replace(/\s*\n\s*/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim()
    .replace(/^[:：]\s*/, '')
    .replace(/([。；：])\d{1,2}$/, '$1')
    .replace(/(?<=[\u4e00-\u9fff。；：])\d{1,2}$/u, '');
}

function cleanDetail(value) {
  return clean(value).replace(/^(?:【)?(?:侧重点|侧重|语境|用法注意|考试重点|感情色彩)[】：:]?/, '');
}

function fallbackMeaning(text, name) {
  return clean(text.match(new RegExp(`${name}[\\s\\S]{0,500}?(?:释义|语义|【语义】)[：:]?([\\s\\S]{1,240})`))?.[1] || '')
    .split(/(?=\n\s*(?:侧重点|侧重|用法注意|考试重点|语境|官媒例句|例句|感情色彩|【注意】))/)[0].trim();
}

const MEANING_OVERRIDES = {
  43: {
    审视: '仔细深入地分析察看，侧重用理性眼光评判、考量。', 审察: '仔细观察、考查，带有侦查、探究真相的意味。',
    审查: '检查核对是否正确、妥当，多指上级或官方进行把关。', 检视: '对照检查并查看，常用于具体工作、流程或实物。',
    核查: '核对审查数据、账目或事实是否正确。', 规范: '符合规定的标准；也指使事物合乎规定的标准。',
    规划: '对较长时期的目标、任务和实施步骤作出全面安排。', 校正: '校对并改正错误。',
    校准: '校验并调整，使达到准确状态。', 扭转: '纠正或改变事物的发展方向、局面。', 逆转: '形势或情况向相反方向转化。',
    卷帙浩繁: '形容书籍很多或一部书的篇幅很长。', 博大精深: '形容思想、学识等广博高深。',
    长盛不衰: '长久兴盛而不衰败。', 奔流不息: '水流奔腾流淌，永不停止。',
    波涛汹涌: '形容波浪又大又急。', 气势磅礴: '形容气势雄伟浩大。',
    与生俱来: '一出生就具有的。', 天赋异禀: '天生具有异于常人的才华或特质。',
    得天独厚: '具备的条件特别优越，所处环境特别好。', 出类拔萃: '形容品德、才能等超出同类之上。',
    卓尔不群: '才德超出寻常，与众不同。',
  },
  47: {
    隐蔽性: '隐藏较深、不容易被察觉的性质。', 复杂性: '因素众多、关系交织而难以厘清的性质。',
    滞后性: '反应或变化落后于相关事物的性质。', 周期性: '按照一定节奏循环往复的性质。',
    阶段性: '发展过程分成不同阶段且各有特征的性质。', 范式: '可以作为典范的形式或样式；模式。',
    范本: '可以作为模范的样本。', 蓝图: '对未来的宏伟设想或建设规划。',
    蓝本: '著作或设计所依据的底本。', 写照: '对真实情况的描写或刻画。',
  },
  37: {
    '不易之论': '至精至当，不可改易的言论；指论断或意见完全正确。',
    '门可罗雀': '形容门庭冷落，宾客稀少。',
    '昭示': '明白地告诉、明显地显示。',
    '告知': '告诉使知道。',
    '传递': '由一方传给另一方。',
    '传播': '广泛散布。',
  },
  39: { 凸显: '突出地显露。', 突显: '突出地显现。' },
  48: {
    载体: '承载其他事物的实体；比喻承载内容的平台或媒介等。', 标杆: '测量用的标竿；比喻学习的榜样或标准。',
    源头: '水发源的地方；比喻事物的起点。', 抓手: '做事着力的切入点或可供把握的事物。',
    生命力: '维持生存、发展和延续的能力。', 亲和力: '使人愿意亲近、接纳的力量。',
    吸引力: '吸引人注意或使人向往的力量。', 影响力: '对他人或社会产生作用、改变的力量。',
  },
  40: {
    '拔苗助长': '比喻违反事物发展规律，急于求成，反而坏事。',
    '得不偿失': '所得的利益抵偿不了所受的损失。',
    '因小失大': '为了小的利益而造成大的损失。',
    '花拳绣腿': '比喻只做些表面好看而没有实际用途的工作。',
    '蜂拥而至': '像一窝蜂似的拥来。',
    '争先恐后': '争着向前，唯恐落后。',
    '趋之若鹜': '像鸭子一样成群跑去，比喻许多人争着去追逐某些不好的事物。',
  },
  41: {
    '相得益彰': '两者互相配合，双方的长处和优势更能显现。',
    '休戚与共': '彼此利害、祸福相关，共同承担。',
    '同舟共济': '比喻团结协作、共渡难关。',
    '一览无遗': '一眼看清全部，毫无遗漏。',
    '一览无余': '一眼看到全部，没有一点剩余或遮挡。',
  },
};

function normalizeMeaning(value, name) {
  return value
    .replace(/(?:侧重点：|侧重】|【例句】|例句：|【注意】|【感情色彩】|【搭配】|【常见搭配】|常见搭配[：:]|核心侧重[：:]|搭配对象[：:]|主体特征[：:]|核心目的[：:]|功能[：:]|作用[：:]|用法[：:])[\s\S]*$/, '')
    .replace(/（(?:人民网|新华网|光明网|人民日报|经济日报|央视新闻|求是网|环球时报|\d{4})[^）]*）[\s\S]*$/, '')
    .trim() || value;
}

function labeledSection(block, labels) {
  const labelPattern = labels.map(label => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const section = clean(block.match(new RegExp(`【(?:${labelPattern})】\\s*([\\s\\S]*?)(?=【[^】]+】|$)`))?.[1] || '');
  return clean(section.split('一句话总结')[0]);
}

function splitExamples(value) {
  if (!value) return [];
  return value
    .split(/(?=(?:\(?[一二三四五六七八九十\d]+[）.)]|人民网|新华网|光明网|人民日报|经济日报|央视新闻|求是网|环球时报))/)
    .map(clean)
    .filter(example => example && example.length > 8)
    .map(text => text.replace(/^例句[：:]?/, ''));
}

function extractStaticDetails(text, name, nextNames) {
  const heading = new RegExp(`\\n\\f?[ \\t]+(?:[一二三四五六七八九十]+、)?[（(]?${name}[）)]?[ \\t]*\\n`);
  const startMatch = heading.exec(text) || new RegExp(`\\n\\f?[ \\t]+[^\\n]*${name}[^\\n]*\\n`).exec(text);
  if (!startMatch) return { notes: '', examples: [] };
  const start = startMatch.index;
  const end = Math.min(...nextNames.map(nextName => {
    const match = new RegExp(`\\n\\f?[ \\t]+(?:[一二三四五六七八九十]+、)?[（(]?${nextName}[）)]?[ \\t]*\\n`).exec(text.slice(start + 1));
    return match ? start + 1 + match.index : Number.POSITIVE_INFINITY;
  }));
  const block = text.slice(start, end);
  return {
    notes: labeledSection(block, ['注意', '侧重点', '语境', '用法注意', '搭配', '常见搭配']),
    examples: splitExamples(labeledSection(block, ['例句'])),
  };
}

function extractTerm(text, name, nextNames) {
  const heading = new RegExp(`\\n\\f?[ \\t]+(?:[一二三四五六七八九十]+、)?[（(]?${name}[）)]?[ \\t]*\\n`);
  const startMatch = heading.exec(text) || new RegExp(`\\n\\f?[ \\t]+[^\\n]*${name}[^\\n]*\\n`).exec(text);
  if (!startMatch) throw new Error(`Cannot find term heading: ${name}`);
  const start = startMatch.index;
  const possibleEnds = nextNames
    .map(nextName => {
      const match = new RegExp(`\\n\\f?[ \\t]+(?:[一二三四五六七八九十]+、)?[（(]?${nextName}[）)]?[ \\t]*\\n`).exec(text.slice(start + 1));
      return match ? start + 1 + match.index : Number.POSITIVE_INFINITY;
    });
  const questionStart = /\n\s*\d+[.．]\s*[（(]\d{4}/.exec(text.slice(start + 1));
  if (questionStart) possibleEnds.push(start + 1 + questionStart.index);
  const block = text.slice(start, Math.min(...possibleEnds));
  const meaning = MEANING_OVERRIDES[day]?.[name] || normalizeMeaning(clean(block.match(/(?:释义|语义|【语义】)[：:]?([\s\S]*?)(?=\n\s*(?:侧重点|侧重|用法注意|考试重点|语境|官媒例句|例句|感情色彩|搭配对象|主体特征|核心目的|功能|作用|用法|【侧重】|【语境】|【例句】|【常见搭配】|【搭配】|【注意】))/)?.[1] || '') || fallbackMeaning(text, name), name);
  const focus = cleanDetail(block.match(/(?:侧重点|侧重|搭配对象|主体特征|核心目的|功能|作用|语境)：([\s\S]*?)(?=\n\s*(?:用法注意|考试重点|官媒例句|例句|用法|语境|感情色彩|【注意】))/)?.[1] || '');
  const inlineUsage = cleanDetail(block.slice(
    block.search(/(?:侧重点|侧重|搭配对象|主体特征|核心目的|功能|作用|用法注意|考试重点|语境|感情色彩)[：:]?/),
    block.search(/\n\s*(?:官媒例句|例句)/)
  ));
  const noteText = labeledSection(block, ['注意', '侧重点', '语境', '用法注意', '搭配', '常见搭配']);
  const rawLectureNote = clean(block.match(/【注意】\s*([\s\S]*?)(?=【[^】]+】|$)/)?.[1] || '');
  const inlineExamples = block.match(/\n\s*(?:官媒例句|用法)[：:]?\s*([\s\S]*?)(?=\n\s*【注意】)/)?.[1] || '';
  const examplesText = labeledSection(block, ['例句'])
    || inlineExamples
    || '';
  const examples = (inlineExamples ? [clean(inlineExamples)] : splitExamples(examplesText))
    .flatMap(example => example.split(/(?=(?:人民网|新华网|光明网|人民日报|经济日报|央视新闻|求是网|环球时报|中国纪检监察报)[：:])/))
    .map(clean)
    .filter(value => value && !/^\d{1,2}$/.test(value));

  if (!meaning) throw new Error(`Cannot extract meaning for ${name}`);
  return {
    id: `day-${day}-${name}`,
    name,
    meaning,
    usage: [focus, noteText || rawLectureNote || inlineUsage].filter(Boolean).join(' ') || meaning,
    collocations: [],
    examples,
    oneLineSummary: focus || meaning,
  };
}

function extractWord(text, name, nextNames) {
  const heading = new RegExp(`\\n\\f?[ \\t]+(?:[一二三四五六七八九十]+、)?[（(]?${name}[）)]?[ \\t]*\\n`);
  const startMatch = heading.exec(text) || new RegExp(`\\n\\f?[ \\t]+[^\\n]*${name}[^\\n]*\\n`).exec(text);
  if (!startMatch) throw new Error(`Cannot find word heading: ${name}`);
  const start = startMatch.index;
  const possibleEnds = nextNames.map(nextName => {
    const match = new RegExp(`\\n\\f?[ \\t]+(?:[一二三四五六七八九十]+、)?[（(]?${nextName}[）)]?[ \\t]*\\n`).exec(text.slice(start + 1));
    return match ? start + 1 + match.index : Number.POSITIVE_INFINITY;
  });
  const questionStart = /\n\s*\d+[.．]\s*[（(]\d{4}/.exec(text.slice(start + 1));
  if (questionStart) possibleEnds.push(start + 1 + questionStart.index);
  const block = text.slice(start, Math.min(...possibleEnds));
  const meaning = MEANING_OVERRIDES[day]?.[name] || normalizeMeaning(clean(block.match(/(?:释义|语义|【语义】)[：:]?([\s\S]*?)(?=\n\s*(?:侧重点|侧重|用法注意|例句|语境|感情色彩|搭配对象|主体特征|核心目的|功能|作用|用法|【侧重】|【语境】|【例句】|【常见搭配】|【搭配】|【注意】))/)?.[1] || '') || fallbackMeaning(text, name), name);
  const focus = cleanDetail(block.match(/(?:侧重点|侧重|搭配对象|主体特征|核心目的|功能|作用|语境)：([\s\S]*?)(?=\n\s*(?:用法注意|例句|用法|语境|感情色彩|【注意】))/)?.[1] || '');
  const usageContext = cleanDetail(block.match(/(?:侧重点|侧重|用法注意|语境|感情色彩)[：:]?([\s\S]*?)(?=\n\s*(?:例句|【注意】))/)?.[0] || '');
  const noteText = labeledSection(block, ['注意', '侧重点', '语境', '用法注意', '搭配', '常见搭配']);
  const examples = splitExamples(labeledSection(block, ['例句']));
  if (!meaning) throw new Error(`Cannot extract meaning for word ${name}`);
  return {
    id: `day-${day}-${name}`,
    name,
    meaning,
    usageContext: [focus, noteText || usageContext].filter(Boolean).join(' ') || meaning,
    examples: examples.map(text => ({ text })),
    analysisAngles: focus ? [{ dimension: '语境侧重', description: focus }] : [],
    synonyms: [],
    oneLineSummary: focus || meaning,
  };
}

function extractQuizzes(text, config) {
  const { answers } = config;
  const quizCount = answers.length;
  const starts = [...text.matchAll(/(?:^|\n)\s*(\d+)[.．]?\s*[（(](\d{4})\s*([^）)]*)[）)]/g)]
    .filter(match => Number(match[1]) >= 1 && Number(match[1]) <= quizCount);
  const firstByNumber = new Map();
  for (const match of starts) {
    const number = Number(match[1]);
    if (!firstByNumber.has(number) || config.preferLastQuestion) firstByNumber.set(number, match);
  }
  // Some note PDFs omit the year/region prefix. Recover those questions from
  // the numbered analysis markers and the nearest preceding question number.
  if (firstByNumber.size < quizCount) {
    for (let number = 1; number <= quizCount; number += 1) {
      const analysis = new RegExp(`【解析】\\s*${number}[.．]?`).exec(text);
      if (!analysis) continue;
      const prefix = text.slice(0, analysis.index);
      const matches = [...prefix.matchAll(new RegExp(`(?:^|\\n)\\s*${number}[.．]\\s*`, 'g'))];
      const match = matches.at(-1);
      if (match) {
        firstByNumber.set(number, {
          index: match.index,
          0: match[0],
          1: String(number),
          2: '',
          3: '',
        });
      }
    }
  }

  return Array.from({ length: quizCount }, (_, index) => {
    const number = index + 1;
    const match = firstByNumber.get(number);
    if (!match) throw new Error(`Cannot find question ${number}`);
    const start = match.index + (match[0].startsWith('\n') ? 1 : 0);
    const analysisMarker = new RegExp(`【解析】\\s*${number}[.．]?`).exec(text.slice(start));
    if (!analysisMarker) throw new Error(`Cannot find analysis ${number}`);
    const analysisStart = start + analysisMarker.index;
    const questionBlock = text.slice(start, analysisStart);
    const optionMatches = [...questionBlock.matchAll(/(?:^|\s)([A-D])(?:[.．、]\s*|\s{1,})/g)];
    if (optionMatches.length !== 4 || optionMatches.map(item => item[1]).join('') !== 'ABCD') {
      throw new Error(`Question ${number} does not contain exactly A-D options`);
    }
    const options = optionMatches.map((option, optionIndex) => {
      const valueStart = option.index + option[0].length;
      const valueEnd = optionMatches[optionIndex + 1]?.index ?? questionBlock.length;
      return { label: option[1], text: clean(questionBlock.slice(valueStart, valueEnd)) };
    });
    const questionEnd = optionMatches[0].index;
    const question = clean(questionBlock.slice(0, questionEnd)
      .replace(/^\s*\d+[.．]\s*/, ''));
    const rawA = questionBlock.slice(
      optionMatches[0].index + optionMatches[0][0].length,
      optionMatches[1].index
    );
    const blankCount = Math.max(1, rawA.trim().split(/[ \t]{2,}/).filter(Boolean).length);
    const afterAnalysis = text.slice(analysisStart);
    const selection = new RegExp(`【\\s*选\\s*${answers[index]}】`).exec(afterAnalysis);
    if (!selection) throw new Error(`Answer marker mismatch for question ${number}`);
    const analysisEnd = analysisStart + selection.index + selection[0].length;
    const analysis = clean(text.slice(analysisStart, analysisEnd)
      .replace(new RegExp(`^【解析】\\s*${number}[.．]?`), ''));

    return {
      id: number,
      year: match[2],
      region: match[3].trim(),
      groupId: `day-${day}-group-${config.quizGroups
        ? config.quizGroups.findIndex(lastQuestion => number <= lastQuestion) + 1
        : Math.ceil(number / 4)}`,
      question,
      blankCount,
      options,
      answer: answers[index],
      analysis: { blank1: analysis },
      tips: [],
    };
  });
}

function main() {
  const config = CONFIG[day];
  if (!sourcePdf || !config) {
    console.error('Usage: node scripts/import-annotated-note-pdf.js <pdf-path> <day-number> [--overwrite]');
    process.exit(1);
  }
  const dataPath = path.join(ROOT, 'client', 'src', 'data', `day-${day}.json`);
  const targetPdf = path.join(ROOT, 'client', 'public', 'pdfs', `day${day}.pdf`);
  if (!overwrite && (fs.existsSync(dataPath) || fs.existsSync(targetPdf))) {
    throw new Error(`day-${day} already exists; refusing to overwrite`);
  }
  const buffer = fs.readFileSync(sourcePdf);
  if (buffer.subarray(0, 5).toString() !== '%PDF-') throw new Error('Input is not a valid PDF');
  const text = execFileSync('pdftotext', ['-layout', sourcePdf, '-'], { encoding: 'utf8' })
    .replace(/\r/g, '');
  const isStatic = !Array.isArray(config.groups[0]) && Boolean(config.groups[0].entries);
  const isStructured = !Array.isArray(config.groups[0]) && Boolean(config.groups[0].terms);
  const allTerms = isStatic
    ? config.groups.flatMap(group => group.entries.map(([name]) => name))
    : isStructured
      ? config.groups.flatMap(group => group.terms)
      : config.groups.flatMap(([, terms]) => terms);
  const groups = isStatic
    ? config.groups.map((group, groupIndex) => ({
      id: `day-${day}-group-${groupIndex + 1}`,
      name: group.name,
      summary: `辨析${group.name}，重点掌握词义侧重和适用语境。`,
      [group.type]: group.entries.map(([name, meaning]) => {
        const details = config.enrichStatic
          ? extractStaticDetails(text, name, allTerms.filter(item => item !== name))
          : { notes: '', examples: [] };
        return group.type === 'words'
          ? {
            id: `day-${day}-${name}`, name, meaning, usageContext: details.notes || meaning,
            examples: details.examples.map(text => ({ text })), analysisAngles: [], synonyms: [],
            oneLineSummary: meaning,
          }
          : {
            id: `day-${day}-${name}`, name, meaning, usage: details.notes || meaning,
            collocations: [], examples: details.examples, oneLineSummary: meaning,
          };
      }),
    }))
    : isStructured
      ? config.groups.map((group, groupIndex) => ({
        id: `day-${day}-group-${groupIndex + 1}`,
        name: group.name,
        summary: `辨析${group.name}，重点掌握词义侧重和适用语境。`,
        [group.type]: group.terms.map(term => group.type === 'words'
          ? extractWord(text, term, allTerms.filter(item => item !== term))
          : extractTerm(text, term, allTerms.filter(item => item !== term))),
      }))
      : config.groups.map(([name, terms], groupIndex) => ({
      id: `day-${day}-group-${groupIndex + 1}`,
      name,
      summary: `辨析${name}，重点掌握词义侧重和适用语境。`,
      [config.type || 'idioms']: terms.map(term => config.type === 'words'
        ? extractWord(text, term, allTerms.filter(item => item !== term))
        : extractTerm(text, term, allTerms.filter(item => item !== term))),
    }));
  const quizzes = extractQuizzes(text, config);
  const data = {
    id: `day-${day}`,
    label: `第${day}天`,
    date: config.date,
    summary: `词语辨析：共${allTerms.length}个词条，${quizzes.length}道练习题。`,
    groups,
    quizzes,
  };

  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.mkdirSync(path.dirname(targetPdf), { recursive: true });
  fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
  fs.copyFileSync(sourcePdf, targetPdf);
  console.log(`day-${day}: ${allTerms.length} entries and ${quizzes.length} quizzes imported`);
}

try {
  main();
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}
