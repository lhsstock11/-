import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Star, ShieldCheck, Tag, Heart, FlameKindling, Activity, Sparkles, Filter } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS_MOCK_DATA } from "../data";

interface HomeViewProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, isSub: boolean) => void;
  setCurrentView: (view: "survey" | "shop" | "cart" | "home" | "result" | "mypage") => void;
}

export default function HomeView({ onSelectProduct, onAddToCart, setCurrentView }: HomeViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const bannerSlides = [
    {
      title: "아침에 느끼는 건강한 변화,",
      accentTitle: "첫 맞춤 구독 최대 50% 할인",
      desc: "3분 건강설문만 참여해도 의학 자문의 분석 알고리즘이 추천하는 최적의 건기식을 무료 우체국 배송으로 아침 문 앞까지 배송해 드립니다.",
      bgImage: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=1200",
      cta: "1:1 맞춤 설문 진단하기",
      badge: "FIRST SUBSCRIPTION 50% OFF"
    },
    {
      title: "매일 섭취해야 할 최적의 정배합,",
      accentTitle: "포레스트 데일리 솔루션 출시",
      desc: "합성 보존료 0% 보장. 특허받은 생체 이용률 저온 초임계 공법으로 하루 한 팩으로 에센셜 에너지를 빈틈없이 완벽하게 섭취해 보세요.",
      bgImage: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=1200",
      cta: "베스트셀러 보러가기",
      badge: "ORGANIC RAW MATERIAL 100%"
    }
  ];

  // Filtering products
  const filteredProducts = PRODUCTS_MOCK_DATA.filter((prod) => {
    const categoryMatch = selectedCategory === "all" || prod.category === selectedCategory;
    const ageMatch = selectedAge === "all" || prod.ageGroup === selectedAge;
    return categoryMatch && ageMatch;
  });

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Promotion Banner Section with Slides */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-950">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={bannerSlides[activeSlide].bgImage}
            alt="Hero Background"
            className="h-full w-full object-cover transition-all duration-1000 transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-24 lg:px-16 max-w-2xl text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            key={`badge-${activeSlide}`}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-[#FF7A00] text-white tracking-widest mb-6"
          >
            <Tag className="h-3 w-3" />
            {bannerSlides[activeSlide].badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key={`title-${activeSlide}`}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight"
          >
            {bannerSlides[activeSlide].title}
            <span className="block text-emerald-400 mt-2">
              {bannerSlides[activeSlide].accentTitle}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            key={`desc-${activeSlide}`}
            className="mt-6 text-zinc-300 text-sm sm:text-base leading-relaxed"
          >
            {bannerSlides[activeSlide].desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            key={`cta-${activeSlide}`}
            className="mt-8 flex flex-wrap gap-4"
          >
            <button
              onClick={() => {
                if (activeSlide === 0) {
                  setCurrentView("survey");
                } else {
                  setSelectedCategory("all");
                  setSelectedAge("all");
                  // Smooth scroll to product grid
                  const el = document.getElementById("trending-products");
                  el?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[#0F5132] hover:bg-[#0b3d25] transition-all min-h-[44px] shadow-lg cursor-pointer"
            >
              {bannerSlides[activeSlide].cta}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveSlide((activeSlide + 1) % bannerSlides.length)}
              className="px-5 py-3.5 rounded-xl text-sm font-semibold text-zinc-300 bg-white/10 hover:bg-white/20 hover:text-white transition-all cursor-pointer min-h-[44px]"
            >
              혜택 더보기
            </button>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 right-6 z-10 flex gap-2">
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === idx ? "w-8 bg-[#FF7A00]" : "w-2.5 bg-white/30"
              }`}
              aria-label={`Slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* Grid Features Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0F5132]/5 rounded-2xl p-6 border border-[#0F5132]/15 flex gap-4">
          <div className="p-3 bg-[#0F5132] text-white rounded-xl h-fit">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-zinc-900 font-bold block mb-1">의학 자문단 정밀 분석</h3>
            <p className="text-zinc-600 text-xs sm:text-sm">성별 권장 섭취 규격에 의거한 영양 1:1 진단 서비스를 제공합니다.</p>
          </div>
        </div>
        
        <div className="bg-[#FF7A00]/5 rounded-2xl p-6 border border-[#FF7A00]/15 flex gap-4">
          <div className="p-3 bg-[#FF7A00] text-white rounded-xl h-fit">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-zinc-900 font-bold block mb-1">상시 정기구독 50% 할인</h3>
            <p className="text-zinc-600 text-xs sm:text-sm">건기식 단품 대비 50% 파격 할인가로 생활비도 동시에 다이어트하세요.</p>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-xl h-fit">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-zinc-900 font-bold block mb-1">신선 안심 알림 및 관리</h3>
            <p className="text-zinc-600 text-xs sm:text-sm">오직 신선한 원료로만 고밀도 충전 완료. 편리하게 주기를 관리하고 언제든 쉬어갑니다.</p>
          </div>
        </div>
      </section>

      {/* 2. Interactive Smart Category Filters Area */}
      <section id="trending-products" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#0F5132] bg-[#0F5132]/10 rounded-full px-2.5 py-1 text-xs font-bold mb-2">
              <Sparkles className="h-3 w-3" /> TRENDING NOW
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              실시간 베스트셀러 및 맞춤 추천
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1">
              실제 많은 고객들이 정기 배송으로 만족 중인 완벽 배합 라인업입니다.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-end">
            <Filter className="h-4 w-4 text-zinc-400 shrink-0" />
            <span className="text-xs text-zinc-400 font-medium">필터 조건</span>
          </div>
        </div>

        {/* Filters Group */}
        <div className="flex flex-col gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
          {/* Category Filter Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-400 font-bold w-16 select-none sm:w-20">건강 부위</span>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#0F5132] text-white shadow-sm"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              전체보기
            </button>
            <button
              onClick={() => setSelectedCategory("종합건강")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] cursor-pointer ${
                selectedCategory === "종합건강"
                  ? "bg-[#0F5132] text-white shadow-sm"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              종합건강
            </button>
            <button
              onClick={() => setSelectedCategory("장건강")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] cursor-pointer ${
                selectedCategory === "장건강"
                  ? "bg-[#0F5132] text-white shadow-sm"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              장건강
            </button>
            <button
              onClick={() => setSelectedCategory("혈행/눈")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] cursor-pointer ${
                selectedCategory === "혈행/눈"
                  ? "bg-[#0F5132] text-white shadow-sm"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              혈행 / 눈건강
            </button>
          </div>

          <div className="h-[1px] bg-zinc-200/60 my-1"></div>

          {/* Age Group Filter Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-400 font-bold w-16 select-none sm:w-20">소비자 연령</span>
            <button
              onClick={() => setSelectedAge("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] cursor-pointer ${
                selectedAge === "all"
                  ? "bg-[#0F5132] text-white shadow-sm"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              연령 전체
            </button>
            <button
              onClick={() => setSelectedAge("2040")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] cursor-pointer ${
                selectedAge === "2040"
                  ? "bg-[#0F5132] text-white shadow-sm"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              20~40 대 핵심 에너지
            </button>
            <button
              onClick={() => setSelectedAge("3050")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] cursor-pointer ${
                selectedAge === "3050"
                  ? "bg-[#0F5132] text-white shadow-sm"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              30~50 대 혈행/순환 케어
            </button>
          </div>
        </div>

        {/* 3. Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => {
              const discountedPrice = Math.floor(prod.price * (1 - prod.subscriptionDiscount / 100));
              return (
                <motion.div
                  key={prod.id}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  className="group bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl overflow-hidden flex flex-col transition-all duration-300 relative"
                >
                  {/* Photo Banner with Subscription Discount Badge */}
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-[#FF7A00] text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow-md tracking-wider flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      구독 시 {prod.subscriptionDiscount}% 특별할인
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Tags & Rating */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-xs font-semibold text-[#0F5132] bg-[#0F5132]/10 rounded-md px-2 py-0.5">
                          {prod.category}
                        </span>
                        <div className="flex items-center gap-1 text-[#FF7A00]">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="text-xs font-bold text-zinc-800">{prod.rating}</span>
                          <span className="text-zinc-400 text-[10px]">({prod.reviewCount})</span>
                        </div>
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="font-extrabold text-[#0F5132] text-md sm:text-lg tracking-tight group-hover:text-[#0b3d25] transition-colors leading-6">
                        {prod.name}
                      </h3>
                      <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed min-h-[32px]">
                        {prod.tagline}
                      </p>

                      {/* Ingredients list */}
                      <div className="flex flex-wrap gap-1 mt-4">
                        {prod.ingredients.map((ing, idx) => (
                          <span
                            key={idx}
                            className="bg-zinc-50 text-zinc-600 text-[10px] px-2 py-1 rounded-md border border-zinc-200/50"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price section and CTA */}
                    <div className="mt-6 pt-5 border-t border-zinc-100">
                      <div className="flex items-baseline justify-between">
                        <div className="text-zinc-400 text-xs line-through">
                          일반가 ₩{prod.price.toLocaleString()}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-[#FF7A00] font-black uppercase">정기구독가</span>
                          <span className="text-lg sm:text-xl font-extrabold text-[#0F5132]">
                            ₩{discountedPrice.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-zinc-500"> / 월</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button
                          onClick={() => onSelectProduct(prod)}
                          className="w-full text-[#0F5132] bg-[#0F5132]/5 hover:bg-[#0F5132]/10 font-bold text-xs rounded-xl transition-all cursor-pointer min-h-[44px] border border-transparent hover:border-[#0F5132]/25"
                        >
                          상세보기
                        </button>
                        <button
                          onClick={() => onAddToCart(prod, true)} // Defaults to subscribing
                          className="w-full flex items-center justify-center gap-1.5 text-white bg-[#0F5132] hover:bg-[#0b3d25] font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer min-h-[44px] active:scale-95"
                        >
                          정기구독 신청
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-zinc-400 bg-zinc-50 rounded-3xl border border-zinc-100 border-dashed">
              선택한 카테고리 및 연령대의 만족 상품이 존재하지 않습니다.
              <br />
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedAge("all");
                }}
                className="mt-4 inline-flex text-xs font-bold text-[#0F5132] underline"
              >
                필터 초기화
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Mini Banner for Custom Analysis Entry */}
      <section className="bg-gradient-to-br from-[#0F5132] to-[#042415] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none bg-radial-gradient"></div>
        <div className="space-y-4 max-w-xl text-left">
          <span className="text-xs font-black text-[#FF7A00] tracking-widest bg-white/10 px-3 py-1.5 rounded-xl uppercase">
            3-Minute Interactive Diagnosis
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            의학 통계 기준 나만의 맞춤 영양 솔루션 구상하기
          </h2>
          <p className="text-zinc-300 text-sm leading-relaxed">
            성별, 나이, 하루 섭취량 및 불규칙 식습관을 연산하여 최적의 부위 개선 원료 매칭 데이터를 이희선 님만을 위한 결과지로 직관적으로 확인해 보세요.
          </p>
        </div>
        <div>
          <button
            onClick={() => setCurrentView("survey")}
            className="whitespace-nowrap flex items-center gap-2 bg-white text-[#0F5132] hover:bg-zinc-100 focus:ring-4 focus:ring-zinc-300 text-sm font-extrabold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer min-h-[44px] active:scale-95 animate-pulse"
          >
            내 맞춤 맞춤진단 시작하기
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
