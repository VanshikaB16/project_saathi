import 'dart:convert';
import 'package:http/http.dart' as http;
import '../core/database/database_helper.dart';
import '../core/database/schema.dart';

enum SyncConnectionState {
  offline,
  syncPending,
  syncing,
  synced,
  syncFailed
}

class SyncService {
  static final SyncService instance = SyncService._init();
  SyncConnectionState _currentState = SyncConnectionState.offline;

  SyncService._init();

  SyncConnectionState get currentState => _currentState;

  Future<bool> synchronizePendingRecords(String backendUrl) async {
    _currentState = SyncConnectionState.syncing;

    try {
      final db = await DatabaseHelper.instance.database;
      final pendingQueue = await db.query(
        LocalSchema.tableSyncQueue,
        where: 'status = ?',
        whereArgs: ['PENDING'],
      );

      if (pendingQueue.isEmpty) {
        _currentState = SyncConnectionState.synced;
        return true;
      }

      final payload = {
        'deviceId': 'mobile-asha-device-01',
        'workerId': 'wp-demo-1',
        'syncTimestamp': DateTime.now().toIso8601String(),
        'schemaVersion': '1.0.0',
        'patients': await DatabaseHelper.instance.queryAll(LocalSchema.tablePatients),
        'consents': await DatabaseHelper.instance.queryAll(LocalSchema.tableConsent),
        'screeningResults': await DatabaseHelper.instance.queryAll(LocalSchema.tableScreenings),
        'referrals': await DatabaseHelper.instance.queryAll(LocalSchema.tableReferrals),
      };

      final response = await http.post(
        Uri.parse('$backendUrl/api/sync/batch'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(payload),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        // Mark sync queue as resolved
        await db.update(
          LocalSchema.tableSyncQueue,
          {'status': 'RESOLVED'},
          where: 'status = ?',
          whereArgs: ['PENDING'],
        );
        _currentState = SyncConnectionState.synced;
        return true;
      } else {
        _currentState = SyncConnectionState.syncFailed;
        return false;
      }
    } catch (e) {
      // Stay safely in offline/sync-pending state
      _currentState = SyncConnectionState.syncPending;
      return false;
    }
  }
}
