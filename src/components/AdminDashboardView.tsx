import React, { useEffect, useState } from "react";
import { 
  Users, Sliders, Shield, Award, Calendar, Trash2, 
  RefreshCw, RefreshCw as LoopIcon, Smile, Heart, 
  ShoppingBag, CheckCircle2, UserCheck, ShieldAlert,
  ArrowLeft, Search, MessageSquare, Database
} from "lucide-react";
import { auth, db } from "../lib/firebase";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { UserState } from "../types";

interface AdminDashboardViewProps {
  userState: UserState;
  onBackToApp: () => void;
  showToast: (text: string, type: "success" | "info" | "warning") => void;
}

export default function AdminDashboardView({
  userState,
  onBackToApp,
  showToast
}: AdminDashboardViewProps) {
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [editingRole, setEditingRole] = useState<string>("user");

  // Fetch all users safely from the Cloud Database rules we configured
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList: any[] = [];
      querySnapshot.forEach((docSnap) => {
        userList.push({
          uid: docSnap.id,
          ...docSnap.data()
        });
      });
      setUsers(userList);
    } catch (err) {
      console.error("Error fetching users directory for admin:", err);
      showToast("회원 목록을 불러오는데 실패했습니다.", "warning");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userState.role === "admin") {
      fetchAllUsers();
    }
  }, [userState]);

  // Handle Role or Name modification in Firestore
  const handleUpdateUser = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, {
        name: editingName,
        role: editingRole
      });
      showToast(`${editingName} 회원의 권한 정보가 성공적으로 변경되었습니다.`, "success");
      setEditingUserId(null);
      fetchAllUsers();
    } catch (err) {
      console.error("Error updating user details:", err);
      showToast("회원 정보를 수정하는데 실패했습니다.", "warning");
    }
  };

  // Toggle user subscription remotely from Admin View
  const handleToggleUserSubscription = async (uid: string, subId: string, currentActive: boolean) => {
    try {
      const targetUser = users.find((u) => u.uid === uid);
      if (!targetUser) return;

      const updatedSubs = (targetUser.subscriptions || []).map((sub: any) => {
        if (sub.id === subId) {
          return { ...sub, active: !currentActive };
        }
        return sub;
      });

      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, {
        subscriptions: updatedSubs
      });
      showToast(`구독 상태가 원격으로 ${!currentActive ? "활성화" : "비활성화"} 처리되었습니다.`, "success");
      fetchAllUsers();
    } catch (err) {
      console.error("Error toggling user subscription:", err);
      showToast("구독 일시중지 수정에 실패했습니다.", "warning");
    }
  };

  // Remove/Delete user profile from system cleanly
  const handleDeleteUser = async (uid: string, userName: string) => {
    if (uid === auth.currentUser?.uid) {
      showToast("로그인된 본인 관리자 계정은 삭제할 수 없습니다.", "warning");
      return;
    }
    
    if (!window.confirm(`정말로 ${userName} 회원의 프로필을 데이터베이스에서 즉시 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "users", uid));
      showToast(`${userName} 회원 계정이 삭제되었습니다.`, "success");
      fetchAllUsers();
    } catch (err) {
      console.error("Error deleting user profile:", err);
      showToast("회원 삭제 권한이 누락 또는 실패하였습니다.", "warning");
    }
  };

  // Stats Aggregation
  const totalUsers = users.length;
  
  const allSubscriptions = users.flatMap((u) => u.subscriptions || []);
  const activeSubscriptionsCount = allSubscriptions.filter((s) => s.active).length;
  
  const totalRevenue = allSubscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => sum + (s.cost || 0), 0);

  // Lifestyle Focus Statistics
  const lifestyleCounts: { [key: string]: number } = {};
  users.forEach((u) => {
    if (u.surveyAnswers?.lifestyles) {
      u.surveyAnswers.lifestyles.forEach((life: string) => {
        lifestyleCounts[life] = (lifestyleCounts[life] || 0) + 1;
      });
    }
  });

  const getLifestyleName = (key: string) => {
    switch (key) {
      case "fatigue": return "만성 피로";
      case "skin": return "피부 미용";
      case "eyes": return "눈 건강";
      case "digestion": return "소화 & 장 기능";
      case "stress": return "스트레스 해소";
      default: return key;
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const nameMatch = (u.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = (u.role || "").toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || emailMatch || roleMatch;
  });

  if (userState.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-6">
        <div className="mx-auto h-16 w-16 bg-red-50 text-red-650 rounded-full flex items-center justify-center">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-extrabold text-zinc-900">관리자 전용 구역</h2>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          죄송합니다, 이 화면은 최고관리자('admin') 권한을 소유한 이희선 님 또는 최초 가입된 총괄 관리자만 접근할 수 있습니다.
        </p>
        <button
          onClick={onBackToApp}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-all cursor-pointer"
        >
          서비스 메인으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 select-none text-left space-y-8">
      
      {/* Header section with back button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-100">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white font-black uppercase tracking-wider bg-red-600 px-2.5 py-0.5 rounded">
              SYSTEM HOST
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Live Cloud SQL & Firebase DB Sync
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-2">
            <Shield className="h-7 w-7 text-[#0F5132]" /> 포레스트 케어 최고관리자 콘솔
          </h2>
        </div>

        <button
          onClick={onBackToApp}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 transition-all text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> 서비스 레이아웃 복귀
        </button>
      </div>

      {/* Statistics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Total Users */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 font-bold block">누적 등록 고객</span>
            <span className="text-2xl font-black text-zinc-900 font-mono">{totalUsers}명</span>
            <span className="text-[10px] text-zinc-400 block font-semibold">최초 가입자 관리 권한 자동 부여</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 2: Active Subscriptions */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 font-bold block">활성 정기 정기구독</span>
            <span className="text-2xl font-black text-emerald-800 font-mono">{activeSubscriptionsCount}개</span>
            <span className="text-[10px] text-zinc-400 block font-semibold">자동 4주/8주/12주 순환 주기</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <RefreshCw className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 3: Estimated Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 font-bold block">추정 월 정기 매출</span>
            <span className="text-2xl font-black text-zinc-900 font-mono">₩{totalRevenue.toLocaleString()}</span>
            <span className="text-[10px] text-zinc-400 block font-semibold">구독 할인 50% 적용 실매출</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 4: Database Config */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 font-bold block">보안 데이터 소스</span>
            <span className="text-sm font-black text-zinc-800 font-mono block truncate">login-made</span>
            <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-extrabold mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Cloud Firestore 연동중
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-zinc-50 text-zinc-600 flex items-center justify-center">
            <Database className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Main console content split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column - User Directory Directory & Moderation */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-zinc-100 p-6 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-[#0F5132]" /> 데이터베이스 회원 관리 대시보드
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">실시간 Firebase Auth와 연동된 정회원 명부입니다.</p>
            </div>

            {/* Reload and Search bar */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="이름, 이메일, 권한 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 border border-zinc-200 rounded-xl text-xs w-full focus:outline-none focus:ring-1 focus:ring-[#0F5132] font-semibold"
                />
              </div>

              <button
                onClick={fetchAllUsers}
                className="p-2 border border-zinc-200 rounded-xl text-zinc-600 hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
                title="새로고침"
              >
                <LoopIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F5132] mx-auto"></div>
              <p className="text-xs text-zinc-400 font-bold">보안 호스트 데이터 로드 중...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-20 text-center text-zinc-450 text-xs font-semibold">
              조회 조건에 부합하는 회원이 존재하지 않습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const isEditing = editingUserId === user.uid;
                const hasSurvey = !!user.surveyAnswers;
                const subsCount = (user.subscriptions || []).length;

                return (
                  <div 
                    key={user.uid}
                    className="p-5 border border-zinc-100 rounded-2xl bg-zinc-50/30 space-y-4 hover:border-zinc-200 transition-all text-left"
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="border border-zinc-300 rounded px-2 py-0.5 text-xs font-bold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
                            />
                          ) : (
                            <h4 className="font-extrabold text-zinc-850 text-sm flex items-center gap-1.5">
                              {user.name || "미지정"}
                              {user.role === "admin" && (
                                <span className="text-[9px] bg-red-50 text-red-700 font-black px-1.5 py-0.5 rounded border border-red-100 uppercase">
                                  ADMIN
                                </span>
                              )}
                            </h4>
                          )}
                          <span className="text-[10px] text-zinc-400 font-mono">UID: {user.uid.substring(0, 8)}...</span>
                        </div>
                        <p className="text-xs text-zinc-500 font-semibold font-mono">{user.email}</p>
                      </div>

                      {/* Controls or Action buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <select
                              value={editingRole}
                              onChange={(e) => setEditingRole(e.target.value)}
                              className="border border-zinc-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#0F5132] font-semibold text-zinc-800 bg-white"
                            >
                              <option value="user">일반 회원 (user)</option>
                              <option value="admin">최고관리자 (admin)</option>
                            </select>
                            <button
                              onClick={() => handleUpdateUser(user.uid)}
                              className="bg-emerald-800 hover:bg-emerald-900 border border-emerald-900 px-3 py-1 rounded-lg text-white font-bold text-xs select-none transition-all"
                            >
                              저장
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              className="bg-zinc-200 hover:bg-zinc-350 px-3 py-1 rounded-lg text-zinc-700 font-bold text-xs select-none transition-all"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingUserId(user.uid);
                                setEditingName(user.name || "");
                                setEditingRole(user.role || "user");
                              }}
                              className="border border-zinc-200 bg-white hover:bg-zinc-50 px-2.5 py-1 rounded-lg text-zinc-650 font-bold text-[10px] transition-all cursor-pointer"
                            >
                              권한 및 이름 변경
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.uid, user.name || "회원")}
                              className="p-1 px-1.5 rounded-lg border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
                              title="회원 프로필 즉시 파기"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Meta survey & custom subscription summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-zinc-200/50">
                      
                      {/* Survey state */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-extrabold text-zinc-400 block uppercase tracking-wider">나만의 맞춤 영양진단 정보</span>
                        {hasSurvey ? (
                          <div className="p-2.5 bg-white border border-zinc-100 rounded-xl space-y-1 text-xs">
                            <div className="flex justify-between text-[11px] font-bold text-zinc-700">
                              <span>성별 & 연령</span>
                              <span className="text-[#0F5132]">
                                {user.surveyAnswers.gender === "male" ? "남성" : "여성"} / {user.surveyAnswers.ageGroup === "2040" ? "20~40대" : user.surveyAnswers.ageGroup === "3050" ? "30~50대" : "시니어"}
                              </span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold text-zinc-700">
                              <span>복용 선호 제형</span>
                              <span className="text-[#FF7A00]">
                                {user.surveyAnswers.preferredForm === "pill" ? "알약형" : user.surveyAnswers.preferredForm === "powder" ? "가루형" : user.surveyAnswers.preferredForm === "liquid" ? "액상형" : "상관없음"}
                              </span>
                            </div>
                            <div className="text-[10px] border-t border-zinc-100 pt-1 mt-1 font-medium text-zinc-500">
                              관심 분야: {(user.surveyAnswers.lifestyles || []).map((l: string) => getLifestyleName(l)).join(", ") || "없음"}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-zinc-400 font-semibold italic p-2 bg-zinc-100/30 border border-dashed rounded-lg">
                            "건강 설문 이력이 확인되지 않은 고객입니다."
                          </div>
                        )}
                      </div>

                      {/* Subscriptions list */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">구독 중인 맞춤 영양팩 ({subsCount}개)</span>
                        </div>
                        {subsCount > 0 ? (
                          <div className="space-y-1.5">
                            {user.subscriptions.map((sub: any) => (
                              <div key={sub.id} className="flex justify-between items-center p-2 bg-white border border-zinc-150 rounded-xl text-xs">
                                <div className="space-y-0.5">
                                  <span className="font-extrabold text-zinc-800 text-[11px] block">{sub.productName}</span>
                                  <span className="text-[9px] text-zinc-400 block font-bold font-mono">
                                    ₩{sub.cost.toLocaleString()} / {sub.deliveryCycle}주 정기 배송
                                  </span>
                                </div>

                                <button
                                  onClick={() => handleToggleUserSubscription(user.uid, sub.id, sub.active)}
                                  className={`px-2 py-1 rounded font-bold text-[9px] transition-all cursor-pointer ${
                                    sub.active 
                                      ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-250" 
                                      : "bg-red-50 text-red-800 hover:bg-red-100 border border-red-250"
                                  }`}
                                >
                                  {sub.active ? "활성(일시 정지)" : "중지(활성화 시키기)"}
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-zinc-400 font-semibold italic p-2 bg-zinc-100/30 border border-dashed rounded-lg">
                            "정기 배송 구독 중인 정기 영양팩이 현재 없습니다."
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Column - User Health Core Insights */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-gradient-to-br from-[#0F5132]/95 to-[#0b3d25] text-white p-6 rounded-3xl space-y-4 shadow-sm text-left relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            
            <h3 className="text-sm font-extrabold tracking-tight flex items-center gap-1.5">
              <Award className="h-4 w-4 text-[#FF7A00]" /> 실시간 웰니스 통계 대시보드
            </h3>
            
            <p className="text-zinc-200 text-xs leading-relaxed">
              가입된 정회원들의 익명 처리된 건강 설문 원본을 분석한 주요 카테고리별 생활습관 관심 데이터 분포입니다.
            </p>

            <div className="space-y-3 pt-2">
              {["fatigue", "stress", "eyes", "skin", "digestion"].map((life) => {
                const count = lifestyleCounts[life] || 0;
                const percentage = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
                
                return (
                  <div key={life} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-100">
                      <span>{getLifestyleName(life)}</span>
                      <span>{count}명 ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-[#FF7A00] h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/10 pt-4 text-[10px] text-zinc-300 font-medium">
              * 위 인사이트를 기반으로 신규 맞춤 영양 성분 기획 및 연령별 맞춤 팩 추가를 연계할 수 있습니다.
            </div>
          </div>

          {/* Database Actions */}
          <div className="bg-white rounded-3xl border border-zinc-105 p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-zinc-900 tracking-wider uppercase flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-zinc-500" /> 호스트 관리자 보안 지침
            </h4>
            
            <ul className="text-xs text-zinc-500 space-y-2.5 font-medium leading-relaxed list-disc pl-4 text-left">
              <li>익명 수집된 회원들의 성별, 생년월일, 설문 응답은 개인정보 보호법에 따라 엄격히 보관됩니다.</li>
              <li>데이터 정렬 및 유효성 검사는 백 엔드 D2C 검수 모듈을 기반으로 보안 점검이 수시 진행됩니다.</li>
              <li>중대 변경 사항 발생 시 Firestore의 백업 규칙 명세를 꼭 검수하세요.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
