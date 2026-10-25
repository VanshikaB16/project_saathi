import 'package:flutter/material.dart';
import '../../core/theme/saathi_theme.dart';
import '../../core/localization/app_translations.dart';
import '../../services/tts_service.dart';
import '../../app/routes.dart';

class ScreeningPathwayScreen extends StatelessWidget {
  const ScreeningPathwayScreen({super.key});

  void _showUrgentAlert(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: SaathiColors.warmOffWhite,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: SaathiColors.redAlert, size: 36),
            SizedBox(width: 12),
            Expanded(
              child: Text(
                'आपातकालीन चेतावनी (Emergency Alert)',
                style: TextStyle(color: SaathiColors.redAlert, fontWeight: FontWeight.bold, fontSize: 18),
              ),
            ),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'यदि मरीज़ को निम्नलिखित में से कोई भी गंभीर लक्षण है:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text('• गंभीर रूप से सांस फूलना या बेहोशी'),
            Text('• अनियंत्रित रक्तस्राव (भारी खून बहना)'),
            Text('• अचानक आंखों की रोशनी चले जाना'),
            Text('• सीने में तेज़ असहनीय दर्द'),
            SizedBox(height: 12),
            Text(
              'तो किसी भी ऐप या फ़ोटो का इंतज़ार न करें! तुरंत 108 एम्बुलेंस बुलाएं।',
              style: TextStyle(color: SaathiColors.redAlert, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(backgroundColor: SaathiColors.redAlert),
            icon: const Icon(Icons.phone_in_talk, color: Colors.white),
            label: const Text('108 एम्बुलेंस कॉल करें', style: TextStyle(color: Colors.white)),
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('108 Emergency Ambulance dialer opened.')),
              );
            },
          ),
          TextButton(
            child: const Text('लक्षण नहीं हैं (Continue Routine)'),
            onPressed: () => Navigator.pop(ctx),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('जाँच का तरीका चुनें (Select Pathway)'),
        backgroundColor: SaathiColors.primaryNavy,
        foregroundColor: SaathiColors.whiteSurface,
        actions: [
          IconButton(
            icon: const Icon(Icons.emergency_outlined, color: Colors.amberAccent),
            tooltip: 'Emergency Protocol',
            onPressed: () => _showUrgentAlert(context),
          ),
          IconButton(
            icon: const Icon(Icons.volume_up_rounded),
            onPressed: () {
              TtsService.instance.speak("कृपया जाँच का प्रकार चुनें: त्वचा के लक्षण, आंख और पर्दा, छाती की जाँच, या खून की रिपोर्ट।");
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Urgent Alert Trigger Banner
            InkWell(
              onTap: () => _showUrgentAlert(context),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFFDE8E8),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: SaathiColors.redAlert.withOpacity(0.4), width: 1.5),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.report_problem_rounded, color: SaathiColors.redAlert, size: 28),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'सांस लेने में भारी तकलीफ या बेहोशी है? आपातकालीन प्रोटोकॉल यहां देखें।',
                        style: TextStyle(color: SaathiColors.redAlert, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Step Indicator (Three-tap screening experience)
            const Text(
              'चरण 1/3: स्क्रीनिंग प्रकार चुनें',
              style: TextStyle(color: SaathiColors.secondaryText, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            // Pathway 1: Skin
            _buildPathwayCard(
              context,
              title: AppTranslations.text('pathway_skin'),
              subtitle: 'घाव, असामान्य चकत्ते, नीले निशान, या पीलापन की जाँच।',
              icon: Icons.flare_rounded,
              color: SaathiColors.clinicalTeal,
              onTap: () {
                TtsService.instance.speak("त्वचा जाँच चुनी गई है। कैमरे को प्राकृतिक रोशनी में रखें।");
                Navigator.pushNamed(context, SaathiRoutes.screeningSkin);
              },
            ),
            const SizedBox(height: 14),

            // Pathway 2: Retina / Eye
            _buildPathwayCard(
              context,
              title: AppTranslations.text('pathway_eye'),
              subtitle: 'मधुमेह वाले मरीज़ों में आंख के पर्दे की प्रारंभिक जाँच (फंडस लेंस आवश्यक)।',
              icon: Icons.remove_red_eye_rounded,
              color: SaathiColors.primaryNavy,
              onTap: () {
                Navigator.pushNamed(context, SaathiRoutes.screeningEye);
              },
            ),
            const SizedBox(height: 14),

            // Pathway 3: Chest / TB
            _buildPathwayCard(
              context,
              title: AppTranslations.text('pathway_chest'),
              subtitle: 'डिजिटल एक्स-रे या 2 सप्ताह से अधिक खांसी के लक्षण प्रोटोकॉल।',
              icon: Icons.medical_information_rounded,
              color: const Color(0xFF2C5E7A),
              onTap: () {
                Navigator.pushNamed(context, SaathiRoutes.screeningChest);
              },
            ),
            const SizedBox(height: 14),

            // Pathway 4: Blood / CBC Funnel
            _buildPathwayCard(
              context,
              title: AppTranslations.text('pathway_blood'),
              subtitle: 'सीबीसी रिपोर्ट रीडिंग, हीमोग्लोबिन/प्लेटलेट नियम और स्लाइड समीक्षा।',
              icon: Icons.water_drop_rounded,
              color: const Color(0xFF8B263E),
              onTap: () {
                Navigator.pushNamed(context, SaathiRoutes.screeningBlood);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPathwayCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: SaathiColors.border, width: 1.5),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(18.0),
          child: Row(
            children: [
              CircleAvatar(
                radius: 30,
                backgroundColor: color.withOpacity(0.12),
                child: Icon(icon, color: color, size: 32),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 19,
                        fontWeight: FontWeight.bold,
                        color: SaathiColors.primaryNavy,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      subtitle,
                      style: const TextStyle(fontSize: 14, color: SaathiColors.secondaryText),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios_rounded, color: SaathiColors.mutedText, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}
