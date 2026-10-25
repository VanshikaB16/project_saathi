import React from 'react';
import { History, ShieldCheck, UserCheck, FileCheck, RefreshCw } from 'lucide-react';

export const AuditPage: React.FC = () => {
  const auditLogs = [
    {
      id: 'aud-01',
      timestamp: '2026-10-15 18:42:10 IST',
      actorRole: 'CLINICIAN',
      actorId: 'Dr. Rajiv Verma (MO Nabha)',
      action: 'UPDATE_REFERRAL_OUTCOME',
      entity: 'REFERRAL #SAA-REF-30911',
      details: 'क्लिनिकल परिणाम दर्ज किया गया: "प्लेटलेट्स 90,000 /uL, छुट्टी दी गई।" फॉलो-थ्रू लूप पूर्ण।',
      ip: '10.24.110.14',
    },
    {
      id: 'aud-02',
      timestamp: '2026-10-15 16:30:22 IST',
      actorRole: 'ASHA_WORKER',
      actorId: 'Sunita Sharma (ASHA Rampur)',
      action: 'IDEMPOTENT_SYNC_BATCH',
      entity: 'SYNC_EVENT #batch-9812',
      details: '3 नए मरीज़, 3 सहमति प्रविष्टियां, 2 त्वचा स्क्रीनिंग परिणाम ऑफ़लाइन से सिंक किए गए।',
      ip: '192.168.1.45',
    },
    {
      id: 'aud-03',
      timestamp: '2026-10-15 14:10:05 IST',
      actorRole: 'ASHA_WORKER',
      actorId: 'Sunita Sharma (ASHA Rampur)',
      action: 'RECORD_CONSENT',
      entity: 'CONSENT #con-9011 (Patient SAA-RAM-2026-4421)',
      details: '5-सूत्रीय सहमति रिकॉर्ड की गई (शोध उपयोग गैर-अनिवार्य रूप से अलग रखा गया)।',
      ip: '192.168.1.45',
    },
    {
      id: 'aud-04',
      timestamp: '2026-10-14 09:15:30 IST',
      actorRole: 'DISTRICT_ADMIN',
      actorId: 'District Health Officer (Patiala)',
      action: 'ANONYMIZED_AGGREGATE_CALCULATION',
      entity: 'DISTRICT_AGGREGATE #2026-Q3',
      details: '5 से कम संख्या वाले ग्राम क्लस्टरों पर Small-Cell Suppression लागू किया गया।',
      ip: '10.24.100.2',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-black text-saathi-navy">सिस्टम ऑडिट ट्रेल (Immutable Audit Trail)</h2>
          <p className="text-xs text-saathi-textSecondary mt-1">
            लॉगिन, ऑफ़लाइन डेटा सिंक, सहमति बदलाव और क्लिनिकल रेफरल परिणामों का छेड़छाड़-रहित इतिहास
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Append-Only Tamper-Evident Storage</span>
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-saathi-border shadow-sm overflow-hidden">
        <div className="divide-y divide-saathi-border">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-5 hover:bg-slate-50 transition-saathi flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-saathi-textMuted">{log.timestamp}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-saathi-paleMint text-saathi-teal">
                    {log.actorRole}
                  </span>
                  <code className="text-[11px] font-mono text-saathi-navy font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                    {log.action}
                  </code>
                </div>

                <p className="text-sm font-bold text-saathi-navy">{log.entity}</p>
                <p className="text-xs text-saathi-textSecondary">{log.details}</p>
              </div>

              <div className="text-right text-xs text-saathi-textMuted shrink-0">
                <p>कर्ता: <strong className="text-saathi-navy">{log.actorId}</strong></p>
                <p className="font-mono text-[11px] text-gray-400">IP: {log.ip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
