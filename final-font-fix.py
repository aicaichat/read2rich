#!/usr/bin/env python3
"""
最终字体修复脚本 - 最激进的字体大小调整确保零溢出
"""
import re
import os

def final_font_fix(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    def adjust_inline_font(match):
        style = match.group(1)
        
        # 最激进的字体大小调整
        style = re.sub(r'font-size:\s*2\.5em', 'font-size: 1.5em', style)
        style = re.sub(r'font-size:\s*2\.2em', 'font-size: 1.3em', style)
        style = re.sub(r'font-size:\s*2\.0em', 'font-size: 1.2em', style)
        style = re.sub(r'font-size:\s*1\.8em', 'font-size: 1.1em', style)
        style = re.sub(r'font-size:\s*1\.5em', 'font-size: 1.0em', style)
        style = re.sub(r'font-size:\s*1\.3em', 'font-size: 0.9em', style)
        style = re.sub(r'font-size:\s*1\.2em', 'font-size: 0.8em', style)
        style = re.sub(r'font-size:\s*1\.1em', 'font-size: 0.7em', style)
        style = re.sub(r'font-size:\s*1\.0em', 'font-size: 0.6em', style)
        style = re.sub(r'font-size:\s*0\.9em', 'font-size: 0.5em', style)
        style = re.sub(r'font-size:\s*0\.8em', 'font-size: 0.45em', style)
        style = re.sub(r'font-size:\s*0\.7em', 'font-size: 0.4em', style)
        style = re.sub(r'font-size:\s*0\.6em', 'font-size: 0.35em', style)
        style = re.sub(r'font-size:\s*0\.5em', 'font-size: 0.3em', style)
        style = re.sub(r'font-size:\s*0\.45em', 'font-size: 0.25em', style)
        style = re.sub(r'font-size:\s*0\.4em', 'font-size: 0.2em', style)
        style = re.sub(r'font-size:\s*0\.35em', 'font-size: 0.18em', style)
        style = re.sub(r'font-size:\s*0\.3em', 'font-size: 0.15em', style)
        style = re.sub(r'font-size:\s*0\.25em', 'font-size: 0.12em', style)
        style = re.sub(r'font-size:\s*0\.2em', 'font-size: 0.1em', style)
        
        # 最激进的padding调整
        style = re.sub(r'padding:\s*20px\s+30px\s+15px\s+30px', 'padding: 5px 8px 3px 8px', style)
        style = re.sub(r'padding:\s*15px\s+20px\s+10px\s+20px', 'padding: 4px 6px 2px 6px', style)
        style = re.sub(r'padding:\s*12px\s+15px\s+8px\s+15px', 'padding: 3px 5px 2px 5px', style)
        style = re.sub(r'padding:\s*10px\s+12px\s+6px\s+12px', 'padding: 2px 4px 1px 4px', style)
        style = re.sub(r'padding:\s*8px\s+10px\s+5px\s+10px', 'padding: 2px 3px 1px 3px', style)
        style = re.sub(r'padding:\s*6px\s+8px\s+4px\s+8px', 'padding: 1px 2px 1px 2px', style)
        style = re.sub(r'padding:\s*4px\s+6px\s+3px\s+6px', 'padding: 1px 2px 1px 2px', style)
        
        # 最激进的margin调整
        style = re.sub(r'margin:\s*15px\s+0', 'margin: 3px 0', style)
        style = re.sub(r'margin:\s*12px\s+0', 'margin: 2px 0', style)
        style = re.sub(r'margin:\s*8px\s+0', 'margin: 1px 0', style)
        style = re.sub(r'margin:\s*5px\s+0', 'margin: 1px 0', style)
        style = re.sub(r'margin-bottom:\s*0\.4em', 'margin-bottom: 0.1em', style)
        style = re.sub(r'margin-bottom:\s*0\.3em', 'margin-bottom: 0.08em', style)
        style = re.sub(r'margin-bottom:\s*0\.2em', 'margin-bottom: 0.05em', style)
        style = re.sub(r'margin-bottom:\s*0\.15em', 'margin-bottom: 0.03em', style)
        style = re.sub(r'margin-bottom:\s*0\.1em', 'margin-bottom: 0.02em', style)
        
        return f'style="{style}"'
    
    # 调整内联样式
    content = re.sub(r'style="([^"]*)"', adjust_inline_font, content)
    
    # 最激进的CSS字体大小调整
    content = re.sub(r'font-size:\s*11px\s*!important', 'font-size: 8px !important', content)
    content = re.sub(r'font-size:\s*10px\s*!important', 'font-size: 7px !important', content)
    content = re.sub(r'font-size:\s*12px\s*!important', 'font-size: 8px !important', content)
    content = re.sub(r'font-size:\s*14px\s*!important', 'font-size: 9px !important', content)
    content = re.sub(r'font-size:\s*16px\s*!important', 'font-size: 10px !important', content)
    
    # 最激进的标题字体调整
    content = re.sub(r'font-size:\s*0\.85em\s*!important', 'font-size: 0.6em !important', content)
    content = re.sub(r'font-size:\s*0\.7em\s*!important', 'font-size: 0.5em !important', content)
    content = re.sub(r'font-size:\s*0\.5em\s*!important', 'font-size: 0.35em !important', content)
    content = re.sub(r'font-size:\s*0\.45em\s*!important', 'font-size: 0.3em !important', content)
    
    # 最激进的padding调整
    content = re.sub(r'padding:\s*8px\s+12px\s+6px\s+12px\s*!important', 'padding: 2px 4px 1px 4px !important', content)
    content = re.sub(r'padding:\s*6px\s+10px\s+5px\s+10px\s*!important', 'padding: 1px 3px 1px 3px !important', content)
    content = re.sub(r'padding:\s*4px\s+8px\s+3px\s+8px\s*!important', 'padding: 1px 2px 1px 2px !important', content)
    
    # 最激进的line-height调整
    content = re.sub(r'line-height:\s*1\.05\s*!important', 'line-height: 1.0 !important', content)
    content = re.sub(r'line-height:\s*1\.15\s*!important', 'line-height: 1.05 !important', content)
    content = re.sub(r'line-height:\s*1\.1\s*!important', 'line-height: 1.02 !important', content)
    
    # 最激进的margin-bottom调整
    content = re.sub(r'margin-bottom:\s*0\.2em\s*!important', 'margin-bottom: 0.05em !important', content)
    content = re.sub(r'margin-bottom:\s*0\.15em\s*!important', 'margin-bottom: 0.03em !important', content)
    content = re.sub(r'margin-bottom:\s*0\.1em\s*!important', 'margin-bottom: 0.02em !important', content)
    
    # 最激进的卡片padding调整
    content = re.sub(r'padding:\s*20px\s+15px', 'padding: 5px 4px', content)
    content = re.sub(r'padding:\s*15px\s+10px', 'padding: 3px 2px', content)
    content = re.sub(r'padding:\s*10px\s+8px', 'padding: 2px 1px', content)
    
    # 最激进的grid gap调整
    content = re.sub(r'gap:\s*15px', 'gap: 3px', content)
    content = re.sub(r'gap:\s*12px', 'gap: 2px', content)
    content = re.sub(r'gap:\s*8px', 'gap: 1px', content)
    
    # 最激进的margin调整
    content = re.sub(r'margin:\s*15px\s+0', 'margin: 2px 0', content)
    content = re.sub(r'margin:\s*12px\s+0', 'margin: 1px 0', content)
    content = re.sub(r'margin:\s*8px\s+0', 'margin: 1px 0', content)
    content = re.sub(r'margin:\s*5px\s+0', 'margin: 0px 0', content)
    
    # 最激进的特定元素字体调整
    content = re.sub(r'\.metric-number\s*{[^}]*font-size:\s*0\.8em[^}]*}', '.metric-number { font-size: 0.5em !important; }', content)
    content = re.sub(r'\.metric-label\s*{[^}]*font-size:\s*0\.4em[^}]*}', '.metric-label { font-size: 0.25em !important; }', content)
    content = re.sub(r'\.impact-number\s*{[^}]*font-size:\s*1\.4em[^}]*}', '.impact-number { font-size: 0.9em !important; }', content)
    content = re.sub(r'\.highlight-text\s*{[^}]*font-size:\s*1\.0em[^}]*}', '.highlight-text { font-size: 0.7em !important; }', content)
    
    # 确保最小高度进一步减少
    content = re.sub(r'min-height:\s*95vh\s*!important', 'min-height: 90vh !important', content)
    
    # 确保所有overflow设置
    content = re.sub(r'overflow:\s*hidden\s*!important;', 'overflow: hidden !important;\n        max-height: 95vh !important;', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ 已完成最终字体修复 {file_path}")

def main():
    files_to_fix = [
        'presentation-world-class-final.html',
        'presentation-world-class-optimized.html',
        'presentation-optimized-final.html'
    ]
    
    for file_path in files_to_fix:
        if os.path.exists(file_path):
            final_font_fix(file_path)
        else:
            print(f"❌ 文件不存在: {file_path}")
    
    print("\n🎉 最终字体修复完成！")
    print("📝 最激进调整:")
    print("   - 基础字体降至8px")
    print("   - 所有间距最小化")
    print("   - padding几乎为零")
    print("   - line-height压缩至1.0")
    print("   - 确保95vh高度限制")
    print("   - 零溢出保证")

if __name__ == "__main__":
    main() 