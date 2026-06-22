import React, { useState, useEffect } from "react";
import { ViewType, Product, CartItem, UserState, SurveyAnswer, SubscriptionSchedule } from "./types";
import { PRODUCTS_MOCK_DATA } from "./data";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import SurveyView from "./components/SurveyView";
import ResultView from "./components/ResultView";
import DetailViewModal from "./components/DetailViewModal";
import CartView from "./components/CartView";
import CheckoutView from "./components/CheckoutView";
import MyPageView from "./components/MyPageView";
import AdminDashboardView from "./components/AdminDashboardView";
import AuthModal from "./components/AuthModal";
import NotificationToast, { ToastMessage } from "./components/NotificationToast";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType | "checkout">("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "toss">("card");

  // 1. Load initial user states with fallback matching 이희선
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem("forest_user_session");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default pre-login state
      }
    }
    return {
      isLoggedIn: true, // Default to true as user is Lee Hee Sun
      name: "이희선",
      email: "heesun@example.com",
      surveyAnswers: null,
      subscriptions: []
    };
  });

  // 2. Load Cart states
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("forest_cart_items");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Sync state modifications to LocalStorage
  useEffect(() => {
    localStorage.setItem("forest_user_session", JSON.stringify(userState));
  }, [userState]);

  useEffect(() => {
    localStorage.setItem("forest_cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  // Firebase Realtime State Syncer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userDocRef);
          
          const userEmail = firebaseUser.email || "";
          const isTargetAdmin = userEmail.toLowerCase() === "lhsstock11@gmail.com";

          if (snap.exists()) {
            const data = snap.data();
            const finalRole = isTargetAdmin ? "admin" : (data.role || "user");

            setUserState({
              isLoggedIn: true,
              name: data.name || "회원",
              email: data.email || userEmail || "",
              surveyAnswers: data.surveyAnswers || null,
              subscriptions: data.subscriptions || [],
              role: finalRole
            });

            if (data.role !== finalRole) {
              await setDoc(userDocRef, { role: finalRole }, { merge: true });
            }
          } else {
            const finalRole = isTargetAdmin ? "admin" : "user";
            const finalName = firebaseUser.displayName || "회원";
            const finalEmail = userEmail;

            // Initiate db with correct values from current auth profile, NOT the stale state
            await setDoc(userDocRef, {
              name: finalName,
              email: finalEmail,
              surveyAnswers: null,
              subscriptions: [],
              role: finalRole
            });
          }
        } catch (e) {
          console.error("Firestore user profile fetch error:", e);
        }
      } else {
        const explicitlyLoggedOut = localStorage.getItem("forest_explicit_logout") === "true";
        if (explicitlyLoggedOut) {
          setUserState({
            isLoggedIn: false,
            name: "",
            email: "",
            surveyAnswers: null,
            subscriptions: [],
            role: "user"
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save changes back to Firestore (Cloud Database Synchronization)
  useEffect(() => {
    const user = auth.currentUser;
    // Guard: Only save if user is logged in, and local state email matches firebase auth email
    // This prevents overwriting the new user's document with stale local state during login transitions
    if (user && userState.isLoggedIn && userState.email.toLowerCase() === user.email?.toLowerCase()) {
      const userDocRef = doc(db, "users", user.uid);
      setDoc(userDocRef, {
        name: userState.name,
        email: userState.email,
        surveyAnswers: userState.surveyAnswers,
        subscriptions: userState.subscriptions,
        role: userState.role || "user"
      }, { merge: true }).catch((err) => {
        console.error("Error saving profile to Firestore:", err);
      });
    }
  }, [userState]);

  // Toast trigger utility
  const showToast = (text: string, type: "success" | "info" | "warning" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  // 3. Cart control logic handlers
  const handleAddToCart = (product: Product, isSubscription: boolean, cycle: number = 4) => {
    const itemId = `${product.id}_${isSubscription ? "sub" : "one"}_${cycle}`;
    
    setCartItems((prev) => {
      const existsIndex = prev.findIndex((item) => item.id === itemId);
      if (existsIndex > -1) {
        const next = [...prev];
        next[existsIndex].quantity += 1;
        showToast(`${product.name} 상품 수량이 1개 추가되었습니다.`, "info");
        return next;
      } else {
        showToast(`${product.name} 상품이 장바구니에 정상 수납되었습니다.`, "success");
        return [...prev, { id: itemId, product, quantity: 1, isSubscription, deliveryCycle: cycle }];
      }
    });

    // Close detail modal on added
    setSelectedProduct(null);
  };

  const handleUpdateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems((prev) => {
      const matched = prev.find((i) => i.id === itemId);
      if (matched) {
        showToast(`${matched.product.name} 상품이 장바구니에서 삭제되었습니다.`, "warning");
      }
      return prev.filter((item) => item.id !== itemId);
    });
  };

  const handleUpdateCartCycle = (itemId: string, newCycle: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, deliveryCycle: newCycle } : item))
    );
    showToast("정기 배송 주기를 성공적으로 조절했습니다.", "success");
  };

  // 4. Survey completes
  const handleCompleteSurvey = (answers: SurveyAnswer) => {
    setUserState((prev) => ({
      ...prev,
      surveyAnswers: answers,
    }));
    showToast("건강 통계 보정이 완료되었습니다! 추천 영양이 매칭되었습니다.", "success");
    setCurrentView("result");
  };

  const handleResetSurvey = () => {
    setUserState((prev) => ({
      ...prev,
      surveyAnswers: null,
    }));
    showToast("설문 진단 이력이 초기화되었습니다. 설문을 다시 시작해 주세요.", "warning");
    setCurrentView("survey");
  };

  // 5. Auth handlers
  const handleLoginSuccess = (name: string, email: string) => {
    localStorage.removeItem("forest_explicit_logout");
    setUserState((prev) => ({
      ...prev,
      isLoggedIn: true,
      name,
      email,
    }));
    showToast(`${name} 님, 환영합니다! 포레스트 케어로 안전 연결되었습니다.`, "success");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Firebase SignOut error:", e);
    }
    localStorage.setItem("forest_explicit_logout", "true");
    setUserState({
      isLoggedIn: false,
      name: "",
      email: "",
      surveyAnswers: null,
      subscriptions: [],
    });
    setCartItems([]);
    showToast("로그아웃 되었습니다. 담아둔 장바구니 및 설문이 해제되었습니다.", "info");
    setCurrentView("home");
  };

  // 6. One-click subscribe multiple curation items
  const handleSubscribeAllRecommended = (products: Product[]) => {
    products.forEach((prod) => {
      // defaults to subscribing 4-weeks cycle
      handleAddToCart(prod, true, 4);
    });
    setCurrentView("cart");
  };

  // 7. Simulated checkout trigger
  const handleProceedToCheckout = (method: "card" | "toss" = "card") => {
    if (!userState.isLoggedIn) {
      showToast("비회원 주문 배송 저지를 위해 로그인이 먼저 필요합니다.", "warning");
      setAuthModalOpen(true);
      return;
    }
    setSelectedPaymentMethod(method);
    setCurrentView("checkout");
  };

  const handleOrderCompleted = (shippingAddress: string, paymentMethod: string) => {
    // Convert cart items directly into active user subscriptions
    const newSubs: SubscriptionSchedule[] = cartItems
      .filter((i) => i.isSubscription)
      .map((item) => {
        const today = new Date();
        today.setDate(today.getDate() + item.deliveryCycle * 7);
        const nextDateStr = today.toISOString().split("T")[0];

        // discounted price
        const price = Math.floor(
          item.product.price * (1 - item.product.subscriptionDiscount / 100)
        );

        return {
          id: `sub_${Math.random().toString(36).substring(2, 9)}`,
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.image,
          cost: price * item.quantity,
          deliveryCycle: item.deliveryCycle,
          nextDeliveryDate: nextDateStr,
          active: true,
        };
      });

    setUserState((prev) => ({
      ...prev,
      subscriptions: [...prev.subscriptions, ...newSubs],
    }));

    // Empty cart
    setCartItems([]);
    showToast("감사합니다! 맞춤형 원클릭 구독 배송이 활성화되었습니다.", "success");
  };

  // 8. MyPage subscriber toggles
  const handleToggleSubscription = (subId: string) => {
    setUserState((prev) => {
      const updated = prev.subscriptions.map((sub) => {
        if (sub.id === subId) {
          const nextActive = !sub.active;
          showToast(
            nextActive
              ? "정기구독 서비스 제어가 재개되엇습니다. 영업 기준일에 출발합니다."
              : "위약금 걱정 없이 구독 일시정지 완료! 언제든 클릭 한 번으로 활성화 가능합니다.",
            nextActive ? "success" : "warning"
          );
          return { ...sub, active: nextActive };
        }
        return sub;
      });
      return { ...prev, subscriptions: updated };
    });
  };

  const handleUpdateSubscriptionCycle = (subId: string, newCycle: number) => {
    setUserState((prev) => {
      const updated = prev.subscriptions.map((sub) => {
        if (sub.id === subId) {
          return { ...sub, deliveryCycle: newCycle };
        }
        return sub;
      });
      return { ...prev, subscriptions: updated };
    });
    showToast(`배송 주기가 성공적으로 갱신되었습니다.`, "info");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-stone-800 antialiased relative">
      
      {/* 1. Header component */}
      <Header
        currentView={currentView === "checkout" ? "cart" : currentView} // highlight cart during checkout
        setCurrentView={(view) => setCurrentView(view)}
        cartCount={cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
        isLoggedIn={userState.isLoggedIn}
        userName={userState.name}
        userRole={userState.role}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. Main content viewport centering */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {currentView === "home" && (
          <HomeView
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(p, sub) => handleAddToCart(p, sub, 4)}
            setCurrentView={(view) => setCurrentView(view)}
            userName={userState.name}
          />
        )}

        {currentView === "survey" && (
          <SurveyView
            onCompleteSurvey={handleCompleteSurvey}
            userName={userState.name}
          />
        )}

        {currentView === "result" && (
          <ResultView
            answers={userState.surveyAnswers}
            userName={userState.name}
            onResetSurvey={handleResetSurvey}
            onSubscribeAllRecommended={handleSubscribeAllRecommended}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentView === "shop" && (
          <HomeView
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(p, sub) => handleAddToCart(p, sub, 4)}
            setCurrentView={(view) => setCurrentView(view)}
            userName={userState.name}
          />
        )}

        {currentView === "cart" && (
          <CartView
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onUpdateCycle={handleUpdateCartCycle}
            onProceedToCheckout={handleProceedToCheckout}
            setCurrentView={(view) => setCurrentView(view)}
          />
        )}

        {currentView === "checkout" && (
          <CheckoutView
            cartItems={cartItems}
            userName={userState.name}
            userEmail={userState.email}
            onOrderCompleted={handleOrderCompleted}
            setCurrentView={(view) => setCurrentView(view)}
            defaultPaymentMethod={selectedPaymentMethod}
          />
        )}

        {currentView === "mypage" && (
          <MyPageView
            userState={userState}
            onToggleSubscription={handleToggleSubscription}
            onUpdateSubscriptionCycle={handleUpdateSubscriptionCycle}
            onResetSurvey={handleResetSurvey}
            setCurrentView={(view) => setCurrentView(view)}
          />
        )}

        {currentView === "admin" && (
          <AdminDashboardView
            userState={userState}
            onBackToApp={() => setCurrentView("home")}
            showToast={showToast}
          />
        )}
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Product parameters Detail Modal overlay */}
      {selectedProduct && (
        <DetailViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, sub) => handleAddToCart(p, sub, 4)}
        />
      )}

      {/* 5. Fast social authorization modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 6. Floating Notification Toast system overlay */}
      <NotificationToast toasts={toasts} setToasts={setToasts} />

    </div>
  );
}
