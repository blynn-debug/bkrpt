import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, MapPin, User, AlertCircle, Plus, Building, Download, Star, ArrowUpDown, ChevronDown, Check, X, Filter } from 'lucide-react';

// --- 초기 데이터 (샘플) ---
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
    place: "서울 서초구 서초대로 283, 4층",
    deadlines: [
      { round: 1, date: "2025-10-29", price: 11000000 },
      { round: 2, date: "2025-11-05", price: 10000000 },
      { round: 3, date: "2025-11-12", price: 9000000 },
    ],
    conditions: "7필지 지분 일괄매각",
    status: "낙찰",
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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(INITIAL_DATA);

  // --- 필터 상태 ---
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filterStatus, setFilterStatus] = useState('all');

  // 종류 필터 다중 선택 상태
  const [filterCategories, setFilterCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  const [filterShare, setFilterShare] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  const [filterPriceIndex, setFilterPriceIndex] = useState(0);

  // 지역 다중 선택 상태
  const [filterRegions, setFilterRegions] = useState([]);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const regionDropdownRef = useRef(null);

  // 인물 검색 상태
  const [filterPerson, setFilterPerson] = useState('');

  // --- 입력 폼 상태 ---
  const [formData, setFormData] = useState({
    uniqueCode: '',
    category: '주거용',
    debtorName: '',
    trusteeName: '',
    contact: '',
    address: '',
    area: '',
    isShare: false,
    shareRatio: '',
    restrictions: '',
    arrears: '',
    remarks: '',
    place: '',
    round1Date: '',
    round1Price: '',
    conditions: '',
    status: '진행중'
  });

  // --- 드롭다운 외부 클릭 감지 ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
        setIsRegionDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleFavorite = (id) => {
    setData(prevData => prevData.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const toggleRegion = (region) => {
    setFilterRegions(prev =>
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const toggleCategory = (cat) => {
    setFilterCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  // --- 데이터 필터링 로직 ---
  const filteredData = useMemo(() => {
    let result = data.filter(item => {
      // 1. 지역 필터
      const matchRegion = filterRegions.length === 0
        ? true
        : filterRegions.some(region => item.address.includes(region));

      // 2. 인물 검색
      const matchPerson = filterPerson === '' ||
                          item.trusteeName.includes(filterPerson) ||
                          item.debtorName.includes(filterPerson);

      // 3. 상태 필터
      const matchStatus = filterStatus === 'all'
        ? true
        : filterStatus === 'active' ? item.status === '진행중'
        : item.status === '낙찰';

      // 4. 종류 필터
      const matchCategory = filterCategories.length === 0
        ? true
        : filterCategories.includes(item.category);

      // 5. 지분 매각 필터
      const isActuallyShare = item.isShare && !item.shareRatio.includes('전체');
      const matchShare = filterShare === 'all'
        ? true
        : filterShare === 'share'
          ? isActuallyShare === true
          : isActuallyShare === false;

      // 6. 가격대 필터
      const currentPrice = item.deadlines[0]?.price || 0;
      const priceRange = PRICE_RANGES[filterPriceIndex];
      const matchPrice = currentPrice >= priceRange.min && currentPrice < priceRange.max;

      return matchRegion && matchPerson && matchStatus && matchCategory && matchShare && matchPrice;
    });

    if (sortOption === 'priceAsc') {
      result.sort((a, b) => (a.deadlines[0]?.price || 0) - (b.deadlines[0]?.price || 0));
    } else if (sortOption === 'dateAsc') {
      result.sort((a, b) => new Date(a.deadlines[0]?.date) - new Date(b.deadlines[0]?.date));
    }

    return result.slice(0, itemsPerPage);
  }, [data, filterRegions, filterPerson, filterStatus, filterCategories, filterShare, filterPriceIndex, sortOption, itemsPerPage]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      uniqueCode: formData.uniqueCode,
      category: formData.category,
      debtorName: formData.debtorName,
      trusteeName: formData.trusteeName,
      contact: formData.contact,
      address: formData.address,
      area: formData.area,
      isShare: formData.isShare,
      shareRatio: formData.shareRatio,
      restrictions: formData.restrictions,
      arrears: formData.arrears,
      remarks: formData.remarks,
      place: formData.place,
      deadlines: [
        { round: 1, date: formData.round1Date, price: Number(formData.round1Price) }
      ],
      conditions: formData.conditions,
      status: formData.status,
      isFavorite: false
    };

    setData([...data, newItem]);
    alert('데이터가 추가되었습니다.');
    setActiveTab('dashboard');
    setFormData(prev => ({ ...prev, debtorName: '', address: '', round1Price: '' }));
  };

  const formatCurrency = (val) => {
    if (!val) return '-';
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);
  };

  return (
    <div className="min-h-screen text-gray-800 font-sans">

      {/* 1. 상단 네비게이션 */}
      <header className="bg-white border-b border-indigo-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md">
                <Building size={24} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">파산자 공매 정보 시스템</h1>
            </div>

            {/* [수정됨] 네비게이션 메뉴 */}
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`text-[18px] font-bold transition-colors ${
                  activeTab === 'dashboard' 
                  ? 'text-indigo-600' // 활성화 시 보라색
                  : 'text-gray-800 hover:text-indigo-600' // 비활성 시 짙은 회색
                }`}
              >
                매물 목록
              </button>
              {/* [수정] 데이터 입력 -> 마이 페이지 (글자만 나오게 수정) */}
              <button
                onClick={() => setActiveTab('input')}
                className={`text-[18px] font-bold transition-colors ${
                  activeTab === 'input' 
                  ? 'text-indigo-600' 
                  : 'text-gray-800 hover:text-indigo-600'
                }`}
              >
                마이 페이지
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">

            {/* 2. 경고 문구 */}
            <div className="bg-white border-l-4 border-red-500 p-5 rounded-r-xl shadow-sm flex items-start">
              <AlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
              <div>
                <p className="font-bold text-gray-800">① 낙찰 여부 등 정확한 세부내용 : 관재인 문의</p>
                <p className="text-sm text-gray-500 mt-1">본 사이트의 정보는 참고용이며, 실제 입찰 전 반드시 담당 관재인에게 문의하시기 바랍니다.</p>
              </div>
            </div>

            {/* 3. 검색 및 필터 바 */}
            <div className="bg-white p-6 rounded-2xl space-y-5">
              <div className="flex flex-col xl:flex-row gap-4 justify-between">
                {/* 왼쪽 필터들 (상단) */}
                <div className="flex flex-wrap gap-3 flex-1 items-center">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <span className="text-xs font-semibold text-gray-500 uppercase">보기</span>
                    <select
                      className="bg-transparent text-sm font-medium text-gray-900 focus:outline-none"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      <option value={10}>10개</option>
                      <option value={20}>20개</option>
                      <option value={50}>50개</option>
                      <option value={100}>100개</option>
                    </select>
                  </div>

                  <div className="h-10 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                  <select
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none hover:bg-gray-100 transition-colors"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">상태: 전체</option>
                    <option value="active">진행중</option>
                    <option value="sold">낙찰</option>
                  </select>

                  {/* 종류 필터 */}
                  <div className="relative min-w-[140px]" ref={categoryDropdownRef}>
                      <button
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      >
                         <span className={`truncate ${filterCategories.length === 0 ? 'text-gray-700' : 'text-indigo-600 font-medium'}`}>
                            {filterCategories.length === 0
                              ? "종류: 전체"
                              : `${filterCategories[0]}${filterCategories.length > 1 ? ` 외 ${filterCategories.length - 1}개` : ''}`
                            }
                         </span>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isCategoryDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-2 w-[180px]">
                           <div className="space-y-1">
                            {CATEGORY_LIST.map((cat) => (
                              <label key={cat} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-indigo-50 transition-colors">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filterCategories.includes(cat) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                                  {filterCategories.includes(cat) && <Check size={12} className="text-white" />}
                                </div>
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  checked={filterCategories.includes(cat)}
                                  onChange={() => toggleCategory(cat)}
                                />
                                <span className={`text-sm ${filterCategories.includes(cat) ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>
                                  {cat}
                                </span>
                              </label>
                            ))}
                           </div>
                           {filterCategories.length > 0 && (
                             <div className="border-t border-gray-100 mt-2 pt-2">
                               <button onClick={() => setFilterCategories([])} className="w-full text-xs text-center text-red-500 hover:text-red-700 py-1">
                                 초기화
                               </button>
                             </div>
                           )}
                        </div>
                      )}
                  </div>

                  {/* 가격대 필터 */}
                  <select
                    className="w-[200px] bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none hover:bg-gray-100 transition-colors"
                    value={filterPriceIndex}
                    onChange={(e) => setFilterPriceIndex(Number(e.target.value))}
                  >
                    {PRICE_RANGES.map((range, index) => (
                      <option key={index} value={index}>{range.label}</option>
                    ))}
                  </select>

                   {/* 지역 선택란 */}
                   <div className="relative w-[200px]" ref={regionDropdownRef}>
                      <button
                        onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                        className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                          <span className={`truncate ${filterRegions.length === 0 ? 'text-gray-400' : 'text-indigo-600 font-medium'}`}>
                            {filterRegions.length === 0
                              ? "지역 선택 (전체)"
                              : `${filterRegions[0]}${filterRegions.length > 1 ? ` 외 ${filterRegions.length - 1}곳` : ''}`
                            }
                          </span>
                        </div>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ${isRegionDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isRegionDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-3 w-[300px]">
                          <div className="flex justify-between items-center mb-2 px-1">
                             <span className="text-xs font-bold text-gray-500">지역 중복 선택 가능</span>
                             {filterRegions.length > 0 && (
                               <button onClick={() => setFilterRegions([])} className="text-xs text-red-500 hover:text-red-700 flex items-center">
                                 <X size={12} className="mr-1"/> 초기화
                               </button>
                             )}
                          </div>
                          <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                            {REGION_LIST.map((region) => (
                              <label key={region} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-indigo-50 transition-colors">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filterRegions.includes(region) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                                  {filterRegions.includes(region) && <Check size={12} className="text-white" />}
                                </div>
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  checked={filterRegions.includes(region)}
                                  onChange={() => toggleRegion(region)}
                                />
                                <span className={`text-sm ${filterRegions.includes(region) ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>
                                  {region}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                   </div>

                   {/* 인물 검색란 */}
                   <div className="flex flex-1 gap-2 min-w-[320px] w-1/4">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="관재인 또는 채무자 이름 검색"
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                          value={filterPerson}
                          onChange={(e) => setFilterPerson(e.target.value)}
                        />
                      </div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center whitespace-nowrap">
                        <Search size={16} className="mr-2" /> 검색
                      </button>
                   </div>
                </div>

                {/* 오른쪽 정렬 옵션 */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} className="text-gray-400"/>
                  <select
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-medium min-w-[140px]"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="default">기본 정렬</option>
                    <option value="priceAsc">최저가순</option>
                    <option value="dateAsc">매각 기일 순</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 매물 리스트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.length === 0 ? (
                <div className="text-center py-20 col-span-full">
                  <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 inline-block">
                    <p className="text-gray-500 text-lg">검색 조건에 맞는 매물이 없습니다.</p>
                  </div>
                </div>
              ) : (
                filteredData.map((item) => (
                  <div key={item.id} className="group bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">

                    {/* 카드 헤더 */}
                    <div className="px-5 pt-5 pb-3 flex justify-between items-start">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[13px] text-gray-600 border border-gray-200 px-2 py-1 rounded bg-orange-50">
                          채무자 : {item.debtorName}
                        </span>
                        <span className={`px-2 py-1 text-[13px] font-bold rounded ${
                          item.category === '주거용' ? 'bg-blue-100 text-blue-700' : 
                          item.category === '토지' ? 'bg-green-100 text-green-700' : 
                          'bg-purple-100 text-purple-700' 
                        }`}>
                          {item.category}
                        </span>
                        <span className="text-[13px] text-gray-500 border border-gray-200 px-2 py-1 rounded bg-gray-50">
                          {item.trusteeName} 관재인
                        </span>
                      </div>
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="text-gray-300 hover:text-yellow-400 transition-colors"
                      >
                        <Star size={20} fill={item.isFavorite ? "#FACC15" : "none"} className={item.isFavorite ? "text-yellow-400" : ""} />
                      </button>
                    </div>

                    {/* 카드 메인 정보 */}
                    <div className="px-5 pb-4 border-b border-gray-50 flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                        {item.address}
                      </h3>
                      <div className="mt-3">
                        <p className="text-xs text-gray-400 font-medium mb-0.5">1차 최저입찰금액</p>
                        <p className="text-2xl font-extrabold text-indigo-600 tracking-tight">
                          {formatCurrency(item.deadlines[0]?.price)}
                        </p>
                      </div>
                    </div>

                    {/* 카드 상세 정보 */}
                    <div className="px-5 py-4 bg-gray-50/50 space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">건물/토지</span>
                        <span className="font-medium text-gray-700">{item.area}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">지분정보</span>
                        <span className="font-medium text-gray-700 truncate w-full-[150px] text-right" title={item.shareRatio}>{item.shareRatio}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">입찰일</span>
                        <span className="font-medium text-gray-900">{item.deadlines[0]?.date}</span>
                      </div>
                    </div>

                    {/* 카드 푸터 */}
                    <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === '낙찰' 
                        ? 'bg-gray-100 text-gray-500' 
                        : 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100'
                      }`}>
                        {item.status}
                      </span>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="공고문 다운로드">
                          <Download size={18} />
                        </button>
                        <button className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm">
                          상세보기
                        </button>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* [수정] 데이터 입력 탭 -> 마이 페이지 탭 (기존 폼 유지) */}
        {activeTab === 'input' && (
          <div className="w-full-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                {/* [수정] 아이콘 변경 (Plus -> User) 및 제목 변경 */}
                <User className="mr-3 text-indigo-600 bg-indigo-50 p-2 rounded-lg" size={40} />
                마이 페이지
              </h2>
              <p className="text-gray-500 mt-2 pl-1">새로운 공매 물건 정보를 등록하거나 관리합니다.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 입력 폼 그리드 (생략 없이 유지) */}
              <div className="grid grid-cols-1 gap-6">
                 {/* 기본 정보 */}
                 <div className="space-y-4">
                    <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-50 pb-2">기본 식별 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">고유코드</label>
                        <input required name="uniqueCode" value={formData.uniqueCode} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 2025-001" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">물건 종류</label>
                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                          <option value="주거용">주거용</option>
                          <option value="상업 및 산업용">상업 및 산업용</option>
                          <option value="토지">토지</option>
                        </select>
                      </div>
                    </div>
                 </div>
                 {/* 인물 정보 */}
                 <div className="space-y-4">
                    <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-50 pb-2">관련 인물</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">채무자</label>
                        <input required name="debtorName" value={formData.debtorName} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">관재인</label>
                        <input required name="trusteeName" value={formData.trusteeName} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                        <input required name="contact" value={formData.contact} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" />
                      </div>
                    </div>
                 </div>
                 {/* 상세 정보 */}
                 <div className="space-y-4">
                    <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-50 pb-2">부동산 상세</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">소재지 (주소)</label>
                      <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">면적</label>
                        <input name="area" value={formData.area} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">지분 정보</label>
                        <input name="shareRatio" value={formData.shareRatio} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" placeholder="예: 40333분의 27" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="isShare" name="isShare" checked={formData.isShare} onChange={handleInputChange} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                        <label htmlFor="isShare" className="text-sm text-gray-700">지분 매각 여부 (체크 시 지분)</label>
                    </div>
                 </div>
                 {/* 입찰 정보 */}
                 <div className="space-y-4">
                    <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-50 pb-2">입찰 정보 (1차 기준)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">1차 최저가</label>
                        <input type="number" name="round1Price" value={formData.round1Price} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">1차 기일</label>
                        <input type="date" name="round1Date" value={formData.round1Date} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" />
                      </div>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl text-lg flex justify-center items-center">
                  <Plus className="mr-2" /> 입력 데이터 저장
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}