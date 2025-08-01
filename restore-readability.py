#!/usr/bin/env python3
"""
恢复可读性脚本 - 调整字体大小到合理水平
"""
import re
import os

def restore_readability(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    def adjust_inline_font(match):
        style = match.group(1)
        
        # 恢复合理的字体大小
        style = re.sub(r'font-size:\s*1\.5em', 'font-size: 2.2em', style)
        style = re.sub(r'font-size:\s*1\.3em', 'font-size: 1.8em', style)
        style = re.sub(r'font-size:\s*1\.2em', 'font-size: 1.6em', style)
        style = re.sub(r'font-size:\s*1\.1em', 'font-size: 1.4em', style)
        style = re.sub(r'font-size:\s*1\.0em', 'font-size: 1.2em', style)
        style = re.sub(r'font-size:\s*0\.9em', 'font-size: 1.1em', style)
        style = re.sub(r'font-size:\s*0\.8em', 'font-size: 1.0em', style)
        style = re.sub(r'font-size:\s*0\.7em', 'font-size: 0.9em', style)
        style = re.sub(r'font-size:\s*0\.6em', 'font-size: 0.8em', style)
        style = re.sub(r'font-size:\s*0\.5em', 'font-size: 0.7em', style)
        style = re.sub(r'font-size:\s*0\.45em', 'font-size: 0.65em', style)
        style = re.sub(r'font-size:\s*0\.4em', 'font-size: 0.6em', style)
        style = re.sub(r'font-size:\s*0\.35em', 'font-size: 0.55em', style)
        style = re.sub(r'font-size:\s*0\.3em', 'font-size: 0.5em', style)
        style = re.sub(r'font-size:\s*0\.25em', 'font-size: 0.4em', style)
        style = re.sub(r'font-size:\s*0\.2em', 'font-size: 0.35em', style)
        style = re.sub(r'font-size:\s*0\.18em', 'font-size: 0.3em', style)
        style = re.sub(r'font-size:\s*0\.15em', 'font-size: 0.25em', style)
        style = re.sub(r'font-size:\s*0\.12em', 'font-size: 0.2em', style)
        style = re.sub(r'font-size:\s*0\.1em', 'font-size: 0.18em', style)
        
        # 恢复合理的padding
        style = re.sub(r'padding:\s*5px\s+8px\s+3px\s+8px', 'padding: 15px 25px 10px 25px', style)
        style = re.sub(r'padding:\s*4px\s+6px\s+2px\s+6px', 'padding: 12px 20px 8px 20px', style)
        style = re.sub(r'padding:\s*3px\s+5px\s+2px\s+5px', 'padding: 10px 15px 6px 15px', style)
        style = re.sub(r'padding:\s*2px\s+4px\s+1px\s+4px', 'padding: 8px 12px 5px 12px', style)
        style = re.sub(r'padding:\s*2px\s+3px\s+1px\s+3px', 'padding: 6px 10px 4px 10px', style)
        style = re.sub(r'padding:\s*1px\s+2px\s+1px\s+2px', 'padding: 4px 8px 3px 8px', style)
        
        # 恢复合理的margin
        style = re.sub(r'margin:\s*3px\s+0', 'margin: 8px 0', style)
        style = re.sub(r'margin:\s*2px\s+0', 'margin: 6px 0', style)
        style = re.sub(r'margin:\s*1px\s+0', 'margin: 4px 0', style)
        style = re.sub(r'margin-bottom:\s*0\.1em', 'margin-bottom: 0.3em', style)
        style = re.sub(r'margin-bottom:\s*0\.08em', 'margin-bottom: 0.25em', style)
        style = re.sub(r'margin-bottom:\s*0\.05em', 'margin-bottom: 0.2em', style)
        style = re.sub(r'margin-bottom:\s*0\.03em', 'margin-bottom: 0.15em', style)
        style = re.sub(r'margin-bottom:\s*0\.02em', 'margin-bottom: 0.1em', style)
        
        return f'style="{style}"'
    
    # 调整内联样式
    content = re.sub(r'style="([^"]*)"', adjust_inline_font, content)
    
    # 恢复合理的CSS字体大小
    content = re.sub(r'font-size:\s*8px\s*!important', 'font-size: 16px !important', content)
    content = re.sub(r'font-size:\s*7px\s*!important', 'font-size: 14px !important', content)
    content = re.sub(r'font-size:\s*9px\s*!important', 'font-size: 15px !important', content)
    content = re.sub(r'font-size:\s*10px\s*!important', 'font-size: 16px !important', content)
    
    # 恢复合理的标题字体
    content = re.sub(r'font-size:\s*0\.6em\s*!important', 'font-size: 1.2em !important', content)
    content = re.sub(r'font-size:\s*0\.5em\s*!important', 'font-size: 1.0em !important', content)
    content = re.sub(r'font-size:\s*0\.35em\s*!important', 'font-size: 0.8em !important', content)
    content = re.sub(r'font-size:\s*0\.3em\s*!important', 'font-size: 0.7em !important', content)
    
    # 恢复合理的padding
    content = re.sub(r'padding:\s*2px\s+4px\s+1px\s+4px\s*!important', 'padding: 15px 25px 10px 25px !important', content)
    content = re.sub(r'padding:\s*1px\s+3px\s+1px\s+3px\s*!important', 'padding: 12px 20px 8px 20px !important', content)
    content = re.sub(r'padding:\s*1px\s+2px\s+1px\s+2px\s*!important', 'padding: 10px 15px 6px 15px !important', content)
    
    # 恢复合理的line-height
    content = re.sub(r'line-height:\s*1\.0\s*!important', 'line-height: 1.3 !important', content)
    content = re.sub(r'line-height:\s*1\.05\s*!important', 'line-height: 1.25 !important', content)
    content = re.sub(r'line-height:\s*1\.02\s*!important', 'line-height: 1.2 !important', content)
    
    # 恢复合理的margin-bottom
    content = re.sub(r'margin-bottom:\s*0\.05em\s*!important', 'margin-bottom: 0.3em !important', content)
    content = re.sub(r'margin-bottom:\s*0\.03em\s*!important', 'margin-bottom: 0.25em !important', content)
    content = re.sub(r'margin-bottom:\s*0\.02em\s*!important', 'margin-bottom: 0.2em !important', content)
    
    # 恢复合理的卡片padding
    content = re.sub(r'padding:\s*5px\s+4px', 'padding: 20px 15px', content)
    content = re.sub(r'padding:\s*3px\s+2px', 'padding: 15px 10px', content)
    content = re.sub(r'padding:\s*2px\s+1px', 'padding: 10px 8px', content)
    
    # 恢复合理的grid gap
    content = re.sub(r'gap:\s*3px', 'gap: 15px', content)
    content = re.sub(r'gap:\s*2px', 'gap: 12px', content)
    content = re.sub(r'gap:\s*1px', 'gap: 8px', content)
    
    # 恢复合理的margin
    content = re.sub(r'margin:\s*2px\s+0', 'margin: 8px 0', content)
    content = re.sub(r'margin:\s*1px\s+0', 'margin: 6px 0', content)
    content = re.sub(r'margin:\s*0px\s+0', 'margin: 4px 0', content)
    
    # 恢复合理的特定元素字体
    content = re.sub(r'\.metric-number\s*{[^}]*font-size:\s*0\.5em[^}]*}', '.metric-number { font-size: 1.2em !important; }', content)
    content = re.sub(r'\.metric-label\s*{[^}]*font-size:\s*0\.25em[^}]*}', '.metric-label { font-size: 0.8em !important; }', content)
    content = re.sub(r'\.impact-number\s*{[^}]*font-size:\s*0\.9em[^}]*}', '.impact-number { font-size: 1.8em !important; }', content)
    content = re.sub(r'\.highlight-text\s*{[^}]*font-size:\s*0\.7em[^}]*}', '.highlight-text { font-size: 1.4em !important; }', content)
    
    # 恢复合理的最小高度
    content = re.sub(r'min-height:\s*90vh\s*!important', 'min-height: 95vh !important', content)
    
    # 确保overflow设置
    content = re.sub(r'overflow:\s*hidden\s*!important;', 'overflow: hidden !important;\n        max-height: 98vh !important;', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ 已恢复 {file_path} 的可读性")

def main():
    files_to_fix = [
        'presentation-world-class-final.html',
        'presentation-world-class-optimized.html',
        'presentation-optimized-final.html'
    ]
    
    for file_path in files_to_fix:
        if os.path.exists(file_path):
            restore_readability(file_path)
        else:
            print(f"❌ 文件不存在: {file_path}")
    
    print("\n🎉 可读性恢复完成！")
    print("📝 主要调整:")
    print("   - 基础字体从8px恢复至16px")
    print("   - 标题字体从0.6em恢复至1.2em")
    print("   - padding从2px恢复至15px")
    print("   - line-height从1.0恢复至1.3")
    print("   - 确保内容可读且完整显示")

if __name__ == "__main__":
    main() 