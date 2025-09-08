@echo off
REM Batch script to convert images to JPEG using ImageMagick
REM Install ImageMagick first: winget install ImageMagick.ImageMagick

echo Converting image to JPEG...
echo Make sure ImageMagick is installed: winget install ImageMagick.ImageMagick
echo.

if not exist "public\profile.CR2" (
    echo Input file not found: public\profile.CR2
    echo Please place your image file in the public/ folder as 'profile.CR2'
    pause
    exit /b 1
)

magick "public\profile.CR2" -resize 400x400 -quality 85 "public\profile-image.jpg"

if %errorlevel% equ 0 (
    echo Image converted successfully! Saved as: public\profile-image.jpg
) else (
    echo Conversion failed. Make sure ImageMagick is installed.
)

pause
