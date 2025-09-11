@echo off
echo 🧪 Testing Cart Library Package
echo ================================

echo.
echo 📁 Checking project structure...
if not exist "src\" (
    echo ❌ src folder not found
    exit /b 1
)
if not exist "views\" (
    echo ❌ views folder not found  
    exit /b 1
)
if not exist "public\" (
    echo ❌ public folder not found
    exit /b 1
)
if not exist "package.json" (
    echo ❌ package.json not found
    exit /b 1
)
echo ✅ Project structure OK

echo.
echo 🔍 Checking TypeScript compilation...
call pnpm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build successful

echo.
echo 📦 Checking dist folder...
if not exist "dist\" (
    echo ❌ dist folder not found after build
    exit /b 1
)
if not exist "dist\index.js" (
    echo ❌ dist/index.js not found
    exit /b 1
)
if not exist "dist\index.d.ts" (
    echo ❌ dist/index.d.ts not found
    exit /b 1
)
echo ✅ Dist files OK

echo.
echo 🔍 Checking package contents...
call npm pack --dry-run > pack-content.txt
type pack-content.txt
del pack-content.txt

echo.
echo 📝 Package info:
call npm show . name version description --json

echo.
echo ✅ All tests passed!
echo 🚀 Ready to publish to NPM
echo.
echo Next steps:
echo 1. npm login
echo 2. npm publish --access public
echo.
pause
