import { PGlite } from '@electric-sql/pglite';
import { seedDatabase } from './src/lib/seedData.js';
import { pmCurriculum, analystCurriculum, stakeholderCurriculum } from './src/data/assignments.js';

async function runQA() {
  console.log("Initializing DB...");
  const db = new PGlite();
  await seedDatabase(db);
  console.log("DB Seeded. Running tests across all curricula...\n");

  let passed = 0;
  let failed = 0;

  const testCurriculum = async (curriculum, name) => {
    console.log(`\nTesting ${name} Curriculum (${curriculum.length} levels)...`);
    for (const assignment of curriculum) {
      for (const test of assignment.tests) {
        try {
          const res = await db.query(test.solutionQuery);
          if (res.rows.length === 0) {
            console.log(`❌ Level ${assignment.level} Test ${test.id} FAILED: Returned 0 rows!`);
            console.log(`   Query: ${test.solutionQuery}`);
            failed++;
          } else {
            passed++;
          }
        } catch (err) {
          console.log(`💥 Level ${assignment.level} Test ${test.id} CRASHED: ${err.message}`);
          console.log(`   Query: ${test.solutionQuery}`);
          failed++;
        }
      }
    }
  };

  await testCurriculum(pmCurriculum, "PM");
  await testCurriculum(analystCurriculum, "Analyst");
  await testCurriculum(stakeholderCurriculum, "Stakeholder");

  console.log(`\nQA Complete. Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

runQA().catch(console.error);
