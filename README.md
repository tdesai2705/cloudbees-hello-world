# Hello World - CloudBees Unify MSI Demo

Simple Python Flask application demonstrating CloudBees Unify Multi-Stage Integration (MSI) workflow.

## Application Overview

- **Framework**: Flask (Python)
- **Purpose**: Learning CloudBees Unify concepts
- **Deployment**: Kubernetes with Helm

## Endpoints

- `/` - Hello world message with environment info
- `/health` - Health check endpoint
- `/version` - Version information

## Local Development

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements-dev.txt

# Run application
python app.py

# Run tests
pytest test_app.py -v
```

## Docker Build

```bash
docker build -t hello-world:latest .
docker run -p 5000:5000 -e ENVIRONMENT=local hello-world:latest
```

## CloudBees Unify Concepts Demonstrated

- **Component**: GitHub repo linked to CloudBees
- **Workflows**: Build → Test → Deploy pipeline
- **Environments**: Dev, Test, Prod with different configs
- **Approval Gates**: Manual approval before Prod
- **Artifact Registration**: Docker image traceability
- **Security Scanning**: Trivy, Gitleaks
- **MSI Pattern**: Multi-stage integration across environments

## Author

Tejas Desai - CloudBees Professional Services APAC

