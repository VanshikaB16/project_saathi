import 'package:flutter/material.dart';
import '../../core/theme/saathi_theme.dart';
import '../../core/localization/app_translations.dart';
import '../../services/tts_service.dart';
import '../../app/routes.dart';

class WorkerHomeScreen extends StatelessWidget {
  const WorkerHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
            ),
            padding: const EdgeInsets.all(2),
            child: Image.asset(
              'assets/images/sathi-logo.png',
              fit: BoxFit.contain,
            ),
          ),
        ),
        title: Text(AppTranslations.text('worker_dashboard')),
        backgroundColor: SaathiColors.primaryNavy,
        foregroundColor: SaathiColors.whiteSurface,
        actions: [
          IconButton(
            icon: const Icon(Icons.volume_up_rounded),
            tooltip: 'Listen Guidance',
            onPressed: () {
              TtsService.instance.speak("नमस्ते आशा दीदी। आज आपके क्षेत्र में 3 लोगों का फॉलो-अप बाकी है और 2 रेफरल अस्पताल की रिपोर्ट का इंतज़ार कर रहे हैं।");
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => Navigator.pushNamed(context, SaathiRoutes.settings),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Connection Status Bar
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: SaathiColors.paleMintBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: SaathiColors.clinicalTeal.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.cloud_queue_rounded, color: SaathiColors.clinicalTeal),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'ऑफ़लाइन मोड (5 रिकॉर्ड सिंक के लिए तैयार हैं)',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: SaathiColors.primaryNavy,
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                    ),
                    const Icon(Icons.sync, color: SaathiColors.clinicalTeal),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Daily Action Highlights
              Text(
                'आज के मुख्य कार्य (Today\'s Tasks)',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 12),

              Card(
                child: ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: SaathiColors.paleMintBg,
                    child: Icon(Icons.person_search, color: SaathiColors.clinicalTeal),
                  ),
                  title: const Text('3 लोगों की दोबारा जाँच (Follow-up) आवश्यक है'),
                  subtitle: const Text('गाँव: रामपूर • 7 दिनों की समयसीमा'),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 18),
                  onTap: () => Navigator.pushNamed(context, SaathiRoutes.followups),
                ),
              ),
              const SizedBox(height: 8),

              Card(
                child: ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: Color(0xFFFFF4E5),
                    child: Icon(Icons.assignment_turned_in, color: SaathiColors.amberWarning),
                  ),
                  title: const Text('2 रेफरल अस्पताल के परिणाम की प्रतीक्षा में हैं'),
                  subtitle: const Text('सीएचसी नाभा • फॉलो-थ्रू लूप खुला है'),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 18),
                  onTap: () => Navigator.pushNamed(context, SaathiRoutes.referralsList),
                ),
              ),
              const SizedBox(height: 24),

              // Primary Worker Action Buttons (Large touch targets)
              ElevatedButton.icon(
                icon: const Icon(Icons.medical_services, size: 30),
                label: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  child: Text(
                    AppTranslations.text('start_screening'),
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                ),
                onPressed: () {
                  Navigator.pushNamed(context, SaathiRoutes.screeningSelect);
                },
              ),
              const SizedBox(height: 14),

              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: SaathiColors.primaryNavy,
                ),
                icon: const Icon(Icons.person_add_alt_1, size: 28),
                label: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  child: Text(
                    AppTranslations.text('register_patient'),
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ),
                onPressed: () {
                  Navigator.pushNamed(context, SaathiRoutes.patientRegister);
                },
              ),
              const SizedBox(height: 14),

              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        side: const BorderSide(color: SaathiColors.clinicalTeal, width: 2),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      icon: const Icon(Icons.history_edu, color: SaathiColors.clinicalTeal),
                      label: const Text(
                        'मरीज़ इतिहास\n(Timeline)',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: SaathiColors.clinicalTeal, fontWeight: FontWeight.bold),
                      ),
                      onPressed: () => Navigator.pushNamed(context, SaathiRoutes.timeline),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        side: const BorderSide(color: SaathiColors.clinicalTeal, width: 2),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      icon: const Icon(Icons.sync_problem, color: SaathiColors.clinicalTeal),
                      label: const Text(
                        'सिंक स्थिति\n(Sync Queue)',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: SaathiColors.clinicalTeal, fontWeight: FontWeight.bold),
                      ),
                      onPressed: () => Navigator.pushNamed(context, SaathiRoutes.settings),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
