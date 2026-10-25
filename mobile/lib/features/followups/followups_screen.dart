import 'package:flutter/material.dart';
import '../../core/theme/saathi_theme.dart';
import '../../services/tts_service.dart';

class FollowupsScreen extends StatelessWidget {
  const FollowupsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final tasks = [
      {
        'patient': 'सुनीता देवी (Sunita Devi, 54)',
        'id': 'SAA-PB-042-8812',
        'village': 'रामपूर',
        'type': 'त्वचा पुनः जाँच (Skin Recheck)',
        'due': 'कल तक देय (Due Tomorrow)',
        'isOverdue': false,
      },
      {
        'patient': 'राम लाल (Ram Lal, 62)',
        'id': 'SAA-RAM-2026-1049',
        'village': 'कल्याणपुर',
        'type': 'छूटी हुई अस्पताल अपॉइंटमेंट (Missed Visit)',
        'due': '2 दिन विलंबित (Overdue 2 days)',
        'isOverdue': true,
      },
      {
        'patient': 'कमला कौर (Kamla Kaur, 48)',
        'id': 'SAA-RAM-2026-9021',
        'village': 'सुंदरनगर',
        'type': 'सीबीसी परीक्षण फॉलो-अप (CBC Follow-up)',
        'due': '3 दिन शेष (Due in 3 days)',
        'isOverdue': false,
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('पुनः जाँच और फॉलो-अप (Follow-ups)'),
        backgroundColor: SaathiColors.primaryNavy,
        foregroundColor: SaathiColors.whiteSurface,
        actions: [
          IconButton(
            icon: const Icon(Icons.volume_up_rounded),
            onPressed: () {
              TtsService.instance.speak("पुनः जाँच सूची। यहाँ उन मरीज़ों के नाम हैं जिन्हें दोबारा देखने या छूटी हुई अपॉइंटमेंट के लिए गृह भेंट की आवश्यकता है।");
            },
          )
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: tasks.length,
        itemBuilder: (context, index) {
          final t = tasks[index];
          final isOverdue = t['isOverdue'] as bool;

          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: BorderSide(
                color: isOverdue ? SaathiColors.redAlert : SaathiColors.border,
                width: isOverdue ? 2 : 1,
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        t['patient'] as String,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: SaathiColors.primaryNavy),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: isOverdue ? const Color(0xFFFDE8E8) : SaathiColors.paleMintBg,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          t['due'] as String,
                          style: TextStyle(
                            color: isOverdue ? SaathiColors.redAlert : SaathiColors.successGreen,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text('कोड: ${t['id']} • गाँव: ${t['village']}'),
                  const SizedBox(height: 6),
                  Text(
                    'कार्य: ${t['type']}',
                    style: const TextStyle(color: SaathiColors.clinicalTeal, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      OutlinedButton.icon(
                        icon: const Icon(Icons.location_on, size: 18),
                        label: const Text('गृह भेंट दर्ज करें'),
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('गृह भेंट परिणाम दर्ज किया गया।')),
                          );
                        },
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: SaathiColors.clinicalTeal,
                          minimumSize: const Size(110, 40),
                        ),
                        icon: const Icon(Icons.check, size: 18),
                        label: const Text('पूर्ण करें'),
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('फॉलो-अप कार्य सफलतापूर्वक संपन्न हुआ।')),
                          );
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
