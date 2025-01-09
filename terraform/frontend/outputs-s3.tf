output "frontend_bucket_name" {
  description = "The name of the S3 bucket for the frontend"
  value       = aws_s3_bucket.frontend.bucket
}

output "frontend_website_endpoint" {
  description = "The website endpoint of the S3 bucket"
  value       = aws_s3_bucket_website_configuration.frontend_website.website_endpoint
}

