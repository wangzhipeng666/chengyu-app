#!/bin/bash

# 成语学习助手 - 一键启动脚本
# 同时启动服务端和客户端，支持本地和IP访问

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER_DIR="$SCRIPT_DIR/server"
CLIENT_DIR="$SCRIPT_DIR/client"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取本机IP
get_ip() {
    ifconfig 2>/dev/null | grep -E "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1
}

IP=$(get_ip)
SERVER_PORT=4917
CLIENT_PORT=5832

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    成语学习助手 - 启动中...${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查依赖
check_deps() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}错误: 未找到 node，请先安装 Node.js${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js 已安装${NC}"
}

# 启动服务端
start_server() {
    echo -e "${YELLOW}正在启动服务端...${NC}"
    cd "$SERVER_DIR"

    # 检查是否已运行
    if lsof -ti:$SERVER_PORT &> /dev/null; then
        echo -e "${YELLOW}端口 $SERVER_PORT 已被占用，尝试关闭旧进程...${NC}"
        kill $(lsof -ti:$SERVER_PORT) 2>/dev/null
        sleep 1
    fi

    npm run dev &
    SERVER_PID=$!

    # 等待服务启动
    for i in {1..10}; do
        if curl -s http://localhost:$SERVER_PORT/api/health &> /dev/null; then
            echo -e "${GREEN}✓ 服务端启动成功${NC}"
            return 0
        fi
        sleep 1
    done

    echo -e "${RED}✗ 服务端启动失败${NC}"
    return 1
}

# 启动客户端
start_client() {
    echo -e "${YELLOW}正在启动客户端...${NC}"
    cd "$CLIENT_DIR"

    # 检查是否已运行
    if lsof -ti:$CLIENT_PORT &> /dev/null; then
        echo -e "${YELLOW}端口 $CLIENT_PORT 已被占用，尝试关闭旧进程...${NC}"
        kill $(lsof -ti:$CLIENT_PORT) 2>/dev/null
        sleep 1
    fi

    npm run dev &
    CLIENT_PID=$!

    # 等待服务启动
    for i in {1..10}; do
        if curl -s http://localhost:$CLIENT_PORT &> /dev/null; then
            echo -e "${GREEN}✓ 客户端启动成功${NC}"
            return 0
        fi
        sleep 1
    done

    echo -e "${RED}✗ 客户端启动失败${NC}"
    return 1
}

# 清理函数
cleanup() {
    echo ""
    echo -e "${YELLOW}正在停止服务...${NC}"
    [ ! -z "$SERVER_PID" ] && kill $SERVER_PID 2>/dev/null
    [ ! -z "$CLIENT_PID" ] && kill $CLIENT_PID 2>/dev/null

    # 关闭占用端口的进程
    lsof -ti:$SERVER_PORT | xargs kill 2>/dev/null
    lsof -ti:$CLIENT_PORT | xargs kill 2>/dev/null

    echo -e "${GREEN}✓ 服务已停止${NC}"
    exit 0
}

# 捕获退出信号
trap cleanup SIGINT SIGTERM

# 主流程
check_deps
start_server || exit 1
start_client || exit 1

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}    启动完成！${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "  本地访问: ${GREEN}http://localhost:$CLIENT_PORT${NC}"
echo -e "  IP 访问:  ${GREEN}http://$IP:$CLIENT_PORT${NC}"
echo ""
echo -e "  服务端API: ${YELLOW}http://$IP:$SERVER_PORT/api${NC}"
echo ""
echo -e "${YELLOW}按 Ctrl+C 停止所有服务${NC}"
echo ""

# 保持前台运行
wait
