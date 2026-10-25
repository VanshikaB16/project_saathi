import 'package:flutter/material.dart';
import '../../core/theme/saathi_theme.dart';
import '../../services/tts_service.dart';
import '../laboratory/cbc_rules_engine.dart';
import '../../app/routes.dart';

class BloodScreeningScreen extends StatefulWidget {
  const BloodScreeningScreen({super.key});

  @override
  State<BloodScreeningScreen> createState() => _BloodScreeningScreenState();
}

class _BloodScreeningScreenState extends State<BloodScreeningScreen> {
  // Stage 1: Visual Signs
  bool _hasBruising = false;
  bool _hasPetechiae = false;
  bool _hasFatigue = false;

  // Stage 2: CBC Values
  final _hbController = TextEditingController(text: '8.4');
  final _wbcController = TextEditingController(text: '2800');
  final _plateletsController = TextEditingController(text: '45000');

  // Stage 4: Smear review flag
  bool _hasMicroscopeSmear = false;
  double _candidateBlasts = 0.0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('रक्त एवं सीबीसी फनल (Blood-Cancer Funnel)'),
        backgroundColor: SaathiColors.primaryNavy,
        foregroundColor: SaathiColors.whiteSurface,
        actions: [
          IconButton(
            icon: const Icon(Icons.volume_up_rounded),
            onPressed: () {
              TtsService.instance.speak(
                "रक्त जाँच फनल: इसमें 4 चरण हैं। पहला, शारीरिक लक्षण जैसे नीले निशान। "
                "दूसरा, सीबीसी रिपोर्ट के मान। तीसरा, प्रमाणित क्लिनिकल नियम। और चौथा, माइक्रोस्कोप स्लाइड समीक्षा। यह कोई अंतिम कैंसर निदान नहीं है।"
              );
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        children: [
          // Clinical Funnel Principle Notice
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: SaathiColors.paleMintBg,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Text(
              'फनल सिद्धांत: कोई भी एक जांच अकेले ल्यूकेमिया तय नहीं करती। यह स्क्रीन शारीरिक लक्षणों, सीबीसी लैब रिपोर्ट और स्लाइड समीक्षा को क्रमबद्ध रूप से जोड़ती है।',
              style: TextStyle(fontSize: 13, color: SaathiColors.primaryNavy, height: 1.4),
            ),
          ),
          const SizedBox(height: 20),

          // Stage 1: Visual Warning Signs
          Text('चरण 1: दृश्य चेतावनी लक्षण (Visual Warning Signs)', style: Theme.of(context).textTheme.headlineMedium),
          CheckboxListTile(
            activeColor: SaathiColors.clinicalTeal,
            title: const Text('बिना चोट के त्वचा पर नीले या काले निशान (Unexplained Bruising)'),
            value: _hasBruising,
            onChanged: (val) => setState(() => _hasBruising = val ?? false),
          ),
          CheckboxListTile(
            activeColor: SaathiColors.clinicalTeal,
            title: const Text('त्वचा पर बारीक लाल-बैंगनी दाने (Petechiae)'),
            value: _hasPetechiae,
            onChanged: (val) => setState(() => _hasPetechiae = val ?? false),
          ),
          CheckboxListTile(
            activeColor: SaathiColors.clinicalTeal,
            title: const Text('अत्यधिक थकान एवं बार-बार संक्रमण (Severe Fatigue / Infections)'),
            value: _hasFatigue,
            onChanged: (val) => setState(() => _hasFatigue = val ?? false),
          ),
          const Divider(height: 32),

          // Stage 2: CBC Report Entry & OCR
          Text('चरण 2 व 3: सीबीसी रिपोर्ट सत्यापन एवं क्लिनिकल नियम', style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _hbController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: 'हीमोग्लोबिन (Hb g/dL)',
                    helperText: 'सामान्य: 12.0 - 16.0',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: TextField(
                  controller: _wbcController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: 'WBC कुल संख्या (/uL)',
                    helperText: 'सामान्य: 4,000 - 11,000',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          TextField(
            controller: _plateletsController,
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              labelText: 'प्लेटलेट्स संख्या (/uL)',
              helperText: 'सामान्य: 1,50,000 - 4,50,000',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
          const Divider(height: 32),

          // Stage 4: Microscope Smear Review
          Text('चरण 4: पेरिफेरल ब्लड स्मीयर माइक्रोस्कोप समीक्षा', style: Theme.of(context).textTheme.headlineMedium),
          SwitchListTile(
            activeColor: SaathiColors.clinicalTeal,
            title: const Text('100x ऑयल विसर्जन माइक्रोस्कोप स्लाइड उपलब्ध है?'),
            subtitle: const Text('लैब तकनीशियन सहायता हेतु (फोन कैमरा फोटो अमान्य है)'),
            value: _hasMicroscopeSmear,
            onChanged: (val) => setState(() => _hasMicroscopeSmear = val),
          ),
          const SizedBox(height: 28),

          ElevatedButton(
            child: const Text('क्लिनिकल नियमों द्वारा मूल्यांकन करें (Evaluate Funnel)'),
            onPressed: () {
              final hb = double.tryParse(_hbController.text);
              final wbc = double.tryParse(_wbcController.text);
              final plt = double.tryParse(_plateletsController.text);

              final summary = CbcRulesEngine.evaluate(
                hemoglobin: hb,
                totalWbc: wbc,
                platelets: plt,
                candidateBlastsPercent: _hasMicroscopeSmear ? 2.5 : 0.0,
              );

              final flag = summary.requiresUrgentMedicalCheck ? 'RED' : (summary.requiresScheduledFollowup ? 'AMBER' : 'GREEN');

              Navigator.pushNamed(
                context,
                SaathiRoutes.screeningResult,
                arguments: {
                  'pathway': 'BLOOD',
                  'simulatedFlag': flag,
                },
              );
            },
          ),
        ],
      ),
    );
  }
}
