import React, { useMemo } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, Star, Tag, CheckSquare, 
  Trash2, ShoppingCart, ArrowRight, RotateCcw, 
  Leaf, Info, Award
} from "lucide-react";
import { SurveyAnswer, Product } from "../types";
import { PRODUCTS_MOCK_DATA } from "../data";

interface ResultViewProps {
  answers: SurveyAnswer | null;
  userName: string;
  onResetSurvey: () => void;
  onSubscribeAllRecommended: (products: Product[]) => void;
  onSelectProduct: (product: Product) => void;
}

export default function ResultView({
  answers,
  userName,
  onResetSurvey,
  onSubscribeAllRecommended,
  onSelectProduct
}: ResultViewProps) {
  
  const displayName = userName || "이희선";

  // Calculate customized health scores based on actual survey answers
  const healthMetrics = useMemo(() => {
    // default scores
    let energy = 80;
    let digestion = 75;
    let skin = 80;
    let vision = 85;
    let stress = 75;

    if (answers) {
      const selectedLifestyles = answers.lifestyles || [];
      const selectedDietary = answers.dietaryPatterns || [];

      // If they have complaints in specific areas, lower their score to represent "need for care"
      if (selectedLifestyles.includes("fatigue")) {
        energy -= 35;
      }
      if (selectedLifestyles.includes("digestion")) {
        digestion -= 30;
      }
      if (selectedLifestyles.includes("skin")) {
        skin -= 35;
      }
      if (selectedLifestyles.includes("eyes")) {
        vision -= 30;
      }
      if (selectedLifestyles.includes("stress")) {
        stress -= 25;
      }

      // Dietary triggers
      if (selectedDietary.includes("delivery_food")) {
        digestion -= 15;
        energy -= 10;
      }
      if (selectedDietary.includes("coffee")) {
        stress -= 15;
        energy += 10; // short spike but decreases deep sleep
      }
      if (selectedDietary.includes("irregular")) {
        digestion -= 15;
        energy -= 15;
      }
      if (selectedDietary.includes("dieting")) {
        skin -= 15;
        energy -= 10;
      }
    }

    // Keep bounds
    return {
      energy: Math.max(25, Math.min(100, energy)),
      digestion: Math.max(25, Math.min(100, digestion)),
      skin: Math.max(25, Math.min(100, skin)),
      vision: Math.max(25, Math.min(100, vision)),
      stress: Math.max(25, Math.min(100, stress)),
    };
  }, [answers]);

  // Calculate recommended products based on score priorities
  const recommendedProducts = useMemo(() => {
    // Return sorted products matching their lowest scores
    const products = [...PRODUCTS_MOCK_DATA];
    
    // Sort logic
    // prod-01 (멀티비타민) -> energy, lifestyle: fatigue
    // prod-02 (오메가3) -> vision/circulation, lifestyle: eyes, stress
    // prod-03 (유산균) -> digestion, skin, lifestyle: digestion, skin
    
    // For D2C premium, we offer them all as a comprehensive custom pack with high priority on their matching deficiency
    return products;
  }, []);

  // trigonometry helper for SVG radar chart
  const radarPoints = useMemo(() => {
    const cx = 130;
    const cy = 130;
    const r = 90;

    // 5 vertices angle starting at 270 deg (top) going clockwise: 270, 342, 54, 126, 198
    const angles = [270, 342, 54, 126, 198];

    const getX = (angle: number, value: number) => {
      const rad = (angle * Math.PI) / 180;
      return cx + r * (value / 100) * Math.cos(rad);
    };

    const getY = (angle: number, value: number) => {
      const rad = (angle * Math.PI) / 180;
      return cy + r * (value / 100) * Math.sin(rad);
    };

    // background concentric rings
    const circles = [25, 50, 75, 100].map((val) => {
      return angles.map((a) => `${getX(a, val)},${getY(a, val)}`).join(" ");
    });

    // spokes
    const spokes = angles.map((a) => {
      return {
        x1: cx,
        y1: cy,
        x2: getX(a, 100),
        y2: getY(a, 100),
      };
    });

    // labels coordinates
    const labelOffsets = [
      { x: cx, y: cy - r - 16, align: "middle", label: "에너지 활력" },
      { x: getX(342, 100) + 14, y: getY(342, 100) - 2, align: "start", label: "순환 & 피로 저항" },
      { x: getX(54, 100) + 14, y: getY(54, 100) + 14, align: "start", label: "피부 면역 장벽" },
      { x: getX(126, 100) - 14, y: getY(126, 100) + 14, align: "end", label: "장내 소화 흡수율" },
      { x: getX(198, 100) - 14, y: getY(198, 100) - 2, align: "end", label: "눈 피로도 완화" },
    ];

    // User metrics mapping
    const metricsMap = [
      healthMetrics.energy,
      healthMetrics.stress, // matching second spoke
      healthMetrics.skin,
      healthMetrics.digestion,
      healthMetrics.vision,
    ];

    const userPolygon = angles.map((a, i) => `${getX(a, metricsMap[i])},${getY(a, metricsMap[i])}`).join(" ");

    return {
      circles,
      spokes,
      labelOffsets,
      userPolygon,
      cx,
      cy,
    };
  }, [healthMetrics]);

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-12 select-none">
      
      {/* 1. Header results tag */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-[#FF7A00] bg-[#FF7A00]/10 rounded-full px-3 py-1 text-xs font-black">
          <Award className="h-3.5 w-3.5 animate-bounce" /> 1:1 CUSTOM DIAGNOSIS REPORT
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F5132] tracking-tight">
          {displayName} 님을 위한 맞춤 영양 배합 진단 결과
        </h2>
        <p className="text-zinc-500 text-xs sm:text-sm max-w-xl mx-auto">
          알고리즘 분석 결과, 최근 생활 습관과 섭취 요구를 바탕으로 아래 5개 활성 부위 가중치가 검출되었습니다.
        </p>
      </div>

      {/* 2. Visualizing Analysis: Beautiful custom SVG Radar Chart container */}
      <div className="bg-white rounded-3xl border border-zinc-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
        
        {/* Left segment - Interactive Radar SVG Chart */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-zinc-50 rounded-2xl border border-zinc-200/50 relative">
          <span className="absolute top-4 left-4 text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Info className="h-3 w-3 text-[#0F5132]" /> 오각형 비율이 넓을수록 안심 수준입니다
          </span>
          
          <svg viewBox="0 0 260 260" className="w-full max-w-[280px] h-auto drop-shadow-sm mt-4">
            {/* Concentration rings */}
            {radarPoints.circles.map((p, idx) => (
              <polygon
                key={idx}
                points={p}
                fill="none"
                stroke="#e4e4e7"
                strokeWidth="1"
                className="transition-all"
              />
            ))}

            {/* Concentric helper grids */}
            <circle cx={radarPoints.cx} cy={radarPoints.cy} r="45" fill="none" stroke="#f4f4f5" strokeWidth="0.5" strokeDasharray="3,3" />
            <circle cx={radarPoints.cx} cy={radarPoints.cy} r="90" fill="none" stroke="#e4e4e7" strokeWidth="0.5" />

            {/* Axial spokes */}
            {radarPoints.spokes.map((s, idx) => (
              <line
                key={idx}
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke="#e4e4e7"
                strokeWidth="1"
              />
            ))}

            {/* Filled User Data Area */}
            <polygon
              points={radarPoints.userPolygon}
              fill="rgba(15, 81, 50, 0.15)"
              stroke="#0F5132"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="animate-pulse"
            />

            {/* User points bullets */}
            {radarPoints.userPolygon.split(" ").map((pStr, idx) => {
              const [px, py] = pStr.split(",");
              return (
                <circle
                  key={idx}
                  cx={px}
                  cy={py}
                  r="4"
                  fill="#FF7A00"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="shadow-sm"
                />
              );
            })}

            {/* Dimension text labels and categories */}
            {radarPoints.labelOffsets.map((l, idx) => (
              <text
                key={idx}
                x={l.x}
                y={l.y}
                textAnchor={l.align}
                className="font-sans font-bold text-[9px] sm:text-[10px] text-zinc-700 fill-current"
              >
                {l.label}
              </text>
            ))}
          </svg>

          {/* Quick analysis summary caption */}
          <div className="mt-4 flex gap-4 text-[10px] font-bold select-none text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#0F5132]"></span> 내 지수 비율
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#FF7A00]"></span> 진단 목표 기준치
            </span>
          </div>
        </div>

        {/* Right segment - Diagnosis metrics description cards */}
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-2">
            <span className="text-[#FF7A00] font-sans font-black text-xs tracking-tight">DIAGNOSIS FEEDBACK</span>
            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
              피로 유발 요인과 식단 불균형 <br />장 면역 밸런스가 위협받고 있습니다
            </h3>
            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
              {displayName} 님이 지적하신 
              <span className="text-[#0F5132] font-extrabold"> {answers?.lifestyles.map(l => {
                if (l === 'fatigue') return "피로";
                if (l === 'eyes') return "눈건강";
                if (l === 'digestion') return "소화";
                if (l === 'skin') return "피부면역";
                if (l === 'stress') return "스트레스";
                return "";
              }).filter(Boolean).join(", ")}</span> 고민 영역에서 생체 보정 권장 규격이 정상 범위보다 현저히 결핍되었습니다.
            </p>
          </div>

          <div className="h-[1px] bg-zinc-100"></div>

          {/* Metrics summary progress bars */}
          <div className="space-y-3">
            {[
              { label: "에너지 활력 지수", score: healthMetrics.energy, color: "bg-[#FF7A00]" },
              { label: "장내 소화 및 세포 면역", score: healthMetrics.digestion, color: "bg-[#0F5132]" },
              { label: "피부 수분 장벽 보완성", score: healthMetrics.skin, color: "bg-emerald-600" }
            ].map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                  <span>{m.label}</span>
                  <span className={m.score < 60 ? "text-[#FF7A00]" : "text-[#0F5132]"}>{m.score}% (위험성)</span>
                </div>
                <div className="bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className={`${m.color} h-full rounded-full`} style={{ width: `${m.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Comprehensive Action CTA */}
          <div className="bg-[#0F5132]/5 rounded-2xl p-4 border border-[#0F5132]/10 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] text-zinc-400 font-bold">1:1 솔루션 프리미엄 특전</span>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900">3개 맞춤 원팩 종합 구독 시 50% 즉시 할인</h4>
            </div>
            <button
              onClick={() => onSubscribeAllRecommended(recommendedProducts)}
              id="subscribe-all-cta"
              className="flex items-center gap-1 px-4 py-2 bg-[#FF7A00] hover:bg-[#e66e00] text-white text-xs font-extrabold rounded-xl shadow transition-all cursor-pointer min-h-[44px]"
            >
              원클릭 구독 신청
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 3. Curator Match Products Header */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-100 pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
              기능 우선순위 기반 맞춤 영양 성분 솔루션
            </h3>
            <p className="text-zinc-500 text-xs sm:text-sm">
              {displayName} 님의 성별 권장 섭취 비율에 기반해 과학적으로 설계된 3종 구상 배합입니다.
            </p>
          </div>

          <button
            onClick={onResetSurvey}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-all cursor-pointer bg-zinc-100 border border-zinc-200 px-3 py-2 rounded-xl h-fit self-start sm:self-auto"
          >
            <RotateCcw className="h-3 w-3" />
            자가 설문 재입력
          </button>
        </div>

        {/* Highlight Curated Products */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendedProducts.map((prod) => {
            const discountedPrice = Math.floor(prod.price * (1 - prod.subscriptionDiscount / 100));
            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300"
              >
                {/* Visual */}
                <div className="relative aspect-video bg-zinc-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#0F5132] text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                    추천도 최상 (적격 매칭)
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-[#FF7A00] uppercase tracking-wider block">
                      Target Care: {prod.category}
                    </span>
                    <h4 className="font-extrabold text-[#0F5132] text-base tracking-tight leading-snug">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {prod.tagline}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Feature bullet list */}
                    <ul className="text-[11px] text-zinc-600 space-y-1 bg-zinc-50 p-3 rounded-xl border border-zinc-200/50">
                      {prod.features.slice(0, 2).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1">
                          <span className="text-emerald-600 font-bold shrink-0">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Subscription cost info */}
                    <div className="flex items-baseline justify-between pt-2 border-t border-zinc-100">
                      <span className="text-xs font-bold text-zinc-400">구독 50% 혜택가</span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-base sm:text-lg font-extrabold text-[#0F5132]">
                          ₩{discountedPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium">/월</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectProduct(prod)}
                        className="w-full text-zinc-600 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer min-h-[44px]"
                      >
                        상세 성분표
                      </button>
                      <button
                        onClick={() => onSubscribeAllRecommended([prod])}
                        className="w-full text-white bg-[#0F5132] hover:bg-[#0b3d25] text-xs font-extrabold py-2.5 rounded-xl transition-all cursor-pointer min-h-[44px] active:scale-95"
                      >
                        즉시 구독신청
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
