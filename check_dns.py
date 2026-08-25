from vps_config import get_vps_credentials
import paramiko
import sys

def check():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        vps_host, vps_user, vps_pass, _ = get_vps_credentials()
        client.connect(vps_host, username=vps_user, password=vps_pass)
        # Check if the domain resolves to the server's IP from an external perspective
        # By pinging it from the server itself. (If it resolves, DNS is propagating)
        stdin, stdout, stderr = client.exec_command("ping -c 1 manavrachnatimes.com")
        print(stdout.read().decode())
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

check()
