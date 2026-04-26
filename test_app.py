"""
Unit tests for Hello World app
"""
import pytest
from app import app

@pytest.fixture
def client():
    """Create test client"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_hello_endpoint(client):
    """Test main hello endpoint"""
    response = client.get('/')
    assert response.status_code == 200
    data = response.get_json()
    assert 'message' in data
    assert data['message'] == 'Hello from CloudBees Unify!'

def test_health_endpoint(client):
    """Test health check endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'

def test_version_endpoint(client):
    """Test version endpoint"""
    response = client.get('/version')
    assert response.status_code == 200
    data = response.get_json()
    assert 'version' in data
