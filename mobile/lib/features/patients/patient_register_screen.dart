import 'package:flutter/material.dart';
import '../../core/theme/saathi_theme.dart';
import '../../core/localization/app_translations.dart';
import '../../services/tts_service.dart';
import '../../core/database/database_helper.dart';
import '../../core/database/schema.dart';
import 'patient_model.dart';
import '../../app/routes.dart';

class PatientRegisterScreen extends StatefulWidget {
  const PatientRegisterScreen({super.key});

  @override
  State<PatientRegisterScreen> createState() => _PatientRegisterScreenState();
}

class _PatientRegisterScreenState extends State<PatientRegisterScreen> {
  final _villageController = TextEditingController(text: 'रामपूर (Rampur)');
  final _ageController = TextEditingController();
  final _emergencyPhoneController = TextEditingController();
  String _selectedGender = 'FEMALE';
  bool _photoCaptured = false;
  bool _audioNameRecorded = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppTranslations.text('register_patient')),
        backgroundColor: SaathiColors.primaryNavy,
        foregroundColor: SaathiColors.whiteSurface,
        actions: [
          IconButton(
            icon: const Icon(Icons.volume_up_rounded),
            onPressed: () {
              TtsService.instance.speak("मरीज़ का पंजीकरण करने के लिए गाँव का नाम, उम्र और लिंग चुनें। फोटो लेना अनिवार्य नहीं है।");
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Safe Non-Biometric Notice
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: SaathiColors.paleMintBg,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text(
                'गोपनीयता सुरक्षा: फ़ोटो या आवाज़ रिकॉर्डिंग इलाज के लिए अनिवार्य नहीं है। एक सुरक्षित मरीज़ कोड अपने आप जारी किया जाएगा।',
                style: TextStyle(fontSize: 14, color: SaathiColors.primaryNavy),
              ),
            ),
            const SizedBox(height: 20),

            // Village
            TextField(
              controller: _villageController,
              decoration: InputDecoration(
                labelText: 'गाँव का नाम (Village Name)',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                prefixIcon: const Icon(Icons.location_on, color: SaathiColors.clinicalTeal),
              ),
            ),
            const SizedBox(height: 16),

            // Age & Gender
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _ageController,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: 'उम्र (Age in Years)',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      prefixIcon: const Icon(Icons.cake, color: SaathiColors.clinicalTeal),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _selectedGender,
                    decoration: InputDecoration(
                      labelText: 'लिंग (Gender)',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'FEMALE', child: Text('महिला (Female)')),
                      DropdownMenuItem(value: 'MALE', child: Text('पुरुष (Male)')),
                      DropdownMenuItem(value: 'OTHER', child: Text('अन्य (Other)')),
                    ],
                    onChanged: (val) => setState(() => _selectedGender = val ?? 'FEMALE'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Emergency Contact Phone
            TextField(
              controller: _emergencyPhoneController,
              keyboardType: TextInputType.phone,
              decoration: InputDecoration(
                labelText: 'पारिवारिक संपर्क फ़ोन (Family Contact Phone)',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                prefixIcon: const Icon(Icons.phone, color: SaathiColors.clinicalTeal),
              ),
            ),
            const SizedBox(height: 20),

            // Optional Non-Mandatory Inputs
            Text('वैकल्पिक पहचान सहायता (Optional Identifiers)', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 8),

            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      side: BorderSide(
                        color: _photoCaptured ? SaathiColors.successGreen : SaathiColors.border,
                        width: 2,
                      ),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    icon: Icon(
                      _photoCaptured ? Icons.check_circle : Icons.camera_alt,
                      color: _photoCaptured ? SaathiColors.successGreen : SaathiColors.secondaryText,
                    ),
                    label: Text(_photoCaptured ? 'फ़ोटो ली गई' : 'वैकल्पिक फ़ोटो'),
                    onPressed: () {
                      setState(() => _photoCaptured = !_photoCaptured);
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      side: BorderSide(
                        color: _audioNameRecorded ? SaathiColors.successGreen : SaathiColors.border,
                        width: 2,
                      ),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    icon: Icon(
                      _audioNameRecorded ? Icons.check_circle : Icons.mic,
                      color: _audioNameRecorded ? SaathiColors.successGreen : SaathiColors.secondaryText,
                    ),
                    label: Text(_audioNameRecorded ? 'आवाज़ दर्ज' : 'वैकल्पिक नाम'),
                    onPressed: () {
                      setState(() => _audioNameRecorded = !_audioNameRecorded);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),

            // Submit Button
            ElevatedButton(
              onPressed: () async {
                final age = int.tryParse(_ageController.text) ?? 45;
                final seq = DateTime.now().millisecondsSinceEpoch % 10000;
                final safeId = 'SAA-RAM-2026-$seq';

                final patient = Patient(
                  id: 'pat-${DateTime.now().millisecondsSinceEpoch}',
                  safeIdentifier: safeId,
                  villageName: _villageController.text.trim(),
                  ageYears: age,
                  gender: _selectedGender,
                  emergencyContact: _emergencyPhoneController.text.trim(),
                  authorizedFamily: _emergencyPhoneController.text.trim(),
                  photoUri: _photoCaptured ? 'file:///simulated/patient_photo.jpg' : null,
                  createdAt: DateTime.now().toIso8601String(),
                  updatedAt: DateTime.now().toIso8601String(),
                );

                await DatabaseHelper.instance.insertOrUpdate(
                  LocalSchema.tablePatients,
                  patient.toMap(),
                );

                TtsService.instance.speak("मरीज़ सफलतापूर्वक पंजीकृत हुआ। कोड संख्या $safeId है। अब सहमति पत्र खोल रहे हैं।");

                if (mounted) {
                  Navigator.pushReplacementNamed(context, SaathiRoutes.consentSettings);
                }
              },
              child: const Text('सहमति एवं आगे बढ़ें (Next: Consent)'),
            ),
          ],
        ),
      ),
    );
  }
}
