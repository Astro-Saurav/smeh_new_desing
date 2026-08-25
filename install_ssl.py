from vps_config import get_vps_credentials
import paramiko
import sys

def install():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        vps_host, vps_user, vps_pass, _ = get_vps_credentials()
        client.connect(vps_host, username=vps_user, password=vps_pass)
        
        print("--- Installing Certbot ---")
        client.exec_command("apt-get update && apt-get install -y certbot python3-certbot-nginx")
        
        # We need to wait for installation
        # Or better yet, we can do it in a single bash script that blocks and waits.
        # But exec_command is non-blocking in paramiko unless we read stdout.
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

install()
