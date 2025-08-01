#!/usr/bin/env python3
"""
布局优化脚本 - 进一步减少间距确保内容完整显示
"""
import re
import os

def optimize_layout(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 进一步减少基础字体大小
    content = re.sub(r'font-size:\s*16px\s*!important', 'font-size: 14px !important', content)
    content = re.sub(r'font-size:\s*14px\s*!important', 'font-size: 12px !important', content)
    content = re.sub(r'font-size:\s*12px\s*!important', 'font-size: 10px !important', content)
    
    # 进一步减少标题字体
    content = re.sub(r'font-size:\s*1\.2em\s*!important', 'font-size: 1.0em !important', content)
    content = re.sub(r'font-size:\s*1\.0em\s*!important', 'font-size: 0.85em !important', content)
    content = re.sub(r'font-size:\s*0\.8em\s*!important', 'font-size: 0.7em !important', content)
    content = re.sub(r'font-size:\s*0\.6em\s*!important', 'font-size: 0.5em !important', content)
    content = re.sub(r'font-size:\s*0\.55em\s*!important', 'font-size: 0.45em !important', content)
    
    # 进一步减少padding
    content = re.sub(r'padding:\s*15px\s+20px\s+10px\s+20px\s*!important', 'padding: 8px 12px 6px 12px !important', content)
    content = re.sub(r'padding:\s*10px\s+15px\s+8px\s+15px\s*!important', 'padding: 6px 10px 5px 10px !important', content)
    content = re.sub(r'padding:\s*8px\s+12px\s+6px\s+12px\s*!important', 'padding: 4px 8px 3px 8px !important', content)
    
    # 减少section的最小高度
    content = re.sub(r'min-height:\s*100vh\s*!important', 'min-height: 95vh !important', content)
    
    # 减少line-height
    content = re.sub(r'line-height:\s*1\.2\s*!important', 'line-height: 1.1 !important', content)
    content = re.sub(r'line-height:\s*1\.3\s*!important', 'line-height: 1.15 !important', content)
    content = re.sub(r'line-height:\s*1\.1\s*!important', 'line-height: 1.05 !important', content)
    
    # 减少margin-bottom
    content = re.sub(r'margin-bottom:\s*0\.3em\s*!important', 'margin-bottom: 0.2em !important', content)
    content = re.sub(r'margin-bottom:\s*0\.2em\s*!important', 'margin-bottom: 0.15em !important', content)
    content = re.sub(r'margin-bottom:\s*0\.15em\s*!important', 'margin-bottom: 0.1em !important', content)
    
    # 减少卡片padding
    content = re.sub(r'padding:\s*60px\s+50px', 'padding: 20px 15px', content)
    content = re.sub(r'padding:\s*40px\s+30px', 'padding: 15px 10px', content)
    content = re.sub(r'padding:\s*30px\s+20px', 'padding: 10px 8px', content)
    
    # 减少grid gap
    content = re.sub(r'gap:\s*40px', 'gap: 15px', content)
    content = re.sub(r'gap:\s*30px', 'gap: 12px', content)
    content = re.sub(r'gap:\s*20px', 'gap: 8px', content)
    
    # 减少margin
    content = re.sub(r'margin:\s*50px\s+0', 'margin: 15px 0', content)
    content = re.sub(r'margin:\s*40px\s+0', 'margin: 12px 0', content)
    content = re.sub(r'margin:\s*30px\s+0', 'margin: 8px 0', content)
    content = re.sub(r'margin:\s*20px\s+0', 'margin: 5px 0', content)
    
    # 减少特定元素的字体大小
    content = re.sub(r'\.metric-number\s*{[^}]*font-size:\s*1\.0em[^}]*}', '.metric-number { font-size: 0.8em !important; }', content)
    content = re.sub(r'\.metric-label\s*{[^}]*font-size:\s*0\.6em[^}]*}', '.metric-label { font-size: 0.4em !important; }', content)
    content = re.sub(r'\.impact-number\s*{[^}]*font-size:\s*1\.8em[^}]*}', '.impact-number { font-size: 1.4em !important; }', content)
    content = re.sub(r'\.highlight-text\s*{[^}]*font-size:\s*1\.2em[^}]*}', '.highlight-text { font-size: 1.0em !important; }', content)
    
    # 减少letter-spacing
    content = re.sub(r'letter-spacing:\s*-0\.02em\s*!important', 'letter-spacing: -0.01em !important', content)
    content = re.sub(r'letter-spacing:\s*-0\.01em\s*!important', 'letter-spacing: 0em !important', content)
    content = re.sub(r'letter-spacing:\s*0\.05em\s*!important', 'letter-spacing: 0.02em !important', content)
    
    # 确保所有section都有overflow hidden
    content = re.sub(r'overflow:\s*hidden\s*!important;', 'overflow: hidden !important;\n        max-height: 100vh !important;', content)
    
    # 减少border-radius
    content = re.sub(r'border-radius:\s*24px', 'border-radius: 12px', content)
    content = re.sub(r'border-radius:\s*20px', 'border-radius: 10px', content)
    content = re.sub(r'border-radius:\s*16px', 'border-radius: 8px', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ 已优化 {file_path} 的布局")

def main():
    files_to_optimize = [
        'presentation-world-class-final.html',
        'presentation-world-class-optimized.html',
        'presentation-optimized-final.html'
    ]
    
    for file_path in files_to_optimize:
        if os.path.exists(file_path):
            optimize_layout(file_path)
        else:
            print(f"❌ 文件不存在: {file_path}")
    
    print("\n🎉 布局优化完成！")
    print("📝 主要优化:")
    print("   - 基础字体进一步缩小")
    print("   - 所有间距大幅减少")
    print("   - 卡片padding最小化")
    print("   - grid gap减少")
    print("   - line-height进一步压缩")
    print("   - 确保max-height限制")

if __name__ == "__main__":
    main() 