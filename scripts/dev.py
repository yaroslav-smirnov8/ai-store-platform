import subprocess
import os
import signal
import sys
import asyncio
import time
import logging
from dotenv import load_dotenv
import argparse
from typing import Dict, Optional, Any
import aiohttp
import json

# Setup logging
parser = argparse.ArgumentParser()
parser.add_argument('--debug', action='store_true', help='Enable debug logging')
args = parser.parse_args()

logging.basicConfig(
    level=logging.DEBUG if args.debug else logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class AIStoreDevEnvironment:
    def __init__(self):
        # Initialize process handlers
        self.backend_process = None
        self.frontend_process = None
        self.backend_tunnel_process = None
        self.frontend_tunnel_process = None
        self.docker_compose_process = None

        # Setup paths
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        self.project_root = os.path.abspath(os.path.join(self.script_dir, '..'))
        self.backend_path = os.path.join(self.project_root, 'backend')
        self.frontend_path = os.path.join(self.project_root, 'frontend')

        # Port configuration
        self.backend_port = int(os.getenv('BACKEND_PORT', '8000'))
        self.frontend_port = int(os.getenv('FRONTEND_PORT', '3000'))
        self.postgres_port = int(os.getenv('POSTGRES_PORT', '5432'))
        self.redis_port = int(os.getenv('REDIS_PORT', '6379'))

        # Tuna configuration
        self.subdomain = os.getenv('TUNA_SUBDOMAIN', 'aistore-dev')
        self.backend_subdomain = f"{self.subdomain}-api"
        self.frontend_subdomain = self.subdomain

        # URLs
        self.backend_url = None
        self.frontend_url = None

        # State tracking
        self.is_running = False
        self.health_check_interval = 30

        # Validate configuration
        self._log_configuration()

    def _log_configuration(self):
        """Log current configuration"""
        logger.info("AI Store Development Environment Configuration:")
        logger.info(f"Project root: {self.project_root}")
        logger.info(f"Backend path: {self.backend_path}")
        logger.info(f"Frontend path: {self.frontend_path}")
        logger.info(f"Backend port: {self.backend_port}")
        logger.info(f"Frontend port: {self.frontend_port}")
        logger.info(f"Tuna subdomain: {self.subdomain}")

    async def check_port_available(self, port: int) -> bool:
        """Check if port is available"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f'http://localhost:{port}', timeout=aiohttp.ClientTimeout(total=2)) as response:
                    return False
        except:
            return True

    async def kill_process_on_port(self, port: int) -> bool:
        """Kill process running on specified port (Windows)"""
        try:
            process = await asyncio.create_subprocess_shell(
                f'netstat -ano | findstr :{port}',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()

            if stdout:
                for line in stdout.decode().split('\n'):
                    if f':{port}' in line and 'LISTENING' in line:
                        parts = line.strip().split()
                        if parts:
                            pid = parts[-1]
                            kill_process = await asyncio.create_subprocess_shell(
                                f'taskkill /F /PID {pid}',
                                stdout=asyncio.subprocess.PIPE,
                                stderr=asyncio.subprocess.PIPE
                            )
                            await kill_process.communicate()
                            logger.info(f"Killed process {pid} on port {port}")
                            return True
            return False

        except Exception as e:
            logger.error(f"Error killing process on port {port}: {str(e)}")
            return False

    async def cleanup_existing_tunnels(self):
        """Clean up any existing Tuna tunnels"""
        logger.info("🧹 Cleaning up existing tunnels...")
        try:
            # Stop all tuna processes
            process = await asyncio.create_subprocess_shell(
                'taskkill /F /IM tuna.exe',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            await process.communicate()

            # Stop tuna service
            process = await asyncio.create_subprocess_shell(
                'tuna stop',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            await process.communicate()

            await asyncio.sleep(2)
            logger.info("✅ Existing tunnels cleaned up")
            return True

        except Exception as e:
            logger.error(f"Error cleaning up tunnels: {str(e)}")
            return False

    async def check_local_services(self) -> bool:
        """Check if local PostgreSQL and Redis are running"""
        logger.info("💾 Checking local PostgreSQL and Redis services...")
        
        # Check PostgreSQL
        try:
            pg_check = await asyncio.create_subprocess_shell(
                'pg_isready -h localhost -p 5432',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await pg_check.communicate()
            
            if pg_check.returncode == 0:
                logger.info("✅ PostgreSQL is running")
            else:
                logger.warning("⚠️ PostgreSQL might not be running, but continuing...")
        except:
            logger.warning("⚠️ Could not check PostgreSQL status, but continuing...")

        # Check Redis
        try:
            redis_check = await asyncio.create_subprocess_shell(
                'redis-cli ping',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await redis_check.communicate()
            
            if redis_check.returncode == 0 and b'PONG' in stdout:
                logger.info("✅ Redis is running")
            else:
                logger.warning("⚠️ Redis might not be running, but continuing...")
        except:
            logger.warning("⚠️ Could not check Redis status, but continuing...")

        logger.info("✅ Local services check completed")
        return True

    async def start_backend(self) -> bool:
        """Start FastAPI backend"""
        logger.info("🚀 Starting FastAPI backend...")
        try:
            # Check if port is available
            if not await self.check_port_available(self.backend_port):
                logger.warning(f"Port {self.backend_port} is already in use, attempting to kill process...")
                if await self.kill_process_on_port(self.backend_port):
                    await asyncio.sleep(2)
                else:
                    logger.error(f"Port {self.backend_port} is already in use")
                    return False

            # Check if virtual environment exists
            venv_path = os.path.join(self.backend_path, 'venv')
            if not os.path.exists(venv_path):
                logger.error("Virtual environment not found. Run scripts\\setup.bat first.")
                return False

            # Start backend with virtual environment
            python_exe = os.path.join(venv_path, 'Scripts', 'python.exe')
            logger.info(f"Starting backend with: {python_exe}")
            logger.info(f"Working directory: {self.backend_path}")
            
            self.backend_process = await asyncio.create_subprocess_exec(
                python_exe, '-m', 'uvicorn', 'main:app', 
                '--host', '127.0.0.1', '--port', str(self.backend_port), '--reload',
                cwd=self.backend_path,
                stdout=None,
                stderr=None
            )

            # Wait for backend to be ready
            for i in range(30):  # 60 seconds timeout
                # Check if process is still running
                if self.backend_process.returncode is not None:
                    logger.error(f"Backend process exited with code {self.backend_process.returncode}")
                    return False
                
                try:
                    async with aiohttp.ClientSession() as session:
                        async with session.get(f'http://127.0.0.1:{self.backend_port}/', timeout=3) as response:
                            if response.status in [200, 404, 422]:
                                logger.info("✅ Backend is ready")
                                return True
                except Exception as e:
                    if i % 10 == 0:  # Log every 20 seconds
                        logger.info(f"Waiting for backend... ({i*2}s)")
                    
                await asyncio.sleep(2)

            logger.error("Backend server did not start in time (60s timeout)")
            return False

        except Exception as e:
            logger.error(f"❌ Backend error: {str(e)}")
            return False

    async def start_frontend(self) -> bool:
        """Start React frontend"""
        logger.info("⚛️ Starting React frontend...")
        try:
            # Check if port is available
            if not await self.check_port_available(self.frontend_port):
                logger.warning(f"Port {self.frontend_port} is already in use, attempting to kill process...")
                if await self.kill_process_on_port(self.frontend_port):
                    await asyncio.sleep(2)
                else:
                    logger.error(f"Port {self.frontend_port} is already in use")
                    return False

            # Check if node_modules exists
            node_modules = os.path.join(self.frontend_path, 'node_modules')
            if not os.path.exists(node_modules):
                logger.error("node_modules not found. Run scripts\\setup.bat first.")
                return False

            # Start frontend
            self.frontend_process = await asyncio.create_subprocess_shell(
                'npm start',
                cwd=self.frontend_path,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            # Wait for startup
            for _ in range(30):
                await asyncio.sleep(1)
                if self.frontend_process.returncode is not None:
                    stderr = await self.frontend_process.stderr.read()
                    logger.error(f"Frontend process failed: {stderr.decode()}")
            # Wait for startup and capture output
            for i in range(15):
                try:
                    async with aiohttp.ClientSession() as session:
                        async with session.get(f'http://localhost:{self.frontend_port}') as response:
                            if response.status == 200:
                                logger.info("✅ Frontend is ready")
                                return True
                except:
                    pass
                
                # Check if process is still running
                if self.frontend_process.returncode is not None:
                    try:
                        stdout, stderr = await self.frontend_process.communicate()
                        logger.error(f"Frontend process exited with code {self.frontend_process.returncode}")
                        if stdout:
                            logger.error(f"Frontend stdout: {stdout.decode()}")
                        if stderr:
                            logger.error(f"Frontend stderr: {stderr.decode()}")
                    except:
                        # Process already terminated, try to read available output
                        if self.frontend_process.stdout:
                            stdout = await self.frontend_process.stdout.read()
                            if stdout:
                                logger.error(f"Frontend stdout: {stdout.decode()}")
                        if self.frontend_process.stderr:
                            stderr = await self.frontend_process.stderr.read()
                            if stderr:
                                logger.error(f"Frontend stderr: {stderr.decode()}")
                    return False
                    
                await asyncio.sleep(2)

            logger.error("Frontend server did not start in time")
            return False

        except Exception as e:
            logger.error(f"❌ Frontend error: {str(e)}")
            return False

    async def setup_tunnels(self) -> bool:
        """Establish HTTP tunnels via Tuna"""
        logger.info("🌐 Setting up Tuna tunnels...")

        try:
            await self.cleanup_existing_tunnels()

            # Backend tunnel
            backend_cmd = f"tuna http localhost:{self.backend_port} --subdomain={self.backend_subdomain}"
            logger.info(f"Starting backend tunnel: {backend_cmd}")
            
            self.backend_tunnel_process = await asyncio.create_subprocess_shell(
                backend_cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            # Wait for backend tunnel
            backend_established = False
            for _ in range(30):
                if self.backend_tunnel_process.stderr:
                    line = await self.backend_tunnel_process.stderr.readline()
                    text = line.decode('utf-8', errors='replace').strip()
                    if text:
                        logger.info(f"Tuna backend: {text}")
                        if f"Forwarding https://{self.backend_subdomain}.ru.tuna.am" in text:
                            self.backend_url = f"https://{self.backend_subdomain}.ru.tuna.am"
                            backend_established = True
                            break
                await asyncio.sleep(1)

            if not backend_established:
                logger.error("Backend tunnel failed to establish")
                return False

            await asyncio.sleep(3)

            # Frontend tunnel
            frontend_cmd = f"tuna http localhost:{self.frontend_port} --subdomain={self.frontend_subdomain}"
            logger.info(f"Starting frontend tunnel: {frontend_cmd}")
            
            self.frontend_tunnel_process = await asyncio.create_subprocess_shell(
                frontend_cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            # Wait for frontend tunnel
            frontend_established = False
            for _ in range(30):
                if self.frontend_tunnel_process.stderr:
                    line = await self.frontend_tunnel_process.stderr.readline()
                    text = line.decode('utf-8', errors='replace').strip()
                    if text:
                        logger.info(f"Tuna frontend: {text}")
                        if f"Forwarding https://{self.frontend_subdomain}.ru.tuna.am" in text:
                            self.frontend_url = f"https://{self.frontend_subdomain}.ru.tuna.am"
                            frontend_established = True
                            break
                await asyncio.sleep(1)

            if backend_established and frontend_established:
                await self._update_env_files()
                logger.info("✅ Tuna tunnels established successfully")
                logger.info(f"🌐 Frontend: {self.frontend_url}")
                logger.info(f"🔧 Backend API: {self.backend_url}")
                return True
            else:
                logger.error("❌ Failed to establish tunnels")
                return False

        except Exception as e:
            logger.error(f"❌ Tunnel error: {str(e)}")
            return False

    async def _update_env_files(self):
        """Update environment files with tunnel URLs"""
        try:
            # Update backend .env
            backend_env_path = os.path.join(self.backend_path, '.env')
            if os.path.exists(backend_env_path):
                with open(backend_env_path, 'r') as f:
                    lines = f.readlines()

                updated_lines = []
                webhook_updated = False
                
                for line in lines:
                    if line.startswith('YOOKASSA_WEBHOOK_URL='):
                        updated_lines.append(f'YOOKASSA_WEBHOOK_URL={self.backend_url}/api/payments/webhook\n')
                        webhook_updated = True
                    else:
                        updated_lines.append(line)

                if not webhook_updated:
                    updated_lines.append(f'YOOKASSA_WEBHOOK_URL={self.backend_url}/api/payments/webhook\n')

                with open(backend_env_path, 'w') as f:
                    f.writelines(updated_lines)

            # Update frontend .env
            frontend_env_path = os.path.join(self.frontend_path, '.env')
            if os.path.exists(frontend_env_path):
                with open(frontend_env_path, 'r') as f:
                    lines = f.readlines()

                updated_lines = []
                api_url_updated = False
                
                for line in lines:
                    if line.startswith('REACT_APP_API_URL='):
                        updated_lines.append(f'REACT_APP_API_URL={self.backend_url}\n')
                        api_url_updated = True
                    else:
                        updated_lines.append(line)

                if not api_url_updated:
                    updated_lines.append(f'REACT_APP_API_URL={self.backend_url}\n')

                with open(frontend_env_path, 'w') as f:
                    f.writelines(updated_lines)

            logger.info("✅ Environment files updated with tunnel URLs")

        except Exception as e:
            logger.error(f"❌ Failed to update environment files: {str(e)}")

    async def health_check(self) -> bool:
        """Perform health check on all services"""
        try:
            # Check processes
            processes = [
                ("Backend", self.backend_process),
                ("Frontend", self.frontend_process),
                ("Backend Tunnel", self.backend_tunnel_process),
                ("Frontend Tunnel", self.frontend_tunnel_process)
            ]

            for name, process in processes:
                if process and process.returncode is not None:
                    logger.error(f"{name} process died")
                    return False

            # Check backend health
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(f'http://localhost:{self.backend_port}/health', timeout=aiohttp.ClientTimeout(total=5)) as response:
                        if response.status != 200:
                            logger.error("Backend health check failed")
                            return False
            except Exception as e:
                logger.error(f"Backend connection error: {str(e)}")
                return False

            # Check frontend health
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(f'http://localhost:{self.frontend_port}', timeout=aiohttp.ClientTimeout(total=5)) as response:
                        if response.status != 200:
                            logger.error("Frontend health check failed")
                            return False
            except Exception as e:
                logger.error(f"Frontend connection error: {str(e)}")
                return False

            return True
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return False

    async def monitor_processes(self):
        """Monitor all running processes"""
        logger.info("🔍 Starting process monitor...")
        self.is_running = True
        try:
            while self.is_running:
                if not await self.health_check():
                    logger.error("Health check failed")
                    break
                await asyncio.sleep(self.health_check_interval)
        except asyncio.CancelledError:
            logger.info("🔴 Process monitoring stopped")
        finally:
            self.is_running = False

    async def cleanup(self):
        """Clean up all processes"""
        logger.info("\n🧹 Cleaning up processes...")
        self.is_running = False

        try:
            # Clean up tunnels first
            await self.cleanup_existing_tunnels()

            # Stop processes
            processes = [
                ("Backend", self.backend_process),
                ("Frontend", self.frontend_process),
                ("Backend Tunnel", self.backend_tunnel_process),
                ("Frontend Tunnel", self.frontend_tunnel_process)
            ]

            for name, process in processes:
                if process:
                    logger.info(f"Stopping {name} process...")
                    try:
                        if process.returncode is None:
                            process.terminate()
                            try:
                                await asyncio.wait_for(process.wait(), timeout=5.0)
                            except asyncio.TimeoutError:
                                logger.warning(f"{name} process did not terminate, killing...")
                                process.kill()
                                await asyncio.wait_for(process.wait(), timeout=2.0)
                    except Exception as e:
                        logger.error(f"Error stopping {name} process: {str(e)}")

            # Stop Docker services
            if self.docker_compose_process:
                logger.info("Stopping Docker services...")
                stop_process = await asyncio.create_subprocess_shell(
                    'docker-compose down',
                    cwd=self.project_root,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                await stop_process.communicate()

            logger.info("✅ Cleanup complete")
        except Exception as e:
            logger.error(f"Error during cleanup: {str(e)}")

    async def start(self):
        """Main entry point"""
        try:
            logger.info("🚦 Starting AI Store development environment")

            # Check local services
            if not await self.check_local_services():
                logger.error("❌ Critical error: Local services check failed")
                await self.cleanup()
                return


            if not await self.start_backend():
                raise Exception("Backend failed to start")

            if not await self.start_frontend():
                raise Exception("Frontend failed to start")

            if not await self.setup_tunnels():
                raise Exception("Tunnel setup failed")

            logger.info("\n🎉 AI Store development environment ready!")
            logger.info(f"🌐 Frontend: {self.frontend_url}")
            logger.info(f"🔧 Backend API: {self.backend_url}")
            logger.info(f"📚 API Docs: {self.backend_url}/docs")
            logger.info(f"📊 Admin Panel: {self.frontend_url}/admin/login")
            logger.info("\n⚠️ Update your Telegram bot webhook URL:")
            logger.info(f"   Webhook URL: {self.backend_url}/api/payments/webhook")
            logger.info("\nPress Ctrl+C to exit")

            await self.monitor_processes()

        except asyncio.CancelledError:
            logger.info("Startup process cancelled")
            raise
        except Exception as e:
            logger.error(f"❌ Critical error: {str(e)}")
        finally:
            await self.cleanup()


if __name__ == "__main__":
    dev_env = AIStoreDevEnvironment()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    async def main():
        try:
            await dev_env.start()
        except asyncio.CancelledError:
            logger.info("Main task cancelled")
        except Exception as e:
            logger.error(f"🔥 Fatal error: {str(e)}")
        finally:
            await dev_env.cleanup()

    def signal_handler(sig, frame):
        logger.info("\n👋 Shutting down...")
        for task in asyncio.all_tasks(loop):
            task.cancel()

    signal.signal(signal.SIGINT, signal_handler)

    try:
        loop.run_until_complete(main())
    except KeyboardInterrupt:
        logger.info("Keyboard interrupt received")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
    finally:
        try:
            pending = asyncio.all_tasks(loop)
            for task in pending:
                task.cancel()

            if pending:
                loop.run_until_complete(asyncio.wait(pending, timeout=5))
        finally:
            loop.close()
