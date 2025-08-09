require('ts-node/register/transpile-only');
const { writeFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');

async function loadGenerator() {
  // 动态使用 ESM import 以兼容 .ts ESM 模块
  const mod = await import('../src/lib/premiumReportGenerator.ts');
  return mod.reportGenerator;
}

function sanitize(name) {
  return name.replace(/[^\w\u4e00-\u9fa5-]/g, '_');
}

async function main() {
  const outDir = join(process.cwd(), 'apps/web/public/reports');
  const outDirBP = join(process.cwd(), 'apps/web/public/bp');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  if (!existsSync(outDirBP)) mkdirSync(outDirBP, { recursive: true });

  const reportGenerator = await loadGenerator();
  const projects = reportGenerator.getAvailableReports();
  const generated = [];

  projects.forEach((p) => {
    // 深度HTML报告
    const html = reportGenerator.generateHTMLReportDeep(p.id);
    const filename = `${sanitize(p.title)}.html`;
    const filePath = join(outDir, filename);
    writeFileSync(filePath, html, { encoding: 'utf-8' });
    generated.push(`/reports/${filename}`);

    // WebPPT BP
    const bp = reportGenerator.generateWebPPT(p.id);
    const bpName = `${sanitize(p.title)}.bp.html`;
    const bpPath = join(outDirBP, bpName);
    writeFileSync(bpPath, bp, { encoding: 'utf-8' });

    // Reveal WebPPT（专业投融资版本）
    const bpReveal = reportGenerator.generateWebPPTReveal(p.id);
    const bpRevealName = `${sanitize(p.title)}.reveal.html`;
    writeFileSync(join(outDirBP, bpRevealName), bpReveal, { encoding: 'utf-8' });
  });

  console.log('Generated HTML reports:');
  generated.forEach((p) => console.log(' -', p));
}

main();


