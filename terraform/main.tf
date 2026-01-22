# Terraform configuration for Live Globe Databricks Integration
# AWS Lambda + API Gateway + Secrets Manager

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "allowed_origin" {
  description = "Allowed CORS origin"
  type        = string
  default     = "https://nuvemshop-live-globe.vercel.app"
}

variable "databricks_host" {
  description = "Databricks workspace hostname"
  type        = string
  sensitive   = true
}

variable "databricks_http_path" {
  description = "Databricks SQL Warehouse HTTP path"
  type        = string
  sensitive   = true
}

variable "databricks_token" {
  description = "Databricks access token"
  type        = string
  sensitive   = true
}

# Locals
locals {
  function_name = "live-globe-databricks-api"
  tags = {
    Project     = "live-globe"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# Secrets Manager - Store Databricks credentials
resource "aws_secretsmanager_secret" "databricks_credentials" {
  name        = "${local.function_name}-databricks-credentials"
  description = "Databricks SQL Warehouse credentials for Live Globe"
  
  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "databricks_credentials" {
  secret_id = aws_secretsmanager_secret.databricks_credentials.id
  secret_string = jsonencode({
    DATABRICKS_HOST      = var.databricks_host
    DATABRICKS_HTTP_PATH = var.databricks_http_path
    DATABRICKS_TOKEN     = var.databricks_token
  })
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${local.function_name}-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
  
  tags = local.tags
}

# IAM Policy for Lambda
resource "aws_iam_role_policy" "lambda_policy" {
  name = "${local.function_name}-policy"
  role = aws_iam_role.lambda_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = aws_secretsmanager_secret.databricks_credentials.arn
      }
    ]
  })
}

# Lambda Layer for dependencies
resource "aws_lambda_layer_version" "databricks_layer" {
  filename            = "${path.module}/../lambda/layer.zip"
  layer_name          = "${local.function_name}-databricks-layer"
  compatible_runtimes = ["python3.11"]
  description         = "Databricks SQL connector and dependencies"
  
  lifecycle {
    create_before_destroy = true
  }
}

# Lambda Function
resource "aws_lambda_function" "api" {
  filename         = "${path.module}/../lambda/function.zip"
  function_name    = local.function_name
  role             = aws_iam_role.lambda_role.arn
  handler          = "handler.handler"
  runtime          = "python3.11"
  timeout          = 30
  memory_size      = 256
  
  layers = [aws_lambda_layer_version.databricks_layer.arn]
  
  environment {
    variables = {
      DATABRICKS_HOST      = var.databricks_host
      DATABRICKS_HTTP_PATH = var.databricks_http_path
      DATABRICKS_TOKEN     = var.databricks_token
      ALLOWED_ORIGIN       = var.allowed_origin
    }
  }
  
  tags = local.tags
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${local.function_name}"
  retention_in_days = 14
  
  tags = local.tags
}

# API Gateway HTTP API (v2 - simpler and cheaper)
resource "aws_apigatewayv2_api" "api" {
  name          = "${local.function_name}-api"
  protocol_type = "HTTP"
  description   = "Live Globe Databricks API"
  
  cors_configuration {
    allow_origins     = [var.allowed_origin, "http://localhost:*"]
    allow_methods     = ["GET", "OPTIONS"]
    allow_headers     = ["Content-Type", "Authorization"]
    max_age           = 86400
    allow_credentials = false
  }
  
  tags = local.tags
}

# API Gateway Stage
resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "prod"
  auto_deploy = true
  
  default_route_settings {
    throttling_burst_limit = 100
    throttling_rate_limit  = 50
  }
  
  tags = local.tags
}

# API Gateway Integration
resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.api.invoke_arn
  payload_format_version = "2.0"
}

# API Gateway Routes
resource "aws_apigatewayv2_route" "stats" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /stats"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "recent_sales" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /sales/recent"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "state_details" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /states/{state}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# Lambda Permission for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

# Outputs
output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_stage.prod.invoke_url
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.api.function_name
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.api.arn
}
