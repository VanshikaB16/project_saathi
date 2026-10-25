import 'package:flutter/material.dart';
import '../core/theme/saathi_theme.dart';
import 'routes.dart';
import '../features/welcome/welcome_screen.dart';
import '../features/home/worker_home_screen.dart';
import '../features/patients/patient_register_screen.dart';
import '../features/consent/consent_screen.dart';
import '../features/screening/screening_pathway_screen.dart';
import '../features/screening/skin_screening_screen.dart';
import '../features/screening/eye_screening_screen.dart';
import '../features/screening/chest_screening_screen.dart';
import '../features/screening/blood_screening_screen.dart';
import '../features/screening/screening_result_screen.dart';
import '../features/referrals/referrals_list_screen.dart';
import '../features/timeline/patient_timeline_screen.dart';
import '../features/followups/followups_screen.dart';
import '../features/settings/settings_screen.dart';

class SaathiApp extends StatelessWidget {
  const SaathiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Project Saathi',
      debugShowCheckedModeBanner: false,
      theme: SaathiTheme.lightTheme,
      initialRoute: SaathiRoutes.welcome,
      routes: {
        SaathiRoutes.welcome: (context) => const WelcomeScreen(),
        SaathiRoutes.workerHome: (context) => const WorkerHomeScreen(),
        SaathiRoutes.patientRegister: (context) => const PatientRegisterScreen(),
        SaathiRoutes.consentSettings: (context) => const ConsentScreen(),
        SaathiRoutes.screeningSelect: (context) => const ScreeningPathwayScreen(),
        SaathiRoutes.screeningSkin: (context) => const SkinScreeningScreen(),
        SaathiRoutes.screeningEye: (context) => const EyeScreeningScreen(),
        SaathiRoutes.screeningChest: (context) => const ChestScreeningScreen(),
        SaathiRoutes.screeningBlood: (context) => const BloodScreeningScreen(),
        SaathiRoutes.screeningResult: (context) => const ScreeningResultScreen(),
        SaathiRoutes.referralsList: (context) => const ReferralsListScreen(),
        SaathiRoutes.timeline: (context) => const PatientTimelineScreen(),
        SaathiRoutes.followups: (context) => const FollowupsScreen(),
        SaathiRoutes.settings: (context) => const SettingsScreen(),
      },
    );
  }
}
