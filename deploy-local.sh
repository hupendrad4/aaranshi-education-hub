#!/bin/bash

# Aaranshi Education Hub - Local Deployment Script
# Deploys website locally on port 3002

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     Aaranshi Education Hub - Local Deployment               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Set the directory
PROJECT_DIR="/home/aumni/Hupendra/Hupendra Work/aaranshi-education-hub"
cd "$PROJECT_DIR" || exit 1

# Kill existing processes
echo "🔄 Stopping existing servers..."
pkill -f "node.*server/index.js" 2>/dev/null
pkill -f "python.*http.server" 2>/dev/null
pkill -f "python.*SimpleHTTPServer" 2>/dev/null
sleep 2

# Check if Node.js is available
if command -v node &> /dev/null; then
    echo "✅ Node.js found"
    echo "🚀 Starting Node.js backend server on port 3002..."

    # Start Node.js server
    PORT=3002 NODE_ENV=development nohup node server/index.js > logs/server.log 2>&1 &
    NODE_PID=$!
    echo "   Backend PID: $NODE_PID"
    sleep 3

    # Check if server started
    if ps -p $NODE_PID > /dev/null; then
        echo "✅ Backend server started successfully"
        echo "   API: http://localhost:3002"
        echo "   Health Check: http://localhost:3002/api/health"
    else
        echo "⚠️  Backend server failed to start. Check logs/server.log"
    fi
else
    echo "⚠️  Node.js not found. Backend API will not be available."
fi

# Start Python HTTP server for frontend
echo ""
echo "🌐 Starting frontend HTTP server on port 3002..."

if command -v python3 &> /dev/null; then
    # Use Python 3
    cd "$PROJECT_DIR"
    python3 -m http.server 3002 > /dev/null 2>&1 &
    HTTP_PID=$!
    echo "   Frontend PID: $HTTP_PID"
    echo "✅ Frontend server started (Python 3)"
elif command -v python &> /dev/null; then
    # Use Python 2
    cd "$PROJECT_DIR"
    python -m SimpleHTTPServer 3002 > /dev/null 2>&1 &
    HTTP_PID=$!
    echo "   Frontend PID: $HTTP_PID"
    echo "✅ Frontend server started (Python 2)"
else
    echo "⚠️  Python not found. Please install Python or use a browser extension."
    echo "   You can still open index.html directly in your browser."
fi

sleep 2

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    Deployment Complete                       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📱 Access Your Website:"
echo "   🌐 Homepage:     http://localhost:3002/index.html"
echo "   📝 About:        http://localhost:3002/about.html"
echo "   📚 Courses:      http://localhost:3002/courses.html"
echo "   📞 Contact:      http://localhost:3002/contact.html"
echo "   👨‍🏫 Teachers:     http://localhost:3002/teachers.html"
echo "   📅 Events:       http://localhost:3002/events.html"
echo "   💬 Testimonials: http://localhost:3002/testimonials.html"
echo "   📝 Register:     http://localhost:3002/register.html"
echo "   🖼️  Gallery:      http://localhost:3002/gallery.html"
echo "   📰 Blog:         http://localhost:3002/blog.html"
echo ""
echo "🔧 API Endpoints:"
echo "   ✓ Health:        http://localhost:3002/api/health"
echo "   ✓ Register:      http://localhost:3002/api/register"
echo ""
echo "📊 To view logs:"
echo "   tail -f logs/server.log"
echo ""
echo "🛑 To stop servers:"
echo "   pkill -f 'node.*server/index.js'"
echo "   pkill -f 'python.*http.server'"
echo ""
echo "✨ Enjoy your modern education website!"
echo ""

