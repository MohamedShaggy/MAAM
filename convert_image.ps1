# PowerShell script to convert images to JPEG using ImageMagick
# Install ImageMagick first: winget install ImageMagick.ImageMagick

param(
    [string]$inputFile = "public/uploads/profile.CR2",
    [string]$outputFile = "public/profile-image.jpg"
)

# Check if ImageMagick is installed
if (!(Get-Command magick -ErrorAction SilentlyContinue)) {
    Write-Host "ImageMagick is not installed. Please install it first:"
    Write-Host "winget install ImageMagick.ImageMagick"
    exit 1
}

# Check if input file exists
if (!(Test-Path $inputFile)) {
    Write-Host "Input file not found: $inputFile"
    Write-Host "Please place your image file in the public/uploads/ folder"
    exit 1
}

# Convert the image
magick $inputFile -resize 400x400 -quality 85 $outputFile

Write-Host "Image converted successfully! Saved as: $outputFile"
