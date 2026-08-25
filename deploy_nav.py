from vps_config import get_vps_credentials
import paramiko

def deploy():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        vps_host, vps_user, vps_pass, _ = get_vps_credentials()
        client.connect(vps_host, username=vps_user, password=vps_pass)
        sftp = client.open_sftp()
        
        local_path = "/home/astro/Documents/code/smeh_new_desing/frontend/src/components/site/header.tsx"
        remote_path = "/root/smeh_new_desing/frontend/src/components/site/header.tsx"
        
        print(f"Uploading {local_path} to {remote_path}...")
        sftp.put(local_path, remote_path)
        sftp.close()
        
        cmd = "cd /root/smeh_new_desing/frontend && npm run build && pm2 restart mrt-frontend"
        print(f"Executing: {cmd}")
        stdin, stdout, stderr = client.exec_command(cmd)
        
        exit_status = stdout.channel.recv_exit_status()
        print("STDOUT:", stdout.read().decode('utf-8'))
        print("STDERR:", stderr.read().decode('utf-8'))
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

deploy()
