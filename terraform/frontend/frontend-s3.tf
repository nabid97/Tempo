resource "aws_s3_bucket" "frontend" {
  bucket = "tempo-frontend-app-bucket-030125" # Replace with your unique bucket name
  force_destroy = true

  tags = {
    Environment = "Production"
    Project     = "NodeJSApp"
  }
}

resource "aws_s3_bucket_website_configuration" "frontend_website" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "PublicReadGetObject",
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      },
      {
        Sid       = "AllowPutBucketPolicy",
        Effect    = "Allow",
        Principal = {
          AWS = "arn:aws:iam::495599735948:user/NabidDev"
        },
        Action    = "s3:PutBucketPolicy",
        Resource  = "${aws_s3_bucket.frontend.arn}"
      }
    ]
  })
}

locals {
  frontend_dist_path = "C:/Users/Nabid/Tempo/frontend/dist"
}

resource "aws_s3_object" "frontend_index" {
  bucket        = aws_s3_bucket.frontend.id
  key           = "index.html"
  source        = "${local.frontend_dist_path}/index.html"
  content_type  = "text/html"
}

resource "aws_s3_object" "frontend_js" {
  bucket       = aws_s3_bucket.frontend.id
  key          = "bundle.js"
  source       = "${local.frontend_dist_path}/bundle.js"
  content_type = "application/javascript"
}