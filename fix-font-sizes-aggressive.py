#!/usr/bin/env python3
"""
更激进的字体大小调整脚本 - 确保所有内容都能完整显示
"""
import re
import os

def adjust_font_sizes_aggressive(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    def adjust_inline_font(match):
        style = match.group(1)
        
        # 更激进的字体大小调整
        style = re.sub(r'font-size:\s*4\.5em', 'font-size: 2.5em', style)
        style = re.sub(r'font-size:\s*4em', 'font-size: 2.2em', style)
        style = re.sub(r'font-size:\s*3\.5em', 'font-size: 2.0em', style)
        style = re.sub(r'font-size:\s*3em', 'font-size: 1.8em', style)
        style = re.sub(r'font-size:\s*2\.5em', 'font-size: 1.5em', style)
        style = re.sub(r'font-size:\s*2\.2em', 'font-size: 1.3em', style)
        style = re.sub(r'font-size:\s*2em', 'font-size: 1.2em', style)
        style = re.sub(r'font-size:\s*1\.8em', 'font-size: 1.1em', style)
        style = re.sub(r'font-size:\s*1\.5em', 'font-size: 1.0em', style)
        style = re.sub(r'font-size:\s*1\.3em', 'font-size: 0.9em', style)
        style = re.sub(r'font-size:\s*1\.2em', 'font-size: 0.85em', style)
        style = re.sub(r'font-size:\s*1\.1em', 'font-size: 0.8em', style)
        style = re.sub(r'font-size:\s*1\.0em', 'font-size: 0.75em', style)
        style = re.sub(r'font-size:\s*0\.95em', 'font-size: 0.7em', style)
        style = re.sub(r'font-size:\s*0\.9em', 'font-size: 0.65em', style)
        style = re.sub(r'font-size:\s*0\.85em', 'font-size: 0.6em', style)
        style = re.sub(r'font-size:\s*0\.8em', 'font-size: 0.55em', style)
        style = re.sub(r'font-size:\s*0\.75em', 'font-size: 0.5em', style)
        style = re.sub(r'font-size:\s*0\.7em', 'font-size: 0.45em', style)
        style = re.sub(r'font-size:\s*0\.65em', 'font-size: 0.4em', style)
        style = re.sub(r'font-size:\s*0\.6em', 'font-size: 0.35em', style)
        style = re.sub(r'font-size:\s*0\.55em', 'font-size: 0.3em', style)
        style = re.sub(r'font-size:\s*0\.5em', 'font-size: 0.25em', style)
        
        # 调整padding
        style = re.sub(r'padding:\s*80px\s+100px\s+60px\s+100px', 'padding: 20px 30px 15px 30px', style)
        style = re.sub(r'padding:\s*60px\s+60px\s+40px\s+60px', 'padding: 15px 20px 10px 20px', style)
        style = re.sub(r'padding:\s*50px\s+40px\s+30px\s+40px', 'padding: 12px 15px 8px 15px', style)
        style = re.sub(r'padding:\s*40px\s+30px\s+20px\s+30px', 'padding: 10px 12px 6px 12px', style)
        style = re.sub(r'padding:\s*30px\s+20px\s+15px\s+20px', 'padding: 8px 10px 5px 10px', style)
        
        # 调整margin
        style = re.sub(r'margin:\s*40px\s+0', 'margin: 15px 0', style)
        style = re.sub(r'margin:\s*30px\s+0', 'margin: 12px 0', style)
        style = re.sub(r'margin:\s*20px\s+0', 'margin: 8px 0', style)
        style = re.sub(r'margin-bottom:\s*0\.8em', 'margin-bottom: 0.4em', style)
        style = re.sub(r'margin-bottom:\s*0\.6em', 'margin-bottom: 0.3em', style)
        
        return f'style="{style}"'
    
    # 调整内联样式
    content = re.sub(r'style="([^"]*)"', adjust_inline_font, content)
    
    # 调整CSS块中的字体大小
    content = re.sub(r'font-size:\s*24px\s*!important', 'font-size: 16px !important', content)
    content = re.sub(r'font-size:\s*20px\s*!important', 'font-size: 14px !important', content)
    content = re.sub(r'font-size:\s*18px\s*!important', 'font-size: 12px !important', content)
    content = re.sub(r'font-size:\s*16px\s*!important', 'font-size: 11px !important', content)
    
    # 调整标题字体大小
    content = re.sub(r'font-size:\s*1\.9em\s*!important', 'font-size: 1.2em !important', content)
    content = re.sub(r'font-size:\s*1\.5em\s*!important', 'font-size: 1.0em !important', content)
    content = re.sub(r'font-size:\s*1\.0em\s*!important', 'font-size: 0.8em !important', content)
    content = re.sub(r'font-size:\s*0\.8em\s*!important', 'font-size: 0.6em !important', content)
    content = re.sub(r'font-size:\s*0\.75em\s*!important', 'font-size: 0.55em !important', content)
    
    # 调整padding
    content = re.sub(r'padding:\s*40px\s+60px\s+30px\s+60px\s*!important', 'padding: 15px 20px 10px 20px !important', content)
    content = re.sub(r'padding:\s*30px\s+40px\s+20px\s+40px\s*!important', 'padding: 10px 15px 8px 15px !important', content)
    content = re.sub(r'padding:\s*20px\s+30px\s+15px\s+30px\s*!important', 'padding: 8px 12px 6px 12px !important', content)
    
    # 调整line-height
    content = re.sub(r'line-height:\s*1\.4\s*!important', 'line-height: 1.2 !important', content)
    content = re.sub(r'line-height:\s*1\.5\s*!important', 'line-height: 1.3 !important', content)
    content = re.sub(r'line-height:\s*1\.3\s*!important', 'line-height: 1.1 !important', content)
    
    # 调整margin-bottom
    content = re.sub(r'margin-bottom:\s*0\.8em\s*!important', 'margin-bottom: 0.3em !important', content)
    content = re.sub(r'margin-bottom:\s*0\.6em\s*!important', 'margin-bottom: 0.2em !important', content)
    content = re.sub(r'margin-bottom:\s*0\.4em\s*!important', 'margin-bottom: 0.15em !important', content)
    
    # 调整特定类名的字体大小
    content = re.sub(r'\.metric-number\s*{[^}]*font-size:\s*1\.5em[^}]*}', '.metric-number { font-size: 1.0em !important; }', content)
    content = re.sub(r'\.metric-label\s*{[^}]*font-size:\s*0\.95em[^}]*}', '.metric-label { font-size: 0.6em !important; }', content)
    content = re.sub(r'\.impact-number\s*{[^}]*font-size:\s*3\.5em[^}]*}', '.impact-number { font-size: 1.8em !important; }', content)
    content = re.sub(r'\.highlight-text\s*{[^}]*font-size:\s*2\.2em[^}]*}', '.highlight-text { font-size: 1.2em !important; }', content)
    
    # 确保overflow hidden
    content = re.sub(r'box-sizing:\s*border-box\s*!important;', 'box-sizing: border-box !important;\n        overflow: hidden !important;', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ 已激进调整 {file_path} 的字体大小")

def main():
    files_to_fix = [
        'presentation-world-class-final.html',
        'presentation-world-class-optimized.html',
        'presentation-optimized-final.html'
    ]
    
    for file_path in files_to_fix:
        if os.path.exists(file_path):
            adjust_font_sizes_aggressive(file_path)
        else:
            print(f"❌ 文件不存在: {file_path}")
    
    print("\n🎉 激进字体大小调整完成！")
    print("📝 主要调整:")
    print("   - 基础字体从24px降至16px")
    print("   - 标题字体大幅缩小")
    print("   - padding和margin显著减少")
    print("   - line-height优化")
    print("   - 确保overflow hidden")

if __name__ == "__main__":
    main() 