import 'package:flutter/material.dart';
import '../../core/theme/saathi_theme.dart';
import '../../services/tts_service.dart';
import '../../app/routes.dart';

class EyeScreeningScreen extends StatefulWidget {
  const EyeScreeningScreen({super.key});

  @override
  State<EyeScreeningScreen> createState() => _EyeScreeningScreenState();
}

class _EyeScreeningScreenState extends State<EyeScreeningScreen> {
  bool _hasFundusAttachment = false;
  bool _hasDiabetes = true;
  bool _blurryVision = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('आंख एवं पर्दा जाँच (Retina Screening)'),
        backgroundColor: SaathiColors.primaryNavy,
        foregroundColor: SaathiColors.whiteSurface,
        actions: [
          IconButton(
            icon: const Icon(Icons.volume_up_rounded),
            onPressed: () {
              TtsService.instance.speak(
                "रेटिना जाँच नियम: सामान्य मोबाइल कैमरे से आंख के अंदर की जांच नहीं हो सकती। इसके लिए विशेष फंडस लेंस की आवश्यकता है। यदि लेंस नहीं है तो जोखिम सवालों के आधार पर नेत्र विशेषज्ञ के पास भेजें।"
              );
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        children: [
          // Mandatory Equipment Notice
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF8E1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: SaathiColors.amberWarning, width: 1.5),
            ),
            child: const Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.warning_amber_rounded, color: SaathiColors.amberWarning, size: 28),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'महत्वपूर्ण नैदानिक सीमा: साधारण कैमरे से आंख के पर्दे (रेटिना) की जांच नहीं की जा सकती। इसके लिए प्रमाणित ऑप्टिकल फंडस अटैचमेंट अनिवार्य है। यदि उपकरण उपलब्ध नहीं है तो मरीज़ को नेत्र अस्पताल में रेफर करें।',
                    style: TextStyle(fontSize: 14, color: SaathiColors.primaryNavy, height: 1.4),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Hardware toggle
          SwitchListTile(
            activeColor: SaathiColors.clinicalTeal,
            title: const Text('ऑप्टिकल फंडस लेंस उपलब्ध है? (Fundus Lens Attached)'),
            subtitle: const Text('प्रमाणित पोर्टेबल लेंस (Remidio/Volk iNview)'),
            value: _hasFundusAttachment,
            onChanged: (val) => setState(() => _hasFundusAttachment = val),
          ),
          const Divider(height: 32),

          Text('जोखिम कारक एवं लक्षण (Risk Factors)', style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 8),

          CheckboxListTile(
            activeColor: SaathiColors.clinicalTeal,
            title: const Text('क्या मरीज़ को मधुमेह (डायबिटीज़) है?'),
            value: _hasDiabetes,
            onChanged: (val) => setState(() => _hasDiabetes = val ?? false),
          ),
          CheckboxListTile(
            activeColor: SaathiColors.clinicalTeal,
            title: const Text('क्या दृष्टि में धुंधलापन या काले धब्बे दिखते हैं?'),
            value: _blurryVision,
            onChanged: (val) => setState(() => _blurryVision = val ?? false),
          ),
          const SizedBox(height: 32),

          if (_hasFundusAttachment) ...[
            ElevatedButton.icon(
              icon: const Icon(Icons.camera_alt),
              label: const Text('फंडस फोटो कैप्चर करें (Fundus Capture)'),
              onPressed: () {
                Navigator.pushNamed(
                  context,
                  SaathiRoutes.screeningResult,
                  arguments: {'pathway': 'RETINA', 'simulatedFlag': 'GREEN'},
                );
              },
            ),
          ] else ...[
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(backgroundColor: SaathiColors.amberWarning),
              icon: const Icon(Icons.local_hospital_rounded),
              label: const Text('नेत्र विशेषज्ञ के पास रेफर करें (Refer to Eye Clinic)'),
              onPressed: () {
                Navigator.pushNamed(
                  context,
                  SaathiRoutes.screeningResult,
                  arguments: {
                    'pathway': 'RETINA',
                    'simulatedFlag': (_hasDiabetes && _blurryVision) ? 'RED' : 'AMBER',
                  },
                );
              },
            ),
          ],
        ],
      ),
    );
  }
}
