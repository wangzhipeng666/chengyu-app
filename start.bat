@echo off
chcp 65001 >nul

REM 成语学习助手 - 一键启动脚本 (Windows)
REM 同时启动服务端和客户端，支持本地和IP访问

setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
set SERVER_DIR=%SCRIPT_DIR%server
set CLIENT_DIR=%SCRIPT_DIR%client
set SERVER_PORT=4917
set CLIENT_PORT=5832

echo ========================================
echo     成语学习助手 - 启动中...
echo ========================================
echo.

REM 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 node，请先安装 Node.js
    pause
    exit /b 1
)
echo [OK] Node.js 已安装

REM 获取本机IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        set IP=%%b
        goto :got_ip
    )
)
:got_ip

REM 关闭占用端口的旧进程
echo 正在清理旧进程...
for /f "tokens=5" %%p in ('netstat -aon ^| findstr ":%SERVER_PORT%"') do taskkill /PID %%p /F >nul 2>&1
for /f "tokens=5" %%p in ('netstat -aon ^| findstr ":%CLIENT_PORT%"') do taskkill /PID %%p /F >nul 2>&1
timeout /t 1 /nobreak >nul

REM 启动服务端
echo 正在启动服务端...
cd /d "%SERVER_PORT%"
cd /d "%SERVER_DIR%"
start "Server" cmd /c "npm run dev"

REM 等待服务端启动
echo 等待服务端启动...
set /a count=0
:wait_server
timeout /t 1 /nobreak >nul
set /a count+=1
if %count% geq 15 goto :server_timeout
curl -s http://localhost:%SERVER_PORT%/api/health >nul 2>&1
if %errorlevel% neq 0 goto :wait_server
echo [OK] 服务端启动成功
goto :start_client

:server_timeout
echo [警告] 服务端启动超时，继续启动客户端...

:start_client
REM 启动客户端
echo 正在启动客户端...
cd /d "%CLIENT_DIR%"
start "Client" cmd /c "npm run dev"

REM 等待客户端启动
echo 等待客户端启动...
set /a count=0
:wait_client
timeout /t 1 /nobreak >nul
set /a count+=1
if %count% geq 15 goto :client_timeout
curl -s http://localhost:%CLIENT_PORT% >nul 2>&1
if %errorlevel% neq 0 goto :wait_client
echo [OK] 客户端启动成功
goto :done

:client_timeout
echo [警告] 客户端启动超时...

:done
echo.
echo ========================================
echo     启动完成！
echo ========================================
echo.
echo   本地访问: http://localhost:%CLIENT_PORT%
echo   IP 访问:  http://%IP%:%CLIENT_PORT%
echo.
echo   服务端API: http://%IP%:%SERVER_PORT%/api
echo.
echo 按任意键停止所有服务...
pause >nul

REM 清理进程
echo 正在停止服务...
for /f "tokens=5" %%p in ('netstat -aon ^| findstr ":%SERVER_PORT%"') do taskkill /PID %%p /F >nul 2>&1
for /f "tokens=5" %%p in ('netstat -aon ^| findstr ":%CLIENT_PORT%"') do taskkill /PID %%p /F >nul 2>&1
echo [OK] 服务已停止
