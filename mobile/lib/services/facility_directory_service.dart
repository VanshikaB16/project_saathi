class HealthFacility {
  final String id;
  final String name;
  final String type; // PHC, CHC, District Hospital
  final String district;
  final String address;
  final String phone;
  final List<String> services;
  final bool hasApiBooking;
  final String lastVerifiedDate;

  HealthFacility({
    required this.id,
    required this.name,
    required this.type,
    required this.district,
    required this.address,
    required this.phone,
    required this.services,
    required this.hasApiBooking,
    required this.lastVerifiedDate,
  });
}

class FacilityDirectoryService {
  static final List<HealthFacility> authorizedFacilities = [
    HealthFacility(
      id: 'fac-phc-01',
      name: 'Rampur Primary Health Centre (PHC)',
      type: 'PHC',
      district: 'Patiala',
      address: 'Near Gram Panchayat Office, Main Road, Rampur',
      phone: '+91-175-223401',
      services: ['General Outpatient', 'Maternal Health', 'Basic Anemia Testing', 'Sputum Collection'],
      hasApiBooking: false,
      lastVerifiedDate: '2026-09-15',
    ),
    HealthFacility(
      id: 'fac-chc-01',
      name: 'Nabha Community Health Centre (CHC)',
      type: 'CHC',
      district: 'Patiala',
      address: 'Civil Hospital Road, Nabha, Punjab 147201',
      phone: '+91-176-522108',
      services: ['Automated CBC Hematology', 'Chest X-Ray Digital', 'Ophthalmology Outreach', 'Emergency 24x7'],
      hasApiBooking: true,
      lastVerifiedDate: '2026-10-01',
    ),
    HealthFacility(
      id: 'fac-dh-01',
      name: 'Mata Kaushalya District Hospital',
      type: 'District Hospital',
      district: 'Patiala',
      address: 'Lehal Colony, Patiala, Punjab 147001',
      phone: '+91-175-221200',
      services: ['Specialist Dermatology', 'Retinal Fundus Examination', 'NTEP TB Center', 'Hematology Oncology Referral'],
      hasApiBooking: true,
      lastVerifiedDate: '2026-10-10',
    ),
  ];

  static List<HealthFacility> getFacilitiesForPathway(String pathway) {
    if (pathway == 'RETINA') {
      return authorizedFacilities.where((f) => f.type != 'PHC').toList();
    }
    if (pathway == 'CHEST') {
      return authorizedFacilities.where((f) => f.services.any((s) => s.contains('X-Ray') || s.contains('TB'))).toList();
    }
    return authorizedFacilities;
  }
}
