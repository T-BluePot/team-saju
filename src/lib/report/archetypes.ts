import type { Element } from '../saju/types'

/**
 * 팀 유형. 주도 오행과 결핍 오행 조합으로 20개, 균형형 1개.
 * 문서 07-team-report.md
 *
 * 카피 규칙은 .claude/skills/report-voice/SKILL.md 를 따른다.
 * 사각지대는 반드시 처방과 짝을 이룬다. 지적만 하고 끝나는 문장은 쓰지 않는다.
 */
export type Archetype = {
  id: string
  dominant: Element | null
  lacking: Element | null
  name: string
  tagline: string
  strengths: [string, string]
  blindSpots: [string, string]
  prescriptions: [string, string]
  needsPerson: string
}

export const ARCHETYPES: Archetype[] = [
  {
    id: 'wood-no-fire',
    dominant: '木',
    lacking: '火',
    name: '설계도만 쌓이는 팀',
    tagline: '아이디어는 많은데 불붙일 사람이 없다',
    strengths: [
      '아이디어가 마르지 않는다. 회의마다 새 안이 나온다',
      '남이 안 보는 각도를 잘 찾아낸다',
    ],
    blindSpots: [
      '시작은 많은데 끝까지 밀어붙이는 사람이 없다',
      '좋은 안이 문서에만 남고 밖으로 안 나간다',
    ],
    prescriptions: [
      '아이디어 회의를 끝낼 때 이번 주에 누가 뭘 만들어볼지 한 줄을 반드시 정하세요',
      '완성 말고 데모를 목표로 잡아보세요. 어설퍼도 눈앞에 보이면 불이 붙습니다',
    ],
    needsPerson: '말 나온 김에 바로 만들어 오는 사람',
  },
  {
    id: 'wood-no-earth',
    dominant: '木',
    lacking: '土',
    name: '뿌리 없이 자라는 팀',
    tagline: '확장은 빠른데 받쳐줄 기반이 얇다',
    strengths: [
      '확장이 빠르다. 기회가 보이면 바로 붙는다',
      '새 영역에 겁이 없다',
    ],
    blindSpots: [
      '벌린 일을 받쳐줄 기반이 얇아서 하나 흔들리면 같이 흔들린다',
      '반복되는 일을 자꾸 처음부터 다시 한다',
    ],
    prescriptions: [
      '두 번 이상 한 일은 그날 바로 문서로 남기세요. 완벽한 문서 말고 열 줄이면 됩니다',
      '새로 벌리기 전에 지금 굴러가는 것 하나를 안정화하는 주를 끼워 넣으세요',
    ],
    needsPerson: '티 안 나게 뒷정리를 해두는 사람',
  },
  {
    id: 'wood-no-metal',
    dominant: '木',
    lacking: '金',
    name: '마감이 없는 팀',
    tagline: '계속 벌리기만 하고 자르질 못한다',
    strengths: [
      '하고 싶은 게 많고 실제로 다 해본다',
      '새 제안에 열려 있어서 아무도 말을 삼키지 않는다',
    ],
    blindSpots: [
      '시작한 게 계속 쌓여서 뭐가 진행 중인지 아무도 모른다',
      '우선순위를 정하는 자리에서 결국 다 하기로 한다',
    ],
    prescriptions: [
      '스프린트마다 이번에 접을 것 한 줄을 정하고 시작하세요. 새로 시작하는 것보다 이게 먼저입니다',
      '진행 중인 일 개수에 상한을 두세요. 넘으면 새로 못 시작합니다',
    ],
    needsPerson: '그거 지금 꼭 해야 하냐고 웃으면서 묻는 사람',
  },
  {
    id: 'wood-no-water',
    dominant: '木',
    lacking: '水',
    name: '물음표가 없는 팀',
    tagline: '잘 밀고 나가는데 왜 하는지 안 묻는다',
    strengths: [
      '일단 굴러간다. 결정하고 실행하는 속도가 빠르다',
      '서로 신뢰가 있어서 소모적인 논쟁이 없다',
    ],
    blindSpots: [
      '왜 하는지 다시 묻는 사람이 없어서 방향이 틀려도 오래 간다',
      '팀 밖에서 온 신호를 늦게 알아챈다',
    ],
    prescriptions: [
      '격주로 한 번, 지금 하는 일 중 하나를 골라 이거 안 하면 무슨 일이 생기는지만 물어보세요',
      '팀 밖 사람 한 명에게 한 달에 한 번 진행 상황을 설명해보세요. 설명하다 보면 구멍이 보입니다',
    ],
    needsPerson: '회의 끝에 근데 이게 왜 필요하냐고 던지는 사람',
  },
  {
    id: 'fire-no-wood',
    dominant: '火',
    lacking: '木',
    name: '연료가 떨어지는 팀',
    tagline: '화력은 센데 다음 소재가 없다',
    strengths: [
      '붙으면 화력이 세다. 마감 직전에 특히 강하다',
      '분위기를 끌어올리는 힘이 있다',
    ],
    blindSpots: [
      '지금 일이 끝나면 다음에 뭘 할지가 비어 있다',
      '같은 방식으로만 태워서 사람이 먼저 지친다',
    ],
    prescriptions: [
      '스프린트 끝날 때마다 다음 후보 세 개를 미리 적어두세요. 고르는 건 나중에 해도 됩니다',
      '한 달에 한 번은 일 얘기 말고 관심사 얘기를 하는 자리를 만드세요. 소재는 거기서 나옵니다',
    ],
    needsPerson: '엉뚱한 걸 자꾸 들고 오는 사람',
  },
  {
    id: 'fire-no-earth',
    dominant: '火',
    lacking: '土',
    name: '다 태우고 남는 게 없는 팀',
    tagline: '뜨겁게 하는데 축적이 안 된다',
    strengths: ['속도가 빠르고 몰입도가 높다', '위기 상황에서 오히려 뭉친다'],
    blindSpots: [
      '끝나고 나면 배운 게 사람 머릿속에만 남는다',
      '같은 실수를 다른 프로젝트에서 반복한다',
    ],
    prescriptions: [
      '끝난 일마다 열 줄짜리 회고를 남기세요. 잘한 것 세 줄, 다시 안 할 것 세 줄이면 충분합니다',
      '반복되는 작업 하나를 골라 이번 달에 템플릿으로 만들어두세요',
    ],
    needsPerson: '지나간 일을 정리해서 다음 사람이 쓸 수 있게 만드는 사람',
  },
  {
    id: 'fire-no-metal',
    dominant: '火',
    lacking: '金',
    name: '브레이크 없는 팀',
    tagline: '속도는 최고, 멈출 기준이 없다',
    strengths: [
      '결정이 빠르다. 회의가 길어지는 일이 거의 없다',
      '일단 해보고 고치는 데 거부감이 없다',
    ],
    blindSpots: [
      '시작한 일을 접는 기준이 없어서 벌려둔 게 쌓인다',
      '급하게 넘어가서 나중에 되돌아오는 비용이 생긴다',
    ],
    prescriptions: [
      '스프린트마다 이번에 접을 것 한 줄을 정하고 시작하세요',
      '머지 전에 체크리스트 한 장만 두세요. 사람이 아니라 문서가 브레이크를 잡게',
    ],
    needsPerson: '그래서 언제까지냐고 자연스럽게 물어보는 사람',
  },
  {
    id: 'fire-no-water',
    dominant: '火',
    lacking: '水',
    name: '식힐 사람이 없는 팀',
    tagline: '뜨겁게 붙고 뜨겁게 싸운다',
    strengths: [
      '서로 솔직하다. 할 말을 삼키지 않는다',
      '에너지가 높아서 일이 빨리 붙는다',
    ],
    blindSpots: [
      '논의가 뜨거워지면 사안이 아니라 사람으로 옮겨간다',
      '결정한 뒤에 감정이 남는다',
    ],
    prescriptions: [
      '의견이 갈리면 그 자리에서 결론내지 말고 하루 두고 다시 보세요. 회의록에 내일 결정이라고 적어두면 됩니다',
      '회의에 진행자를 한 명 정하고, 그 사람은 의견을 내지 않게 하세요',
    ],
    needsPerson: '온도를 낮추고 정리해주는 사람',
  },
  {
    id: 'earth-no-wood',
    dominant: '土',
    lacking: '木',
    name: '새싹이 안 나는 팀',
    tagline: '단단한데 새 시도가 없다',
    strengths: [
      '하기로 한 건 반드시 굴러간다',
      '사람이 잘 안 나가고 서로 오래 안다',
    ],
    blindSpots: [
      '새 방식을 제안해도 지금도 되는데로 끝난다',
      '밖에서 뭐가 바뀌는지 늦게 안다',
    ],
    prescriptions: [
      '분기에 한 번 지금 방식 중 하나를 바꿔본다를 정식 안건으로 올리세요',
      '새 제안은 반대하기 전에 2주짜리 실험으로 한 번 돌려보는 규칙을 만드세요',
    ],
    needsPerson: '자꾸 다른 방법을 들고 오는 사람',
  },
  {
    id: 'earth-no-fire',
    dominant: '土',
    lacking: '火',
    name: '온도가 낮은 팀',
    tagline: '안정적인데 신이 안 난다',
    strengths: [
      '감정 소모가 적고 예측 가능하다',
      '급한 상황에서도 흔들리지 않는다',
    ],
    blindSpots: [
      '잘한 일이 있어도 그냥 지나간다',
      '시작할 때 추진력이 안 붙어서 일정이 뒤로 밀린다',
    ],
    prescriptions: [
      '주간 회의 맨 앞 5분을 지난주에 잘된 것만 말하는 시간으로 쓰세요',
      '새 일은 킥오프를 따로 잡으세요. 30분이면 됩니다. 시작을 사건으로 만드는 게 핵심입니다',
    ],
    needsPerson: '사소한 것도 좋다고 크게 말해주는 사람',
  },
  {
    id: 'earth-no-metal',
    dominant: '土',
    lacking: '金',
    name: '다 품어주는 팀',
    tagline: '사람은 좋은데 쳐내질 못한다',
    strengths: [
      '심리적 안전감이 높다. 실수해도 말할 수 있다',
      '사람이 힘들 때 서로 챙긴다',
    ],
    blindSpots: [
      '안 되는 일을 접자고 말하는 사람이 없다',
      '피드백이 부드러워지다가 요점이 사라진다',
    ],
    prescriptions: [
      '사람 말고 문서가 자르게 하세요. 시작할 때 이 조건이면 접는다를 같이 적어두면 됩니다',
      '리뷰에 체크리스트를 두세요. 사람이 지적하는 게 아니라 항목이 지적하게',
    ],
    needsPerson: '정 없이 기준대로 말해주는 사람',
  },
  {
    id: 'earth-no-water',
    dominant: '土',
    lacking: '水',
    name: '고여 있는 팀',
    tagline: '든든한데 흐름이 없다',
    strengths: [
      '안정적이고 일이 끊기지 않는다',
      '서로 뭘 하는지 다 알고 있다',
    ],
    blindSpots: [
      '정해진 방식 밖의 상황이 오면 대응이 느리다',
      '같은 사람끼리만 얘기해서 사각지대가 겹친다',
    ],
    prescriptions: [
      '두 달에 한 번 팀 밖 사람을 회의에 초대해서 30분만 듣게 하세요',
      '담당을 한 번씩 바꿔보세요. 짧게라도 자리를 바꾸면 안 보이던 게 보입니다',
    ],
    needsPerson: '밖에서 다른 물을 가져오는 사람',
  },
  {
    id: 'metal-no-wood',
    dominant: '金',
    lacking: '木',
    name: '다듬을 게 없는 팀',
    tagline: '기준은 완벽한데 만들 게 없다',
    strengths: [
      '품질 기준이 높고 결과물이 깔끔하다',
      '한번 정한 결정이 잘 흔들리지 않는다',
    ],
    blindSpots: [
      '다듬는 데 시간을 쓰다 보니 새로 만드는 게 줄어든다',
      '완성도 기준 때문에 시작 자체를 미룬다',
    ],
    prescriptions: [
      '한 스프린트를 거칠어도 새로 만드는 주로 정하고 리뷰 기준을 낮추세요',
      '아이디어는 판단하지 말고 모으기만 하는 시간을 따로 두세요. 거르는 건 다음 회의에서',
    ],
    needsPerson: '완성도 신경 안 쓰고 일단 만들어 오는 사람',
  },
  {
    id: 'metal-no-fire',
    dominant: '金',
    lacking: '火',
    name: '차가운 회의실 팀',
    tagline: '정확한데 아무도 안 신난다',
    strengths: [
      '논의가 정확하고 낭비가 없다',
      '결정 근거가 남아서 나중에 되짚기 쉽다',
    ],
    blindSpots: [
      '맞는 말인데 아무도 하고 싶어지지 않는다',
      '잘한 일에 반응이 없어서 동기가 식는다',
    ],
    prescriptions: [
      '결정할 때 왜 이게 좋은지를 한 줄 붙이세요. 근거 말고 기대를 적는 겁니다',
      '배포하거나 끝낸 날은 짧게라도 티를 내세요. 채널에 한 줄이면 됩니다',
    ],
    needsPerson: '신나게 떠들어주는 사람',
  },
  {
    id: 'metal-no-earth',
    dominant: '金',
    lacking: '土',
    name: '날만 서 있는 팀',
    tagline: '예리한데 받쳐줄 바닥이 얇다',
    strengths: [
      '문제를 정확하게 짚어낸다',
      '기준이 분명해서 헷갈릴 일이 없다',
    ],
    blindSpots: [
      '지적은 정확한데 받쳐줄 여유가 없어서 사람이 소진된다',
      '기준을 지킬 기반 작업이 자꾸 뒤로 밀린다',
    ],
    prescriptions: [
      '리뷰에서 문제를 짚으면 누가 언제 도와줄지까지 같이 정하세요',
      '분기에 한 주는 새 기능 없이 정리만 하는 주로 비워두세요',
    ],
    needsPerson: '묵묵히 받쳐주는 사람',
  },
  {
    id: 'metal-no-water',
    dominant: '金',
    lacking: '水',
    name: '규칙이 안 굽는 팀',
    tagline: '원칙은 선명한데 예외를 못 본다',
    strengths: [
      '원칙이 선명해서 판단이 빠르다',
      '누가 해도 결과가 비슷하게 나온다',
    ],
    blindSpots: [
      '규칙에 안 맞는 상황이 오면 그냥 막힌다',
      '예외를 요청하는 사람이 말을 못 꺼낸다',
    ],
    prescriptions: [
      '규칙마다 이럴 땐 예외를 한 줄씩 같이 적어두세요',
      '한 달에 한 번 규칙 중 하나를 골라 지금도 맞는지 다시 보세요',
    ],
    needsPerson: '이 경우는 좀 다르지 않냐고 꺼내는 사람',
  },
  {
    id: 'water-no-wood',
    dominant: '水',
    lacking: '木',
    name: '생각만 흐르는 팀',
    tagline: '통찰은 깊은데 싹이 안 튼다',
    strengths: [
      '상황 파악이 빠르고 맥락을 잘 읽는다',
      '남의 입장을 잘 헤아린다',
    ],
    blindSpots: [
      '분석은 깊은데 만들어진 게 안 나온다',
      '논의가 계속 넓어지면서 착수가 밀린다',
    ],
    prescriptions: [
      '조사를 시작할 때 끝나는 날짜와 산출물을 먼저 정하세요',
      '회의 끝에 반드시 이번 주에 만들 것 하나를 정하고 담당까지 붙이세요',
    ],
    needsPerson: '말 끝나기 전에 손부터 움직이는 사람',
  },
  {
    id: 'water-no-fire',
    dominant: '水',
    lacking: '火',
    name: '미지근한 팀',
    tagline: '다 이해하는데 아무도 안 뛴다',
    strengths: [
      '다들 상황을 이해하고 있어서 설명 비용이 적다',
      '무리하지 않아서 오래 간다',
    ],
    blindSpots: [
      '다 이해하는데 아무도 먼저 움직이지 않는다',
      '급한 일과 안 급한 일의 온도가 같다',
    ],
    prescriptions: [
      '일마다 담당을 한 명으로 좁히세요. 둘이면 아무도 안 합니다',
      '이번 주에 제일 중요한 것 하나만 정해서 눈에 보이는 데 적어두세요',
    ],
    needsPerson: '먼저 뛰어들어서 판을 데우는 사람',
  },
  {
    id: 'water-no-earth',
    dominant: '水',
    lacking: '土',
    name: '흘러가버리는 팀',
    tagline: '유연한데 남는 게 없다',
    strengths: [
      '상황에 맞게 잘 바꾼다. 계획이 틀어져도 흔들리지 않는다',
      '새 정보를 빨리 흡수한다',
    ],
    blindSpots: [
      '방식이 자꾸 바뀌어서 쌓이는 게 없다',
      '무엇을 왜 그렇게 정했는지 기록이 안 남는다',
    ],
    prescriptions: [
      '결정할 때마다 세 줄만 남기세요. 무엇을, 왜, 언제 다시 볼지',
      '한 분기는 같은 방식을 유지해보세요. 바꾸고 싶으면 다음 분기에',
    ],
    needsPerson: '정한 걸 붙잡고 있는 사람',
  },
  {
    id: 'water-no-metal',
    dominant: '水',
    lacking: '金',
    name: '결론이 안 나는 팀',
    tagline: '다 맞는 말인데 정하질 못한다',
    strengths: [
      '모든 의견이 테이블에 올라온다',
      '성급한 결정으로 사고가 나는 일이 거의 없다',
    ],
    blindSpots: [
      '회의가 길어지고 같은 안건이 다음 주에 또 올라온다',
      '결정을 미루는 사이에 선택지가 사라진다',
    ],
    prescriptions: [
      '안건마다 결정권자를 한 명 정해두세요. 합의가 아니라 결정입니다',
      '회의 시작할 때 오늘 안에 정한다를 명시하고, 못 정하면 기본안으로 간다고 미리 합의하세요',
    ],
    needsPerson: '시간 되면 그럼 A로 갑니다라고 끊어주는 사람',
  },
  {
    id: 'balanced',
    dominant: null,
    lacking: null,
    name: '오각형이 꽉 찬 팀',
    tagline: '다 갖춰졌다. 문제는 누가 먼저 움직이냐다',
    strengths: [
      '어떤 상황이 와도 대응할 사람이 있다',
      '한쪽으로 쏠려서 생기는 사고가 적다',
    ],
    blindSpots: [
      '다 있다 보니 누가 먼저 움직일지가 안 정해진다',
      '균형이 좋아서 오히려 아무도 절실하지 않다',
    ],
    prescriptions: [
      '일마다 첫 삽을 뜰 사람을 명시하세요. 다 할 수 있다는 게 아무도 안 한다가 되기 쉽습니다',
      '분기마다 팀이 밀어붙일 방향 하나를 정해서 일부러 한쪽으로 기울여보세요',
    ],
    needsPerson: '이미 다 있습니다. 지금 필요한 건 사람이 아니라 방향이에요',
  },
]

const BY_ID = new Map(ARCHETYPES.map((a) => [a.id, a]))

const FALLBACK = ARCHETYPES[ARCHETYPES.length - 1]

export function getArchetype(id: string): Archetype {
  return BY_ID.get(id) ?? FALLBACK
}
