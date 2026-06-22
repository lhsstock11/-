import React, { useState } from "react";
import { X, Mail, ShieldCheck, Heart, User, Sparkles, Lock, AlertCircle } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, getDocs, collection, query, limit } from "firebase/firestore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, email: string) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  
  const [email, setEmail] = useState<string>("heesun@example.com");
  const [password, setPassword] = useState<string>("heesun123");
  const [name, setName] = useState<string>("이희선");
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (isRegister) {
        // 1. Firebase Auth Signup
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const user = credential.user;

        // Check if this is the very first user in the system safely
        let isFirstUser = false;
        try {
          const usersSnap = await getDocs(query(collection(db, "users"), limit(1)));
          isFirstUser = usersSnap.empty;
        } catch (e) {
          console.warn("Could not check if first user:", e);
        }
        const isTargetAdmin = email.toLowerCase() === "lhsstock11@gmail.com";
        const assignedRole = (isFirstUser || isTargetAdmin) ? "admin" : "user";

        // 2. Write client profile doc to Firestore database (database-level verification)
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          name: name,
          email: email,
          surveyAnswers: null,
          subscriptions: [],
          role: assignedRole
        });

        onLoginSuccess(name, email);
      } else {
        // 1. Firebase Auth Signin
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const user = credential.user;

        // 2. Fetch profile doc
        const userDocRef = doc(db, "users", user.uid);
        const snap = await getDoc(userDocRef);
        let userName = name;
        const isTargetAdmin = email.toLowerCase() === "lhsstock11@gmail.com";

        if (snap.exists()) {
          const data = snap.data();
          userName = data.name || name;
          if (isTargetAdmin && data.role !== "admin") {
            await setDoc(userDocRef, { role: "admin" }, { merge: true });
          }
        } else {
          const assignedRole = isTargetAdmin ? "admin" : "user";
          // If profile doc doesn't exist yet, we create a default one
          await setDoc(userDocRef, {
            name: name,
            email: email,
            surveyAnswers: null,
            subscriptions: [],
            role: assignedRole
          });
        }

        onLoginSuccess(userName, email);
      }
      onClose();
    } catch (error: any) {
      console.error("Firebase Authentication error:", error);
      let korMessage = "로그인 또는 회원가입 중 오류가 발생했습니다.";
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        korMessage = "이메일 또는 비밀번호가 불일치합니다.";
      } else if (error.code === "auth/email-already-in-use") {
        korMessage = "이미 사용 중인 이메일입니다.";
      } else if (error.code === "auth/weak-password") {
        korMessage = "비밀번호는 최소 6자 이상이어야 합니다.";
      } else if (error.code === "auth/invalid-email") {
        korMessage = "올바른 이메일 형식이 아닙니다.";
      }
      setErrorMessage(korMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const user = credential.user;

      const userDocRef = doc(db, "users", user.uid);
      const snap = await getDoc(userDocRef);
      const finalName = user.displayName || "구글 회원";
      const finalEmail = user.email || "";

      const isTargetAdmin = finalEmail.toLowerCase() === "lhsstock11@gmail.com";

      if (!snap.exists()) {
        // Check if this is the very first user in the system safely
        let isFirstUser = false;
        try {
          const usersSnap = await getDocs(query(collection(db, "users"), limit(1)));
          isFirstUser = usersSnap.empty;
        } catch (e) {
          console.warn("Could not check if first user:", e);
        }
        const assignedRole = (isFirstUser || isTargetAdmin) ? "admin" : "user";

        await setDoc(userDocRef, {
          name: finalName,
          email: finalEmail,
          surveyAnswers: null,
          subscriptions: [],
          role: assignedRole
        });
      } else {
        const existingData = snap.data();
        if (!existingData.name && finalName) {
          await setDoc(userDocRef, { name: finalName }, { merge: true });
        }
        if (isTargetAdmin && existingData.role !== "admin") {
          await setDoc(userDocRef, { role: "admin" }, { merge: true });
        }
      }

      const freshSnap = await getDoc(userDocRef);
      const chosenName = freshSnap.exists() ? (freshSnap.data().name || finalName) : finalName;
      onLoginSuccess(chosenName, finalEmail);
      onClose();
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      if (error.code === "auth/popup-blocked") {
        setErrorMessage("브라우저 팝업 차단을 해제하고 다시 시도해 주세요.");
      } else if (error.code === "auth/cancelled-popup-request" || error.code === "auth/popup-closed-by-user") {
        setErrorMessage("사용자가 로그인 팝업 창을 닫았습니다.");
      } else {
        setErrorMessage("구글 로그인 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
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
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-800 text-xs sm:text-sm font-extrabold cursor-pointer border border-zinc-200 min-h-[44px] shadow-sm transition-all active:scale-98 disabled:opacity-60"
          >
            <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google 계정으로 간편 로그인
          </button>
        </div>

        {/* Separator line */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-zinc-100"></div>
          <span className="flex-shrink mx-4 text-zinc-400 text-[10px] font-bold">또는 이메일 계정 통합인증</span>
          <div className="flex-grow border-t border-zinc-100"></div>
        </div>

        {/* Input Form container */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-650 rounded-xl text-xs flex items-start gap-2 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 block">회원 성명</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="홍길동"
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
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 pr-4 py-3 border border-zinc-200 rounded-xl w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] font-semibold font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-600 block">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
              <input
                type="password"
                required
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-4 py-3 border border-zinc-200 rounded-xl w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] font-semibold font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-black bg-[#0F5132] hover:bg-[#0b3d25] text-white text-xs sm:text-sm cursor-pointer shadow-lg transition-all active:scale-98 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                인증 서버 확인 중...
              </>
            ) : isRegister ? (
              "실시간 이메일 회원 가입하기"
            ) : (
              "안전 원클릭 비밀번호 로그인"
            )}
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
