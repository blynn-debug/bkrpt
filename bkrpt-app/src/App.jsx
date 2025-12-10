import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, MapPin, User, AlertCircle, Plus, Building, Download, Star, ArrowUpDown, ChevronDown, Check, X, Filter, Clock, Phone, TrendingDown, Bookmark, BookmarkPlus, Trash2, LogIn, LogOut, Loader2, RotateCcw, Mail, FileText } from 'lucide-react';

// =====================================================
// Supabase 클라이언트 설정
// =====================================================
const supabaseUrl = 'https://rnrtlkxykmihmmttpvav.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucnRsa3h5a21paG1tdHRwdmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTMyNzMsImV4cCI6MjA4MDg4OTI3M30.OC8g-RMK1EIG3nEQNMtP0mks2U0NoTc27sPYRdfwXho';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- 초기 데이터 (샘플 - Supabase 연결 실패 시 폴백용) ---
const INITIAL_DATA = [
  {
    id: 1,
    uniqueCode: "2025-0101",
    category: "주거용",
    debtorName: "구기남",
    trusteeName: "박범진",
    contact: "02-587-2155",
    address: "서울 강동구 암사동 486-72, 구성빌 201호",
    area: "51.49m²",
    isShare: true,
    shareRatio: "40333분의 27",
    restrictions: "임차권 설정 (보증금 반환 채무 인수 조건)",
    arrears: "체납처분 내역 있음",
    remarks: "가족(모, 누나)이 공유자임",
    place: "서울 강남구 테헤란로 120, 5층",
    parcels: [
      { address: "서울 강동구 암사동 486-72, 구성빌 201호", landType: "아파트", area: "51.49㎡", shareRatio: "40333분의 27" }
    ],
    deadlines: [
      { round: 1, date: "2025-11-12", price: 110000000 },
      { round: 2, date: "2025-11-26", price: 88000000 },
      { round: 3, date: "2025-12-10", price: 70400000 },
    ],
    conditions: "기존 임대인 지위 승계",
    status: "진행중",
    isFavorite: true
  },
  {
    id: 2,
    uniqueCode: "2025-0102",
    category: "토지",
    debtorName: "한명자",
    trusteeName: "강승범",
    contact: "02-595-0001",
    address: "강원도 양구군 등 7필지 일괄",
    area: "총 7필지 임야",
    isShare: true,
    shareRatio: "토지 지분 전체",
    restrictions: "일괄매각, 압류 등 체납처분 존재",
    arrears: "말소 없이 매각",
    remarks: "토지 지분 전체 매각",
    place: "서울 서초구 서초대로 283, 4층 (서초동, 남촌빌딩) 법무법인(유한) 산경 변호사 강승범",
    parcels: [
      { address: "강원특별자치도 양구군 양구읍 하리 산15-4", landType: "임야", area: "5,386㎡", shareRatio: "139/5386" },
      { address: "경기도 고양시 덕양구 주교동 380-10", landType: "임야", area: "14,925㎡", shareRatio: "16.6/14925" },
      { address: "경기도 광주시 양벌동 산12-3", landType: "임야", area: "27,060㎡", shareRatio: "165/27060" },
      { address: "세종특별자치시 부강면 문곡리 산25-41", landType: "임야", area: "16,530㎡", shareRatio: "331/16530" },
      { address: "경기도 안성시 일죽면 화봉리 산53", landType: "임야", area: "60,099㎡", shareRatio: "66.11/60099" },
      { address: "경기도 용인시 수지구 신봉동 산126-2", landType: "임야", area: "39,842㎡", shareRatio: "99.18/39842" },
      { address: "세종특별자치시 전동면 송정리 산18", landType: "임야", area: "58,215㎡", shareRatio: "231/58215" },
    ],
    deadlines: [
      { round: 1, date: "2025-10-29", price: 11000000 },
      { round: 2, date: "2025-11-05", price: 10000000 },
      { round: 3, date: "2025-11-12", price: 9000000 },
    ],
    conditions: "7필지 지분 일괄매각",
    status: "진행중",
    isFavorite: false
  },
  {
    id: 3,
    uniqueCode: "2025-0103",
    category: "상업 및 산업용",
    debtorName: "풍성기전(주)",
    trusteeName: "임종엽",
    contact: "070-7781-0220",
    address: "서울 송파구 문정동 가든파이브 라이프 L-8122, 8123호",
    area: "46.34m² (2개호실)",
    isShare: false,
    shareRatio: "전체",
    restrictions: "없음 (현재 공실)",
    arrears: "미납 관리비 매수인 부담",
    remarks: "2개 호실 일괄매각",
    place: "온비드 전자입찰",
    parcels: [
      { address: "서울 송파구 문정동 가든파이브 라이프 L-8122호", landType: "상가", area: "23.17㎡", shareRatio: "전체" },
      { address: "서울 송파구 문정동 가든파이브 라이프 L-8123호", landType: "상가", area: "23.17㎡", shareRatio: "전체" },
    ],
    deadlines: [
      { round: 1, date: "2025-12-15", price: 159600000 },
      { round: 2, date: "2025-12-16", price: 151200000 },
    ],
    conditions: "일괄매각, 부가세 포함",
    status: "진행중",
    isFavorite: false
  }
];

// --- 가격대 옵션 정의 ---
const PRICE_RANGES = [
  { label: '가격대: 전체', min: 0, max: Infinity },
  { label: '100만원 미만', min: 0, max: 1000000 },
  { label: '100만원 ~ 500만원', min: 1000000, max: 5000000 },
  { label: '500만원 ~ 1,000만원', min: 5000000, max: 10000000 },
  { label: '1,000만원 ~ 3,000만원', min: 10000000, max: 30000000 },
  { label: '3,000만원 ~ 6,000만원', min: 30000000, max: 60000000 },
  { label: '6,000만원 ~ 1억원', min: 60000000, max: 100000000 },
  { label: '1억원 ~ 3억원', min: 100000000, max: 300000000 },
  { label: '3억원 이상', min: 300000000, max: Infinity },
];

// --- 지역 목록 정의 ---
const REGION_LIST = [
  '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산',
  '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
];

// --- 종류 목록 정의 ---
const CATEGORY_LIST = ['주거용', '상업 및 산업용', '토지'];

