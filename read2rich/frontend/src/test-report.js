// 临时测试文件
import { reportGenerator } from './lib/premiumReportGenerator.js';

console.log('测试报告生成器...');
console.log('获取报告 ID 5:', reportGenerator.getReport('5'));
console.log('获取报告 ID 1:', reportGenerator.getReport('1'));
console.log('获取报告 ID 4:', reportGenerator.getReport('4'));
