#!/usr/bin/env python3
"""
简单的HTTP服务器，用于测试和修复HTML显示问题
确保正确的MIME类型和文件服务
"""

import http.server
import socketserver
import os
import mimetypes
from urllib.parse import urlparse

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # 设置正确的MIME类型映射
        mimetypes.add_type('text/html', '.html')
        mimetypes.add_type('text/css', '.css')
        mimetypes.add_type('application/javascript', '.js')
        mimetypes.add_type('image/svg+xml', '.svg')
        mimetypes.add_type('image/png', '.png')
        mimetypes.add_type('image/jpeg', '.jpg')
        mimetypes.add_type('image/jpeg', '.jpeg')
        mimetypes.add_type('image/gif', '.gif')
        mimetypes.add_type('image/ico', '.ico')
        mimetypes.add_type('font/woff', '.woff')
        mimetypes.add_type('font/woff2', '.woff2')
        mimetypes.add_type('font/ttf', '.ttf')
        mimetypes.add_type('font/eot', '.eot')
        
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        # 添加CORS头，允许跨域访问
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # 确保HTML文件有正确的Content-Type
        if self.path.endswith('.html'):
            self.send_header('Content-Type', 'text/html; charset=utf-8')
        
        super().end_headers()
    
    def do_GET(self):
        # 解析URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # 默认首页处理
        if path == '/' or path == '':
            # 尝试多个可能的首页文件
            possible_index_files = [
                'index.html',
                'deepneed_site/index.html',
                'presentation-optimized-final.html',
                'presentation-world-class-final.html'
            ]
            
            for index_file in possible_index_files:
                if os.path.exists(index_file):
                    self.path = '/' + index_file
                    break
            else:
                # 如果找不到首页，返回404
                self.send_error(404, "File not found")
                return
        
        # 处理静态文件路径
        if path.startswith('/_static/'):
            # 将/_static/路径映射到实际的文件位置
            actual_path = path[1:]  # 移除开头的/
            if os.path.exists(actual_path):
                self.path = '/' + actual_path
            else:
                # 如果文件不存在，尝试在_static目录下查找
                static_path = '_static' + path[8:]  # 移除/_static/
                if os.path.exists(static_path):
                    self.path = '/' + static_path
        
        # 调用父类方法处理请求
        super().do_GET()
    
    def log_message(self, format, *args):
        # 自定义日志格式
        print(f"[{self.log_date_time_string()}] {format % args}")

def main():
    PORT = 8081
    
    # 确保工作目录正确
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print(f"启动测试服务器在端口 {PORT}")
    print(f"工作目录: {os.getcwd()}")
    print(f"可用的HTML文件:")
    
    # 列出所有HTML文件
    for file in os.listdir('.'):
        if file.endswith('.html'):
            print(f"  - {file}")
    
    if os.path.exists('deepneed_site'):
        for file in os.listdir('deepneed_site'):
            if file.endswith('.html'):
                print(f"  - deepneed_site/{file}")
    
    print(f"\n访问地址:")
    print(f"  - 首页: http://localhost:{PORT}/")
    print(f"  - PPT演示: http://localhost:{PORT}/presentation-optimized-final.html")
    print(f"  - 世界级PPT: http://localhost:{PORT}/presentation-world-class-final.html")
    print(f"  - DeepNeed站点: http://localhost:{PORT}/deepneed_site/")
    
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"\n服务器已启动，按 Ctrl+C 停止")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\n服务器已停止")
    except Exception as e:
        print(f"启动服务器时出错: {e}")

if __name__ == "__main__":
    main() 