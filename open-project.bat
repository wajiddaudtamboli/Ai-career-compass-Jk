@echo off
echo Opening AI Career Compass J&K Project...
cd /d "C:\Users\HP\ai-career-compass-jk"
if exist "C:\Users\HP\AppData\Local\Programs\Microsoft VS Code\Code.exe" (
  "C:\Users\HP\AppData\Local\Programs\Microsoft VS Code\Code.exe" .
) else (
  echo VS Code not found in standard location
  echo Please open VS Code manually and open this folder:
  echo C:\Users\HP\ai-career-compass-jk
  pause
)
