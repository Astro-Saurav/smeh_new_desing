from vps_config import get_vps_credentials
import paramiko
import sys

vps_host, vps_user, vps_pass, _ = get_vps_credentials()
hostname = vps_host
username = "root"
password = vps_pass

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname, username=username, password=password)

commands = [
    "cd /root/smeh_new_desing && git fetch origin",
    "cd /root/smeh_new_desing && git reset --hard origin/main",
    "cd /root/smeh_new_desing && git clean -fd",
    "cd /root/smeh_new_desing/backend && npm install",
    "cd /root/smeh_new_desing/frontend && npm install",
    "cd /root/smeh_new_desing/frontend && npm run build",
    "pm2 restart all"
]


for cmd in commands:
    print(f"Executing: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    
    # Read stdout/stderr block until completion
    exit_status = stdout.channel.recv_exit_status()
    print("STDOUT:", stdout.read().decode('utf-8'))
    print("STDERR:", stderr.read().decode('utf-8'))
    print(f"Exit Status: {exit_status}\n")
    
    if exit_status != 0:
        print("Command failed. Exiting.")
        sys.exit(1)

client.close()
