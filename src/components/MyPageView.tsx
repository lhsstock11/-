import React from "react";
import { 
  Smile, Activity, Calendar, RefreshCw, LogOut, CheckCircle2, 
  HelpCircle, AlertTriangle, ShieldAlert, Award, FileText, PauseCircle, PlayCircle 
} from "lucide-react";
import { UserState, SubscriptionSchedule } from "../types";

interface MyPageViewProps {
  userState: UserState;
  onToggleSubscription: (id: string) => void;
  onUpdateSubscriptionCycle: (id: string, cycle: number) => void;
  onResetSurvey: () => void;
  setCurrentView: (view: "home" | "shop" | "survey" | "cart" | "mypage" | "result") => void;
}

export default function MyPageView({
  userState,
  onToggleSubscription,
  onUpdateSubscriptionCycle,
  onResetSurvey,
  setCurrentView
}: MyPageViewProps) {
  
  const hasActiveSubscriptions = userState.subscriptions.length > 0;

  return (
    <div className="max-w-6xl mx-auto py-4 select-none text-left space-y-12">
      
      {/* Upper Account greeting card */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/4 opacity-10 bg-[radial-gradient]"></div>
        <div className="space-y-3 relative z-10 text-left">
          <span className="text-[10px] text-[#FF7A00] font-black uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-lg">
            FOREST PREMIUM MEMBER
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            반갑습니다, {userState.name || "이희선"} 회원님
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            계정 이메일: {userState.email || "heesun@example.com"} | 마이 케어 케이블 활성화됨
          </p>
        </div>

        <button
          onClick={onResetSurvey}
          className="px-5 py-3 rounded-xl bg-white text-zinc-900 font-bold hover:bg-zinc-100 transition-all text-xs sm:text-sm shadow cursor-pointer"
        >
          건강 진단 정보 초기화
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Active subscriptions list and controller */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-base font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
              <RefreshCw className="h-4.5 w-4.5 text-[#0F5132]" /> 내 원클릭 정기 구독 관리 대시보드
            </h3>
            <span className="text-[10px] text-[#FF7A00] font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
              {userState.subscriptions.filter((s) => s.active).length}개 활성화 중
            </span>
          </div>

          {hasActiveSubscriptions ? (
            <div className="space-y-4">
              {userState.subscriptions.map((sub) => {
                return (
                  <div 
                    key={sub.id} 
                    className={`bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm space-y-4 ${
                      !sub.active ? "opacity-60 border-zinc-100 bg-zinc-50/50" : ""
                    }`}
                  >
                    {/* Upper title */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-100 flex-shrink-0">
                          <img
                            src={sub.productImage}
                            alt={sub.productName}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-left">
                          <span className="text-[9px] text-[#FF7A00] font-black uppercase block">AUTOMATIC DELIVERY</span>
                          <h4 className="font-extrabold text-[#0F5132] text-xs sm:text-sm">
                            {sub.productName}
                          </h4>
                        </div>
                      </div>

                      {/* Active Toggle Switch */}
                      <button
                        onClick={() => onToggleSubscription(sub.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                          sub.active 
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200" 
                            : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                        }`}
                      >
                        {sub.active ? (
                          <>
                            <PauseCircle className="h-4 w-4 shrink-0" />
                            구독 정지하기
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-4 w-4 shrink-0" />
                            구독 재개하기
                          </>
                        )}
                      </button>
                    </div>

                    <div className="h-[1px] bg-zinc-100"></div>

                    {/* Subscription meta settings */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                      
                      {/* Subscription State */}
                      <div className="text-left">
                        <span className="text-zinc-400 text-[10px] block font-bold">구독 현재 상태</span>
                        <span className={`font-bold mt-0.5 inline-block ${sub.active ? "text-[#0F5132]" : "text-zinc-500"}`}>
                          {sub.active ? "정상 배송 정기구독중" : "일시 중지됨 (위약금 제로)"}
                        </span>
                      </div>

                      {/* Delivery frequency cycle selection */}
                      <div className="text-left">
                        <span className="text-zinc-400 text-[10px] block font-bold">배송 주기 변경</span>
                        <select
                          disabled={!sub.active}
                          value={sub.deliveryCycle}
                          onChange={(e) => onUpdateSubscriptionCycle(sub.id, Number(e.target.value))}
                          className="mt-0.5 text-xs font-bold border border-zinc-200 p-1 rounded-lg text-zinc-700 bg-white min-h-[28px] focus:ring-1 focus:ring-[#0F5132] disabled:opacity-40"
                        >
                          <option value={4}>4주마다 (정배합)</option>
                          <option value={8}>8주마다</option>
                          <option value={12}>12주마다</option>
                        </select>
                      </div>

                      {/* Next Automated pay date */}
                      <div className="text-left col-span-2 sm:col-span-1">
                        <span className="text-zinc-400 text-[10px] block font-bold">다음 자동결제 예정</span>
                        <span className="text-zinc-700 mt-0.5 block font-bold font-mono">
                          {sub.active ? sub.nextDeliveryDate : "결제 정지 상태"}
                        </span>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-zinc-400 bg-zinc-50 rounded-3xl border border-zinc-100 border-dashed">
              현재 자사몰에 등록 및 활성화된 원클릭 정기 구독 패키지가 부재합니다.
              <br />
              <button
                onClick={() => setCurrentView("survey")}
                className="mt-4 inline-flex text-xs font-bold text-[#0F5132] underline"
              >
                1:1 정밀 설문 결과지 확인하고 첫 배송받기
              </button>
            </div>
          )}
        </div>

        {/* Right Column - User diagnosis history visualization */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-base font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-[#FF7A00]" /> 나의 건강진단 이력 데이터 시각화
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 space-y-6">
            <span className="text-[10px] text-[#0F5132] font-black uppercase tracking-wider block">
              DIAGNOSIS ARCHIVE PROGRESS
            </span>

            {userState.surveyAnswers ? (
              <div className="space-y-5 text-left">
                
                {/* Visual grid bars representing health markers */}
                <div className="space-y-4">
                  {[
                    { label: "에너지 활력 지수", score: 85, color: "bg-[#FF7A00]" },
                    { label: "장 상태 및 변통 지수", score: 65, color: "bg-[#0F5132]" },
                    { label: "피부 수분 장벽 보정율", score: 75, color: "bg-emerald-600" },
                    { label: "눈 피로 / 눈 건조 지표", score: 70, color: "bg-[#0F5132]/60" }
                  ].map((metric, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-zinc-700">
                        <span>{metric.label}</span>
                        <span>{metric.score}% (매칭 기준 규격 만족)</span>
                      </div>
                      <div className="bg-zinc-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`${metric.color} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${metric.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-[1px] bg-zinc-100"></div>

                <div className="space-y-2 text-xs text-zinc-600">
                  <span className="font-extrabold text-zinc-800 block">설문 응답 키워드 요약:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {userState.surveyAnswers.lifestyles.map((l, i) => (
                      <span key={i} className="px-2.5 py-1 bg-[#0F5132]/5 text-[#0F5132] rounded-lg font-bold border border-[#0F5132]/10">
                        #{l === 'fatigue' ? '아침피로' : l === 'eyes' ? '안구건조' : l === 'digestion' ? '더부룩함' : l === 'skin' ? '피부보완' : '스트레스'}
                      </span>
                    ))}
                    <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-lg">
                      #{userState.surveyAnswers.preferredForm === 'pill' ? '정제선호' : '분말선호'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView("result")}
                  className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-extrabold border border-dashed border-[#0F5132] hover:bg-[#0F5132]/5 text-[#0F5132] rounded-xl transition-all cursor-pointer min-h-[44px]"
                >
                  상세 진단지 분석 리포트 열기
                </button>

              </div>
            ) : (
              <div className="py-12 text-center text-zinc-400 text-xs text-zinc-400">
                <FileText className="h-8 w-8 mx-auto text-zinc-300 mb-3" />
                아직 건강 설문을 진행하지 않았습니다.
                <br />
                건강 지표 가축 데이터를 생성하려면 아래 설문을 마쳐주세요.
                <br />
                <button
                  onClick={() => setCurrentView("survey")}
                  className="mt-4 px-4 py-2 bg-[#0F5132] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  기능 진단 시작 (3분)
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
