import 'package:flutter/material.dart';
import '../../core/theme/saathi_theme.dart';
import '../../core/localization/app_translations.dart';
import '../../services/tts_service.dart';
import 'quality_checker.dart';
import '../../app/routes.dart';

class SkinScreeningScreen extends StatefulWidget {
  const SkinScreeningScreen({super.key});

  @override
  State<SkinScreeningScreen> createState() => _SkinScreeningScreenState();
}

class _SkinScreeningScreenState extends State<SkinScreeningScreen> {
  bool _imageCaptured = false;
  bool _isAnalyzing = false;
  EdgeQualityCheck? _qualityCheck;
  String _selectedSignType = 'UNUSUAL_LESION';

  void _simulateCapture() {
    setState(() {
      _isAnalyzing = true;
    });

    // Simulate 300ms on-device quality check
    Future.delayed(const Duration(milliseconds: 400), () {
      setState(() {
        _imageCaptured = true;
        _isAnalyzing = false;
        _qualityCheck = EdgeQualityCheck.evaluateImage(
          blurVariance: 165.0,
          luminance: 125.0,
          hardwareMatched: true,
        );
      });
      TtsService.instance.speak("फोटो सही आई है। अब ऑन-डिवाइस विश्लेषण किया जा रहा है।");
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('त्वचा लक्षण जाँच (Skin Screening)'),
        backgroundColor: SaathiColors.primaryNavy,
        foregroundColor: SaathiColors.whiteSurface,
        actions: [
          IconButton(
            icon: const Icon(Icons.volume_up_rounded),
            onPressed: () {
              TtsService.instance.speak("मरीज़ को पर्याप्त प्राकृतिक रोशनी में बैठाएं। कैमरे को स्थिर पकड़कर फोटो खींचें।");
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'चरण 2/3: त्वचा लक्षण का चयन एवं फ़ोटो',
              style: TextStyle(color: SaathiColors.secondaryText, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            // Sign Category Dropdown
            DropdownButtonFormField<String>(
              value: _selectedSignType,
              decoration: InputDecoration(
                labelText: 'लक्षण का प्रकार (Observed Sign)',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
              items: const [
                DropdownMenuItem(value: 'UNUSUAL_LESION', child: Text('असामान्य घाव या बढ़ता तिल (Unusual Lesion)')),
                DropdownMenuItem(value: 'UNEXPLAINED_BRUISING', child: Text('बिना चोट के नीले निशान (Unexplained Bruising)')),
                DropdownMenuItem(value: 'PETECHIAE', child: Text('बारीक लाल-बैंगनी दाने (Pinpoint Spots)')),
                DropdownMenuItem(value: 'SEVERE_PALLOR', child: Text('गंभीर पीलापन (Severe Pallor)')),
              ],
              onChanged: (val) => setState(() => _selectedSignType = val ?? 'UNUSUAL_LESION'),
            ),
            const SizedBox(height: 20),

            // Camera Viewport Simulation / Frame
            Container(
              height: 280,
              decoration: BoxDecoration(
                color: Colors.black87,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: _imageCaptured ? SaathiColors.clinicalTeal : SaathiColors.border,
                  width: 3,
                ),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  if (!_imageCaptured && !_isAnalyzing) ...[
                    Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.camera_enhance_rounded, color: Colors.white70, size: 64),
                        const SizedBox(height: 12),
                        const Text(
                          'कैमरे को त्वचा से 15 सेमी की दूरी पर रखें',
                          style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Move to natural daylight • Hold steady',
                          style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 13),
                        ),
                      ],
                    ),
                  ] else if (_isAnalyzing) ...[
                    const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(color: SaathiColors.softMint),
                        SizedBox(height: 16),
                        Text(
                          'गुणवत्ता एवं ऑन-डिवाइस मॉडल विश्लेषण...',
                          style: TextStyle(color: Colors.white, fontSize: 16),
                        ),
                      ],
                    ),
                  ] else ...[
                    // Captured image feedback preview
                    Container(
                      width: double.infinity,
                      height: double.infinity,
                      color: const Color(0xFF2B3A42),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.check_circle_outline, color: SaathiColors.softMint, size: 64),
                          const SizedBox(height: 12),
                          const Text(
                            'फ़ोटो सफलतापूर्वक सत्यापित हुई',
                            style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            _qualityCheck?.instructionHi ?? 'गुणवत्ता सही है।',
                            style: const TextStyle(color: SaathiColors.softMint, fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 24),

            if (!_imageCaptured) ...[
              ElevatedButton.icon(
                icon: const Icon(Icons.camera_alt, size: 28),
                label: const Text('फ़ोटो खींचें (Capture Image)'),
                onPressed: _isAnalyzing ? null : _simulateCapture,
              ),
            ] else ...[
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(backgroundColor: SaathiColors.clinicalTeal),
                icon: const Icon(Icons.arrow_forward_rounded, size: 28),
                label: const Text('जाँच परिणाम देखें (Review Result)'),
                onPressed: () {
                  Navigator.pushNamed(
                    context,
                    SaathiRoutes.screeningResult,
                    arguments: {
                      'pathway': 'SKIN',
                      'signType': _selectedSignType,
                      'simulatedFlag': 'AMBER', // Demonstrating safety triage
                    },
                  );
                },
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () {
                  setState(() {
                    _imageCaptured = false;
                    _qualityCheck = null;
                  });
                },
                child: const Text('दोबारा फ़ोटो लें (Retake Image)'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
