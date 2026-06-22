import React, { useState } from "react";
import { X, Star, Check, Shield, Tag, Calendar, ShoppingCart, Award } from "lucide-react";
import { Product } from "../types";

interface DetailViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, isSub: boolean) => void;
}

export default function DetailViewModal({
  product,
  onClose,
  onAddToCart
}: DetailViewModalProps) {
  
  const [selectedSub, setSelectedSub] = useState<boolean>(true); // default to subscription choice
  
  if (!product) return null;

  const discountedPrice = Math.floor(product.price * (1 - product.subscriptionDiscount / 100));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Container Card */}
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-zinc-100 flex flex-col max-h-[90vh] sm:max-h-[85vh] md:max-h-[90vh] animate-scale-up select-none">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#0F5132] bg-[#0F5132]/10 px-2.5 py-1 rounded-lg">대표 기능성</span>
            <span className="text-xs text-zinc-500 font-bold">{product.category} 솔루션</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scroll content wrapper */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Column product image and badge */}
            <div className="md:col-span-5 space-y-4">
              <div className="aspect-square w-full bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-100 relative shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=600";
                  }}
                />
                
                <span className="absolute bottom-3 left-3 bg-zinc-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-white/10">
                  포토 보정 실사 기준
                </span>
              </div>

              {/* Security Shield */}
              <div className="bg-zinc-50 border border-zinc-200/50 rounded-xl p-3 flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-600 shrink-0" />
                <div className="text-left">
                  <h5 className="text-xs font-bold text-zinc-800">품질 우수 및 안심 보장 수치</h5>
                  <p className="text-[10px] text-zinc-500">K-FDA 기능성 신고 및 HACCP인증 제조 기술 적용.</p>
                </div>
              </div>
            </div>

            {/* Right Column Specifications details */}
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Star className="h-4.5 w-4.5 text-[#FF7A00] fill-current" />
                  <span className="text-sm font-bold text-zinc-800">{product.rating}</span>
                  <span className="text-xs">({product.reviewCount}개 후기 평점)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight leading-tight">
                  {product.name}
                </h3>
                <p className="text-zinc-600 text-xs sm:text-sm">
                  {product.tagline}
                </p>
              </div>

              {/* Compare pricing comparison list */}
              <div className="bg-[#0F5132]/5 rounded-2xl border border-[#0F5132]/10 overflow-hidden">
                <div className="p-4 bg-[#0F5132]/10 border-b border-[#0F5132]/10 flex justify-between items-center">
                  <span className="text-xs font-black text-[#0F5132]">결제 플랜 구매 혜택 비교</span>
                  <span className="text-[10px] font-bold text-[#FF7A00] uppercase tracking-wider">구독 배키지 최적</span>
                </div>
                <div className="divide-y divide-zinc-100 bg-white">
                  
                  {/* Single plan */}
                  <div 
                    onClick={() => setSelectedSub(false)}
                    className={`p-4 flex justify-between items-center transition-all cursor-pointer ${
                      !selectedSub ? "bg-[#FF7A00]/5 ring-2 ring-[#FF7A00]" : ""
                    }`}
                  >
                    <div className="text-left">
                      <span className="text-xs text-zinc-400 font-bold block">1회 일반 단품 구매</span>
                      <span className="text-xs text-zinc-500">배송비 착불 청구</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-zinc-400 leading-none block line-through">₩{product.price.toLocaleString()}</span>
                      <span className="text-base font-extrabold text-[#0F5132]">₩{product.price.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Subscription plan */}
                  <div 
                    onClick={() => setSelectedSub(true)}
                    className={`p-4 flex justify-between items-center transition-all cursor-pointer ${
                      selectedSub ? "bg-[#0F5132]/5 ring-2 ring-[#0F5132]" : ""
                    }`}
                  >
                    <div className="text-left flex items-start gap-1.5">
                      <div className="mt-0.5 p-0.5 rounded-full bg-[#FF7A00] text-white">
                        <Check className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="text-xs text-[#0F5132] font-black block flex items-center gap-1">
                          원클릭 무료 정기구독 <span className="bg-[#FF7A00] text-white text-[8px] px-1 rounded">50%할인</span>
                        </span>
                        <span className="text-[10px] text-zinc-500">우체국 무료배송, 매달 자동결제, 쉬어가기 가능</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-zinc-400 line-through block">₩{product.price.toLocaleString()}</span>
                      <span className="text-lg font-black text-[#FF7A00]">₩{discountedPrice.toLocaleString()}</span>
                      <span className="text-[10px] text-zinc-400"> / 월</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Sub-features checklist */}
              <div className="space-y-3 text-left">
                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest">포레스트 특화 공법 스펙</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-zinc-700">
                      <div className="flex-shrink-0 h-4 w-4 bg-[#0F5132]/10 rounded-full flex items-center justify-center text-[#0F5132]">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table of active ingredients */}
              <div className="space-y-2 text-left">
                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest">주요 성분 규격 및 기능</h4>
                <table className="w-full text-xs text-left text-zinc-600 border border-zinc-100 rounded-xl overflow-hidden">
                  <thead className="bg-zinc-50 text-zinc-500">
                    <tr>
                      <th className="p-2.5 border-b border-zinc-100">복합 성분</th>
                      <th className="p-2.5 border-b border-zinc-100">기능성 기능 인정 지표</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {product.ingredients.map((ing, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-bold text-zinc-800">{ing}</td>
                        <td className="p-2.5">체내 생체 효율 활성 및 저항 조율 적격 기준 성분 원료 배합</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>

          <div className="h-[1px] bg-zinc-100"></div>

          {/* Detailed Customer Reviews - High Quality Photo Review Grid */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm font-black text-zinc-800 tracking-tight flex items-center gap-1.5">
                포레스트 신뢰 후기 <span className="text-[#FF7A00] font-bold">({product.reviewCount}개)</span>
              </h4>
              <span className="text-xs text-zinc-400">조작 없는 우성 성격 리얼 구매 리뷰</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/50 text-left space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < rev.rating ? "text-[#FF7A00] fill-current" : "text-zinc-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-400 font-bold">{rev.user} 고객님</span>
                  </div>
                  
                  <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                    {rev.content}
                  </p>

                  <div className="flex items-center gap-1 bg-white border border-zinc-200 p-1 px-2 rounded-lg w-fit">
                    <span className="text-[9px] text-[#0F5132] font-black">정기 배송 2회차 이용중</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Form Submit Footer Actions */}
        <div className="px-6 py-5 bg-zinc-50 border-t border-zinc-100 flex flex-wrap gap-4 items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] text-zinc-400 font-bold block select-none">선택한 요금제 기준 예상 자동 결제액</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-black text-[#FF7A00]">
                ₩{(selectedSub ? discountedPrice : product.price).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-zinc-500">{selectedSub ? " / 월" : " (단품)"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onAddToCart(product, selectedSub)}
              className="px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-[#0F5132] hover:bg-[#0b3d25] flex items-center justify-center gap-2 shadow-lg transition-all min-h-[44px] cursor-pointer"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              장바구니 담고 주문하기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
