import 'package:flutter/material.dart';
import '../../core/theme/saathi_theme.dart';
import '../../core/localization/app_translations.dart';
import '../../services/tts_service.dart';

class TimelineEntry {
  final String date;
  final String title;
  final String sourceLabel;
  final String sourceType; // AI_SCREENING, WORKER_ENTERED, LAB_VALUE, CLINICIAN_CONFIRMED
  final String details;
  final Color badgeColor;

  TimelineEntry({
    required this.date,
    required this.title,
    required this.sourceLabel,
    required this.sourceType,
    required this.details,
    required this.badgeColor,
  });
}

class PatientTimelineScreen extends StatelessWidget {
  const PatientTimelineScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final entries = [
      TimelineEntry(
        date: '14 Oct 2026, 11:30 AM',
        title: 'अस्पताल परामर्श एवं निदान दर्ज',
        sourceLabel: 'डॉ. राजीव वर्मा (चिकित्सा अधिकारी, सीएचसी नाभा)',
        sourceType: 'CLINICIAN_CONFIRMED',
        details: 'मरीज़ ने ओपीडी में उपस्थित होकर त्वचा बायोप्सी कराई। सौम्य सिस्ट की पुष्टि। एंटीबायोटिक मलहम दिया गया।',
        badgeColor: SaathiColors.successGreen,
      ),
      TimelineEntry(
        date: '12 Oct 2026, 04:15 PM',
        title: 'अस्पताल रेफरल एवं परिवार संदेश',
        sourceLabel: 'सुनीता शर्मा (आशा कार्यकर्ता)',
        sourceType: 'WORKER_ENTERED',
        details: 'सीएचसी नाभा के लिए रेफरल कोड SAA-REF-10492 जारी। परिवार के अधिकृत नंबर पर सामान्य सूचना एसएमएस भेजा गया।',
        badgeColor: SaathiColors.primaryNavy,
      ),
      TimelineEntry(
        date: '12 Oct 2026, 04:05 PM',
        title: 'ऑन-डिवाइस त्वचा स्क्रीनिंग परिणाम (Amber Flag)',
        sourceLabel: 'ऑन-डिवाइस एआई मॉडल (saathi-skin-v1.0-q8)',
        sourceType: 'AI_SCREENING',
        details: 'लक्षण: असामान्य त्वचा बदलाव। सिफारिश: 7 से 14 दिनों के भीतर नजदीकी स्वास्थ्य केंद्र में डॉक्टर से जांच कराएं।',
        badgeColor: SaathiColors.amberWarning,
      ),
      TimelineEntry(
        date: '12 Oct 2026, 03:55 PM',
        title: 'सहमति एवं गुणवत्ता सत्यापन',
        sourceLabel: 'सुनीता शर्मा (आशा कार्यकर्ता)',
        sourceType: 'WORKER_ENTERED',
        details: '5-सूत्रीय सहमति प्राप्त (जांच, रेफरल, एसएमएस)। प्राकृतिक रोशनी में ली गई फोटो की गुणवत्ता 95% स्पष्ट दर्ज हुई।',
        badgeColor: SaathiColors.clinicalTeal,
      ),
      TimelineEntry(
        date: '10 Sep 2026, 10:00 AM',
        title: 'पूर्व सीबीसी रक्त रिपोर्ट (नियमित कैंप)',
        sourceLabel: 'पीएचसी रामपुर प्रयोगशाला',
        sourceType: 'LAB_VALUE',
        details: 'हीमोग्लोबिन: 12.8 g/dL, WBC: 6,800 /uL, प्लेटलेट्स: 2,10,000 /uL. सभी पैरामीटर सामान्य सीमा में पाए गए।',
        badgeColor: const Color(0xFF2C5E7A),
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('मरीज़ स्वास्थ्य इतिहास (Timeline)'),
        backgroundColor: SaathiColors.primaryNavy,
        foregroundColor: SaathiColors.whiteSurface,
        actions: [
          IconButton(
            icon: const Icon(Icons.volume_up_rounded),
            onPressed: () {
              TtsService.instance.speak("मरीज़ का संपूर्ण स्वास्थ्य इतिहास। इसमें एआई स्क्रीनिंग, आशा दीदी की प्रविष्टि, लैब रिपोर्ट और डॉक्टर की जांच स्पष्ट रूप से अलग-अलग दिखाई गई है।");
            },
          )
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: entries.length,
        itemBuilder: (context, index) {
          final item = entries[index];
          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Chronological Line & Indicator
              Column(
                children: [
                  CircleAvatar(
                    radius: 12,
                    backgroundColor: item.badgeColor,
                    child: const Icon(Icons.circle, size: 8, color: Colors.white),
                  ),
                  if (index != entries.length - 1)
                    Container(
                      width: 2,
                      height: 110,
                      color: SaathiColors.border,
                    ),
                ],
              ),
              const SizedBox(width: 14),
              // Card Details
              Expanded(
                child: Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                    side: BorderSide(color: SaathiColors.border.withOpacity(0.8)),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(14.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              item.date,
                              style: const TextStyle(fontSize: 12, color: SaathiColors.secondaryText, fontWeight: FontWeight.bold),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: item.badgeColor.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                _getSourceTypeLabel(item.sourceType),
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: item.badgeColor,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          item.title,
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: SaathiColors.primaryNavy),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'स्रोत: ${item.sourceLabel}',
                          style: const TextStyle(fontSize: 13, color: SaathiColors.clinicalTeal, fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          item.details,
                          style: const TextStyle(fontSize: 14, color: SaathiColors.primaryText, height: 1.3),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  String _getSourceTypeLabel(String type) {
    switch (type) {
      case 'AI_SCREENING':
        return 'AI स्क्रीनिंग आउटपुट';
      case 'WORKER_ENTERED':
        return 'आशा कार्यकर्ता प्रविष्टि';
      case 'LAB_VALUE':
        return 'प्रयोगशाला मान (Lab)';
      case 'CLINICIAN_CONFIRMED':
        return 'डॉक्टर द्वारा पुष्ट';
      default:
        return 'रिकॉर्ड';
    }
  }
}
