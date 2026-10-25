import 'package:flutter/material.dart';
import '../../core/theme/saathi_theme.dart';
import '../../core/localization/app_translations.dart';
import '../../services/tts_service.dart';
import '../../core/database/database_helper.dart';
import '../../core/database/schema.dart';
import '../../app/routes.dart';

class ScreeningResultScreen extends StatefulWidget {
  const ScreeningResultScreen({super.key});

  @override
  State<ScreeningResultScreen> createState() => _ScreeningResultScreenState();
}

class _ScreeningResultScreenState extends State<ScreeningResultScreen> {
  String _flag = 'AMBER';
  String _pathway = 'SKIN';

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    if (args != null) {
      _flag = args['simulatedFlag'] ?? 'AMBER';
      _pathway = args['pathway'] ?? 'SKIN';
    }
  }

  Color _getFlagColor() {
    switch (_flag) {
      case 'GREEN':
        return SaathiColors.successGreen;
      case 'AMBER':
        return SaathiColors.amberWarning;
      case 'RED':
        return SaathiColors.redAlert;
      default:
        return SaathiColors.secondaryText;
    }
  }

  IconData _getFlagIcon() {
    switch (_flag) {
      case 'GREEN':
        return Icons.check_circle_rounded;
      case 'AMBER':
        return Icons.help_outline_rounded;
      case 'RED':
        return Icons.warning_rounded;
      default:
        return Icons.info_outline_rounded;
    }
  }

  String _getTitleText() {
    switch (_flag) {
      case 'GREEN':
        return AppTranslations.text('result_green_title');
      case 'AMBER':
        return AppTranslations.text('result_amber_title');
      case 'RED':
        return AppTranslations.text('result_red_title');
      default:
        return 'गुणवत्ता या मॉडल समस्या (Quality Issue)';
    }
  }

  String _getSpokenText() {
    switch (_flag) {
      case 'GREEN':
        return AppTranslations.text('result_green_spoken');
      case 'AMBER':
        return AppTranslations.text('result_amber_spoken');
      case 'RED':
        return AppTranslations.text('result_red_spoken');
      default:
        return 'जाँच पूरी नहीं हो सकी। कृपया दोबारा फ़ोटो लें या सीधे डॉक्टर को दिखाएं।';
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getFlagColor();

    return Scaffold(
      appBar: AppBar(
        title: const Text('जाँच परिणाम (Screening Result)'),
        backgroundColor: SaathiColors.primaryNavy,
        foregroundColor: SaathiColors.whiteSurface,
        actions: [
          IconButton(
            icon: const Icon(Icons.volume_up_rounded, size: 28),
            onPressed: () {
              TtsService.instance.speak(_getSpokenText());
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Demonstration Mode Badge
            Container(
              padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
              decoration: BoxDecoration(
                color: SaathiColors.amberWarning.withOpacity(0.15),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: SaathiColors.amberWarning),
              ),
              child: const Text(
                'DEMO MODEL — NOT CLINICALLY VALIDATED FOR PATIENT DIAGNOSIS',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: SaathiColors.amberWarning,
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Step Indicator
            const Text(
              'चरण 3/3: परिणाम एवं आगामी कदम',
              style: TextStyle(color: SaathiColors.secondaryText, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            // Color Coded High Contrast Card
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(color: color, width: 2.5),
              ),
              child: Padding(
                padding: const EdgeInsets.all(22.0),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 40,
                      backgroundColor: color.withOpacity(0.15),
                      child: Icon(_getFlagIcon(), color: color, size: 48),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      _getTitleText(),
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: color,
                        height: 1.3,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _getSpokenText(),
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Clinical Limitations Disclaimer (Mandatory)
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: SaathiColors.warmOffWhite,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: SaathiColors.border),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.info_outline, color: SaathiColors.secondaryText, size: 22),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'चिकित्सीय चेतावनी: यह जाँच केवल सहायता के लिए है, यह कोई पक्की बीमारी तय नहीं करती। हरी जाँच भी बीमारी की पूर्ण अनुपस्थिति की गारंटी नहीं है।',
                      style: TextStyle(fontSize: 13, color: SaathiColors.secondaryText, height: 1.4),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Next Step Action (Follow-Through Loop)
            if (_flag != 'GREEN') ...[
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(backgroundColor: SaathiColors.clinicalTeal),
                icon: const Icon(Icons.send_rounded, size: 26),
                label: const Text('अस्पताल रेफरल बनाएं (Create Referral)'),
                onPressed: () async {
                  final refNum = DateTime.now().millisecondsSinceEpoch % 100000;
                  final ref = {
                    'id': 'ref-${DateTime.now().millisecondsSinceEpoch}',
                    'safe_reference_code': 'SAA-REF-$refNum',
                    'patient_id': 'pat-active',
                    'destination_facility_id': 'fac-chc-01',
                    'urgency_tier': _flag == 'RED' ? 'PROMPT_ASSESSMENT' : 'SCHEDULED_CHECK',
                    'status': 'REFERRED',
                    'reason_summary': 'त्वचा स्क्रीनिंग में संभावित लक्षण पाए गए।',
                    'created_at': DateTime.now().toIso8601String(),
                    'updated_at': DateTime.now().toIso8601String(),
                  };

                  await DatabaseHelper.instance.insertOrUpdate(
                    LocalSchema.tableReferrals,
                    ref,
                  );

                  TtsService.instance.speak("रेफरल सफलतापूर्वक दर्ज कर लिया गया है। फॉलो-थ्रू लूप सक्रिय है।");

                  if (mounted) {
                    Navigator.pushReplacementNamed(context, SaathiRoutes.referralsList);
                  }
                },
              ),
              const SizedBox(height: 12),
            ],

            OutlinedButton(
              onPressed: () {
                Navigator.pushReplacementNamed(context, SaathiRoutes.workerHome);
              },
              child: const Text('आशा होम स्क्रीन पर लौटें (Return Home)'),
            ),
          ],
        ),
      ),
    );
  }
}
