#!/usr/bin/env python3
"""
简单的代理服务器，解决前端调用AI API的CORS问题
支持Claude API和DeepSeek API
"""

import sys
import subprocess
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import urllib.request
import urllib.error
from datetime import datetime

# 检查并安装依赖
try:
    import requests
    print('✅ requests 已安装')
except ImportError:
    print('📦 正在安装 requests...')
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'requests', '--break-system-packages'])
        import requests
        print('✅ requests 安装成功')
    except subprocess.CalledProcessError:
        print('❌ 无法安装 requests，使用内置库')
        requests = None

class ProxyHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """处理预检请求"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key')
        self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()

    def do_GET(self):
        """处理GET请求"""
        try:
            path = self.path
            print(f'📥 收到GET请求: {path}')
            
            if path == '/health':
                # 健康检查端点
                self.send_response(200)
                self.send_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                
                health_data = {
                    'status': 'ok',
                    'timestamp': datetime.now().isoformat(),
                    'deepseek_key': 'sk-dc146c694369404a...',
                    'claude_key': 'your-claude-api-key-here',
                    'endpoints': [
                        'POST /claude - Claude API代理',
                        'POST /deepseek - DeepSeek API代理',
                        'GET /health - 健康检查'
                    ]
                }
                self.wfile.write(json.dumps(health_data).encode('utf-8'))
            else:
                self.send_error_response(404, 'Endpoint not found')
                
        except Exception as e:
            print(f'❌ 处理GET请求失败: {e}')
            self.send_error_response(500, str(e))

    def do_POST(self):
        """处理POST请求"""
        try:
            # 解析路径
            path = self.path
            print(f'📥 收到请求: {path}')
            
            # 读取请求体
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            # 解析JSON数据
            try:
                request_data = json.loads(post_data.decode('utf-8'))
            except json.JSONDecodeError:
                self.send_error_response(400, 'Invalid JSON')
                return
            
            # 根据路径路由到不同的API
            if '/claude' in path:
                self.proxy_claude_api(request_data)
            elif '/deepseek' in path:
                self.proxy_deepseek_api(request_data)
            else:
                self.send_error_response(404, 'API not found')
                
        except Exception as e:
            print(f'❌ 处理请求失败: {e}')
            self.send_error_response(500, str(e))

    def proxy_claude_api(self, data):
        """代理Claude API请求"""
        print('🤖 代理Claude API请求...')
        
        # Claude API配置
        api_url = 'https://api.anthropic.com/v1/messages'
        api_key = 'your-claude-api-key-here'
        
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': api_key,
            'anthropic-version': '2023-06-01'
        }
        
        # 构建Claude API请求数据
        claude_data = {
            'model': data.get('model', 'claude-3-haiku-20240307'),
            'max_tokens': data.get('max_tokens', 1500),
            'temperature': data.get('temperature', 0.5),
            'messages': data.get('messages', [])
        }
        
        self.make_api_request(api_url, headers, claude_data)

    def proxy_deepseek_api(self, data):
        """代理DeepSeek API请求"""
        print('🤖 代理DeepSeek API请求...')
        print('⚠️ 注意: 当前DeepSeek API密钥无效，请更新有效密钥')
        
        # 返回错误信息，提示用户更新API密钥
        self.send_error_response(401, {
            'message': 'DeepSeek API密钥无效，请更新有效密钥',
            'suggestion': '请访问 https://platform.deepseek.com/ 获取有效的API密钥',
            'note': '当前系统可以使用Claude API，DeepSeek API需要有效密钥'
        })
        return
        
        # DeepSeek API配置 - 需要有效的API密钥
        api_url = 'https://api.deepseek.com/v1/chat/completions'
        api_key = 'sk-dc146c694369404abde7e6b734a635f2'  # 当前密钥无效
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        }
        
        # 构建DeepSeek API请求数据
        deepseek_data = {
            'model': data.get('model', 'deepseek-chat'),
            'messages': data.get('messages', []),
            'max_tokens': data.get('max_tokens', 1500),
            'temperature': data.get('temperature', 0.5),
            'stream': False
        }
        
        self.make_api_request(api_url, headers, deepseek_data)

    def make_api_request(self, url, headers, data):
        """发起API请求"""
        try:
            if requests:
                # 使用requests库
                response = requests.post(url, headers=headers, json=data, timeout=30)
                response_data = response.json()
                status_code = response.status_code
            else:
                # 使用内置urllib
                req_data = json.dumps(data).encode('utf-8')
                request = urllib.request.Request(url, data=req_data, headers=headers)
                
                with urllib.request.urlopen(request, timeout=30) as response:
                    response_data = json.loads(response.read().decode('utf-8'))
                    status_code = response.getcode()
            
            print(f'✅ API调用成功 (状态码: {status_code})')
            
            # 返回成功响应
            self.send_response(status_code)
            self.send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
            
        except urllib.error.HTTPError as e:
            error_data = json.loads(e.read().decode('utf-8'))
            print(f'❌ API调用失败 (HTTP {e.code}): {error_data}')
            self.send_error_response(e.code, error_data)
        except Exception as e:
            print(f'❌ API调用异常: {e}')
            self.send_error_response(500, str(e))

    def send_cors_headers(self):
        """发送CORS头"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key')

    def send_error_response(self, status_code, message):
        """发送错误响应"""
        self.send_response(status_code)
        self.send_cors_headers()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        error_response = {
            'error': {
                'message': str(message),
                'code': status_code
            }
        }
        self.wfile.write(json.dumps(error_response).encode('utf-8'))

    def log_message(self, format, *args):
        """自定义日志格式"""
        print(f'🌐 {self.address_string()} - {format % args}')

def main():
    port = 8000
    
    print('🚀 启动代理服务器...')
    print(f'📡 服务地址: http://localhost:{port}')
    print('🔗 支持的API端点:')
    print('   - POST /claude - Claude API代理')
    print('   - POST /deepseek - DeepSeek API代理')
    print()
    
    try:
        server = HTTPServer(('localhost', port), ProxyHandler)
        print(f'✅ 代理服务器启动成功，端口: {port}')
        print('💡 在前端可以通过以下方式调用:')
        print(f'   - Claude: http://localhost:{port}/claude')
        print(f'   - DeepSeek: http://localhost:{port}/deepseek')
        print()
        print('按 Ctrl+C 停止服务器')
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n🛑 服务器已停止')
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f'❌ 端口 {port} 已被占用')
            print('💡 请停止其他服务或使用不同端口')
        else:
            print(f'❌ 启动失败: {e}')

if __name__ == '__main__':
    main() 