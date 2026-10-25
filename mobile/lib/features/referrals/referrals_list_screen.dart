import 'package:flutter/material.dart';
import '../../core/theme/saathi_theme.dart';
import '../../core/localization/app_translations.dart';
import '../../services/tts_service.dart';
import '../../core/database/database_helper.dart';
import '../../core/database/schema.dart';
import '../../app/routes.dart';

class ReferralsListScreen extends StatefulWidget {
  const ReferralsListScreen({super.key});

  @override
  State<ReferralsListScreen> createState() => _ReferralsListScreenState();
}

class _ReferralsListScreenState extends State<ReferralsListScreen> {
  List<Map<String, dynamic>> _referrals = [];

  @override
  void initState() {
    super.initState();
    _loadReferrals();
  }

  Future<void> _loadReferrals() async {
    final list = await DatabaseHelper.instance.queryAll(LocalSchema.tableReferrals);
    setState(() {
      _referrals = list;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppTranslations.text('open_referrals')),
        backgroundColor: SaathiColors.primaryNavy,
        foregroundColor: SaathiColors.whiteSurface,
        actions: [
          IconButton(
            icon: const Icon(Icons.volume_up_rounded),
            onPressed: () {
              TtsService.instance.speak("खुले रेफरल की सूची। यह रेफरल तब तक खुले रहेंगे जब तक अस्पताल से डॉक्टर की अंतिम रिपोर्ट दर्ज नहीं हो जाती।");
            },
          )
        ],
      ),
      body: _referrals.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.assignment_turned_in_outlined, size: 72, color: SaathiColors.clinicalTeal),
                    const SizedBox(height: 16),
                    Text(
                      'कोई सक्रिय रेफरल लंबित नहीं है',
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'सभी पूर्व मामलों का क्लिनिकल परिणाम दर्ज हो चुका है।',
                      style: TextStyle(color: SaathiColors.secondaryText),
                    ),
                  ],
                ),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _referrals.length,
              itemBuilder: (context, index) {
                final ref = _referrals[index];
                final isClosed = ref['status'] == 'COMPLETED';
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              ref['safe_reference_code'] ?? 'SAA-REF',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: SaathiColors.primaryNavy),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: isClosed ? SaathiColors.paleMintBg : const Color(0xFFFFF4E5),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                ref['status'] ?? 'REFERRED',
                                style: TextStyle(
                                  color: isClosed ? SaathiColors.successGreen : SaathiColors.amberWarning,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'कारण: ${ref['reason_summary'] ?? 'जाँच में लक्षण दर्ज'}',
                          style: const TextStyle(fontSize: 15),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'अस्पताल: Nabha Community Health Centre (CHC)',
                          style: TextStyle(color: SaathiColors.secondaryText, fontSize: 13),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            OutlinedButton.icon(
                              icon: const Icon(Icons.phone, size: 18),
                              label: const Text('मरीज़ को कॉल करें'),
                              onPressed: () {},
                            ),
                            const SizedBox(width: 8),
                            ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: SaathiColors.clinicalTeal,
                                minimumSize: const Size(120, 40),
                              ),
                              icon: const Icon(Icons.check, size: 18),
                              label: const Text('परिणाम दर्ज करें'),
                              onPressed: () {
                                _showRecordOutcomeDialog(ref['id']);
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

  void _showRecordOutcomeDialog(String referralId) {
    final outcomeController = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('क्लिनिकल परिणाम दर्ज करें (Record Outcome)'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('अस्पताल के डॉक्टर द्वारा दी गई सलाह या जांच रिपोर्ट का विवरण भरें:'),
            const SizedBox(height: 12),
            TextField(
              controller: outcomeController,
              maxLines: 3,
              decoration: const InputDecoration(
                hintText: 'उदा. डॉक्टर ने जांच की, दवा दी और 14 दिन बाद पुनः बुलाया।',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            child: const Text('रद्द करें'),
            onPressed: () => Navigator.pop(ctx),
          ),
          ElevatedButton(
            child: const Text('रेफरल पूर्ण करें (Close Loop)'),
            onPressed: () async {
              if (outcomeController.text.trim().isNotEmpty) {
                final db = await DatabaseHelper.instance.database;
                await db.update(
                  LocalSchema.tableReferrals,
                  {
                    'status': 'COMPLETED',
                    'outcome_summary': outcomeController.text.trim(),
                    'updated_at': DateTime.now().toIso8601String(),
                  },
                  where: 'id = ?',
                  whereArgs: [referralId],
                );
                Navigator.pop(ctx);
                _loadReferrals();
                TtsService.instance.speak("रेफरल का परिणाम दर्ज कर लिया गया है। फॉलो-थ्रू लूप सफलतापूर्वक पूर्ण हुआ।");
              }
            },
          ),
        ],
      ),
    );
  }
}
