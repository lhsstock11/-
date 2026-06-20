import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, CreditCard, Home, MapPin, Phone, User, ShieldCheck, Mail, Sparkles, Calendar } from "lucide-react";
import { CartItem } from "../types";

interface CheckoutViewProps {
  cartItems: CartItem[];
  userName: string;
  userEmail: string;
  onOrderCompleted: (shippingAddress: string, paymentMethod: string) => void;
  setCurrentView: (view: "home" | "shop" | "survey" | "cart" | "mypage" | "result") => void;
}

export default function CheckoutView({
  cartItems,
  userName,
  userEmail,
  onOrderCompleted,
  setCurrentView,
}: CheckoutViewProps) {
  
  const [shippingPhase, setShippingPhase] = useState<"form" | "success">("form");
  const [recipientName, setRecipientName] = useState<string>(userName || "이희선");
  const [phone, setPhone] = useState<string>("010-4567-2025");
  const [postcode, setPostcode] = useState<string>("13524");
  const [address, setAddress] = useState<string>("경기도 성남시 분당구 판교역로 10층");
  const [detailAddress, setDetailAddress] = useState<string>("의학 자문 밸리");
  const [cardNumber, setCardNumber] = useState<string>("4561-8975-2015-3021");
  const [cardExpiry, setCardExpiry] = useState<string>("12/30");
  const [cardCvC, setCardCvC] = useState<string>("925");

  // Sum total calculation
  const totalAmount = React.useMemo(() => {
    let sum = 0;
    cartItems.forEach((item) => {
      const price = item.isSubscription
        ? Math.floor(item.product.price * (1 - item.product.subscriptionDiscount / 100))
        : item.product.price;
      sum += price * item.quantity;
    });
    // add shipping if has standard items
    const hasGeneral = cartItems.some((i) => !i.isSubscription);
    return sum + (hasGeneral ? 3000 : 0);
  }, [cartItems]);

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setShippingPhase("success");
    // Trigger parent hook
    const fullAddress = `[${postcode}] ${address} ${detailAddress}`;
    onOrderCompleted(fullAddress, "신용카드");
  };

  if (shippingPhase === "success") {
    return (
      <div className="max-w-xl mx-auto my-12 space-y-8 select-none animate-fade-in text-center">
        
        {/* Celebration element card */}
        <div className="bg-white rounded-3xl border border-zinc-100 shadow-2xl p-8 sm:p-12 space-y-6 flex flex-col items-center">
          <div className="relative flex items-center justify-center mb-4">
            <div className="absolute h-20 w-20 rounded-full border-4 border-emerald-500/20 animate-ping"></div>
            <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-500 text-emerald-600 shadow-inner">
              <Check className="h-8 w-8 animate-[scaleIn_0.4s_ease-out]" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-[#FF7A00] tracking-widest bg-amber-50 px-3 py-1 rounded-full uppercase">
              Subscription Activated
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#033c20] tracking-tight">
              맞춤 영양 자동 배송 주문 성공!
            </h3>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              성공적으로 첫 달 자동 결제가 처리되었습니다. 신선 원료 배합 후 즉시 우체국 익일 배송으로 출발합니다.
            </p>
          </div>

          <div className="h-[1px] bg-zinc-100 w-full my-4"></div>

          {/* Delivery overview card details */}
          <div className="w-full bg-zinc-50 rounded-2xl border border-zinc-200/50 p-4 font-sans text-left text-xs space-y-3">
            <h4 className="font-extrabold text-zinc-800 text-xs flex items-center gap-1.5 mb-1">
              <Sparkles className="h-4 w-4 text-[#FF7A00]" /> 실시간 배송 및 소속 주기 확인
            </h4>
            <div className="flex justify-between">
              <span className="text-zinc-400">수령주소</span>
              <span className="font-semibold text-zinc-900 text-right truncate max-w-[180px] sm:max-w-none">
                {address} {detailAddress}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">결제 수단</span>
              <span className="font-semibold text-zinc-900">가상 신용카드 (매칭 자동이체 활성)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">결제 금액</span>
              <span className="font-extrabold text-[#0F5132]">₩{totalAmount.toLocaleString()}원 / 월</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">1회 배송일</span>
              <span className="font-bold text-[#FF7A00] flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> 영업일 3일 이내 출하 예정
              </span>
            </div>
          </div>

          {/* Buttons to navigate */}
          <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
            <button
              onClick={() => setCurrentView("mypage")}
              className="flex-1 py-3.5 rounded-xl font-bold bg-[#0F5132] hover:bg-[#0b3d25] text-white text-xs sm:text-sm shadow-md transition-all cursor-pointer min-h-[44px]"
            >
              마이 배송 관리 현황
            </button>
            <button
              onClick={() => setCurrentView("home")}
              className="flex-1 py-3.5 rounded-xl font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs sm:text-sm transition-all cursor-pointer min-h-[44px]"
            >
              쇼핑몰 홈으로 돌아가기
            </button>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 select-none">
      
      {/* Page description title */}
      <div className="text-left border-b border-zinc-100 pb-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          안전 가상 주문 결제대
        </h2>
        <p className="text-zinc-500 text-xs sm:text-sm mt-1">
          우체국 무료 배송 정보 및 정기 결제를 위한 안전 카드 정보를 기재하여 즉시 활력 상태를 확보합니다.
        </p>
      </div>

      <form onSubmit={handleSubmitPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Column Input fields */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Shipping segment panel */}
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-[#0F5132]" /> 1. 배송지 신선 도착 정보
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-600 block">수령인 성명</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="pl-9 pr-4 py-3 border border-zinc-200 rounded-xl w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-600 block">수령인 연락처</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9 pr-4 py-3 border border-zinc-200 rounded-xl w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* postcode zip */}
              <div className="space-y-1.5 sm:col-span-4">
                <label className="text-xs font-bold text-zinc-600 block">우편번호</label>
                <input
                  type="text"
                  required
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="px-4 py-3 border border-zinc-200 rounded-xl w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] font-semibold"
                />
              </div>

              {/* main address */}
              <div className="space-y-1.5 sm:col-span-8">
                <label className="text-xs font-bold text-zinc-600 block">기본 주소</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="px-4 py-3 border border-zinc-200 rounded-xl w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] font-semibold"
                />
              </div>

              {/* detail address */}
              <div className="space-y-1.5 sm:col-span-full">
                <label className="text-xs font-bold text-zinc-600 block">상세 호수 및 설명</label>
                <input
                  type="text"
                  required
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  placeholder="예: 102동 405호"
                  className="px-4 py-3 border border-zinc-200 rounded-xl w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Payment Card credentials info */}
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight flex items-center gap-2">
                <CreditCard className="h-4.5 w-4.5 text-[#0F5132]" /> 2. 안전 자동 결제 카드 등록
              </h3>
              <span className="text-[9px] text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded font-bold">
                KCP 안전 결제 망 연동
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 block">카드 번호</label>
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="0000-0000-0000-0000"
                className="px-4 py-3 border border-zinc-200 rounded-xl w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] font-mono font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-600 block">유효 기한 (MM/YY)</label>
                <input
                  type="text"
                  required
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="12/30"
                  className="px-4 py-3 border border-zinc-200 rounded-xl w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] font-mono font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-600 block">CVC 비밀번호 뒷3자리</label>
                <input
                  type="password"
                  maxLength={3}
                  required
                  value={cardCvC}
                  onChange={(e) => setCardCvC(e.target.value)}
                  placeholder="***"
                  className="px-4 py-3 border border-zinc-200 rounded-xl w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] font-mono font-semibold text-center"
                />
              </div>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl text-left border border-zinc-200/50 flex gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-[10px] text-zinc-500 leading-relaxed">
                정기 구독 약관에 합의하며, 제출 즉시 첫 달 요금이 인출되고 이후 선택한 주기(4주/8주/12주)마다 자동으로 결제 청산 처리됩니다.
              </div>
            </div>
          </div>

        </div>

        {/* Right column checkout totals */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-md p-6 space-y-6">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest text-left">
              주문 최종 패키지 요약
            </h3>

            {/* List items miniatures */}
            <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="text-left truncate max-w-[150px]">
                    <span className="font-extrabold text-[#0F5132]">{item.product.name}</span>
                    <span className="text-zinc-400 text-[10px] block">
                      {item.isSubscription ? `${item.deliveryCycle}주 정기구독` : "1회성 일반구매"} x {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium text-zinc-800">
                    ₩{(
                      (item.isSubscription
                        ? Math.floor(item.product.price * (1 - item.product.subscriptionDiscount / 100))
                        : item.product.price) * item.quantity
                    ).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-[1px] bg-zinc-100 my-4"></div>

            <div className="space-y-3.5 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-zinc-500">패키지 총 중량가</span>
                <span className="font-bold text-zinc-800">₩{totalAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">우체국 택배 요금</span>
                <span className="font-bold text-emerald-600">₩0원 (무료 혜택 통합)</span>
              </div>
              
              <div className="h-[1px] bg-zinc-100 my-2"></div>

              <div className="flex justify-between items-baseline pt-2">
                <span className="text-xs font-black text-zinc-900">최종 승인 금액</span>
                <span className="text-xl font-black text-[#FF7A00]">₩{totalAmount.toLocaleString()}원</span>
              </div>
            </div>

            <button
              id="submit-payment-btn"
              type="submit"
              className="w-full py-4 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-black text-xs sm:text-hm rounded-xl shadow-lg transition-all min-h-[44px] cursor-pointer"
            >
              ₩{totalAmount.toLocaleString()}원 안전 정기등록
            </button>

          </div>
        </div>

      </form>

    </div>
  );
}
