import { Product } from "./types";

export const PRODUCTS_MOCK_DATA: Product[] = [
  {
    id: "prod-01",
    name: "포레스트 데일리 멀티비타민 RX",
    tagline: "바쁜 현대인을 위한 21가지 에센셜 비타민 & 미네랄 배합",
    category: "종합건강",
    ageGroup: "2040",
    ingredients: ["비타민B군", "비타민C", "아연", "셀레늄"],
    price: 38000,
    subscriptionDiscount: 50, // 정기 구독 시 50% 할인
    rating: 4.9,
    reviewCount: 1420,
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=600",
    features: ["체내 흡수율 극대화 특허 공법", "100% 유기농 야채 유래 원료", "목넘김이 편한 9mm 미니 태블릿"],
    reviews: [
      { id: "r-1", user: "김*우", rating: 5, content: "야근이 잦아 항상 피곤했는데, 이 제품 구독해 먹고 나서 아침에 눈뜨는 게 정말 달라졌어요. 강력 추천합니다!", photo: true },
      { id: "r-2", user: "박*아", rating: 5, content: "정기배송으로 알아서 매달 문 앞에 오니까 신경 안 써도 되고 할인율도 대박이네요.", photo: false },
      { id: "r-5", user: "최*현", rating: 4, content: "종합비타민 특유의 속쓰림이 전혀 없어서 맘에 듭니다. 꾸준히 먹어볼 생각입니다.", photo: true }
    ]
  },
  {
    id: "prod-02",
    name: "메모리 퓨어 알티지 오메가3",
    tagline: "생체 이용률을 극대화한 저온 초임계 추출 순도 80% rTG 오메가",
    category: "혈행/눈",
    ageGroup: "3050",
    ingredients: ["EPA", "DHA", "비타민E"],
    price: 42000,
    subscriptionDiscount: 50,
    rating: 4.8,
    reviewCount: 890,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600",
    features: ["중금속 걱정 없는 남극해 미세조류 추출", "비린내 차단 장용성 캡슐 적용", "혈행 개선 및 건조한 눈 개선 동시 기능성 인정"],
    reviews: [
      { id: "r-3", user: "정*민", rating: 5, content: "오메가3 특유의 비린내가 전혀 안 올라와서 신기해요. 매일 아침 거부감 없이 먹고 있습니다.", photo: true },
      { id: "r-6", user: "윤*정", rating: 4, content: "스마트폰을 자주 봐서 눈이 항상 뻑뻑했는데 이거 한 달 복용하니 안구건조감이 많이 나아졌어요.", photo: false }
    ]
  },
  {
    id: "prod-03",
    name: "포레스트 프로바이오 스킨 액티브",
    tagline: "장 건강부터 피부 면역까지 하루 한 포로 챙기는 100억 유산균",
    category: "장건강",
    ageGroup: "2040",
    ingredients: ["프로바이오틱스", "프리바이오틱스", "히알루론산"],
    price: 36000,
    subscriptionDiscount: 50,
    rating: 4.95,
    reviewCount: 2110,
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600",
    features: ["특허받은 4중 코팅 기술로 장까지 살아서 도달", "프리바이오틱스 부원료 함유 신바이오틱스 포뮬러", "새콤달콤한 천연 블루베리 맛 분말"],
    reviews: [
      { id: "r-4", user: "이*선", rating: 5, content: "더부룩하던 속이 편해졌어요. 화장실 가기가 너무 편해져서 삶의 질이 수직 상승했습니다.", photo: true },
      { id: "r-7", user: "강*진", rating: 5, content: "유산균 유목민이었는데 여기에 눕습니다. 가루 제형이라 물 없이 간편하게 섭취하기 진짜 좋네요.", photo: true }
    ]
  }
];

export interface SurveyStep {
  id: number;
  title: string;
  subtitle: string;
  field: string; // matches key of SurveyAnswer
  type: "single" | "multiple";
  options: {
    value: string;
    label: string;
    description?: string;
    icon?: string;
  }[];
}

export const SURVEY_STEPS: SurveyStep[] = [
  {
    id: 1,
    title: "성별과 연령대를 선택해 주세요",
    subtitle: "가장 알맞은 영양 제안과 체내 영양소 권장 섭취 기준을 계산하기 위해 필요합니다.",
    field: "genderAndAge", // handled with custom logic
    type: "single", // we will build a tailored UI combining gender and age grouping
    options: []
  },
  {
    id: 2,
    title: "평소 신체 증상이나 지키고 싶은 건강 고민을 모두 선택하세요 (중복 가능)",
    subtitle: "고객님의 현재 몸 상태와 가장 가까운 부위 및 증상을 알려주세요.",
    field: "lifestyles",
    type: "multiple",
    options: [
      { value: "fatigue", label: "피로 및 활력 저하", description: "아침에 일어나기 힘들고 항상 나른해요", icon: "BatteryCharging" },
      { value: "eyes", label: "눈 피로 / 건조함", description: "화면을 오래 보고 침침하며 뻑뻑해요", icon: "Eye" },
      { value: "digestion", label: "소화 / 장의 더부룩함", description: "화장실 가기 곤란하거나 속이 무거워요", icon: "FlameKindling" },
      { value: "skin", label: "피부 건조 / 면역력", description: "푸석푸석하고 피부 장벽 관리가 필요해요", icon: "Sparkles" },
      { value: "stress", label: "과도한 스트레스 / 긴장", description: "업무 스트레스와 피로 누적으로 편히 쉬고 싶어요", icon: "Frown" }
    ]
  },
  {
    id: 3,
    title: "선호하시는 영양제 제형은 어떤 스타일인가요?",
    subtitle: "삼키기 쉽고 꾸준하게 섭취할 수 있는 방식을 선택해 주세요.",
    field: "preferredForm",
    type: "single",
    options: [
      { value: "pill", label: "미니 정제 (알약형)", description: "크기가 작아 목넘김이 편하고 냄새가 적습니다", icon: "Layers" },
      { value: "powder", label: "맛있는 분말 (가루형)", description: "물 없이 새콤달콤하게 짜먹거나 털어넣습니다", icon: "Wind" },
      { value: "liquid", label: "빠른 흡수 액상 (드링크형)", description: "체내 흡수가 가장 빠르고 휴대가 용이합니다", icon: "Droplet" },
      { value: "all", label: "종류 상관 없음", description: "편하게 복용 가능하며 성능이 우선입니다", icon: "CheckCircle" }
    ]
  },
  {
    id: 4,
    title: "최근 생활 습관 및 식습관은 어떠신가요? (중복 가능)",
    subtitle: "영양 불균형 영역을 정확하게 분석하기 위해 평소의 식문화를 반영합니다.",
    field: "dietaryPatterns",
    type: "multiple",
    options: [
      { value: "delivery_food", label: "잦은 외식 및 배달음식 섭취", description: "기름지거나 인스턴트 위주의 식사를 즐깁니다", icon: "Pizza" },
      { value: "coffee", label: "매일 2잔 이상의 고카페인 섭취", description: "커피, 에너지 드링크를 자주 마십니다", icon: "CupSoda" },
      { value: "irregular", label: "과중한 야근 및 불규칙한 식사 시간", description: "야식을 즐기거나 아침을 자주 거릅니다", icon: "Moon" },
      { value: "dieting", label: "체중 조절 및 극단적인 다이어트", description: "식사량을 무리하게 조절하거나 가려 먹습니다", icon: "TrendingDown" }
    ]
  }
];
