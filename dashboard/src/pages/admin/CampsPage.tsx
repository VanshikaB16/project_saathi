import React, { useState, useEffect, useMemo } from 'react';
import {
  Tent,
  Calendar,
  Users,
  Wrench,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  X,
  Trash2,
  Check,
  Search,
  Filter,
  Stethoscope,
  Truck,
  ShieldCheck,
  FileText,
  UserCheck,
} from 'lucide-react';
import { offlineStore, StoredCamp } from '../../services/offlineStore';

interface CampsPageProps {
  onNavigateTab?: (tab: any) => void;
}

export const CampsPage: React.FC<CampsPageProps> = () => {
  const [camps, setCamps] = useState<StoredCamp[]>(() => offlineStore.getCamps());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Schedule New Camp Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [campName, setCampName] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [campDate, setCampDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [targetPopulation, setTargetPopulation] = useState<string>(
    'बुजुर्ग एवं गैर-संचारी रोग (NCD) उच्च जोखिम'
  );
  const [allocatedStaff, setAllocatedStaff] = useState<string>(
    '3 ASHA Workers, 1 Medical Officer, 1 Lab Tech'
  );
  const [equipmentReady, setEquipmentReady] = useState<string>(
    'Portable CBC, 1 Fundus Lens, BP/Glucose Kit'
  );
  const [campStatus, setCampStatus] = useState<StoredCamp['status']>('PLANNING');
  const [campNotes, setCampNotes] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Roster Details Modal State
  const [selectedCampForRoster, setSelectedCampForRoster] = useState<StoredCamp | null>(null);

  // Subscribe to real-time changes
  useEffect(() => {
    const update = () => {
      setCamps([...offlineStore.getCamps()]);
    };
    update();
    const unsubscribe = offlineStore.subscribe(update);
    return () => unsubscribe();
  }, []);

  // Distinct villages from live village aggregates for dropdown
  const availableVillages = useMemo(() => {
    return offlineStore.getLiveVillageAggregates().map((v) => v.villageName);
  }, []);

  // Set default village when modal opens if empty
  useEffect(() => {
    if (isScheduleModalOpen && !selectedVillage && availableVillages.length > 0) {
      setSelectedVillage(availableVillages[0]);
      setCampName(`${availableVillages[0]} ग्राम स्वास्थ्य सेवा शिविर`);
    }
  }, [isScheduleModalOpen, selectedVillage, availableVillages]);

  // When village dropdown changes, suggest friendly name
  const handleVillageChange = (vName: string) => {
    setSelectedVillage(vName);
    setCampName(`${vName} ग्राम स्वास्थ्य सेवा शिविर`);
  };

  // Filtered camps
  const filteredCamps = useMemo(() => {
    return camps.filter((c) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.village.toLowerCase().includes(q) ||
        c.targetPopulation.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (statusFilter === 'ALL') return true;
      return c.status === statusFilter;
    });
  }, [camps, searchQuery, statusFilter]);

  // Summary Metrics
  const summary = useMemo(() => {
    const total = camps.length;
    const confirmed = camps.filter((c) => c.status === 'CONFIRMED').length;
    const planning = camps.filter((c) => c.status === 'PLANNING').length;
    const inProgress = camps.filter((c) => c.status === 'IN_PROGRESS').length;
    const completed = camps.filter((c) => c.status === 'COMPLETED').length;
    const distinctVillages = new Set(camps.map((c) => c.village.toLowerCase())).size;
    return { total, confirmed, planning, inProgress, completed, distinctVillages };
  }, [camps]);

  const handleCreateCamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVillage || !campName.trim() || !campDate) return;

    const newCamp: StoredCamp = {
      id: `camp-${Date.now()}`,
      name: campName.trim(),
      date: campDate,
      village: selectedVillage,
      targetPopulation,
      allocatedStaff,
      equipmentReady,
      status: campStatus,
      notes: campNotes.trim() || undefined,
      rosterDetails: {
        medicalOfficer: 'डॉ. राजीव वर्मा (Dr. Rajiv Verma, MO PHC/CHC)',
        ashaWorkers: [
          'स्थानीय आशा कार्यकर्ता 1 (Local ASHA-01)',
          'स्थानीय आशा कार्यकर्ता 2 (Local ASHA-02)',
          'सहयोगी आशा कार्यकर्ता (Support ASHA)',
        ],
        labTechnician: 'गुरप्रीत सिंह (Mobile Lab Technologist)',
        vanDetails: 'Patiala District Health Mobile Van #PB-11-2041',
      },
      createdAt: new Date().toISOString(),
    };

    offlineStore.saveCamp(newCamp);
    setIsScheduleModalOpen(false);
    setSuccessToast(`कैंप "${newCamp.name}" सफलतापूर्वक शेड्यूल किया गया!`);
    setTimeout(() => setSuccessToast(null), 4000);

    // Reset fields
    setCampNotes('');
  };

  const handleUpdateStatus = (campId: string, newStatus: StoredCamp['status']) => {
    offlineStore.updateCampStatus(campId, newStatus);
    setSuccessToast(`कैंप स्थिति बदलकर "${newStatus}" कर दी गई है।`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleDeleteCamp = (campId: string, name: string) => {
    if (confirm(`क्या आप वाकई शिविर "${name}" को हटाना चाहते हैं?`)) {
      offlineStore.deleteCamp(campId);
      if (selectedCampForRoster?.id === campId) setSelectedCampForRoster(null);
      setSuccessToast(`शिविर हटा दिया गया।`);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const getStatusBadge = (status: StoredCamp['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            स्वीकृत (CONFIRMED)
          </span>
        );
      case 'PLANNING':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" />
            योजना में (PLANNING)
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300 animate-pulse">
            <Tent className="w-3.5 h-3.5" />
            सक्रिय शिविर (IN PROGRESS)
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
            <Check className="w-3.5 h-3.5" />
            संपन्न (COMPLETED)
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            <X className="w-3.5 h-3.5" />
            रद्द (CANCELLED)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-saathi-navy text-white px-4 py-3 rounded-2xl shadow-xl border border-saathi-teal flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-saathi-softMint shrink-0" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-saathi-navy">स्क्रीनिंग कैंप योजना (Screening Camps)</h2>
            <span className="text-xs bg-saathi-paleMint text-saathi-teal px-2.5 py-0.5 rounded-full font-bold border border-saathi-softMint">
              Live Field Ops
            </span>
          </div>
          <p className="text-xs text-saathi-textSecondary mt-1">
            दूरदराज के {summary.distinctVillages} सक्रिय गाँवों में मोबाइल स्वास्थ्य कैंपों की वास्तविक समय योजना, स्टाफ आवंटन और उपकरण ट्रैकिंग
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsScheduleModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-saathi-teal hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-saathi cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>नया कैंप शेड्यूल करें (Schedule Camp)</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-saathi-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-saathi-textSecondary">कुल कैंप (Total Camps)</span>
            <div className="p-2 bg-emerald-50 text-saathi-teal rounded-xl">
              <Tent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-saathi-navy">{summary.total}</span>
            <span className="text-xs text-saathi-textMuted">{summary.distinctVillages} गाँव सम्मिलित</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-saathi-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-saathi-textSecondary">पुष्ट / स्वीकृत (Confirmed)</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-saathi-navy">{summary.confirmed}</span>
            <span className="text-xs text-blue-600 font-semibold">स्टाफ व वैन तैयार</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-saathi-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-saathi-textSecondary">योजना में (In Planning)</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-saathi-amber">{summary.planning}</span>
            <span className="text-xs text-amber-700 font-medium">रोस्टर निर्धारण बाकी</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-saathi-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-saathi-textSecondary">संपन्न कैंप (Completed)</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-700">{summary.completed}</span>
            <span className="text-xs text-purple-600 font-medium">सफल स्क्रीनिंग</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-saathi-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-saathi-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="कैंप या गाँव खोजें (e.g. Rampur, कल्याणपुर, TB, नेत्र)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-saathi-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-saathi-teal focus:bg-white transition-saathi"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl transition-saathi whitespace-nowrap ${
              statusFilter === 'ALL'
                ? 'bg-saathi-navy text-white shadow-xs'
                : 'bg-slate-100 text-saathi-textSecondary hover:bg-slate-200'
            }`}
          >
            सभी ({camps.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('CONFIRMED')}
            className={`px-3 py-1.5 rounded-xl transition-saathi whitespace-nowrap ${
              statusFilter === 'CONFIRMED'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-saathi-textSecondary hover:bg-slate-200'
            }`}
          >
            स्वीकृत ({summary.confirmed})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('PLANNING')}
            className={`px-3 py-1.5 rounded-xl transition-saathi whitespace-nowrap ${
              statusFilter === 'PLANNING'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-saathi-textSecondary hover:bg-slate-200'
            }`}
          >
            योजना में ({summary.planning})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-xl transition-saathi whitespace-nowrap ${
              statusFilter === 'COMPLETED'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-slate-100 text-saathi-textSecondary hover:bg-slate-200'
            }`}
          >
            संपन्न ({summary.completed})
          </button>
        </div>
      </div>

      {/* Camps List Grid */}
      {filteredCamps.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-saathi-border shadow-xs">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tent className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-saathi-navy">कोई स्क्रीनिंग कैंप नहीं मिला</h3>
          <p className="text-xs text-saathi-textSecondary mt-1 max-w-md mx-auto">
            {searchQuery
              ? `खोज "${searchQuery}" के लिए कोई कैंप मौजूद नहीं है।`
              : 'वर्तमान में इस फ़िल्टर में कोई कैंप सूचीबद्ध नहीं है। नया कैंप जोड़ने के लिए ऊपर दिए गए बटन का उपयोग करें।'}
          </p>
          <button
            type="button"
            onClick={() => setIsScheduleModalOpen(true)}
            className="mt-4 px-4 py-2 bg-saathi-teal text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition-saathi inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>नया कैंप शेड्यूल करें</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCamps.map((camp) => (
            <div
              key={camp.id}
              className="bg-white rounded-2xl p-5 border border-saathi-border shadow-xs hover:shadow-md transition-saathi flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between pb-3 border-b border-saathi-border gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-saathi-paleMint text-saathi-teal rounded-xl shrink-0">
                      <Tent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-saathi-navy line-clamp-1" title={camp.name}>
                        {camp.name}
                      </h3>
                      <p className="text-xs text-saathi-textSecondary flex items-center gap-1.5 mt-0.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-saathi-teal" />
                        <span>तारीख: <strong>{camp.date}</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {getStatusBadge(camp.status)}
                  </div>
                </div>

                {/* Village Tag */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-saathi-navy bg-slate-100 px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-saathi-teal" />
                    गाँव: {camp.village}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ID: {camp.id.slice(-6)}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-3 space-y-2 text-xs text-saathi-textPrimary">
                  <p>
                    <strong className="text-saathi-navy">लक्षित समूह (Target):</strong>{' '}
                    <span className="text-saathi-textSecondary">{camp.targetPopulation}</span>
                  </p>
                  <p>
                    <strong className="text-saathi-navy">आवंटित कर्मी (Staff):</strong>{' '}
                    <span className="text-saathi-textSecondary">{camp.allocatedStaff}</span>
                  </p>
                  <p>
                    <strong className="text-saathi-navy">उपकरण तत्परता:</strong>{' '}
                    <span className="text-saathi-textSecondary">{camp.equipmentReady}</span>
                  </p>
                  {camp.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-200">
                      &quot;{camp.notes}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                {/* Status Switcher Selector */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-saathi-textMuted font-medium">स्थिति बदलें:</span>
                  <div className="flex items-center gap-1">
                    {camp.status !== 'CONFIRMED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(camp.id, 'CONFIRMED')}
                        className="px-2 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-md border border-emerald-200"
                        title="स्वीकृत करें"
                      >
                        पुष्ट करें
                      </button>
                    )}
                    {camp.status !== 'IN_PROGRESS' && camp.status !== 'COMPLETED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(camp.id, 'IN_PROGRESS')}
                        className="px-2 py-1 text-[11px] font-bold bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-md border border-blue-200"
                        title="शिविर शुरू करें"
                      >
                        शुरू करें
                      </button>
                    )}
                    {camp.status !== 'COMPLETED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(camp.id, 'COMPLETED')}
                        className="px-2 py-1 text-[11px] font-bold bg-purple-50 text-purple-800 hover:bg-purple-100 rounded-md border border-purple-200"
                        title="शिविर संपन्न मार्क करें"
                      >
                        पूर्ण
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCampForRoster(camp)}
                    className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-saathi-navy font-bold rounded-xl text-xs transition-saathi text-center"
                  >
                    रोस्टर विवरण देखें
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCamp(camp.id, camp.name)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-saathi"
                    title="कैंप हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule New Camp Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-saathi-border shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-saathi-border">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-saathi-teal rounded-2xl">
                  <Tent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-saathi-navy">नया स्क्रीनिंग कैंप शेड्यूल करें</h3>
                  <p className="text-xs text-saathi-textSecondary">
                    पटियाला जिला स्वास्थ्य परिचालन • मोबाइल स्क्रीनिंग योजना
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-saathi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCamp} className="space-y-4 text-xs">
              {/* Village Selection */}
              <div>
                <label className="block font-bold text-saathi-navy mb-1">
                  लक्षित गाँव (Select Target Village) *
                </label>
                <select
                  value={selectedVillage}
                  onChange={(e) => handleVillageChange(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-sm font-semibold text-saathi-navy focus:bg-white focus:ring-2 focus:ring-saathi-teal"
                >
                  {availableVillages.map((vName) => (
                    <option key={vName} value={vName}>
                      {vName} (पटियाला उप-केन्द्र)
                    </option>
                  ))}
                </select>
              </div>

              {/* Camp Name */}
              <div>
                <label className="block font-bold text-saathi-navy mb-1">
                  कैंप / शिविर का नाम (Camp Title) *
                </label>
                <input
                  type="text"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  required
                  placeholder="उदा. मेरठ मोबाइल स्वास्थ्य शिविर..."
                  className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-sm font-semibold text-saathi-navy focus:bg-white focus:ring-2 focus:ring-saathi-teal"
                />
              </div>

              {/* Date & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-saathi-navy mb-1">
                    तारीख (Scheduled Date) *
                  </label>
                  <input
                    type="date"
                    value={campDate}
                    onChange={(e) => setCampDate(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-sm font-semibold text-saathi-navy focus:bg-white focus:ring-2 focus:ring-saathi-teal"
                  />
                </div>

                <div>
                  <label className="block font-bold text-saathi-navy mb-1">
                    प्रारंभिक स्थिति (Initial Status)
                  </label>
                  <select
                    value={campStatus}
                    onChange={(e) => setCampStatus(e.target.value as StoredCamp['status'])}
                    className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-sm font-semibold text-saathi-navy focus:bg-white focus:ring-2 focus:ring-saathi-teal"
                  >
                    <option value="PLANNING">योजना में (PLANNING)</option>
                    <option value="CONFIRMED">स्वीकृत (CONFIRMED)</option>
                    <option value="IN_PROGRESS">सक्रिय (IN PROGRESS)</option>
                  </select>
                </div>
              </div>

              {/* Target Population */}
              <div>
                <label className="block font-bold text-saathi-navy mb-1">
                  लक्षित समूह (Target Population)
                </label>
                <select
                  value={targetPopulation}
                  onChange={(e) => setTargetPopulation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-xs font-medium text-saathi-navy focus:bg-white focus:ring-2 focus:ring-saathi-teal"
                >
                  <option value="बुजुर्ग एवं गैर-संचारी रोग (NCD) उच्च जोखिम">
                    बुजुर्ग एवं गैर-संचारी रोग (NCD) उच्च जोखिम
                  </option>
                  <option value="मातृ एवं बाल स्वास्थ्य तथा एनीमिया (MCH & Anemia)">
                    मातृ एवं बाल स्वास्थ्य तथा एनीमिया (MCH & Anemia)
                  </option>
                  <option value="नेत्र एवं डायबिटिक रेटिनोपैथी विशेष जांच">
                    नेत्र एवं डायबिटिक रेटिनोपैथी विशेष जांच
                  </option>
                  <option value="क्षयरोग (TB) एवं श्वसन लक्षण क्लस्टर जांच">
                    क्षयरोग (TB) एवं श्वसन लक्षण क्लस्टर जांच
                  </option>
                  <option value="सामान्य ग्रामीण समुदाय एवं विद्यालय जांच">
                    सामान्य ग्रामीण समुदाय एवं विद्यालय जांच
                  </option>
                </select>
              </div>

              {/* Staff Allocation */}
              <div>
                <label className="block font-bold text-saathi-navy mb-1">
                  आवंटित स्वास्थ्य कर्मी (Staff Allocation)
                </label>
                <input
                  type="text"
                  value={allocatedStaff}
                  onChange={(e) => setAllocatedStaff(e.target.value)}
                  placeholder="e.g. 4 ASHA Workers, 1 MO, 1 Lab Tech"
                  className="w-full p-2 bg-slate-50 border border-saathi-border rounded-xl text-xs text-saathi-navy focus:bg-white focus:ring-2 focus:ring-saathi-teal"
                />
              </div>

              {/* Equipment Ready */}
              <div>
                <label className="block font-bold text-saathi-navy mb-1">
                  उपकरण तत्परता (Equipment & Mobile Van)
                </label>
                <input
                  type="text"
                  value={equipmentReady}
                  onChange={(e) => setEquipmentReady(e.target.value)}
                  placeholder="e.g. Portable CBC, 1 Fundus Lens, Digital Radiograph Van"
                  className="w-full p-2 bg-slate-50 border border-saathi-border rounded-xl text-xs text-saathi-navy focus:bg-white focus:ring-2 focus:ring-saathi-teal"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-saathi-navy mb-1">
                  अतिरिक्त निर्देश / मुख्य चिकित्सा अधिकारी टिप्पणी (Notes)
                </label>
                <textarea
                  value={campNotes}
                  onChange={(e) => setCampNotes(e.target.value)}
                  rows={2}
                  placeholder="उदा. इस गाँव में हाल ही में 5 से अधिक मामलों का सेवा अंतराल दर्ज हुआ है, प्राथमिकता दें..."
                  className="w-full p-2 bg-slate-50 border border-saathi-border rounded-xl text-xs text-saathi-navy focus:bg-white focus:ring-2 focus:ring-saathi-teal resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-saathi-navy font-bold rounded-xl text-xs transition-saathi"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-saathi-teal hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-saathi flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>कैंप सुरक्षित करें (Confirm Schedule)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Roster & Logistics Details Modal */}
      {selectedCampForRoster && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-saathi-border shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-saathi-border">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-saathi-navy">कैंप रोस्टर एवं लॉजिस्टिक्स विवरण</h3>
                  <p className="text-xs text-saathi-textSecondary">
                    {selectedCampForRoster.name} • {selectedCampForRoster.village}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCampForRoster(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-saathi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Roster Details */}
            <div className="space-y-3 text-xs">
              {/* Status & Date */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">निर्धारित तारीख</span>
                  <strong className="text-saathi-navy text-sm">{selectedCampForRoster.date}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] text-right">वर्तमान स्थिति</span>
                  <div>{getStatusBadge(selectedCampForRoster.status)}</div>
                </div>
              </div>

              {/* Medical Officer */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-saathi-teal shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-saathi-navy block text-xs">
                    प्रभारी चिकित्सा अधिकारी (Medical Officer in Charge):
                  </span>
                  <span className="text-xs text-saathi-textPrimary font-semibold">
                    {selectedCampForRoster.rosterDetails?.medicalOfficer || 'डॉ. राजीव वर्मा (MO PHC/CHC)'}
                  </span>
                </div>
              </div>

              {/* ASHA Frontline Team */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <Users className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="w-full">
                  <span className="font-bold text-saathi-navy block text-xs mb-1">
                    तैनात आशा कार्यकर्ता (Assigned ASHA Team):
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-xs text-saathi-textSecondary font-medium">
                    {selectedCampForRoster.rosterDetails?.ashaWorkers?.map((w, i) => (
                      <li key={i}>{w}</li>
                    )) || <li>स्थानीय ग्राम आशा कार्यकर्ता (Active ASHA Network)</li>}
                  </ul>
                </div>
              </div>

              {/* Mobile Unit / Vehicle */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <Truck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-saathi-navy block text-xs">
                    मोबाइल वैन एवं वाहन विवरण (Mobile Vehicle Unit):
                  </span>
                  <span className="text-xs text-saathi-textPrimary font-semibold">
                    {selectedCampForRoster.rosterDetails?.vanDetails || 'Patiala Mobile Screening Unit #PB-11-2041'}
                  </span>
                </div>
              </div>

              {/* Equipment Checklist */}
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1.5">
                <span className="font-bold text-emerald-950 block text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  उपकरण तत्परता चेकलिस्ट (Diagnostic Hardware Checklist):
                </span>
                <p className="text-xs text-emerald-900 font-medium">
                  {selectedCampForRoster.equipmentReady}
                </p>
                <div className="pt-1 flex flex-wrap gap-1 text-[10px] font-mono font-bold text-emerald-800">
                  <span className="bg-emerald-100 px-2 py-0.5 rounded">✓ CBC Cartridges</span>
                  <span className="bg-emerald-100 px-2 py-0.5 rounded">✓ Fundus Lens Adapter</span>
                  <span className="bg-emerald-100 px-2 py-0.5 rounded">✓ Digital NTEP Sputum Kits</span>
                  <span className="bg-emerald-100 px-2 py-0.5 rounded">✓ Offline Tablets</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedCampForRoster(null)}
                className="w-full py-2.5 bg-saathi-navy hover:bg-saathi-deepNavy text-white font-bold rounded-xl text-xs transition-saathi"
              >
                रोस्टर बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
