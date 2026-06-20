import React, { useState } from "react";
import { X, Mail, ShieldCheck, Heart, User, Sparkles, MessageCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, email: string) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  
  const [email, setEmail] = useState<string>("heesun@example.com");
  const [name, setName] = useState<string>("이희선");
  const [isRegister, setIsRegister] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(name, email);
    onClose();
  };

  const handleKakaoMock = () => {
    onLoginSuccess("이희선 (카카오)", "heesun@kakao.com");
    onClose();
  };

  const handleNaverMock = () => {
    onLoginSuccess("이희선 (네이버)", "heesun@naver.com");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Container inside view */}
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-zinc-100 flex flex-col p-6 sm:p-8 space-y-6 relative animate-scale-up select-none">
        
        {/* Toggle close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2 mt-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F5132]/10 text-[#0F5132] mx-auto">
            <Heart className="h-5 w-5 animate-pulse" />
          </div>
          <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">
            {isRegister ? "포레스트 데일리 1회 속성 가입" : "포레스트 통합 안전 로그인"}
          </h3>
          <p className="text-zinc-500 text-xs leading-relaxed max-w-xs mx-auto">
            맞춤 영양 데이터 보정 및 평생 구독 50% 할인 코환 연동을 위해 가상 멤버십이 필요합니다.
          </p>
        </div>

        {/* Social Fast Signup options */}
        <div className="space-y-2.5">
          <button
            onClick={handleKakaoMock}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-[#FEE500] hover:bg-[#FEE500]/90 text-zinc-900 text-xs sm:text-sm font-extrabold cursor-pointer min-h-[44px] shadow-sm transition-all active:scale-98"
          >
            <MessageCircle className="h-4.5 w-4.5 fill-[#3C1E1E] text-transparent shrink-0" />
            카카오톡 3초 원클릭 로그인
          </button>
          
          <button
            onClick={handleNaverMock}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-[#03C75A] hover:bg-[#03C75A]/90 text-white text-xs sm:text-sm font-extrabold cursor-pointer min-h-[44px] shadow-sm transition-all active:scale-98"
          >
            <span className="font-extrabold font-serif text-sm">N</span>
            네이버 원클릭 간편연동
          </button>
        </div>

        {/* Separator line */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-zinc-100"></div>
          <span className="flex-shrink mx-4 text-zinc-400 text-[10px] font-bold">또는 이메일 데모 계정</span>
          <div className="flex-grow border-t border-zinc-100"></div>
        </div>

        {/* Input Form container */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 block">회원 성명</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-zinc-200 rounded-xl w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] font-semibold"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-600 block">이메일 주소</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 pr-4 py-3 border border-zinc-200 rounded-xl w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] font-semibold font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full py-3.5 rounded-2xl font-black bg-[#0F5132] hover:bg-[#0b3d25] text-white text-xs sm:text-sm cursor-pointer shadow-lg transition-all active:scale-98 min-h-[44px]"
          >
            {isRegister ? "3초 회원 가입하고 들어가기" : "가상 계정으로 빠른로그인 연동"}
          </button>
        </form>

        {/* Footer toggling triggers */}
        <div className="text-center pt-2">
          {isRegister ? (
            <button
              onClick={() => setIsRegister(false)}
              className="text-xs text-zinc-500 hover:text-zinc-800 font-semibold"
            >
              기존 계정이 있으신가요? <span className="text-[#0F5132] underline">로그인하기</span>
            </button>
          ) : (
            <button
              onClick={() => setIsRegister(true)}
              className="text-xs text-zinc-500 hover:text-zinc-800 font-semibold"
            >
              처음이신가요? <span className="text-[#0F5132] underline">회원가입하기 (5초)</span>
            </button>
          )}
        </div>

        {/* SSL notification */}
        <p className="text-[9px] text-zinc-400 flex items-center justify-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 전송 구간 가상화 암호 통신(SSL)이 적용되어 안전합니다.
        </p>

      </div>
    </div>
  );
}
