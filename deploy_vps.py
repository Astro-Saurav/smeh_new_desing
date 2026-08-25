from vps_config import get_vps_credentials
import paramiko
import sys

def deploy_on_vps():
    vps_host, vps_user, vps_pass, _ = get_vps_credentials()
    hostname = vps_host
    username = 'root'
    password = vps_pass
    
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print(f"Connecting to {hostname}...")
        ssh.connect(hostname, username=username, password=password)
        
        # Remove untracked files and Run the deployment script
        command = 'cd ~/smeh_new_desing && rm -f backend/fix-html-entities.js && git clean -fd && ./auto_deploy.sh'
        print(f"Executing command: {command}")
        stdin, stdout, stderr = ssh.exec_command(command)
        
        # Print output in real-time if possible, or wait and print
        exit_status = stdout.channel.recv_exit_status()
        out = stdout.read().decode('utf-8')
        err = stderr.read().decode('utf-8')
        
        print("STDOUT:")
        print(out)
        
        if err:
            print("STDERR:")
            print(err)
            
        print(f"Exit status: {exit_status}")
        
    except Exception as e:
        print(f"Error connecting or executing command: {e}")
    finally:
        ssh.close()

if __name__ == '__main__':
    deploy_on_vps()
