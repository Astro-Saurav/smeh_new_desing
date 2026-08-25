from vps_config import get_vps_credentials
import paramiko
import sys

def run():
    vps_host, vps_user, vps_pass, _ = get_vps_credentials()
    hostname = vps_host
    username = 'root'
    password = vps_pass
    
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password)
    
    # We first checkout the file in case it was deleted
    command = 'cd ~/smeh_new_desing && git restore backend/fix-html-entities.js && cd backend && node fix-html-entities.js'
    stdin, stdout, stderr = ssh.exec_command(command)
    
    print("STDOUT:")
    print(stdout.read().decode('utf-8'))
    print("STDERR:")
    print(stderr.read().decode('utf-8'))
    
    ssh.close()

if __name__ == '__main__':
    run()
