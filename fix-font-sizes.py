#!/usr/bin/env python3
"""
批量调整PPT文件中的字体大小
"""

import re
import os

def adjust_font_sizes(file_path):
    """调整文件中的字体大小"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 调整内联样式中的字体大小
    def adjust_inline_font(match):
        style = match.group(1)
        # 调整各种字体大小
        style = re.sub(r'font-size:\s*3\.5em', 'font-size: 2.8em', style)
        style = re.sub(r'font-size:\s*3em', 'font-size: 2.4em', style)
        style = re.sub(r'font-size:\s*2\.8em', 'font-size: 2.2em', style)
        style = re.sub(r'font-size:\s*2\.6em', 'font-size: 2.0em', style)
        style = re.sub(r'font-size:\s*2\.5em', 'font-size: 2.0em', style)
        style = re.sub(r'font-size:\s*2\.4em', 'font-size: 1.9em', style)
        style = re.sub(r'font-size:\s*2\.2em', 'font-size: 1.8em', style)
        style = re.sub(r'font-size:\s*2em', 'font-size: 1.6em', style)
        style = re.sub(r'font-size:\s*1\.8em', 'font-size: 1.5em', style)
        style = re.sub(r'font-size:\s*1\.6em', 'font-size: 1.3em', style)
        style = re.sub(r'font-size:\s*1\.4em', 'font-size: 1.2em', style)
        style = re.sub(r'font-size:\s*1\.3em', 'font-size: 1.1em', style)
        style = re.sub(r'font-size:\s*1\.2em', 'font-size: 1.0em', style)
        style = re.sub(r'font-size:\s*1\.1em', 'font-size: 0.95em', style)
        style = re.sub(r'font-size:\s*1em', 'font-size: 0.9em', style)
        style = re.sub(r'font-size:\s*0\.9em', 'font-size: 0.8em', style)
        style = re.sub(r'font-size:\s*0\.85em', 'font-size: 0.75em', style)
        return f'style="{style}"'
    
    # 应用调整
    content = re.sub(r'style="([^"]*)"', adjust_inline_font, content)
    
    # 调整CSS中的字体大小
    content = re.sub(r'font-size:\s*3\.5em', 'font-size: 2.8em', content)
    content = re.sub(r'font-size:\s*3em', 'font-size: 2.4em', content)
    content = re.sub(r'font-size:\s*2\.8em', 'font-size: 2.2em', content)
    content = re.sub(r'font-size:\s*2\.6em', 'font-size: 2.0em', content)
    content = re.sub(r'font-size:\s*2\.5em', 'font-size: 2.0em', content)
    content = re.sub(r'font-size:\s*2\.4em', 'font-size: 1.9em', content)
    content = re.sub(r'font-size:\s*2\.2em', 'font-size: 1.8em', content)
    content = re.sub(r'font-size:\s*2em', 'font-size: 1.6em', content)
    content = re.sub(r'font-size:\s*1\.8em', 'font-size: 1.5em', content)
    content = re.sub(r'font-size:\s*1\.6em', 'font-size: 1.3em', content)
    content = re.sub(r'font-size:\s*1\.4em', 'font-size: 1.2em', content)
    content = re.sub(r'font-size:\s*1\.3em', 'font-size: 1.1em', content)
    content = re.sub(r'font-size:\s*1\.2em', 'font-size: 1.0em', content)
    content = re.sub(r'font-size:\s*1\.1em', 'font-size: 0.95em', content)
    content = re.sub(r'font-size:\s*1em', 'font-size: 0.9em', content)
    content = re.sub(r'font-size:\s*0\.9em', 'font-size: 0.8em', content)
    content = re.sub(r'font-size:\s*0\.85em', 'font-size: 0.75em', content)
    
    # 调整padding
    content = re.sub(r'padding:\s*80px\s+100px\s+60px\s+100px', 'padding: 40px 60px 30px 60px', content)
    content = re.sub(r'padding:\s*60px\s+60px\s+40px\s+60px', 'padding: 30px 40px 20px 40px', content)
    
    # 添加overflow hidden
    content = re.sub(r'box-sizing:\s*border-box\s*!important;', 'box-sizing: border-box !important;\n        overflow: hidden !important;', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ 已调整 {file_path} 的字体大小")

def main():
    """主函数"""
    files_to_fix = [
        'presentation-world-class-final.html',
        'presentation-world-class-optimized.html',
        'presentation-optimized-final.html'
    ]
    
    for file_path in files_to_fix:
        if os.path.exists(file_path):
            adjust_font_sizes(file_path)
        else:
            print(f"❌ 文件不存在: {file_path}")
    
    print("\n🎉 字体大小调整完成！")
    print("现在PPT应该能够完整显示所有内容了。")

if __name__ == "__main__":
    main() 