import os
from pathlib import Path

def load_dotenv(env_path=None):
    """Simple parser to load key-value pairs from .env file into os.environ if not already set."""
    if env_path is None:
        env_path = Path(__file__).parent / ".env"
    else:
        env_path = Path(env_path)

    if not env_path.exists():
        return

    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, val = line.split("=", 1)
            key = key.strip()
            val = val.strip().strip("'\"")
            if key and key not in os.environ:
                os.environ[key] = val

# Load .env on import
load_dotenv()

def get_vps_credentials():
    """
    Returns (host, user, password, port) sourced strictly from environment or .env.
    Host can be specified as VPS_HOST (IP or hostname) or VPS_SSH_HOST (e.g. root@your_vps_ip).
    """
    raw_host = os.environ.get("VPS_HOST", "")
    user = os.environ.get("VPS_USER", "root")
    password = os.environ.get("VPS_PASSWORD", "")
    port = int(os.environ.get("VPS_PORT", 22))

    if "@" in raw_host:
        user_part, host_part = raw_host.split("@", 1)
        user = user_part or user
        host = host_part
    else:
        host = raw_host

    return host, user, password, port

def get_vps_host():
    host, _, _, _ = get_vps_credentials()
    return host

def get_vps_user():
    _, user, _, _ = get_vps_credentials()
    return user

def get_vps_password():
    _, _, password, _ = get_vps_credentials()
    return password

def get_vps_port():
    _, _, _, port = get_vps_credentials()
    return port
