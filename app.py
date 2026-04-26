"""
Simple Hello World Flask Application
CloudBees Unify MSI Demo
"""
from flask import Flask, jsonify
import os
import datetime

app = Flask(__name__)

@app.route('/')
def hello():
    """Main hello world endpoint"""
    return jsonify({
        'message': 'Hello from CloudBees Unify!',
        'app': 'hello-world',
        'environment': os.getenv('ENVIRONMENT', 'unknown'),
        'version': os.getenv('VERSION', '1.0.0'),
        'timestamp': datetime.datetime.now().isoformat()
    })

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.datetime.now().isoformat()
    })

@app.route('/version')
def version():
    """Version endpoint"""
    return jsonify({
        'version': os.getenv('VERSION', '1.0.0'),
        'environment': os.getenv('ENVIRONMENT', 'unknown')
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
