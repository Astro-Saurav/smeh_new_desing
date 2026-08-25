from vps_config import get_vps_credentials
import paramiko

def check():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        vps_host, vps_user, vps_pass, _ = get_vps_credentials()
        client.connect(vps_host, username=vps_user, password=vps_pass)
        
        print("--- Testing localhost ---")
        stdin, stdout, stderr = client.exec_command("curl -I http://127.0.0.1")
        print(stdout.read().decode())
        
        print("--- Checking iptables/ufw ---")
        stdin, stdout, stderr = client.exec_command("ufw status")
        print(stdout.read().decode())
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

check()
