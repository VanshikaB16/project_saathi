import 'package:flutter/material.dart';
import '../../core/theme/saathi_theme.dart';
import '../../core/localization/app_translations.dart';
import '../../services/tts_service.dart';
import '../../services/sync_service.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String _selectedLang = 'hi';
  bool _audioMuted = false;
  bool _isSyncing = false;

  @override
  void initState() {
    super.initState();
    _audioMuted = TtsService.instance.isMuted;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('सेटिंग्स एवं सिंक (Settings & Sync)'),
        backgroundColor: SaathiColors.primaryNavy,
        foregroundColor: SaathiColors.whiteSurface,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Demonstration Banner Notice
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: SaathiColors.amberWarning.withOpacity(0.12),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: SaathiColors.amberWarning),
            ),
            child: const Row(
              children: [
                Icon(Icons.shield_outlined, color: SaathiColors.amberWarning),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'प्रदर्शन मोड सक्रिय है: केवल डमी/सिम्युलेटेड रिकॉर्ड्स का उपयोग किया जा रहा है।',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: SaathiColors.amberWarning),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Section 1: Language
          Text('भाषा का चयन (App Language)', style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 8),
          RadioListTile<String>(
            activeColor: SaathiColors.clinicalTeal,
            title: const Text('हिन्दी (Hindi)'),
            value: 'hi',
            groupValue: _selectedLang,
            onChanged: (val) {
              setState(() => _selectedLang = val!);
              TtsService.instance.setLanguage('hi');
              TtsService.instance.speak("भाषा हिन्दी पर सेट की गई है।");
            },
          ),
          RadioListTile<String>(
            activeColor: SaathiColors.clinicalTeal,
            title: const Text('English'),
            value: 'en',
            groupValue: _selectedLang,
            onChanged: (val) {
              setState(() => _selectedLang = val!);
              TtsService.instance.setLanguage('en');
              TtsService.instance.speak("Language changed to English.");
            },
          ),
          const Divider(height: 32),

          // Section 2: Audio & Accessibility
          Text('आवाज़ एवं सुगमता (Voice & Audio)', style: Theme.of(context).textTheme.headlineMedium),
          SwitchListTile(
            activeColor: SaathiColors.clinicalTeal,
            title: const Text('ध्वनि मार्गदर्शन (Spoken Voice Guidance)', style: TextStyle(fontWeight: FontWeight.w600)),
            subtitle: const Text('परिणाम और निर्देश बोलकर सुनाएं।'),
            value: !_audioMuted,
            onChanged: (val) {
              setState(() {
                TtsService.instance.toggleMute();
                _audioMuted = TtsService.instance.isMuted;
              });
            },
          ),
          const Divider(height: 32),

          // Section 3: Offline Data Synchronization
          Text('डेटा सिंक (Data Synchronization)', style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 8),
          const Text(
            'गाँव में नेटवर्क न होने पर भी सभी रिकॉर्ड्स सुरक्षित रहते हैं। कनेक्शन मिलने पर यहाँ से सिंक करें।',
            style: TextStyle(color: SaathiColors.secondaryText),
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(backgroundColor: SaathiColors.clinicalTeal),
            icon: _isSyncing
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Icon(Icons.sync_rounded),
            label: Text(_isSyncing ? 'सिंक हो रहा है...' : 'अभी सिंक करें (Sync Now)'),
            onPressed: _isSyncing
                ? null
                : () async {
                    setState(() => _isSyncing = true);
                    await Future.delayed(const Duration(seconds: 1)); // simulate sync
                    setState(() => _isSyncing = false);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('ऑफ़लाइन डेटा सफलतापूर्वक सर्वर से सिंक हो गया।')),
                    );
                    TtsService.instance.speak("सभी डेटा सर्वर पर सफलतापूर्वक सिंक हो गया है।");
                  },
          ),
        ],
      ),
    );
  }
}
