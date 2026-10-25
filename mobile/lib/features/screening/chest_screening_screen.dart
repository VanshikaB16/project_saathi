import 'package:flutter/material.dart';
import '../../core/theme/saathi_theme.dart';
import '../../services/tts_service.dart';
import '../../app/routes.dart';

class ChestScreeningScreen extends StatefulWidget {
  const ChestScreeningScreen({super.key});

  @override
  State<ChestScreeningScreen> createState() => _ChestScreeningScreenState();
}

class _ChestScreeningScreenState extends State<ChestScreeningScreen> {
  bool _coughOver2Weeks = false;
  bool _coughingBlood = false;
  bool _feverOrNightSweats = false;
  bool _unexplainedWeightLoss = false;
  bool _xrayImported = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('छाती एवं टीबी स्क्रीनिंग (Chest / TB)'),
        backgroundColor: SaathiColors.primaryNavy,
        foregroundColor: SaathiColors.whiteSurface,
        actions: [
          IconButton(
            icon: const Icon(Icons.volume_up_rounded),
            onPressed: () {
              TtsService.instance.speak(
                "छाती की साधारण फ़ोटो से फेफड़ों की बीमारी या टीबी का पता नहीं चल सकता। केवल डिजिटल एक्स-रे या लक्षण प्रश्नावली के आधार पर बलगम जाँच के लिए रेफर करें।"
              );
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        children: [
          // Mandatory Radiograph Warning
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFFDE8E8),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: SaathiColors.redAlert.withOpacity(0.4)),
            ),
            child: const Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.warning_amber_rounded, color: SaathiColors.redAlert, size: 28),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'नैदानिक नियम: साधारण कैमरे से छाती की त्वचा की फोटो एक्स-रे का विकल्प नहीं है। अधिकृत डिजिटल एक्स-रे आयात करें या नीचे दी गई लक्षण प्रश्नावली भरें।',
                    style: TextStyle(fontSize: 14, color: SaathiColors.primaryNavy, height: 1.4),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          Text('राष्ट्रीय टीबी उन्मूलन कार्यक्रम लक्षण प्रश्नावली', style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 8),

          CheckboxListTile(
            activeColor: SaathiColors.clinicalTeal,
            title: const Text('2 सप्ताह से अधिक समय से लगातार खांसी (Cough > 2 weeks)'),
            value: _coughOver2Weeks,
            onChanged: (val) => setState(() => _coughOver2Weeks = val ?? false),
          ),
          CheckboxListTile(
            activeColor: SaathiColors.redAlert,
            title: const Text('खांसी में खून आना (Hemoptysis / Blood in Sputum)', style: TextStyle(fontWeight: FontWeight.bold)),
            value: _coughingBlood,
            onChanged: (val) => setState(() => _coughingBlood = val ?? false),
          ),
          CheckboxListTile(
            activeColor: SaathiColors.clinicalTeal,
            title: const Text('शाम के समय बुखार या रात में पसीना आना (Night Sweats / Fever)'),
            value: _feverOrNightSweats,
            onChanged: (val) => setState(() => _feverOrNightSweats = val ?? false),
          ),
          CheckboxListTile(
            activeColor: SaathiColors.clinicalTeal,
            title: const Text('अस्पष्ट रूप से वजन कम होना (Unexplained Weight Loss)'),
            value: _unexplainedWeightLoss,
            onChanged: (val) => setState(() => _unexplainedWeightLoss = val ?? false),
          ),
          const Divider(height: 32),

          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              minimumSize: const Size.fromHeight(50),
              side: BorderSide(color: _xrayImported ? SaathiColors.successGreen : SaathiColors.clinicalTeal, width: 2),
            ),
            icon: Icon(_xrayImported ? Icons.check_circle : Icons.upload_file, color: _xrayImported ? SaathiColors.successGreen : SaathiColors.clinicalTeal),
            label: Text(_xrayImported ? 'डिजिटल एक्स-रे आयातित (Verified)' : 'डिजिटल एक्स-रे आयात करें (PACS/DICOM Import)'),
            onPressed: () {
              setState(() => _xrayImported = !_xrayImported);
            },
          ),
          const SizedBox(height: 28),

          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: (_coughingBlood || (_coughOver2Weeks && _feverOrNightSweats))
                  ? SaathiColors.redAlert
                  : SaathiColors.clinicalTeal,
            ),
            child: const Text('जाँच परिणाम देखें (Review Clinical Output)'),
            onPressed: () {
              final isUrgent = _coughingBlood || (_coughOver2Weeks && _feverOrNightSweats);
              final isModerate = _coughOver2Weeks || _unexplainedWeightLoss || _feverOrNightSweats;

              Navigator.pushNamed(
                context,
                SaathiRoutes.screeningResult,
                arguments: {
                  'pathway': 'CHEST',
                  'simulatedFlag': isUrgent ? 'RED' : (isModerate ? 'AMBER' : 'GREEN'),
                },
              );
            },
          ),
        ],
      ),
    );
  }
}
