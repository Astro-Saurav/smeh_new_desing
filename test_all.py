from vps_config import get_vps_credentials
import paramiko
import requests
import time
import os

def run_tests():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        print("Connecting to VPS...")
        vps_host, vps_user, vps_pass, _ = get_vps_credentials()
        client.connect(vps_host, username=vps_user, password=vps_pass)
        
        print("--- 0. Uploading scripts to VPS ---")
        sftp = client.open_sftp()
        sftp.put('/home/astro/Documents/code/smeh_new_desing/maintenance.sh', '/root/smeh_new_desing/maintenance.sh')
        sftp.put('/home/astro/Documents/code/smeh_new_desing/auto_deploy.sh', '/root/smeh_new_desing/auto_deploy.sh')
        sftp.close()
        client.exec_command("chmod +x /root/smeh_new_desing/maintenance.sh /root/smeh_new_desing/auto_deploy.sh")
        print("Uploaded and made executable.")

        print("--- 1. Triggering maintenance mode ---")
        stdin, stdout, stderr = client.exec_command("cd /root/smeh_new_desing && ./maintenance.sh")
        print(stdout.read().decode())
        
        print("--- 2. Checking website status ---")
        time.sleep(2)
        try:
            r = requests.get('https://manavrachnatimes.com', timeout=5)
            print(f"Status Code: {r.status_code}")
            if r.status_code == 503:
                print("503 Maintenance page is active!")
            else:
                print("Content:", r.text[:200])
        except Exception as e:
            print("Failed to fetch page:", e)
            
        print("--- 3. Testing auto_deploy.sh without force ---")
        stdin, stdout, stderr = client.exec_command("cd /root/smeh_new_desing && ./auto_deploy.sh")
        out = stdout.read().decode()
        print(out)
        if "Auto deployment is suspended." in out:
            print("SUCCESS: auto_deploy.sh correctly skipped!")
            
        print("--- 4. Testing auto_deploy.sh with force ---")
        stdin, stdout, stderr = client.exec_command("cd /root/smeh_new_desing && ./auto_deploy.sh --force")
        out = stdout.read().decode()
        print(out)
        if "Manual forced run detected" in out:
            print("SUCCESS: auto_deploy.sh correctly bypassed maintenance!")
            
        print("--- 5. Checking website status after recovery ---")
        time.sleep(2)
        try:
            r = requests.get('https://manavrachnatimes.com', timeout=5)
            print(f"Status Code: {r.status_code}")
            if r.status_code == 200:
                print("200 OK! Website recovered.")
        except Exception as e:
            print("Failed to fetch page:", e)

    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    run_tests()
