import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'schema.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('saathi_edge.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future<void> _createDB(Database db, int version) async {
    await db.execute(LocalSchema.createTablePatients);
    await db.execute(LocalSchema.createTableConsent);
    await db.execute(LocalSchema.createTableScreenings);
    await db.execute(LocalSchema.createTableReferrals);
    await db.execute(LocalSchema.createTableSyncQueue);
  }

  // Idempotent upsert helper
  Future<int> insertOrUpdate(String table, Map<String, dynamic> data) async {
    final db = await instance.database;
    return await db.insert(
      table,
      data,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<Map<String, dynamic>>> queryAll(String table) async {
    final db = await instance.database;
    return await db.query(table, orderBy: 'created_at DESC');
  }

  Future<void> close() async {
    final db = await instance.database;
    db.close();
  }
}
