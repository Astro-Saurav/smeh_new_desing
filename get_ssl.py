from vps_config import get_vps_credentials
import paramiko
import sys

def get_ssl():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        vps_host, vps_user, vps_pass, _ = get_vps_credentials()
        client.connect(vps_host, username=vps_user, password=vps_pass)
        
        commands = [
            "apt-get update && apt-get install -y certbot python3-certbot-nginx",
            "certbot --nginx -d manavrachnatimes.com -d www.manavrachnatimes.com --non-interactive --agree-tos -m admin@manavrachnatimes.com --redirect"
        ]
        
        for cmd in commands:
            print(f"Executing: {cmd}")
            stdin, stdout, stderr = client.exec_command(cmd)
            exit_status = stdout.channel.recv_exit_status()
            print("STDOUT:", stdout.read().decode('utf-8'))
            print("STDERR:", stderr.read().decode('utf-8'))
            if exit_status != 0:
                print(f"Command failed with exit status {exit_status}")
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

get_ssl()
