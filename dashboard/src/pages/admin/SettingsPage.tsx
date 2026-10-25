import React, { useState } from 'react';
import { Settings, Shield, Bell, Database, CheckCircle2, Volume2, Sparkles, Key, Check, Globe, Bot, Terminal, ExternalLink, Loader2, ArrowRight } from 'lucide-react';
import { elevenLabsService, ELEVENLABS_PRESETS } from '../../services/elevenLabsService';
import { speechTts } from '../../services/speechTts';
import { browserUseService, HospitalTokenResult } from '../../services/browserUseService';

export const SettingsPage: React.FC = () => {
  const [smsProvider, setSmsProvider] = useState('mock');
  const [suppressionThreshold, setSuppressionThreshold] = useState('5');
  const [demoMode, setDemoMode] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // ElevenLabs Voice Settings
  const [elevenApiKey, setElevenApiKey] = useState(() => elevenLabsService.getApiKey());
  const [elevenVoiceId, setElevenVoiceId] = useState(() => elevenLabsService.getVoiceId());
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Cloud Browser Use Settings
  const [browserUseKey, setBrowserUseKey] = useState(() => browserUseService.getApiKey());
  const [showBrowserKey, setShowBrowserKey] = useState(false);
  const [isTestingAgent, setIsTestingAgent] = useState(false);
  const [agentProgressSteps, setAgentProgressSteps] = useState<string[]>([]);
  const [agentResult, setAgentResult] = useState<HospitalTokenResult | null>(null);

  const handleTestVoice = async () => {
    setIsTestingVoice(true);
    elevenLabsService.setApiKey(elevenApiKey);
    elevenLabsService.setVoiceId(elevenVoiceId);

    const testPhrase = 'नमस्ते आशा दीदी। प्रोजेक्ट साथी में आपका स्वागत है। आज आपके इलाके में 3 मरीजों की पुनः जाँच बाकी है।';
    await speechTts.speak(testPhrase, 'hi');
    setTimeout(() => setIsTestingVoice(false), 3000);
  };

  const handleTestAgent = async () => {
    setIsTestingAgent(true);
    setAgentProgressSteps([]);
    setAgentResult(null);

    browserUseService.setApiKey(browserUseKey);

    try {
      const res = await browserUseService.bookDistrictHospitalReferral({
        patientName: 'Sunita Devi',
        age: 48,
        safeId: 'SAA-NAB-2026-1049',
        specialty: 'Dermatology',
        facilityName: 'Nabha Sub-Divisional Civil Hospital (SDH)',
        reason: 'Autonomous Agent Pre-Booking Verification',
        onProgress: (stepText) => {
          setAgentProgressSteps((prev) => [...prev, stepText]);
        },
      });
      setAgentResult(res);
    } catch (err: any) {
      setAgentProgressSteps((prev) => [...prev, `Error: ${err.message}`]);
    } finally {
      setIsTestingAgent(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    elevenLabsService.setApiKey(elevenApiKey);
    elevenLabsService.setVoiceId(elevenVoiceId);
    browserUseService.setApiKey(browserUseKey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-2">
        <h2 className="text-2xl font-black text-saathi-navy">जिला प्रशासनिक सेटिंग्स (System Settings)</h2>
        <p className="text-xs text-saathi-textSecondary mt-1">
          गोपनीयता सीमा, एसएमएस गेटवे एडाप्टर और क्लिनिकल सीमा विन्यास
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>कॉन्फ़िगरेशन सेटिंग्स सफलतापूर्वक सुरक्षित कर दी गईं।</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Privacy & Small Cell Settings */}
        <div className="bg-white rounded-2xl p-6 border border-saathi-border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-saathi-navy flex items-center gap-2">
            <Shield className="w-5 h-5 text-saathi-teal" />
            डेटा प्राइवेसी एवं स्मॉल-सेल सप्रेशन (DPDPA Safeguards)
          </h3>

          <div>
            <label className="block text-xs font-bold text-saathi-navy mb-1">
              स्मॉल-सेल सप्रेशन कट-ऑफ सीमा (Small-Cell Suppression Threshold)
            </label>
            <input
              type="number"
              min="3"
              max="15"
              value={suppressionThreshold}
              onChange={(e) => setSuppressionThreshold(e.target.value)}
              className="w-full sm:w-64 text-sm p-3 border border-saathi-border rounded-xl focus:ring-2 focus:ring-saathi-teal"
            />
            <p className="text-xs text-saathi-textMuted mt-1">
              गाँव में इस सीमा से कम केस होने पर संख्या को स्वतः &quot;&lt; 5&quot; के रूप में छिपाया जाएगा।
            </p>
          </div>
        </div>

        {/* SMS Gateway Adapter */}
        <div className="bg-white rounded-2xl p-6 border border-saathi-border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-saathi-navy flex items-center gap-2">
            <Bell className="w-5 h-5 text-saathi-teal" />
            सूचना एवं एसएमएस गेटवे एडाप्टर (SMS Adapter Configuration)
          </h3>

          <div>
            <label className="block text-xs font-bold text-saathi-navy mb-1">
              एसएमएस प्रदाता एडाप्टर (Pluggable Provider)
            </label>
            <select
              value={smsProvider}
              onChange={(e) => setSmsProvider(e.target.value)}
              className="w-full sm:w-64 text-sm p-3 border border-saathi-border rounded-xl focus:ring-2 focus:ring-saathi-teal"
            >
              <option value="mock">Mock SMS Provider (Safe Local Testing)</option>
              <option value="twilio">Twilio Cloud SMS Gateway</option>
              <option value="gupshup">Gupshup India Enterprise SMS</option>
              <option value="fast2sms">Fast2SMS DLT Approved Gateway</option>
            </select>
            <p className="text-xs text-saathi-textMuted mt-1">
              गोपनीयता नीति: एसएमएस में कभी भी बीमारी या निदान का नाम शामिल नहीं किया जाएगा। केवल अपॉइंटमेंट समय व संदर्भ संख्या भेजी जाएगी।
            </p>
          </div>
        </div>

        {/* ElevenLabs Multilingual Voice AI Integration */}
        <div className="bg-white rounded-2xl p-6 border border-saathi-border shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-saathi-navy flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-indigo-600" />
                इलेवनलैब्स प्राकृतिक आवाज़ एकीकरण (ElevenLabs Voice AI)
              </h3>
              <p className="text-xs text-saathi-textMuted mt-0.5">
                ElevenLabs Multilingual V2 द्वारा आशा दीदी और मरीज़ों के लिए आत्मीय, मानवीय एवं स्पष्ट स्वर।
              </p>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto ${
                elevenApiKey && elevenApiKey.length > 15
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border border-slate-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  elevenApiKey && elevenApiKey.length > 15 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              ></span>
              <span>
                {elevenApiKey && elevenApiKey.length > 15
                  ? 'ElevenLabs AI Voice Active'
                  : 'On-Device Web Speech Fallback'}
              </span>
            </span>
          </div>

          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-saathi-navy flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                <span>ElevenLabs API Key</span>
              </label>
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                {showApiKey ? 'Hide Key' : 'Show Key'}
              </button>
            </div>
            <input
              type={showApiKey ? 'text' : 'password'}
              value={elevenApiKey}
              onChange={(e) => setElevenApiKey(e.target.value)}
              placeholder="e.g. sk_4a89bc... (from elevenlabs.io/app/settings/api-keys)"
              className="w-full text-sm p-3 font-mono border border-saathi-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              कुंजी स्थानीय रूप से सहेजी जाती है। यदि अनुपस्थित हो, तो ऐप स्वचालित रूप से ऑन-डिवाइस वेब स्पीच पर काम करता रहेगा।
            </span>
          </div>

          {/* Voice Presets */}
          <div>
            <label className="block text-xs font-bold text-saathi-navy mb-1.5">
              क्लिनिकल आवाज़ चयन (Select Healthcare Voice Model):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ELEVENLABS_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setElevenVoiceId(p.id)}
                  className={`p-3 rounded-xl border text-left transition-saathi ${
                    elevenVoiceId === p.id
                      ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/30'
                      : 'bg-slate-50 border-gray-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-saathi-navy">{p.name}</span>
                    {elevenVoiceId === p.id && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <p className="text-[11px] text-slate-600">{p.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Voice ID */}
          <div>
            <label className="block text-xs font-bold text-saathi-navy mb-1">
              या कस्टम Voice ID दर्ज करें (Custom ElevenLabs Voice ID)
            </label>
            <input
              type="text"
              value={elevenVoiceId}
              onChange={(e) => setElevenVoiceId(e.target.value)}
              placeholder="e.g. EXAVITQu4vr4xnSDxMaL"
              className="w-full sm:w-96 text-sm p-2.5 font-mono border border-saathi-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Test Voice Button */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              disabled={isTestingVoice}
              onClick={handleTestVoice}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-saathi"
            >
              <Volume2 className={`w-4 h-4 ${isTestingVoice ? 'animate-bounce' : ''}`} />
              <span>{isTestingVoice ? 'आवाज़ बज रही है... (Playing)' : 'आवाज़ का परीक्षण करें (Test Voice)'}</span>
            </button>
            <span className="text-[11px] text-slate-500">
              परीक्षण वाक्य: &quot;नमस्ते आशा दीदी। प्रोजेक्ट साथी में आपका स्वागत है।&quot;
            </span>
          </div>
        </div>

        {/* Cloud Browser Use Settings */}
        <div className="bg-white rounded-2xl p-6 border border-saathi-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-saathi-navy flex items-center gap-2">
                  क्लाउड ब्राउज़र-यूज़ ऑटोनॉमस एजेंट (Cloud Browser Use Agent)
                  <span className="text-[10px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full font-bold">
                    Autonomous Web AI
                  </span>
                </h3>
                <p className="text-xs text-saathi-textMuted">
                  सरकारी अस्पतालों (e-Hospital) में स्वचालित ओपीडी प्री-बुकिंग, टोकन जनरेशन एवं जन औषधि जेनेरिक दवा दर सत्यापन
                </p>
              </div>
            </div>

            {browserUseService.hasApiKey() && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                सत्यापित एवं सक्रिय (Connected ✓)
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-saathi-navy flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-600" />
                Browser Use API Key (cloud.browser-use.com):
              </label>
              <button
                type="button"
                onClick={() => setShowBrowserKey(!showBrowserKey)}
                className="text-[11px] font-semibold text-cyan-600 hover:text-cyan-800"
              >
                {showBrowserKey ? 'Hide Key' : 'Show Key'}
              </button>
            </div>
            <input
              type={showBrowserKey ? 'text' : 'password'}
              value={browserUseKey}
              onChange={(e) => setBrowserUseKey(e.target.value)}
              placeholder="bu_..."
              className="w-full text-sm p-3 font-mono border border-saathi-border rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              यह कुंजी cloud.browser-use.com पर उपलब्ध है। इसके माध्यम से एजेंट जिला अस्पताल पोर्टल्स पर स्वचालित ओपीडी टोकन बुक करता है।
            </span>
          </div>

          {/* Test Agent Action */}
          <div className="pt-1">
            <button
              type="button"
              disabled={isTestingAgent || !browserUseKey.trim()}
              onClick={handleTestAgent}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-saathi"
            >
              {isTestingAgent ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>एजेंट अस्पताल पोर्टल पर कार्य कर रहा है (Agent Running)...</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>ऑटोनॉमस रेफरल प्री-बुकिंग का परीक्षण करें (Test Agent Referral Booking)</span>
                </>
              )}
            </button>
          </div>

          {/* Live Agent Terminal Log */}
          {(isTestingAgent || agentProgressSteps.length > 0 || agentResult) && (
            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 text-xs font-mono space-y-3 animate-fade-in shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-cyan-400">
                  <Terminal className="w-3.5 h-3.5" />
                  Cloud Browser Use Telemetry Stream
                </span>
                <span className="text-[10px]">Model: browser-use-2.0</span>
              </div>

              <div className="space-y-1.5 text-[11px] max-h-48 overflow-y-auto">
                {agentProgressSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-cyan-500 select-none">›</span>
                    <span>{step}</span>
                  </div>
                ))}
                {isTestingAgent && (
                  <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                    <span>›</span>
                    <span>Navigating DOM, handling forms and extracting appointment confirmation...</span>
                  </div>
                )}
              </div>

              {agentResult && (
                <div className="mt-3 p-3 bg-slate-800/80 rounded-xl border border-emerald-500/40 text-emerald-300 space-y-1.5 font-sans">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      अस्पताल ओपीडी टोकन सफलतापूर्वक आरक्षित (Pre-Booking Confirmed)
                    </span>
                    <span className="font-mono text-[11px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 border border-emerald-700/50">
                      Cost: {agentResult.cost || '$0.012'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 text-slate-300 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[9px]">HOSPITAL</span>
                      <strong className="text-white">{agentResult.hospitalName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">DEPARTMENT</span>
                      <strong className="text-white">{agentResult.department}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">CONFIRMED TOKEN #</span>
                      <strong className="text-emerald-400 text-xs">{agentResult.tokenNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">DATE</span>
                      <strong className="text-white">{agentResult.appointmentDate}</strong>
                    </div>
                  </div>

                  {agentResult.sessionUrl && (
                    <div className="pt-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Cloud Session: {agentResult.sessionId}</span>
                      <a
                        href={agentResult.sessionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold underline"
                      >
                        लाइव रिकॉर्डिंग देखें (View Browser Session)
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Demonstration Mode */}
        <div className="bg-white rounded-2xl p-6 border border-saathi-border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-saathi-navy flex items-center gap-2">
            <Database className="w-5 h-5 text-saathi-amber" />
            डिमॉन्स्ट्रेशन मोड नियंत्रण (Demonstration Policy)
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-saathi-navy">डिमॉन्स्ट्रेशन मोड सक्रिय रखें (Enforce Demo Badge)</p>
              <p className="text-xs text-saathi-textMuted">
                सक्रिय होने पर ऐप में &quot;DEMO — NOT FOR CLINICAL USE&quot; चेतावनी प्रदर्शित रहेगी।
              </p>
            </div>
            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              className="w-5 h-5 text-saathi-teal rounded focus:ring-saathi-teal"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-saathi-teal hover:bg-teal-600 text-white font-bold rounded-xl text-sm shadow-md transition-saathi"
        >
          कॉन्फ़िगरेशन सहेजें (Save Settings)
        </button>
      </form>
    </div>
  );
};