// =====================================================
// [핵심] 현재 입찰 정보를 가져오는 공통 함수
// =====================================================
const getCurrentBidInfo = (deadlines) => {
  if (!deadlines || deadlines.length === 0) {
    return {
      price: null,
      date: '-',
      round: null,
      label: '-',
      status: 'none',
      isExpired: true,
      daysLeft: null
    };
  }

  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const todayKST = new Date(utc + KR_TIME_DIFF);
  todayKST.setHours(0, 0, 0, 0);

  const activeIndex = deadlines.findIndex(d => {
    const targetDate = new Date(d.date);
    targetDate.setHours(0, 0, 0, 0);
    return targetDate >= todayKST;
  });

  if (activeIndex === -1) {
    const lastRound = deadlines[deadlines.length - 1];
    return {
      price: lastRound.price,
      date: lastRound.date,
      round: lastRound.round,
      label: '수의계약 문의',
      status: 'expired',
      isExpired: true,
      daysLeft: null
    };
  }

  const currentRound = deadlines[activeIndex];
  const targetDate = new Date(currentRound.date);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate - todayKST;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let label = `마감 ${diffDays}일전`;
  let status = 'active';

  if (diffDays === 0) {
    label = '마감 당일';
    status = 'today';
  } else if (diffDays === 1) {
    label = '마감 1일전';
    status = 'tomorrow';
  } else if (diffDays <= 7) {
    status = 'imminent';
  }

  return {
    price: currentRound.price,
    date: currentRound.date,
    round: currentRound.round,
    label: label,
    status: status,
    isExpired: false,
    daysLeft: diffDays
  };
};

