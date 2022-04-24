terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.9.0"
    }
  }

  required_version = ">= 0.14.9"
}

provider "aws" {
  region = "ap-southeast-1"
}

variable "TELEGRAM_BOT_TOKEN" {}

data "archive_file" "lambda_zip" {
  type          = "zip"
  source_dir    = "${path.module}"
  excludes      = [".terraform", ".git"]
  output_path   = "${path.module}/lambda_function.zip"
}

resource "aws_iam_role" "telegram_bot" {
  name = "telegram_bot"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_access" {
  role       = aws_iam_role.telegram_bot.id
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}


resource "aws_lambda_function" "telegram_bot" {
  filename      = data.archive_file.lambda_zip.output_path
  function_name = "telegram_bot"
  role          = aws_iam_role.telegram_bot.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  runtime = "nodejs14.x"

  environment {
    variables = {
      TELEGRAM_BOT_TOKEN = var.TELEGRAM_BOT_TOKEN
    }
  }
}

resource "aws_lambda_function_url" "webhook_url" {
  function_name      = aws_lambda_function.telegram_bot.function_name
  authorization_type = "NONE"
}

output "aws_lambda_function_url" {
  value       = aws_lambda_function_url.webhook_url.function_url
}
