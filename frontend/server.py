from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser
import threading
import time

class CustomHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)

def start_server():
    server_address = ('', 3000)
    httpd = HTTPServer(server_address, CustomHandler)
    print("Frontend server running at http://localhost:3000")
    print("Press Ctrl+C to stop the server")
    httpd.serve_forever()

if __name__ == '__main__':
    # Start server in a separate thread
    server_thread = threading.Thread(target=start_server)
    server_thread.daemon = True
    server_thread.start()
    
    # Open browser after a short delay
    time.sleep(1)
    webbrowser.open('http://localhost:3000')
    
    # Keep the main thread alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nServer stopped")