// 하락률 계산 함수
const calculateDropRate = (currentPrice, previousPrice) => {
  if (!previousPrice || !currentPrice) return null;
  const rate = ((previousPrice - currentPrice) / previousPrice) * 100;
  return rate.toFixed(1);
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [rememberCredentials, setRememberCredentials] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState([]);
  const [userFavoriteIds, setUserFavoriteIds] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('bid');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategories, setFilterCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const [filterShare, setFilterShare] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  const [filterPriceIndex, setFilterPriceIndex] = useState(0);
  const [filterRegions, setFilterRegions] = useState([]);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const regionDropdownRef = useRef(null);
  const [filterPerson, setFilterPerson] = useState('');
  const [savedFilters, setSavedFilters] = useState([]);
  const [isFilterBookmarkOpen, setIsFilterBookmarkOpen] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const filterBookmarkRef = useRef(null);

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    const savedRememberCredentials = localStorage.getItem('rememberCredentials') === 'true';
    const savedAutoLogin = localStorage.getItem('autoLogin') === 'true';

    if (savedRememberCredentials && savedEmail) {
      setAuthEmail(savedEmail);
      setRememberCredentials(true);
    }
    if (savedRememberCredentials && savedPassword) {
      try { setAuthPassword(atob(savedPassword)); } catch (e) { console.error('비밀번호 디코딩 실패'); }
    }
    if (savedAutoLogin) setAutoLogin(true);
    if (savedAutoLogin && savedEmail && savedPassword) autoLoginAttempt(savedEmail, atob(savedPassword));
  }, []);

  const autoLoginAttempt = async (email, password) => {
    try { await supabase.auth.signInWithPassword({ email, password }); } catch (err) { console.error('자동 로그인 실패:', err); }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadUserFavorites(session.user.id);
        loadSavedFilters(session.user.id);
      } else {
        setUserFavoriteIds(new Set());
        setSavedFilters([]);
      }
    });
    loadProperties();
    return () => { subscription.unsubscribe(); };
  }, []);

  const loadProperties = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: properties, error } = await supabase
        .from('properties')
        .select(`*, bid_rounds (id, round_number, bid_date, bid_time, min_price, discount_rate, status), property_parcels (id, parcel_address, land_type, area, share_ratio, sort_order)`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (properties && properties.length > 0) {
        const formattedData = properties.map(property => ({
          id: property.id,
          uniqueCode: property.unique_code,
          category: property.category,
          debtorName: property.debtor_name,
          trusteeName: property.trustee_name,
          contact: property.trustee_contact,
          address: property.property_address + (property.property_detail_address ? `, ${property.property_detail_address}` : ''),
          area: property.area,
          isShare: property.is_share,
          shareRatio: property.share_ratio || '전체',
          restrictions: property.restrictions,
          arrears: property.arrears,
          remarks: property.remarks,
          place: property.bid_place,
          parcels: (property.property_parcels || [])
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map(parcel => ({ address: parcel.parcel_address, landType: parcel.land_type, area: parcel.area, shareRatio: parcel.share_ratio })),
          deadlines: (property.bid_rounds || [])
            .sort((a, b) => a.round_number - b.round_number)
            .map(round => ({ round: round.round_number, date: round.bid_date, price: round.min_price })),
          conditions: property.conditions,
          status: property.status,
          caseNumber: property.case_number,
          trusteeAddress: property.trustee_address,
          trusteeBankAccount: property.trustee_bank_account,
          bidMethod: property.bid_method,
          originalPdfUrl: property.original_pdf_url
        }));
        setData(formattedData);
      } else {
        setData(INITIAL_DATA);
      }
    } catch (err) {
      console.error('데이터 로드 오류:', err);
      setData(INITIAL_DATA);
      setError('서버 연결 실패. 샘플 데이터를 표시합니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserFavorites = async (userId) => {
    try {
      const { data: favorites, error } = await supabase.from('user_favorites').select('property_id').eq('user_id', userId);
      if (error) throw error;
      setUserFavoriteIds(new Set(favorites.map(f => f.property_id)));
    } catch (err) { console.error('관심 물건 로드 오류:', err); }
  };

  const loadSavedFilters = async (userId) => {
    try {
      const { data: filters, error } = await supabase.from('saved_filters').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error) throw error;
      setSavedFilters(filters.map(f => ({ id: f.id, name: f.name, filters: f.filter_config, createdAt: f.created_at })));
    } catch (err) { console.error('검색 조건 로드 오류:', err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      if (error) throw error;
      if (rememberCredentials) {
        localStorage.setItem('savedEmail', authEmail);
        localStorage.setItem('savedPassword', btoa(authPassword));
        localStorage.setItem('rememberCredentials', 'true');
      } else {
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedPassword');
        localStorage.setItem('rememberCredentials', 'false');
      }
      if (autoLogin) {
        localStorage.setItem('autoLogin', 'true');
        if (!rememberCredentials) {
          localStorage.setItem('savedEmail', authEmail);
          localStorage.setItem('savedPassword', btoa(authPassword));
          localStorage.setItem('rememberCredentials', 'true');
        }
      } else { localStorage.setItem('autoLogin', 'false'); }
      setShowAuthModal(false);
    } catch (err) { alert(err.message); } finally { setAuthLoading(false); }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword, options: { data: { name: authName } } });
      if (error) throw error;
      alert('회원가입이 완료되었습니다. 이메일을 확인해주세요.');
      setAuthMode('login');
    } catch (err) { alert(err.message); } finally { setAuthLoading(false); }
  };

  const handleLogout = async () => {
    if (localStorage.getItem('autoLogin') !== 'true') localStorage.removeItem('savedPassword');
    await supabase.auth.signOut();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) setIsRegionDropdownOpen(false);
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) setIsCategoryDropdownOpen(false);
      if (filterBookmarkRef.current && !filterBookmarkRef.current.contains(event.target)) setIsFilterBookmarkOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCurrentFilterState = () => ({ filterStatus, filterCategories: [...filterCategories], filterPriceIndex, filterRegions: [...filterRegions], filterPerson, sortOption });

  const getFilterSummary = (filters) => {
    const parts = [];
    if (filters.filterStatus !== 'all') {
      const statusMap = { active: '진행중', negotiation: '수의계약', sold: '낙찰' };
      parts.push(statusMap[filters.filterStatus] || filters.filterStatus);
    }
    if (filters.filterCategories.length > 0) parts.push(filters.filterCategories.join(', '));
    if (filters.filterPriceIndex !== 0) parts.push(PRICE_RANGES[filters.filterPriceIndex].label);
    if (filters.filterRegions.length > 0) parts.push(filters.filterRegions.join(', '));
    if (filters.filterPerson) parts.push(`"${filters.filterPerson}"`);
    return parts.length > 0 ? parts.join(' / ') : '전체';
  };

  const saveCurrentFilter = async () => {
    if (!user) { alert('로그인이 필요합니다.'); setShowAuthModal(true); return; }
    if (savedFilters.length >= 50) { alert('즐겨찾기 검색 조건은 최대 50개까지 저장할 수 있습니다.'); return; }
    setShowSaveModal(true);
    setNewFilterName('');
  };

  const confirmSaveFilter = async () => {
    const currentFilters = getCurrentFilterState();
    const filterName = newFilterName.trim() || getFilterSummary(currentFilters);
    if (!user) {
      setSavedFilters(prev => [...prev, { id: Date.now(), name: filterName, filters: currentFilters, createdAt: new Date().toISOString() }]);
      setShowSaveModal(false);
      setNewFilterName('');
      return;
    }
    try {
      const { data: newFilter, error } = await supabase.from('saved_filters').insert([{ user_id: user.id, name: filterName, filter_config: currentFilters }]).select().single();
      if (error) throw error;
      setSavedFilters(prev => [{ id: newFilter.id, name: newFilter.name, filters: newFilter.filter_config, createdAt: newFilter.created_at }, ...prev]);
      setShowSaveModal(false);
      setNewFilterName('');
    } catch (err) { console.error('검색 조건 저장 오류:', err); alert('저장 중 오류가 발생했습니다.'); }
  };

  const deleteSavedFilter = async (id) => {
    if (user) { try { await supabase.from('saved_filters').delete().eq('id', id); } catch (err) { console.error('검색 조건 삭제 오류:', err); } }
    setSavedFilters(prev => prev.filter(f => f.id !== id));
  };

  const applySavedFilter = (savedFilter) => {
    const { filters } = savedFilter;
    setFilterStatus(filters.filterStatus);
    setFilterCategories(filters.filterCategories);
    setFilterPriceIndex(filters.filterPriceIndex);
    setFilterRegions(filters.filterRegions);
    setFilterPerson(filters.filterPerson);
    setSortOption(filters.sortOption);
    setIsFilterBookmarkOpen(false);
  };

  const resetFilters = () => { setFilterStatus('all'); setFilterCategories([]); setFilterPriceIndex(0); setFilterRegions([]); setFilterPerson(''); setSortOption('default'); setFilterShare('all'); };

  const toggleFavorite = async (id) => {
    if (!user) {
      setData(prevData => prevData.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
      if (selectedItem && selectedItem.id === id) setSelectedItem(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
      return;
    }
    const isFavorite = userFavoriteIds.has(id);
    try {
      if (isFavorite) {
        await supabase.from('user_favorites').delete().eq('user_id', user.id).eq('property_id', id);
        setUserFavoriteIds(prev => { const newSet = new Set(prev); newSet.delete(id); return newSet; });
      } else {
        await supabase.from('user_favorites').insert([{ user_id: user.id, property_id: id }]);
        setUserFavoriteIds(prev => new Set([...prev, id]));
      }
    } catch (err) { console.error('관심 물건 토글 오류:', err); alert('처리 중 오류가 발생했습니다.'); }
  };

  const toggleRegion = (region) => setFilterRegions(prev => prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]);
  const toggleCategory = (cat) => setFilterCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  const downloadPDF = async (uniqueCode) => {
    try {
      const { data } = supabase.storage
        .from('property-pdfs')
        .getPublicUrl(`${uniqueCode}.pdf`);

      if (data?.publicUrl) {
        window.open(data.publicUrl, '_blank');
      } else {
        alert('PDF 파일을 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('PDF 다운로드 오류:', err);
      alert('PDF 파일을 찾을 수 없습니다.');
    }
  };
  const toggleSelectionMode = () => {
  setIsSelectionMode(prev => !prev);
  setSelectedItems(new Set());
};

const toggleSelectItem = (id) => {
  setSelectedItems(prev => {
    const newSet = new Set(prev);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    return newSet;
  });
};

const selectAll = () => {
  const currentData = activeTab === 'dashboard' ? dashboardData : myPageData;
  setSelectedItems(new Set(currentData.map(item => item.id)));
};

const deselectAll = () => {
  setSelectedItems(new Set());
};

const downloadSelectedPDFs = async () => {
  if (selectedItems.size === 0) {
    alert('선택된 매물이 없습니다.');
    return;
  }

  const currentData = activeTab === 'dashboard' ? dashboardData : myPageData;
  const selectedData = currentData.filter(item => selectedItems.has(item.id));

  for (const item of selectedData) {
    const { data } = supabase.storage
      .from('property-pdfs')
      .getPublicUrl(`${item.uniqueCode}.pdf`);

    if (data?.publicUrl) {
      // 각 PDF를 새 탭으로 열기 (브라우저 정책상 직접 다운로드는 제한됨)
      window.open(data.publicUrl, '_blank');
      // 연속 요청 방지를 위한 딜레이
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }


  setIsSelectionMode(false);
  setSelectedItems(new Set());
};


  const getFilteredData = (sourceData) => {
    let result = sourceData.filter(item => {
      const matchRegion = filterRegions.length === 0 ? true : filterRegions.some(region => item.address.includes(region));
      const matchPerson = filterPerson === '' || item.trusteeName?.includes(filterPerson) || item.debtorName?.includes(filterPerson);
      const currentBidInfo = getCurrentBidInfo(item.deadlines);
      let matchStatus = true;
      if (filterStatus === 'all') matchStatus = true;
      else if (filterStatus === 'active') matchStatus = item.status === '진행중' && !currentBidInfo.isExpired;
      else if (filterStatus === 'sold') matchStatus = item.status === '낙찰';
      else if (filterStatus === 'negotiation') matchStatus = currentBidInfo.isExpired && item.status !== '낙찰';
      const matchCategory = filterCategories.length === 0 ? true : filterCategories.includes(item.category);
      const isActuallyShare = item.isShare && !item.shareRatio?.includes('전체');
      const matchShare = filterShare === 'all' ? true : filterShare === 'share' ? isActuallyShare === true : isActuallyShare === false;
      const currentPrice = currentBidInfo.price || 0;
      const priceRange = PRICE_RANGES[filterPriceIndex];
      const matchPrice = currentPrice >= priceRange.min && currentPrice < priceRange.max;
      return matchRegion && matchPerson && matchStatus && matchCategory && matchShare && matchPrice;
    });
    if (sortOption === 'priceAsc') result.sort((a, b) => (getCurrentBidInfo(a.deadlines).price || 0) - (getCurrentBidInfo(b.deadlines).price || 0));
    else if (sortOption === 'dateAsc') result.sort((a, b) => new Date(getCurrentBidInfo(a.deadlines).date) - new Date(getCurrentBidInfo(b.deadlines).date));
    return result.slice(0, itemsPerPage);
  };

  const dashboardData = useMemo(() => getFilteredData(data), [data, filterRegions, filterPerson, filterStatus, filterCategories, filterShare, filterPriceIndex, sortOption, itemsPerPage]);
  const myPageData = useMemo(() => { const favorites = user ? data.filter(item => userFavoriteIds.has(item.id)) : data.filter(item => item.isFavorite); return getFilteredData(favorites); }, [data, user, userFavoriteIds, filterRegions, filterPerson, filterStatus, filterCategories, filterShare, filterPriceIndex, sortOption, itemsPerPage]);

  const formatCurrency = (val) => !val ? '-' : new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);
  const closeModal = () => { setSelectedItem(null); setActiveModalTab('bid'); };

  const getDDayBadgeStyle = (status) => {
    switch (status) {
      case 'today': return 'bg-red-500 text-white border-red-500 animate-pulse shadow-lg shadow-red-200';
      case 'tomorrow': return 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100';
      case 'imminent': return 'bg-red-50 text-red-600 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const renderAuthModal = () => {
    if (!showAuthModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowAuthModal(false)}>
        <div className="bg-white rounded-xl shadow-2xl w-[400px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">{authMode === 'login' ? '로그인' : '회원가입'}</h3>
            <form onSubmit={authMode === 'login' ? handleLogin : handleSignUp} className="space-y-4">
              {authMode === 'signup' && (<div><label className="block text-sm font-medium text-gray-600 mb-1">이름</label><input type="text" placeholder="이름을 입력하세요" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={authName} onChange={(e) => setAuthName(e.target.value)} required /></div>)}
              <div><label className="block text-sm font-medium text-gray-600 mb-1">이메일</label><input type="email" placeholder="이메일을 입력하세요" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required /></div>
              <div><label className="block text-sm font-medium text-gray-600 mb-1">비밀번호</label><input type="password" placeholder="비밀번호를 입력하세요" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required minLength={6} /></div>
              {authMode === 'login' && (<div className="space-y-2 pt-2"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={rememberCredentials} onChange={(e) => { setRememberCredentials(e.target.checked); if (!e.target.checked) setAutoLogin(false); }} className="w-4 h-4 text-indigo-600 rounded border-gray-300" /><span className="text-sm text-gray-600">아이디/비밀번호 저장</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={autoLogin} onChange={(e) => { setAutoLogin(e.target.checked); if (e.target.checked) setRememberCredentials(true); }} className="w-4 h-4 text-indigo-600 rounded border-gray-300" /><span className="text-sm text-gray-600">자동 로그인</span></label></div>)}
              <button type="submit" disabled={authLoading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold disabled:opacity-50 flex items-center justify-center gap-2 mt-4">{authLoading && <Loader2 size={18} className="animate-spin" />}{authMode === 'login' ? '로그인' : '회원가입'}</button>
            </form>
            <div className="mt-4 text-center"><button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthEmail(''); setAuthPassword(''); setAuthName(''); }} className="text-sm text-indigo-600 hover:underline">{authMode === 'login' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}</button></div>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailModal = () => {
    if (!selectedItem) return null;
    const currentBidInfo = getCurrentBidInfo(selectedItem.deadlines);
    const isFavorite = user ? userFavoriteIds.has(selectedItem.id) : selectedItem.isFavorite;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={closeModal}>
        <div className="bg-white rounded-xl shadow-2xl w-[70%] h-[85vh] overflow-hidden flex flex-col relative" onClick={(e) => e.stopPropagation()}>
          <button onClick={closeModal} className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"><X size={20} className="text-gray-600" /></button>
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mb-6 pr-10">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded ${currentBidInfo.isExpired ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{currentBidInfo.isExpired ? '수의계약' : selectedItem.status === '진행중' ? '입찰진행중' : '낙찰'}</span>
                <span className="text-gray-400 text-sm">일련번호: {selectedItem.uniqueCode}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">{selectedItem.address}</h2>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="flex border-b border-gray-200 mb-6">
                  <button onClick={() => setActiveModalTab('bid')} className={`px-4 py-3 text-base font-bold border-b-2 ${activeModalTab === 'bid' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>입찰 정보</button>
                  <button onClick={() => setActiveModalTab('detail')} className={`px-4 py-3 text-base font-bold border-b-2 ${activeModalTab === 'detail' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>부동산 상세</button>
                  <button onClick={() => setActiveModalTab('rights')} className={`px-4 py-3 text-base font-bold border-b-2 ${activeModalTab === 'rights' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>권리 및 유의사항</button>
                </div>
                <div className="min-h-[300px]">
                  {activeModalTab === 'bid' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-gray-800">입찰 회차별 내역</h3>
                        {selectedItem.deadlines.length > 1 && (<div className="flex items-center gap-1 text-sm text-gray-500"><TrendingDown size={14} className="text-red-500" /><span>1회차 대비 총 </span><span className="font-bold text-red-500">{calculateDropRate(selectedItem.deadlines[selectedItem.deadlines.length - 1].price, selectedItem.deadlines[0].price)}%</span><span> 하락</span></div>)}
                      </div>
                      <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50 text-gray-500"><tr><th className="px-4 py-3 font-medium text-left">회차</th><th className="px-4 py-3 font-medium text-left">최저 입찰가</th><th className="px-4 py-3 font-medium text-center">하락률</th><th className="px-4 py-3 font-medium text-center">상태</th></tr></thead>
                          <tbody className="divide-y divide-gray-100">
                            {selectedItem.deadlines.map((round, idx) => {
                              const today = new Date(); today.setHours(0, 0, 0, 0);
                              const activeIndex = selectedItem.deadlines.findIndex(d => new Date(d.date) >= today);
                              let statusText = "예정", rowClass = "bg-white text-gray-500", statusClass = "text-gray-400";
                              if (activeIndex === -1 || idx < activeIndex) statusText = "유찰";
                              else if (idx === activeIndex) { statusText = "진행중"; rowClass = "bg-blue-50/50 text-gray-900"; statusClass = "text-blue-600 font-bold"; }
                              const previousPrice = idx > 0 ? selectedItem.deadlines[idx - 1].price : null;
                              const dropRate = calculateDropRate(round.price, previousPrice);
                              return (<tr key={idx} className={rowClass}><td className="px-4 py-4 text-base font-medium"><div className="flex items-center gap-2"><span>{round.round}회차</span><span className="text-xs font-normal text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded">{round.date}</span></div></td><td className="px-4 py-4 text-base font-bold">{formatCurrency(round.price)}</td><td className="px-4 py-4 text-center">{dropRate ? (<span className="inline-flex items-center gap-1 text-red-500 font-medium"><TrendingDown size={14} />{dropRate}%</span>) : (<span className="text-gray-300">-</span>)}</td><td className={`px-4 py-4 text-center text-base font-medium ${statusClass}`}>{statusText}</td></tr>);
                            })}
                            {(() => {
                              const deadlines = selectedItem.deadlines;
                              const lastRound = deadlines.length > 0 ? deadlines[deadlines.length - 1] : { round: 0, date: null };
                              let nextDateStr = "-";
                              if (lastRound.date) { const dateObj = new Date(lastRound.date); dateObj.setDate(dateObj.getDate() + 1); nextDateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`; }
                              const today = new Date(); today.setHours(0, 0, 0, 0);
                              const isAllExpired = deadlines.every(d => new Date(d.date) < today);
                              const rowClass = isAllExpired ? "bg-amber-50/50 text-gray-900" : "bg-white text-gray-400";
                              const statusClass = isAllExpired ? "text-amber-600 font-bold" : "text-gray-500";
                              return (<tr className={rowClass}><td className="px-4 py-4 text-base font-medium"><div className="flex items-center gap-2"><span>{lastRound.round + 1}회차</span><span className="text-xs font-normal text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded">{nextDateStr}</span></div></td><td className="px-4 py-4 text-base text-gray-400">협의</td><td className="px-4 py-4 text-center text-gray-300">-</td><td className={`px-4 py-4 text-center text-base font-bold ${statusClass}`}>수의계약 문의</td></tr>);
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {activeModalTab === 'detail' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2"><FileText size={20} className="text-indigo-600" />매각 대상 물건</h3>
                        {selectedItem.parcels && selectedItem.parcels.length > 0 ? (
                          <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="min-w-full text-sm">
                              <thead className="bg-gray-50 text-gray-500"><tr><th className="px-4 py-3 font-medium text-left">지번/주소</th><th className="px-4 py-3 font-medium text-center w-24">지목</th><th className="px-4 py-3 font-medium text-center w-28">면적</th><th className="px-4 py-3 font-medium text-center w-32">지분</th></tr></thead>
                              <tbody className="divide-y divide-gray-100">
                                {selectedItem.parcels.map((parcel, idx) => (<tr key={idx} className="bg-white hover:bg-gray-50"><td className="px-4 py-3 text-gray-800">{parcel.address}</td><td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">{parcel.landType || '-'}</span></td><td className="px-4 py-3 text-center text-gray-700">{parcel.area || '-'}</td><td className="px-4 py-3 text-center text-gray-700 font-medium">{parcel.shareRatio || '-'}</td></tr>))}
                              </tbody>
                            </table>
                            {selectedItem.parcels.length > 1 && (<div className="bg-indigo-50 px-4 py-2 text-sm text-indigo-700 font-medium border-t border-indigo-100">총 {selectedItem.parcels.length}개 물건 일괄매각</div>)}
                          </div>
                        ) : (<div className="bg-gray-50 p-4 rounded-lg border border-gray-200"><p className="text-gray-600">{selectedItem.address}</p><div className="mt-2 flex gap-4 text-sm text-gray-500"><span>면적: {selectedItem.area}</span><span>지분: {selectedItem.shareRatio}</span></div></div>)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2"><Mail size={20} className="text-indigo-600" />입찰서 제출 주소</h3>
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <MapPin size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-800 font-medium leading-relaxed">{selectedItem.place || '입찰 장소 정보 없음'}</p>
                              {selectedItem.place && !selectedItem.place.includes('온비드') && (<p className="text-sm text-indigo-600 mt-2 font-medium">※ 등기우편으로 제출 (현장 입찰 불가)</p>)}
                              {selectedItem.place && selectedItem.place.includes('온비드') && (<p className="text-sm text-indigo-600 mt-2 font-medium">※ 온비드 전자입찰 진행</p>)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-700 mb-3">파산관재인 정보</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2"><User size={16} className="text-gray-400" /><span className="text-gray-600">관재인:</span><span className="font-medium text-gray-800">{selectedItem.trusteeName}</span></div>
                          <div className="flex items-center gap-2"><Phone size={16} className="text-gray-400" /><span className="text-gray-600">연락처:</span><span className="font-medium text-gray-800">{selectedItem.contact}</span></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeModalTab === 'rights' && (
                    <div className="space-y-4">
                      <div className="bg-red-50 border-l-4 border-red-400 p-4"><div className="flex items-center gap-2 mb-1"><AlertCircle size={18} className="text-red-500" /><h4 className="font-bold text-red-700">주요 권리관계 (요약)</h4></div><p className="text-sm text-red-600 leading-relaxed">{selectedItem.restrictions || "특이사항 없음"}</p></div>
                      <div className="border border-gray-200 rounded-lg p-4 space-y-3"><h4 className="font-bold text-gray-700 border-b border-gray-100 pb-2">기타 유의사항</h4><ul className="text-sm text-gray-600 space-y-1 list-disc pl-4"><li>체납 정보: {selectedItem.arrears || '없음'}</li><li>비고: {selectedItem.remarks || '없음'}</li><li>입찰 조건: {selectedItem.conditions || '없음'}</li></ul></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-[320px] shrink-0">
                <div className="border border-gray-200 rounded-xl p-6 sticky top-0">
                  {(currentBidInfo.status === 'today' || currentBidInfo.status === 'tomorrow') && (<div className={`mb-4 p-3 rounded-lg text-center ${currentBidInfo.status === 'today' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}><p className="text-2xl font-black">{currentBidInfo.label}</p><p className="text-sm opacity-90">{currentBidInfo.status === 'today' ? '오늘 입찰 마감!' : '내일 입찰 마감!'}</p></div>)}
                  <div className="mb-6">
                    {currentBidInfo.round && (<p className="text-xs text-gray-400 mb-1">{currentBidInfo.isExpired ? `${currentBidInfo.round}회차 (마지막)` : `${currentBidInfo.round}회차`} 최저 입찰가</p>)}
                    {!currentBidInfo.round && (<p className="text-xs text-gray-500 mb-1">최저 입찰가</p>)}
                    <p className={`text-3xl font-extrabold tracking-tight ${currentBidInfo.isExpired ? 'text-gray-500' : 'text-blue-600'}`}>{formatCurrency(currentBidInfo.price)}</p>
                    <div className="mt-2">
                      {currentBidInfo.isExpired ? (<span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold"><Phone size={14} />수의계약 문의</span>) : (<div className="flex items-center gap-2"><span className={`px-3 py-1 rounded-full text-sm font-bold border ${getDDayBadgeStyle(currentBidInfo.status)}`}>{currentBidInfo.label}</span><span className="text-gray-400 text-sm">({currentBidInfo.date})</span></div>)}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button onClick={() => toggleFavorite(selectedItem.id)} className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${isFavorite ? 'bg-yellow-400 text-white hover:bg-yellow-500' : 'bg-gray-200 text-gray-700 hover:bg-yellow-400 hover:text-white'}`}><Star size={18} fill={isFavorite ? "currentColor" : "none"} /> 관심 물건 {isFavorite ? '해제' : '등록'}</button>
                    <button onClick={() => downloadPDF(selectedItem.uniqueCode)} className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold flex items-center justify-center gap-2"><Download size={18} /> 원본 공고 다운로드</button>
                    <button className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-bold flex items-center justify-center gap-2"><Phone size={18} /> 파산관재인 연락하기</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPropertyCard = (item) => {
    const currentBidInfo = getCurrentBidInfo(item.deadlines);
    const isFavorite = user ? userFavoriteIds.has(item.id) : item.isFavorite;
    return (
      <div key={item.id} onClick={() => isSelectionMode ? toggleSelectItem(item.id) : setSelectedItem(item)} className={`group relative bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col h-full shadow-sm border cursor-pointer ${selectedItems.has(item.id) ? 'ring-2 ring-indigo-500 border-indigo-300' : currentBidInfo.status === 'today' ? 'border-red-300 ring-2 ring-red-100' : currentBidInfo.status === 'tomorrow' ? 'border-orange-300 ring-2 ring-orange-100' : 'border-gray-100'}`}>
  {isSelectionMode && (
    <div className="absolute top-3 left-3 z-10">
      <input
        type="checkbox"
        checked={selectedItems.has(item.id)}
        onChange={(e) => { e.stopPropagation(); toggleSelectItem(item.id); }}
        onClick={(e) => e.stopPropagation()}
        className="w-5 h-5 text-indigo-600 rounded border-gray-300 cursor-pointer"
      />
    </div>
  )}
        {(currentBidInfo.status === 'today' || currentBidInfo.status === 'tomorrow') && (<div className={`py-1.5 text-center text-xs font-bold ${currentBidInfo.status === 'today' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>{currentBidInfo.status === 'today' ? '🔥 오늘 마감!' : '⏰ 내일 마감!'}</div>)}
        <div className="px-5 pt-5 pb-3 flex justify-between items-start">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[13px] text-gray-600 border border-gray-200 px-2 py-1 rounded bg-orange-50">채무자 : {item.debtorName}</span>
            <span className={`px-2 py-1 text-[13px] font-bold rounded ${item.category === '주거용' ? 'bg-blue-100 text-blue-700' : item.category === '토지' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{item.category}</span>
            <span className="text-[13px] text-gray-500 border border-gray-200 px-2 py-1 rounded bg-gray-50">{item.trusteeName} 관재인</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }} className="text-gray-300 hover:text-yellow-400"><Star size={20} fill={isFavorite ? "#FACC15" : "none"} className={isFavorite ? "text-yellow-400" : ""} /></button>
        </div>
        <div className="px-5 pb-4 border-b border-gray-50 flex-grow">
          <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600">{item.address}</h3>
          <div className="mt-3">
            <p className="text-xs text-gray-400 font-medium mb-0.5">{currentBidInfo.isExpired ? `${currentBidInfo.round}차 (수의계약)` : currentBidInfo.round ? `${currentBidInfo.round}차 최저입찰금액` : '최저입찰금액'}</p>
            <p className={`text-2xl font-extrabold tracking-tight ${currentBidInfo.isExpired ? 'text-gray-500' : 'text-indigo-600'}`}>{formatCurrency(currentBidInfo.price)}</p>
          </div>
        </div>
        <div className="px-5 py-4 bg-gray-50/50 space-y-2 text-sm">
          <div className="flex justify-between items-center"><span className="text-gray-500 text-sm">건물/토지</span><span className="font-medium text-gray-700">{item.area}</span></div>
          <div className="flex justify-between items-center"><span className="text-gray-500 text-sm">지분정보</span><span className="font-medium text-gray-700 truncate max-w-[150px] text-right" title={item.shareRatio}>{item.shareRatio}</span></div>
          <div className="flex justify-between items-center"><span className="text-gray-500 text-sm flex items-center gap-1"><Clock size={14}/> 입찰일</span><div className="flex items-center gap-2"><span className="font-medium text-gray-900">{currentBidInfo.date}</span><span className={`text-[12px] px-2 py-0.5 rounded-full font-bold border ${getDDayBadgeStyle(currentBidInfo.status)}`}>{currentBidInfo.label}</span></div></div>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === '낙찰' ? 'bg-gray-100 text-gray-500' : currentBidInfo.isExpired ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-100' : 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100'}`}>{item.status === '낙찰' ? '낙찰' : currentBidInfo.isExpired ? '수의계약' : '진행중'}</span>
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); downloadPDF(item.uniqueCode); }} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="공고문 다운로드"><Download size={18} /></button>
            <button onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }} className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm">상세보기</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-gray-800 font-sans bg-gray-50">
      {renderDetailModal()}
      {renderAuthModal()}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowSaveModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-[400px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><BookmarkPlus size={20} className="text-amber-500" />검색 조건 저장</h3>
              <div className="mb-4"><label className="block text-sm font-medium text-gray-600 mb-2">조건 이름 (선택)</label><input type="text" placeholder="예: 서울 주거용 1억 이하" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" value={newFilterName} onChange={(e) => setNewFilterName(e.target.value)} autoFocus /><p className="text-xs text-gray-400 mt-1">비워두면 필터 조건이 자동으로 이름이 됩니다.</p></div>
              <div className="bg-gray-50 rounded-lg p-3 mb-4"><p className="text-xs text-gray-500 mb-1">현재 검색 조건</p><p className="text-sm font-medium text-gray-700">{getFilterSummary(getCurrentFilterState())}</p></div>
              <div className="flex gap-2"><button onClick={() => setShowSaveModal(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium">취소</button><button onClick={confirmSaveFilter} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium">저장</button></div>
            </div>
          </div>
        </div>
      )}
      <header className="bg-white border-b border-indigo-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3"><div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md"><Building size={24} /></div><h1 className="text-xl font-bold text-gray-900 tracking-tight">파산자 공매 정보</h1></div>
            <nav className="flex items-center space-x-8">
              <button onClick={() => setActiveTab('dashboard')} className={`text-[18px] font-bold ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-800 hover:text-indigo-600'}`}>부동산</button>
              <button onClick={() => setActiveTab('input')} className={`text-[18px] font-bold ${activeTab === 'input' ? 'text-indigo-600' : 'text-gray-800 hover:text-indigo-600'}`}>마이 페이지</button>
              {user ? (<div className="flex items-center gap-3"><span className="text-sm text-gray-600 hidden md:inline">{user.email}</span><button onClick={handleLogout} className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600"><LogOut size={16} /><span className="hidden sm:inline">로그아웃</span></button></div>) : (<button onClick={() => setShowAuthModal(true)} className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"><LogIn size={16} />로그인</button>)}
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (<div className="flex items-center justify-center py-20"><Loader2 size={40} className="animate-spin text-indigo-600" /></div>)}
        {error && (<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-xl mb-6"><p className="text-yellow-700 text-sm">{error}</p></div>)}
        {!isLoading && (
          <>
            <div className="space-y-8 mb-8">
  <div className="bg-white border-l-4 border-red-500 p-5 rounded-r-xl shadow-sm flex items-start"><AlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={20} /><div><p className="font-bold text-gray-800">낙찰 여부 등 정확한 세부내용 : 관재인 문의</p><p className="text-sm text-gray-500 mt-1">본 사이트의 정보는 참고용이며, 실제 입찰 전 반드시 담당 관재인에게 문의하시기 바랍니다.</p></div></div>
  <div className="bg-white p-6 rounded-2xl">
  {/* 1행: 필터 + 검색 + 초기화 + 즐겨찾기 + 정렬 + 보기 */}
  <div className="flex flex-wrap gap-3 items-center justify-between">
    <div className="flex flex-wrap gap-3 items-center">
      <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 outline-none hover:bg-gray-100" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="all">상태: 전체</option><option value="active">진행중</option><option value="negotiation">🤝 수의계약</option><option value="sold">낙찰</option></select>
      <div className="relative min-w-[140px]" ref={categoryDropdownRef}>
        <button onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100"><span className={`truncate ${filterCategories.length === 0 ? 'text-gray-700' : 'text-indigo-600 font-medium'}`}>{filterCategories.length === 0 ? "종류: 전체" : `${filterCategories[0]}${filterCategories.length > 1 ? ` 외 ${filterCategories.length - 1}개` : ''}`}</span><ChevronDown size={16} className={`text-gray-400 flex-shrink-0 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} /></button>
        {isCategoryDropdownOpen && (<div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-2 w-[180px]"><div className="space-y-1">{CATEGORY_LIST.map((cat) => (<label key={cat} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-indigo-50"><div className={`w-4 h-4 rounded border flex items-center justify-center ${filterCategories.includes(cat) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>{filterCategories.includes(cat) && <Check size={12} className="text-white" />}</div><input type="checkbox" className="hidden" checked={filterCategories.includes(cat)} onChange={() => toggleCategory(cat)} /><span className={`text-sm ${filterCategories.includes(cat) ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>{cat}</span></label>))}</div>{filterCategories.length > 0 && (<div className="border-t border-gray-100 mt-2 pt-2"><button onClick={() => setFilterCategories([])} className="w-full text-xs text-center text-red-500 hover:text-red-700 py-1">초기화</button></div>)}</div>)}
      </div>
      <select className="w-[180px] bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 outline-none hover:bg-gray-100" value={filterPriceIndex} onChange={(e) => setFilterPriceIndex(Number(e.target.value))}>{PRICE_RANGES.map((range, index) => (<option key={index} value={index}>{range.label}</option>))}</select>
      <div className="relative w-[180px]" ref={regionDropdownRef}>
        <button onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)} className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100"><div className="flex items-center gap-2 truncate"><MapPin size={16} className="text-gray-400 flex-shrink-0" /><span className={`truncate ${filterRegions.length === 0 ? 'text-gray-400' : 'text-indigo-600 font-medium'}`}>{filterRegions.length === 0 ? "지역 선택 (전체)" : `${filterRegions[0]}${filterRegions.length > 1 ? ` 외 ${filterRegions.length - 1}곳` : ''}`}</span></div><ChevronDown size={16} className={`text-gray-400 flex-shrink-0 ${isRegionDropdownOpen ? 'rotate-180' : ''}`} /></button>
        {isRegionDropdownOpen && (<div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-3 w-[300px]"><div className="flex justify-between items-center mb-2 px-1"><span className="text-xs font-bold text-gray-500">지역 중복 선택 가능</span>{filterRegions.length > 0 && (<button onClick={() => setFilterRegions([])} className="text-xs text-red-500 hover:text-red-700 flex items-center"><X size={12} className="mr-1"/> 초기화</button>)}</div><div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">{REGION_LIST.map((region) => (<label key={region} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-indigo-50"><div className={`w-4 h-4 rounded border flex items-center justify-center ${filterRegions.includes(region) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>{filterRegions.includes(region) && <Check size={12} className="text-white" />}</div><input type="checkbox" className="hidden" checked={filterRegions.includes(region)} onChange={() => toggleRegion(region)} /><span className={`text-sm ${filterRegions.includes(region) ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>{region}</span></label>))}</div></div>)}
      </div>
      <div className="h-8 w-px bg-gray-200 hidden lg:block"></div>
      <div className="relative w-[200px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={16} className="text-gray-400" /></div>
        <input type="text" placeholder="관재인/채무자 검색" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" value={filterPerson} onChange={(e) => setFilterPerson(e.target.value)} />
      </div>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm flex items-center whitespace-nowrap"><Search size={16} className="mr-2" /> 검색</button>
      <button onClick={resetFilters} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2.5 rounded-lg text-sm font-medium flex items-center whitespace-nowrap gap-1" title="필터 초기화"><RotateCcw size={16} /><span className="hidden xl:inline">초기화</span></button>
      <div className="relative" ref={filterBookmarkRef}>
        <button onClick={() => setIsFilterBookmarkOpen(!isFilterBookmarkOpen)} className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2.5 rounded-lg text-sm font-medium shadow-sm flex items-center whitespace-nowrap gap-1" title="즐겨찾기 검색 조건"><Bookmark size={16} /><span className="hidden xl:inline">즐겨찾기</span>{savedFilters.length > 0 && (<span className="bg-white text-amber-600 text-xs font-bold px-1.5 py-0.5 rounded-full ml-1">{savedFilters.length}</span>)}</button>
        {isFilterBookmarkOpen && (<div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-30 w-[360px]"><div className="p-4 border-b border-gray-100"><div className="flex items-center justify-between mb-3"><h3 className="font-bold text-gray-800 flex items-center gap-2"><Bookmark size={18} className="text-amber-500" />즐겨찾기 검색 조건</h3><span className="text-xs text-gray-400">{savedFilters.length}/50</span></div><button onClick={saveCurrentFilter} className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 border border-amber-200"><BookmarkPlus size={16} />현재 검색 조건 저장</button></div><div className="max-h-[300px] overflow-y-auto">{savedFilters.length === 0 ? (<div className="p-6 text-center text-gray-400"><Bookmark size={32} className="mx-auto mb-2 opacity-30" /><p className="text-sm">저장된 검색 조건이 없습니다.</p></div>) : (<div className="p-2 space-y-1">{savedFilters.map((saved) => (<div key={saved.id} className="group flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"><div className="flex-1 min-w-0" onClick={() => applySavedFilter(saved)}><p className="font-medium text-gray-800 text-sm truncate">{saved.name}</p><p className="text-xs text-gray-400 truncate">{getFilterSummary(saved.filters)}</p></div><button onClick={(e) => { e.stopPropagation(); deleteSavedFilter(saved.id); }} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100" title="삭제"><Trash2 size={14} /></button></div>))}</div>)}</div></div>)}
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2"><ArrowUpDown size={16} className="text-gray-400"/><select className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 font-medium min-w-[120px]" value={sortOption} onChange={(e) => setSortOption(e.target.value)}><option value="default">기본 정렬</option><option value="priceAsc">최저가순</option><option value="dateAsc">매각 기일 순</option></select></div>
      <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"><span className="text-xs font-semibold text-gray-500 uppercase">보기</span><select className="bg-transparent text-sm font-medium text-gray-900 focus:outline-none" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}><option value={10}>10개</option><option value={20}>20개</option><option value={50}>50개</option><option value={100}>100개</option></select></div>
        </div>
      </div>
    </div>
    {/* PDF 선택 버튼 - 독립 영역 */}
    <div className="flex justify-end">
      <button onClick={toggleSelectionMode} className={`px-3 py-2.5 rounded-lg text-base font-medium flex items-center whitespace-nowrap gap-1 ${isSelectionMode ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`} title="PDF 일괄 다운로드"><Download size={16} /><span>{isSelectionMode ? '선택 취소' : 'PDF 선택'}</span></button>
    </div>
  </div>
            {isSelectionMode && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === (activeTab === 'dashboard' ? dashboardData : myPageData).length && selectedItems.size > 0}
                    onChange={(e) => e.target.checked ? selectAll() : deselectAll()}
                    className="w-5 h-5 text-indigo-600 rounded border-gray-300"
                  />
                  <span className="font-medium text-gray-700">모두 선택</span>
                </label>
                <span className="text-sm text-indigo-600 font-bold">
                  {selectedItems.size}개 선택됨
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={deselectAll}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  선택 해제
                </button>
                <button
                  onClick={downloadSelectedPDFs}
                  disabled={selectedItems.size === 0}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-bold flex items-center gap-2"
                >
                  <Download size={16} />
                  선택 PDF 다운로드 ({selectedItems.size})
                </button>
              </div>
            </div>
          )}

            {activeTab === 'dashboard' && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{dashboardData.length === 0 ? (<div className="text-center py-20 col-span-full"><div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 inline-block"><p className="text-gray-500 text-lg">검색 조건에 맞는 매물이 없습니다.</p></div></div>) : (dashboardData.map((item) => renderPropertyCard(item)))}</div>)}
            {activeTab === 'input' && (<div><div className="mb-6 flex items-center gap-2"><Star className="text-yellow-400 fill-yellow-400" size={24} /><h2 className="text-xl font-bold text-gray-900">관심 물건 목록</h2><span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold ml-1">{myPageData.length}</span></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{myPageData.length === 0 ? (<div className="text-center py-20 col-span-full"><div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 inline-block"><Star className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-lg">등록된 관심 매물이 없습니다.</p><p className="text-gray-400 text-sm mt-1">매물 목록에서 별표(★)를 눌러 관심 매물을 등록해보세요.</p></div></div>) : (myPageData.map((item) => renderPropertyCard(item)))}</div></div>)}
          </>
        )}
      </main>
    </div>
  );
}