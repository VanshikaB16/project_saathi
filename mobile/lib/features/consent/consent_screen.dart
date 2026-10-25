import 'package:flutter/material.dart';
import '../../core/theme/saathi_theme.dart';
import '../../core/localization/app_translations.dart';
import '../../services/tts_service.dart';
import '../../core/database/database_helper.dart';
import '../../core/database/schema.dart';
import 'consent_model.dart';
import '../../app/routes.dart';

class ConsentScreen extends StatefulWidget {
  const ConsentScreen({super.key});

  @override
  State<ConsentScreen> createState() => _ConsentScreenState();
}

class _ConsentScreenState extends State<ConsentScreen> {
  bool _screeningConsented = true;
  bool _referralConsented = true;
  bool _familyNotificationConsented = true;
  bool _photoStorageConsented = false;
  bool _researchConsented = false; // Deliberately default false!

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('मरीज़ की सहमति (Informed Consent)'),
        backgroundColor: SaathiColors.primaryNavy,
        foregroundColor: SaathiColors.whiteSurface,
        actions: [
          IconButton(
            icon: const Icon(Icons.volume_up_rounded),
            onPressed: () {
              TtsService.instance.speak(
                "सहमति विकल्प: पहला, स्वास्थ्य जाँच के लिए। दूसरा, आवश्यकता पड़ने पर अस्पताल रेफरल के लिए। "
                "तीसरा, परिवार को संदेश भेजने के लिए। चौथा, शोध कार्य के लिए, जिसे चुनना आपकी मर्जी पर निर्भर है।"
              );
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: SaathiColors.paleMintBg,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: SaathiColors.clinicalTeal.withOpacity(0.4)),
              ),
              child: const Text(
                'महत्वपूर्ण: सहमति न देने पर भी मरीज़ को आपातकालीन सेवा या सामान्य डॉक्टर से मिलने से रोका नहीं जा सकता। शोध की सहमति कभी भी अनिवार्य नहीं की जा सकती।',
                style: TextStyle(fontSize: 14, color: SaathiColors.primaryNavy, height: 1.4),
              ),
            ),
            const SizedBox(height: 20),

            SwitchListTile(
              activeColor: SaathiColors.clinicalTeal,
              title: const Text('1. प्राथमिक स्वास्थ्य जाँच की अनुमति (Screening)', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('आशा कार्यकर्ता द्वारा त्वचा, आंख या लक्षण जाँच करने की सहमति।'),
              value: _screeningConsented,
              onChanged: (val) => setState(() => _screeningConsented = val),
            ),
            const Divider(),

            SwitchListTile(
              activeColor: SaathiColors.clinicalTeal,
              title: const Text('2. अस्पताल रेफरल समन्वय (Referral Coordination)', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('जाँच में संदेह होने पर पीएचसी या सीएचसी डॉक्टर के साथ रिपोर्ट साझा करने की सहमति।'),
              value: _referralConsented,
              onChanged: (val) => setState(() => _referralConsented = val),
            ),
            const Divider(),

            SwitchListTile(
              activeColor: SaathiColors.clinicalTeal,
              title: const Text('3. परिवार को सूचना संदेश (Family Notifications)', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('अस्पताल की तारीख का सामान्य संदेश फ़ोन पर भेजने की सहमति (संदेश में बीमारी का नाम नहीं होगा)।'),
              value: _familyNotificationConsented,
              onChanged: (val) => setState(() => _familyNotificationConsented = val),
            ),
            const Divider(),

            SwitchListTile(
              activeColor: SaathiColors.clinicalTeal,
              title: const Text('4. फ़ोटो संग्रह (Optional Photograph Storage)', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('डॉक्टर द्वारा दोबारा मिलान हेतु त्वचा या रिपोर्ट की फ़ोटो सुरक्षित रखने की सहमति।'),
              value: _photoStorageConsented,
              onChanged: (val) => setState(() => _photoStorageConsented = val),
            ),
            const Divider(),

            SwitchListTile(
              activeColor: SaathiColors.clinicalTeal,
              title: const Text('5. गैर-अनिवार्य शोध उपयोग (Optional Research Use)', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('अनाम डेटा का स्वास्थ्य अनुसंधान एवं प्रणाली सुधार के लिए उपयोग। (इलाज के लिए अनिवार्य नहीं)'),
              value: _researchConsented,
              onChanged: (val) => setState(() => _researchConsented = val),
            ),
            const SizedBox(height: 32),

            ElevatedButton(
              onPressed: () async {
                final consent = Consent(
                  id: 'con-${DateTime.now().millisecondsSinceEpoch}',
                  patientId: 'pat-active',
                  workerId: 'wp-demo-1',
                  screeningConsented: _screeningConsented,
                  referralConsented: _referralConsented,
                  familyNotificationConsented: _familyNotificationConsented,
                  photoConsented: _photoStorageConsented,
                  researchConsented: _researchConsented,
                  timestamp: DateTime.now().toIso8601String(),
                );

                await DatabaseHelper.instance.insertOrUpdate(
                  LocalSchema.tableConsent,
                  consent.toMap(),
                );

                TtsService.instance.speak("सहमति दर्ज हो गई है। कृपया जाँच का तरीका चुनें।");

                if (mounted) {
                  Navigator.pushReplacementNamed(context, SaathiRoutes.screeningSelect);
                }
              },
              child: const Text('सहमति सहेजें और जाँच चुनें (Select Pathway)'),
            ),
          ],
        ),
      ),
    );
  }
}
