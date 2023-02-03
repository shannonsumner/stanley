import { rmSync } from 'fs';
import path from 'path';

const coverageDirectory = path.join(process.cwd(), 'coverage');
const distributionDirectory = path.join(process.cwd(), 'dist');
const targetDirectory = path.join(process.cwd(), 'target');

try {
  rmSync(coverageDirectory, { recursive: true, force: true });
  rmSync(distributionDirectory, { recursive: true, force: true });
  rmSync(targetDirectory, { recursive: true, force: true });
} catch (err) {
  console.error('Error occurred while deleting the directory.', err);
}
