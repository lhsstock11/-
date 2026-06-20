import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronRight, ArrowLeft, ShieldCheck, CheckSquare, Square,
  Battery, Eye, Flame, Sparkles, AlertCircle, 
  Layers, Wine, CupSoda, Moon, HeartCrack, Smile
} from "lucide-react";
import { SurveyAnswer } from "../types";
import { SURVEY_STEPS } from "../data";

interface SurveyViewProps {
  onCompleteSurvey: (answers: SurveyAnswer) => void;
  userName: string;
}

// Icon mapper helper safely to avoid syntax dynamic imports
const iconMap: { [key: string]: any } = {
  BatteryCharging: Battery,
  Eye: Eye,
  FlameKindling: Flame,
  Sparkles: Sparkles,
  Frown: HeartCrack,
  Layers: Layers,
  Wind: Wine,
  Droplet: Wine,
  CheckCircle: Smile,
  Pizza: Wine,
  CupSoda: CupSoda,
  Moon: Moon,
  TrendingDown: ArrowLeft,
};

export default function SurveyView({ onCompleteSurvey, userName }: SurveyViewProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  // Individual Survey State
  const [gender, setGender] = useState<string>("female"); // default to female as user is 이희선
  const [ageGroup, setAgeGroup] = useState<string>("2040");
  const [lifestyles, setLifestyles] = useState<string[]>([]);
  const [preferredForm, setPreferredForm] = useState<string>("pill");
  const [dietaryPatterns, setDietaryPatterns] = useState<string[]>([]);

  const totalSteps = SURVEY_STEPS.length;
  const progressPercent = Math.min(((currentStepIdx + 1) / totalSteps) * 100, 100);

  const handleNextStep = () => {
    if (currentStepIdx < totalSteps - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      // Last step: trigger analyzing phase
      startAnalyzing();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const startAnalyzing = () => {
    setAnalyzing(true);
    // Simulate smart medical calculation
    setTimeout(() => {
      setAnalyzing(false);
      onCompleteSurvey({
        gender,
        ageGroup,
        lifestyles,
        preferredForm,
        dietaryPatterns,
      });
    }, 2800);
  };

  const toggleLifestyle = (val: string) => {
    setLifestyles((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  const toggleDietary = (val: string) => {
    setDietaryPatterns((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  if (analyzing) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-zinc-100 max-w-2xl mx-auto my-12 shadow-xl">
        <div className="relative flex items-center justify-center mb-8">
          {/* Animated concentric rings */}
          <div className="absolute h-24 w-24 rounded-full border-4 border-[#0F5132]/10 animate-ping"></div>
          <div className="absolute h-20 w-20 rounded-full border-4 border-[#FF7A00]/20 animate-pulse"></div>
          <div className="h-16 w-16 rounded-full bg-[#0F5132]/5 flex items-center justify-center border border-[#0F5132]/30 text-[#0F5132]">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
          {userName || "이희선"} 님의 활력 진단 알고리즘 분석 중
        </h3>
        <p className="text-zinc-500 text-xs sm:text-sm mt-3 leading-relaxed max-w-md">
          의학 학술 논문 및 권장 섭취 가이드라인 연령 매칭 알고리즘을 토대로, 부족하기 쉬운 영양 성분 비율을 치밀하게 계산하고 있습니다.
        </p>

        {/* Customized calculation step details */}
        <div className="mt-8 space-y-2.5 max-w-sm w-full bg-zinc-50 p-4 rounded-2xl border border-zinc-100 font-mono text-[11px] text-[#0F5132]">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">데이터 입력성</span>
            <span className="font-bold">성공 (성별: {gender === 'female' ? '여성' : '남성'} / {ageGroup === '2040' ? '20-40대' : '30-50대'})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">건강 개선 목표</span>
            <span className="font-bold">{lifestyles.length}군 매칭 가동 중</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">구조 가중치 배합 식단</span>
            <span className="font-bold">성분 오차 분석 완료</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 space-y-8 select-none">
      
      {/* Upper header information */}
      <div className="text-center space-y-2">
        <span className="text-xs font-black text-[#FF7A00] uppercase tracking-widest bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
          Smart Medical Survey
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F5132] tracking-tight">
          3분 만에 찾는 나만의 1:1 맞춤 영양 솔루션
        </h2>
        <p className="text-zinc-500 text-xs sm:text-sm max-w-lg mx-auto">
          평소 식습관과 불편 부위 정보를 가감 없이 제출해 주시면, 맞춤 팩 구성을 추천하며 최대 50%의 평생 구독 혜택을 연동해 드립니다.
        </p>
      </div>

      {/* Modern Glass Card Containing the Surveys */}
      <div className="bg-white rounded-3xl border border-zinc-100 shadow-xl overflow-hidden flex flex-col min-h-[480px]">
        {/* Step Indicator Progress Bar */}
        <div className="bg-zinc-50 border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-[#0F5132]">
              진행 상태 ({currentStepIdx + 1} / {totalSteps})
            </span>
          </div>
          <div className="w-1/2 bg-zinc-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#0F5132] h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Survey Body Content with Slider Animation */}
        <div className="p-6 sm:p-10 flex-grow flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIdx}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
                  {SURVEY_STEPS[currentStepIdx].title}
                </h3>
                <p className="text-zinc-500 text-xs sm:text-sm mt-1 leading-relaxed">
                  {SURVEY_STEPS[currentStepIdx].subtitle}
                </p>
              </div>

              {/* Custom Selector UI depending on Step Field */}
              {SURVEY_STEPS[currentStepIdx].field === "genderAndAge" ? (
                /* Step 1 Matrix Layout combining Gender and Age Selection */
                <div className="space-y-6">
                  {/* Gender matrix selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-extrabold text-[#0F5132] block">성별 선택</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setGender("female")}
                        className={`p-4 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[50px] cursor-pointer flex items-center justify-center gap-2 ${
                          gender === "female"
                            ? "bg-[#0F5132]/10 border-2 border-[#0F5132] text-[#0F5132]"
                            : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                        }`}
                      >
                        여성 (이희선 님 권장)
                      </button>
                      <button
                        onClick={() => setGender("male")}
                        className={`p-4 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[50px] cursor-pointer flex items-center justify-center gap-2 ${
                          gender === "male"
                            ? "bg-[#0F5132]/10 border-2 border-[#0F5132] text-[#0F5132]"
                            : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                        }`}
                      >
                        남성 (일반)
                      </button>
                    </div>
                  </div>

                  {/* Age Group selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-extrabold text-[#0F5132] block">활동 연령대 집군</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { val: "2040", label: "20-40대", desc: "청년 및 직장 활성기" },
                        { val: "3050", label: "30-50대", desc: "체력 완성 및 순환 케어" },
                        { val: "senior", label: "60대 이상", desc: "항산화 골밀도 종합" }
                      ].map((age) => (
                        <button
                          key={age.val}
                          onClick={() => setAgeGroup(age.val)}
                          className={`p-3 rounded-xl border transition-all text-center flex flex-col justify-center items-center gap-0.5 cursor-pointer ${
                            ageGroup === age.val
                              ? "bg-[#0F5132]/10 border-2 border-[#0F5132] text-[#0F5132]"
                              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                          }`}
                        >
                          <span className="text-xs font-bold">{age.label}</span>
                          <span className="text-[10px] text-zinc-400 font-medium">{age.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : SURVEY_STEPS[currentStepIdx].field === "lifestyles" ? (
                /* Step 2 Multi-select Grid with customized icons representing goals */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                  {SURVEY_STEPS[currentStepIdx].options.map((opt) => {
                    const isSelected = lifestyles.includes(opt.value);
                    const SpecificIcon = iconMap[opt.icon || ""] || Sparkles;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleLifestyle(opt.value)}
                        className={`p-4 rounded-2xl text-left border flex items-center gap-4 transition-all min-h-[70px] cursor-pointer ${
                          isSelected
                            ? "bg-[#0F5132]/5 border-2 border-[#0F5132] text-[#0F5132]"
                            : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300"
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl ${isSelected ? "bg-[#0F5132] text-white" : "bg-zinc-100 text-zinc-500"}`}>
                          <SpecificIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm font-extrabold flex items-center justify-between">
                            {opt.label}
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 shrink-0" />
                            ) : (
                              <Square className="h-4 w-4 text-zinc-300 shrink-0" />
                            )}
                          </div>
                          {opt.description && (
                            <p className="text-[10px] text-zinc-400 mt-0.5">{opt.description}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : SURVEY_STEPS[currentStepIdx].field === "preferredForm" ? (
                /* Step 3 Form choices (Single select) */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SURVEY_STEPS[currentStepIdx].options.map((opt) => {
                    const isSelected = preferredForm === opt.value;
                    const SpecificIcon = iconMap[opt.icon || ""] || Sparkles;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setPreferredForm(opt.value)}
                        className={`p-4 rounded-2xl text-left border flex items-center gap-4 transition-all min-h-[64px] cursor-pointer ${
                          isSelected
                            ? "bg-[#0F5132]/5 border-2 border-[#0F5132] text-[#0F5132]"
                            : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300"
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-[#0F5132] text-white" : "bg-zinc-100 text-zinc-500"}`}>
                          <SpecificIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-extrabold">{opt.label}</div>
                          {opt.description && (
                            <p className="text-[10px] text-zinc-400 mt-0.5">{opt.description}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Step 4 Food patterns (Multi select) */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SURVEY_STEPS[currentStepIdx].options.map((opt) => {
                    const isSelected = dietaryPatterns.includes(opt.value);
                    const SpecificIcon = iconMap[opt.icon || ""] || Sparkles;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleDietary(opt.value)}
                        className={`p-4 rounded-2xl text-left border flex items-center gap-4 transition-all min-h-[70px] cursor-pointer ${
                          isSelected
                            ? "bg-[#0F5132]/5 border-2 border-[#0F5132] text-[#0F5132]"
                            : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300"
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl ${isSelected ? "bg-[#0F5132] text-white" : "bg-zinc-100 text-zinc-500"}`}>
                          <SpecificIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm font-extrabold flex items-center justify-between">
                            {opt.label}
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 shrink-0" />
                            ) : (
                              <Square className="h-4 w-4 text-zinc-300 shrink-0" />
                            )}
                          </div>
                          {opt.description && (
                            <p className="text-[10px] text-zinc-400 mt-0.5">{opt.description}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Survey Navigation Buttons at bottom */}
          <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={handlePrevStep}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold text-zinc-500 hover:text-zinc-900 px-4 py-2 rounded-xl transition-all min-h-[44px] cursor-pointer ${
                currentStepIdx === 0 ? "opacity-35 pointer-events-none" : ""
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              이전 단계
            </button>

            <button
              id="survey-next-btn"
              onClick={handleNextStep}
              className="flex items-center gap-1.5 bg-[#0F5132] hover:bg-[#0b3d25] text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow transition-all min-h-[44px] cursor-pointer active:scale-95"
            >
              {currentStepIdx === totalSteps - 1 ? "정밀분석 제출하기" : "다음 단계"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Safety and privacy clause footer */}
      <div className="text-center">
        <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> 포레스트 데일리 자가 설문은 식품위생법 정합성 검증 및 SSL 보안 암호 처리가 적용되어 안전합니다.
        </p>
      </div>

    </div>
  );
}
