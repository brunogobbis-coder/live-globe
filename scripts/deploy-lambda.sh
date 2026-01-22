#!/bin/bash
set -euo pipefail

# Deploy Lambda function and infrastructure
# Usage: ./scripts/deploy-lambda.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LAMBDA_DIR="$PROJECT_DIR/lambda"
TERRAFORM_DIR="$PROJECT_DIR/terraform"

echo "=== Live Globe Lambda Deployment ==="
echo ""

# Check dependencies
command -v python3 >/dev/null 2>&1 || { echo "Error: python3 is required"; exit 1; }
command -v pip3 >/dev/null 2>&1 || { echo "Error: pip3 is required"; exit 1; }
command -v terraform >/dev/null 2>&1 || { echo "Error: terraform is required"; exit 1; }
command -v aws >/dev/null 2>&1 || { echo "Error: aws cli is required"; exit 1; }

# Check AWS credentials
echo "Checking AWS credentials..."
aws sts get-caller-identity > /dev/null || { echo "Error: AWS credentials not configured"; exit 1; }
echo "AWS credentials OK"
echo ""

# Build Lambda layer (dependencies)
echo "Building Lambda layer..."
LAYER_DIR=$(mktemp -d)
mkdir -p "$LAYER_DIR/python"
pip3 install -r "$LAMBDA_DIR/requirements.txt" -t "$LAYER_DIR/python" --quiet
cd "$LAYER_DIR"
zip -r "$LAMBDA_DIR/layer.zip" python > /dev/null
rm -rf "$LAYER_DIR"
echo "Layer built: $LAMBDA_DIR/layer.zip"
echo ""

# Package Lambda function
echo "Packaging Lambda function..."
cd "$LAMBDA_DIR"
zip -r function.zip handler.py > /dev/null
echo "Function packaged: $LAMBDA_DIR/function.zip"
echo ""

# Check terraform.tfvars
if [ ! -f "$TERRAFORM_DIR/terraform.tfvars" ]; then
    echo "Error: terraform.tfvars not found"
    echo "Copy terraform.tfvars.example to terraform.tfvars and fill in the values"
    exit 1
fi

# Deploy with Terraform
echo "Deploying infrastructure with Terraform..."
cd "$TERRAFORM_DIR"

terraform init -upgrade
terraform plan -out=tfplan
echo ""
read -p "Apply changes? (yes/no): " CONFIRM
if [ "$CONFIRM" = "yes" ]; then
    terraform apply tfplan
    echo ""
    echo "=== Deployment Complete ==="
    echo ""
    terraform output
else
    echo "Deployment cancelled"
    exit 0
fi
