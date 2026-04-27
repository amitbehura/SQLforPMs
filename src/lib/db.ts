import { PGlite } from '@electric-sql/pglite';
import { seedDatabase } from './seedData';

// Singleton instance
let dbInstance: PGlite | null = null;
let isInitializing = false;
let initPromise: Promise<PGlite> | null = null;

export async function getDb(): Promise<PGlite> {
  if (dbInstance) return dbInstance;
  
  if (isInitializing && initPromise) {
    return initPromise;
  }

  isInitializing = true;
  initPromise = (async () => {
    try {
      console.log('Initializing PGLite...');
      // We use an in-memory database by default.
      // If we wanted persistence we'd use: new PGlite('idb://sql-for-pms')
      const db = new PGlite(); 
      await db.waitReady;
      
      console.log('PGLite initialized. Seeding database...');
      await seedDatabase(db);
      console.log('Database seeding complete.');
      
      dbInstance = db;
      return db;
    } catch (error) {
      console.error('Failed to initialize database', error);
      throw error;
    } finally {
      isInitializing = false;
    }
  })();

  return initPromise;
}

export async function query(sql: string, params?: unknown[]) {
  const db = await getDb();
  return db.query(sql, params);
}
