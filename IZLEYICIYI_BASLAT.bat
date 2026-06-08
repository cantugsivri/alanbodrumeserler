@echo off
chcp 65001 >nul
title ALAN Art & Coffee - Fotograf Izleyici
echo.
echo  ==========================================
echo   ALAN Art ^& Coffee - Fotograf Izleyici
echo  ==========================================
echo.
echo  Eser_Fotograflari klasorunu izliyor...
echo  Yeni fotograf ekleyince otomatik yukler!
echo.
echo  Durdurmak icin bu pencereyi kapatin.
echo  ==========================================
echo.
python "%~dp0fotograf_izleyici.py"
pause
