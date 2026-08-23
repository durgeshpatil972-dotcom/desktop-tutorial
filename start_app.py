import os
import sys
import subprocess
import time
import webbrowser

def main():
    print("=" * 70)
    print("      🚀 KISANSAGAR AI - SIH 2026 PROBLEM STATEMENT 5 🚀")
    print("  AI for Public Good: Inclusive Tech for Farmers & Coastal Fishermen")
    print("=" * 70)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")

    print("\n[1/3] Starting FastAPI Backend on http://localhost:8000 ...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
    backend_process = subprocess.Popen(backend_cmd, cwd=backend_dir)

    time.sleep(2)

    print("\n[2/3] Launching React Frontend Server on http://localhost:5173 ...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_cmd = [npm_cmd, "run", "dev", "--", "--host"]
    frontend_process = subprocess.Popen(frontend_cmd, cwd=frontend_dir)

    time.sleep(3)

    print("\n[3/3] Opening KisanSagar AI in your Web Browser...")
    webbrowser.open("http://localhost:5173")

    print("\n" + "=" * 70)
    print("  SUCCESS! KisanSagar AI is running live.")
    print("  • Frontend App: http://localhost:5173")
    print("  • API Docs (Swagger): http://localhost:8000/docs")
    print("  • Press Ctrl+C in this terminal window to stop servers.")
    print("=" * 70 + "\n")

    try:
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\nStopping KisanSagar AI services...")
        backend_process.terminate()
        frontend_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()
