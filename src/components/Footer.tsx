import React from "react";
import { Leaf, ShieldCheck, Truck, RefreshCw, CalendarCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 border-t border-zinc-800 pt-16 pb-12 mt-auto select-none">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 mb-12 border-b border-zinc-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-zinc-800 text-[#FF7A00] rounded-xl">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold mb-1">100% 안심 보장 원료</h4>
              <p className="text-xs text-zinc-500">포레스트 데일리는 엄격하게 검증된 프리미엄 천연 유래 원료만을 고집합니다.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-zinc-800 text-[#FF7A00] rounded-xl">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold mb-1">원클릭 구독 주기 설정</h4>
              <p className="text-xs text-zinc-500">배송지, 배송 주기를 고객의 호흡에 맞춰 4주/8주/12주 단위로 간편히 조절합니다.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-zinc-800 text-[#FF7A00] rounded-xl">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold mb-1">언제나 무료 우체국 택배</h4>
              <p className="text-xs text-zinc-500">구독 회원이시라면 단 하나의 상품만 구독하셔도 영구적으로 배송비 0원입니다.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-zinc-800 text-[#FF7A00] rounded-xl">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold mb-1">약정 없는 일시 정지</h4>
              <p className="text-xs text-zinc-500">언제든 위약금 전혀 없이 클릭 한 번으로 자동 배송을 쉬어가거나 중단 가능합니다.</p>
            </div>
          </div>
        </div>

        {/* Company & Support Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F5132] text-white">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="font-sans font-extrabold text-white text-lg tracking-tight">
                나만의 영양
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              개별 인체 적합성과 평소 라이프 스타일을 과학적으로 자가 진단하여 최적의 에센셜 성분을 단 한 팩에 배송하는 개인 맞춤 정기 구독 플랫폼입니다.
            </p>
            <div className="text-xs text-zinc-500 space-y-1">
              <p>본사 주소: 서울특별시 보태니컬 빌딩 10층 (의학 자문실)</p>
              <p>건강기능식품 판매업 신고: 제 2026-서울강남-0115호</p>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div>
              <h5 className="text-white text-xs font-extrabold uppercase tracking-widest mb-4">서비스 링크</h5>
              <ul className="space-y-2 text-xs">
                <li><span className="hover:text-white transition-colors duration-200 cursor-pointer">1:1 AI 맞춤설문</span></li>
                <li><span className="hover:text-white transition-colors duration-200 cursor-pointer">전체 베스트 상품</span></li>
                <li><span className="hover:text-white transition-colors duration-200 cursor-pointer">구독 회원 혜택관</span></li>
                <li><span className="hover:text-white transition-colors duration-200 cursor-pointer">언론 보도 및 임상 시험</span></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white text-xs font-extrabold uppercase tracking-widest mb-4">고객 서비스</h5>
              <ul className="space-y-2 text-xs">
                <li><span className="hover:text-white transition-colors duration-200 cursor-pointer">1:1 전문의 카운셀링</span></li>
                <li><span className="hover:text-white transition-colors duration-200 cursor-pointer">자주 묻는 질문 FAQ</span></li>
                <li><span className="hover:text-white transition-colors duration-200 cursor-pointer">제휴 및 원료 공급 문의</span></li>
                <li><span className="hover:text-white transition-colors duration-200 cursor-pointer">이용약관 / 개인정보방침</span></li>
              </ul>
            </div>
          </div>

          {/* Customer Support Call */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="text-white text-xs font-extrabold uppercase tracking-widest">포레스트 컨시어지</h5>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white tracking-tight">1644-2025</p>
              <p className="text-xs text-zinc-500">평일 09:00 - 18:00 (점심시간 12:00 - 13:00)</p>
              <p className="text-xs text-zinc-500">주말 / 공휴일 카카오톡 챗봇 24시간 대응중</p>
            </div>
            <div className="pt-2">
              <span className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer text-center">
                카카오톡 1:1 진단 상담 실행
              </span>
            </div>
          </div>
        </div>

        {/* Developer Credit Placement and Copyright */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-zinc-500 tracking-wider">
            © 2025 나만의 영양. Developed by 이희선 (개인/프리랜서). All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
