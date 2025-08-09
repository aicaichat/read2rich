import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { reportGenerator } from '../lib/premiumReportGenerator';

function sanitize(name: string): string {
  return name.replace(/[^\w\u4e00-\u9fa5-]/g, '_');
}

function main() {
  const outDir = join(process.cwd(), 'apps/web/public/reports');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const projects = reportGenerator.getAvailableReports();
  const generated: string[] = [];

  projects.forEach((p) => {
    const html = reportGenerator.generateHTMLReport(p.id);
    const filename = `${sanitize(p.title)}.html`;
    const filePath = join(outDir, filename);
    writeFileSync(filePath, html, { encoding: 'utf-8' });
    generated.push(`/reports/${filename}`);
  });

  console.log('Generated HTML reports:');
  generated.forEach((p) => console.log(' -', p));
}

main();


