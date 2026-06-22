import React, { useState } from "react";
import { Leaf, ShoppingCart, User, Menu, X, LogOut, Award, Shield } from "lucide-react";
import { ViewType } from "../types";

interface HeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  cartCount: number;
  isLoggedIn: boolean;
  userName: string;
  userRole?: string;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Header({
  currentView,
  setCurrentView,
  cartCount,
  isLoggedIn,
  userName,
  userRole,
  onOpenAuth,
  onLogout,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems: { view: ViewType; label: string }[] = [
    { view: "home", label: "홈" },
    { view: "survey", label: "1:1 건강설문" },
    { view: "shop", label: "맞춤 건기식" },
    { view: "cart", label: "장바구니" },
    { view: "mypage", label: "마이 구독" },
  ];

  const handleNavClick = (view: ViewType) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Section */}
          <div 
            className="flex items-center gap-2 cursor-pointer select-none group"
            onClick={() => handleNavClick("home")}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F5132]/10 text-[#0F5132] transition-colors duration-200 group-hover:bg-[#0F5132]/20">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-extrabold text-[#0F5132] text-base tracking-tight leading-none">
                나만의 영양
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {menuItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  id={`nav-item-${item.view}`}
                  onClick={() => handleNavClick(item.view)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 select-none ${
                    isActive
                      ? "text-[#0F5132] bg-[#0F5132]/5 font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Section Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              id="header-cart-icon"
              onClick={() => handleNavClick("cart")}
              className={`relative p-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                currentView === 'cart'
                  ? "bg-[#0F5132]/5 text-[#0F5132]"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF7A00] text-[10px] font-bold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
                {userRole === "admin" && (
                  <button
                    id="header-admin-btn"
                    onClick={() => handleNavClick("admin")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      currentView === "admin"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-emerald-50 text-[#0F5132] hover:bg-[#0F5132]/10 border border-emerald-100"
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5" /> 관리자 콘솔
                  </button>
                )}
                <button
                  id="header-mypage-btn"
                  onClick={() => handleNavClick("mypage")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-all font-medium"
                >
                  <User className="h-4 w-4 text-[#0F5132]" />
                  <span className="font-semibold text-[#0F5132]">{userName}</span>님
                </button>
                <button
                  id="header-logout-btn"
                  onClick={onLogout}
                  className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-zinc-100 transition-all cursor-pointer"
                  title="로그아웃"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0F5132] hover:bg-[#0b3d25] shadow-sm hover:shadow active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                로그인 / 가입
              </button>
            )}
          </div>

          {/* Mobile Menu Action */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="header-mobile-cart"
              onClick={() => handleNavClick("cart")}
              className="relative p-2 text-zinc-600 hover:text-zinc-900"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF7A00] text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              id="header-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-600 hover:text-zinc-900 rounded-lg bg-zinc-50"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white/95 backdrop-blur-md px-4 py-4 space-y-2 animate-fade-in">
          {menuItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "text-[#0F5132] bg-[#0F5132]/5 font-semibold"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
                onClick={() => handleNavClick(item.view)}
              >
                {item.label}
              </button>
            );
          })}
          
          <div className="border-t border-zinc-100 pt-4 mt-2">
            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm font-semibold text-zinc-800">
                    <span className="text-[#0F5132]">{userName}</span>님 로그인됨
                  </span>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 text-xs text-red-500 font-semibold cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> 로그아웃
                  </button>
                </div>
                {userRole === "admin" && (
                  <div className="px-4">
                    <button
                      onClick={() => {
                        handleNavClick("admin");
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black text-red-700 bg-red-50 hover:bg-red-100 border border-red-150 transition-all cursor-pointer"
                    >
                      <Shield className="h-3.5 w-3.5" /> 관리자 콘솔 바로가기
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold text-white bg-[#0F5132] hover:bg-[#0b3d25] transition-all"
              >
                <User className="h-4 w-4" /> 로그인 / 회원가입
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
