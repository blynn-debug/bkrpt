import React, { useState, useMemo } from 'react';
import { Search, MapPin, User, FileText, AlertCircle, Plus, Calendar, Building, Download, Star, Filter, ArrowUpDown } from 'lucide-react';

// --- 초기 데이터 ---
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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(INITIAL_DATA);

  // --- 필터 상태 ---
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterShare, setFilterShare] = useState('all');
  const [sortOption, setSortOption] = useState('default');

  const [filterRegion, setFilterRegion] = useState('');
  const [filterTrustee, setFilterTrustee] = useState('');

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

  const toggleFavorite = (id) => {
    setData(prevData => prevData.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const filteredData = useMemo(() => {
    let result = data.filter(item => {
      const matchRegion = filterRegion === '' || item.address.includes(filterRegion);
      const matchTrustee = filterTrustee === '' || item.trusteeName.includes(filterTrustee);

      const matchStatus = filterStatus === 'all'
        ? true
        : filterStatus === 'active' ? item.status === '진행중'
        : item.status === '낙찰';

      const matchCategory = filterCategory === 'all'
        ? true
        : item.category === filterCategory;

      const isActuallyShare = item.isShare && !item.shareRatio.includes('전체');
      const matchShare = filterShare === 'all'
        ? true
        : filterShare === 'share'
          ? isActuallyShare === true
          : isActuallyShare === false;

      return matchRegion && matchTrustee && matchStatus && matchCategory && matchShare;
    });

    if (sortOption === 'priceAsc') {
      result.sort((a, b) => (a.deadlines[0]?.price || 0) - (b.deadlines[0]?.price || 0));
    } else if (sortOption === 'dateAsc') {
      result.sort((a, b) => new Date(a.deadlines[0]?.date) - new Date(b.deadlines[0]?.date));
    }

    return result.slice(0, itemsPerPage);
  }, [data, filterRegion, filterTrustee, filterStatus, filterCategory, filterShare, sortOption, itemsPerPage]);

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

    setFormData(prev => ({
      ...prev,
      debtorName: '', address: '', round1Price: ''
    }));
  };

  const formatCurrency = (val) => {
    if (!val) return '-';
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* [수정 포인트] max-w-5xl (약 1024px) 로 고정하고
          mx-auto (중앙 정렬) 를 적용하여 양옆 여백을 강제로 만듭니다.
      */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Building size={24} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">파산자 공매 정보 시스템</h1>
            </div>
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                매물 목록
              </button>
              <button
                onClick={() => setActiveTab('input')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'input' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                데이터 입력
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* [수정 포인트] 메인 컨텐츠도 똑같이 max-w-5xl, mx-auto 적용
          이렇게 하면 화면이 아무리 커도 컨텐츠는 중앙 1024px 영역에만 표시됩니다.
      */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">

            {/* 경고 문구 */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
              <AlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
              <div>
                <p className="font-bold text-red-700">① 낙찰 여부 등 정확한 세부내용 : 관재인 문의</p>
                <p className="text-sm text-red-600 mt-1">본 사이트의 정보는 참고용이며, 실제 입찰 전 반드시 담당 관재인에게 문의하시기 바랍니다.</p>
              </div>
            </div>

            {/* 메인 필터 및 검색 바 */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-4">

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  >
                    <option value={10}>10개씩 보기</option>
                    <option value={20}>20개씩 보기</option>
                    <option value={50}>50개씩 보기</option>
                    <option value={100}>100개씩 보기</option>
                  </select>

                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">상태: 전체</option>
                    <option value="active">진행중</option>
                    <option value="sold">낙찰</option>
                  </select>

                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">종류: 전체</option>
                    <option value="주거용">주거용</option>
                    <option value="상업 및 산업용">상업 및 산업용</option>
                    <option value="토지">토지</option>
                  </select>

                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    value={filterShare}
                    onChange={(e) => setFilterShare(e.target.value)}
                  >
                    <option value="all">매각형태: 전체</option>
                    <option value="share">지분 매각</option>
                    <option value="whole">전체 매각</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <ArrowUpDown size={16} className="text-gray-400"/>
                  <select
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-medium"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="default">기본 정렬</option>
                    <option value="priceAsc">최저가순 (오름차순)</option>
                    <option value="dateAsc">입찰 기일 순</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                 <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="지역 검색 (예: 서울)"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-48"
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="관재인 이름"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-40"
                    value={filterTrustee}
                    onChange={(e) => setFilterTrustee(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 데이터 리스트: 1열로 꽉 차게 배치 (grid-cols-1) */}
            <div className="grid grid-cols-1 gap-6">
              {filteredData.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 text-gray-500 col-span-full">
                  검색 조건에 맞는 매물이 없습니다.
                </div>
              ) : (
                filteredData.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative">

                    {/* 카드 헤더 */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded font-mono">
                            {item.uniqueCode}
                          </span>
                          <span className={`px-2 py-1 text-xs font-bold rounded ${
                            item.category === '주거용' ? 'bg-blue-100 text-blue-700' : 
                            item.category === '토지' ? 'bg-green-100 text-green-700' : 
                            'bg-purple-100 text-purple-700' 
                          }`}>
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-500 border px-2 py-1 rounded bg-white">
                            {item.trusteeName} 관재인
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.address}</h3>
                      </div>

                      <div className="flex items-start gap-3">
                         <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="공고문 다운로드">
                            <Download size={20} />
                         </button>
                         <button
                            onClick={() => toggleFavorite(item.id)}
                            className={`p-2 rounded-full transition-colors ${item.isFavorite ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
                            title="관심물건 등록"
                          >
                            <Star size={20} fill={item.isFavorite ? "currentColor" : "none"} />
                         </button>
                      </div>
                    </div>

                    <div className="px-6 py-2 border-b border-gray-50 flex justify-end">
                       <div className="text-right">
                          <p className="text-xs text-gray-500">1차 최저입찰금액</p>
                          <p className="text-xl font-bold text-blue-600">{formatCurrency(item.deadlines[0]?.price)}</p>
                       </div>
                    </div>

                    {/* 카드 바디 */}
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                      {/* 1. 기본 정보 */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center border-b pb-2">
                          <FileText size={16} className="mr-2 text-blue-600"/> 기본 정보
                        </h4>
                        <div className="text-sm space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-500">채무자</span>
                            <span className="font-medium">{item.debtorName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">관재인(담당자) 연락처</span>
                            <span className="font-medium">{item.contact}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">건물/토지 면적</span>
                            <span className="font-medium text-right">{item.area}</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-gray-500">지분 정보</span>
                             <span className="font-medium text-orange-600">{item.shareRatio}</span>
                          </div>
                          <div className="pt-2">
                            <p className="text-gray-500 text-xs mb-1">입찰장소</p>
                            <p className="font-medium text-gray-700">{item.place}</p>
                          </div>
                        </div>
                      </div>

                      {/* 2. 권리 및 특이사항 */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center border-b pb-2">
                          <AlertCircle size={16} className="mr-2 text-red-500"/> 권리 및 특이사항
                        </h4>
                        <div className="text-sm bg-gray-50 p-4 rounded-lg space-y-3">
                          <div>
                            <span className="block text-xs text-gray-500 mb-1">제한물건</span>
                            <p className="text-gray-800">{item.restrictions || '-'}</p>
                          </div>
                          <div>
                            <span className="block text-xs text-gray-500 mb-1">체납정보</span>
                            <p className="text-gray-800">{item.arrears || '-'}</p>
                          </div>
                          <div>
                            <span className="block text-xs text-gray-500 mb-1">비고</span>
                            <p className="text-gray-800">{item.remarks}</p>
                          </div>
                        </div>
                      </div>

                      {/* 3. 입찰 진행 현황 */}
                      <div className="space-y-4 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 flex items-center border-b pb-2 mb-3">
                            <Calendar size={16} className="mr-2 text-green-600"/> 입찰 진행 현황
                          </h4>
                          <div className="overflow-hidden rounded-lg border border-gray-200">
                            <table className="min-w-full text-sm text-left">
                              <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                  <th className="px-3 py-2 font-medium">회차</th>
                                  <th className="px-3 py-2 font-medium">일시</th>
                                  <th className="px-3 py-2 font-medium text-right">최저가</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {item.deadlines.map((round, idx) => (
                                  <tr key={idx} className="bg-white hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium text-gray-900">{round.round}차</td>
                                    <td className="px-3 py-2 text-gray-600">{round.date}</td>
                                    <td className="px-3 py-2 text-right font-mono text-gray-700">{formatCurrency(round.price)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="flex justify-end items-center mt-4">
                          <span className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${
                            item.status === '낙찰' 
                            ? 'bg-gray-200 text-gray-600' 
                            : 'bg-blue-600 text-white'    
                          }`}>
                            현재상태 : {item.status}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 데이터 입력 탭 (너비 유지) */}
        {activeTab === 'input' && (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Plus className="mr-2 text-blue-600" /> 매물 데이터 입력
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 기본 식별 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">고유코드</label>
                   <input required name="uniqueCode" value={formData.uniqueCode} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="예: 2025-001" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">물건 종류</label>
                   <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                     <option value="주거용">주거용</option>
                     <option value="상업 및 산업용">상업 및 산업용</option>
                     <option value="토지">토지</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">현재 상태</label>
                   <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                     <option value="진행중">진행중</option>
                     <option value="낙찰">낙찰</option>
                   </select>
                 </div>
              </div>

              {/* 인물 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">채무자 이름</label>
                  <input required name="debtorName" value={formData.debtorName} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">관재인 이름</label>
                  <input required name="trusteeName" value={formData.trusteeName} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">관재인 연락처</label>
                  <input required name="contact" value={formData.contact} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none" />
                </div>
              </div>

              {/* 부동산 정보 */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900">부동산 세부 정보</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">소재지 (주소)</label>
                  <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">면적</label>
                    <input name="area" value={formData.area} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">지분 정보 (비율)</label>
                    <input name="shareRatio" value={formData.shareRatio} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none" placeholder="예: 40333분의 27" />
                  </div>
                </div>
                <div className="flex items-center pt-2">
                    <input type="checkbox" id="isShare" name="isShare" checked={formData.isShare} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
                    <label htmlFor="isShare" className="ml-2 text-sm text-gray-700 font-medium">지분 매각 여부 (체크 시 지분)</label>
                </div>
              </div>

              {/* 입찰 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">1차 최저입찰금액</label>
                   <input type="number" name="round1Price" value={formData.round1Price} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">1차 입찰일</label>
                   <input type="date" name="round1Date" value={formData.round1Date} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none" />
                 </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg">
                  입력 데이터 저장
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}