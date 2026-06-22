import React from "react";
import { Trash2, CalendarCheck, HelpCircle, ArrowRight, Sparkles, AlertCircle, ShoppingBag } from "lucide-react";
import { CartItem } from "../types";

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdateCycle: (id: string, cycle: number) => void;
  onProceedToCheckout: () => void;
  setCurrentView: (view: "home" | "shop" | "survey" | "cart" | "mypage" | "result") => void;
}

export default function CartView({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateCycle,
  onProceedToCheckout,
  setCurrentView,
}: CartViewProps) {
  
  const subItems = cartItems.filter((i) => i.isSubscription);
  const generalItems = cartItems.filter((i) => !i.isSubscription);

  // Math totals calculation
  const totals = React.useMemo(() => {
    let originalTotal = 0;
    let discountTotal = 0;
    
    cartItems.forEach((item) => {
      const price = item.product.price;
      const qty = item.quantity;
      originalTotal += price * qty;
      
      if (item.isSubscription) {
        discountTotal += Math.floor(price * (item.product.subscriptionDiscount / 100)) * qty;
      }
    });

    const finalAmount = originalTotal - discountTotal;
    // general shipping fee is 3,000 won (subscribers get free)
    const hasGeneral = generalItems.length > 0;
    const shippingFee = hasGeneral ? 3000 : 0;

    return {
      originalTotal,
      discountTotal,
      shippingFee,
      finalAmount: finalAmount + shippingFee,
    };
  }, [cartItems, generalItems]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-zinc-100 max-w-2xl mx-auto my-12 shadow-md select-none">
        <div className="h-16 w-16 rounded-full bg-[#0F5132]/5 flex items-center justify-center text-[#0F5132] mb-6 border border-[#0F5132]/10">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">장바구니가 비어 있습니다</h3>
        <p className="text-zinc-500 text-xs sm:text-sm mt-3 leading-relaxed max-w-sm">
          의학 자문단 진단 결과를 통해 나만의 최상 영양 패키지를 구성해 보시거나, 맞춤 건기식 상점에서 상품을 가득 담아보세요.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setCurrentView("survey")}
            className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0F5132] hover:bg-[#0b3d25] transition-all cursor-pointer shadow-sm"
          >
            1:1 건강설문 복원하기
          </button>
          <button
            onClick={() => setCurrentView("shop")}
            className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-[#0F5132] bg-zinc-100 hover:bg-zinc-250 transition-all cursor-pointer"
          >
            인기 제품 둘러보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 select-none">
      
      {/* Upper description */}
      <div className="text-left border-b border-zinc-100 pb-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          장바구니 정기배송 플래너
        </h2>
        <p className="text-zinc-500 text-xs sm:text-sm mt-1">
          일반 담기 품목과 매칭 정기구독 혜택 품목을 투명하게 분리하여 실시간 청산 주기를 계산합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column list items */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Subscription Section */}
          {subItems.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#0F5132] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#FF7A00] animate-pulse"></span>
                  정기 구독 신선 관리 배송 품목 ({subItems.length}개)
                </h3>
                <span className="text-[10px] text-zinc-400 font-bold bg-zinc-100 px-2 py-1 rounded">
                  구독 50% 할인 및 항시 배송비 0원 적용
                </span>
              </div>

              <div className="divide-y divide-zinc-100 border border-zinc-100 bg-white rounded-2xl overflow-hidden shadow-sm">
                {subItems.map((item) => {
                  const product = item.product;
                  const discountPrice = Math.floor(product.price * (1 - product.subscriptionDiscount / 100));
                  return (
                    <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Image Details */}
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl bg-zinc-100 border border-zinc-100 overflow-hidden flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=200";
                            }}
                          />
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] text-[#FF7A00] font-black uppercase tracking-tight block">
                            맞춤 정기구독
                          </span>
                          <h4 className="font-extrabold text-[#0F5132] text-xs sm:text-sm leading-snug">
                            {product.name}
                          </h4>
                          <div className="text-xs text-zinc-400 mt-0.5 line-through">
                            일반가 ₩{product.price.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Cycle parameters */}
                      <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                        {/* Delivery frequency cycle adjustment */}
                        <div className="flex flex-col text-left">
                          <label className="text-[9px] text-zinc-400 font-bold mb-1 block">정기배송 주기 선택</label>
                          <select
                            value={item.deliveryCycle}
                            onChange={(e) => onUpdateCycle(item.id, Number(e.target.value))}
                            className="text-xs font-bold border border-zinc-200 bg-white p-1 rounded-lg text-zinc-700 min-h-[30px]"
                          >
                            <option value={4}>4주마다 (추천)</option>
                            <option value={8}>8주마다</option>
                            <option value={12}>12주마다</option>
                          </select>
                        </div>

                        {/* quantity */}
                        <div className="flex flex-col">
                          <span className="text-[9px] text-[#0F5132] font-black mb-1">수량</span>
                          <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden shrink-0">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 bg-zinc-50 hover:bg-zinc-100 text-xs font-bold text-zinc-600 cursor-pointer min-h-[30px]"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-bold text-zinc-800">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 bg-zinc-50 hover:bg-zinc-100 text-xs font-bold text-zinc-600 cursor-pointer min-h-[30px]"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Cost details */}
                        <div className="text-right">
                          <span className="text-[9px] text-zinc-400 font-bold block">구독 최종액</span>
                          <span className="text-xs sm:text-sm font-black text-[#FF7A00]">
                            ₩{(discountPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 text-zinc-300 hover:text-red-500 rounded-lg hover:bg-zinc-50 transition-all cursor-pointer self-end sm:self-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* General Single items section */}
          {generalItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-zinc-800 flex items-center gap-2">
                1회성 일반 구매 품목 ({generalItems.length}개)
              </h3>

              <div className="divide-y divide-zinc-100 border border-zinc-100 bg-white rounded-2xl overflow-hidden shadow-sm">
                {generalItems.map((item) => {
                  const product = item.product;
                  return (
                    <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl bg-zinc-100 border border-zinc-100 overflow-hidden flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=200";
                            }}
                          />
                        </div>
                        <div className="text-left">
                          <span className="text-[9px] text-zinc-400 font-bold uppercase block">
                            ONE-TIME PURCHASE
                          </span>
                          <h4 className="font-bold text-[#0F5132] text-xs sm:text-sm leading-snug">
                            {product.name}
                          </h4>
                          <p className="text-zinc-500 text-[10px] mt-0.5">{product.tagline}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        
                        {/* quantity */}
                        <div className="flex flex-col">
                          <span className="text-[9px] text-[#0F5132] font-black mb-1">수량</span>
                          <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden shrink-0">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 bg-zinc-50 hover:bg-zinc-100 text-xs font-bold text-zinc-600 cursor-pointer min-h-[30px]"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-bold text-zinc-800">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 bg-zinc-50 hover:bg-zinc-100 text-xs font-bold text-zinc-600 cursor-pointer min-h-[30px]"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Cost */}
                        <div className="text-right">
                          <span className="text-[9px] text-zinc-400 font-bold block">최종 합산액</span>
                          <span className="text-xs sm:text-sm font-bold text-zinc-800">
                            ₩{(product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 text-zinc-300 hover:text-red-500 rounded-lg hover:bg-zinc-50 transition-all cursor-pointer self-end sm:self-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right column pricing checkout box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-lg p-6 space-y-6">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest text-left">
              최종 예상 청산 가격표
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center text-zinc-600">
                <span>단품 기준가 총합</span>
                <span className="font-semibold text-zinc-800">₩{totals.originalTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600">
                <span>정기 구독 50% 세금 감액</span>
                <span className="font-extrabold text-[#FF7A00]">-₩{totals.discountTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600">
                <span>배송료</span>
                <span className="font-semibold text-zinc-800">
                  {totals.shippingFee > 0 ? `₩${totals.shippingFee.toLocaleString()}` : "우체국 무료배송"}
                </span>
              </div>

              <div className="h-[1px] bg-zinc-100 my-4"></div>

              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-zinc-800">최종 청구액</span>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 font-bold block leading-none mb-1">
                    매월 자동 결제 주기가 적용됩니다
                  </span>
                  <span className="text-2xl font-black text-[#0F5132] tracking-tight">
                    ₩{totals.finalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery scheduling parameters banner */}
            <div className="bg-zinc-50 rounded-xl p-3 text-left border border-zinc-200/50 flex gap-2">
              <CalendarCheck className="h-5 w-5 text-[#0F5132] shrink-0 mt-0.5" />
              <div className="text-[10px] text-zinc-500 leading-relaxed">
                <p className="font-bold text-zinc-800">신선 배송 주기 안내</p>
                오늘 주문하시면 최적 정밀 제조된 상품이 <span className="text-[#FF7A00] font-bold">포장 즉시 3일 이내 우체국 택배 </span>로 출발합니다.
              </div>
            </div>

            {/* CTA action button to proceed to payment */}
            <button
              onClick={onProceedToCheckout}
              id="proceed-checkout-btn"
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#0F5132] hover:bg-[#0b3d25] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer min-h-[44px] active:scale-95 text-center"
            >
              가상 안전 결제 완료하기
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="text-center p-2">
            <span className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
              <AlertCircle className="h-3 w-3" /> 안심하고 위약금 전혀 없이 주기 수정 / 대기 정지 가능
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
