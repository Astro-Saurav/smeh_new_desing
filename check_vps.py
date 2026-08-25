from vps_config import get_vps_credentials
import paramiko

def check():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        vps_host, vps_user, vps_pass, _ = get_vps_credentials()
        client.connect(vps_host, username=vps_user, password=vps_pass)
        
        print("--- Checking project dir ---")
        stdin, stdout, stderr = client.exec_command("ls -la /root/smeh_new_desing")
        print(stdout.read().decode())
        
        print("--- Checking PM2 ---")
        stdin, stdout, stderr = client.exec_command("pm2 list")
        print(stdout.read().decode())
        
        print("--- Checking Nginx sites ---")
        stdin, stdout, stderr = client.exec_command("ls -la /etc/nginx/sites-enabled/")
        print(stdout.read().decode())
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

check()
