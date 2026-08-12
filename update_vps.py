import paramiko
import os

hostname = "187.127.156.106"
username = "root"
password = "ManavRachna@Admin1234"
remote_file = "/root/smeh_new_desing/frontend/next.config.ts"
local_file = "/home/astro/Documents/code/smeh_new_desing/frontend/next.config.ts"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname, username=username, password=password)

# SFTP upload
print("Uploading next.config.ts...")
sftp = client.open_sftp()
sftp.put(local_file, remote_file)
sftp.close()

# Execute build and restart
print("Building and restarting frontend...")
commands = [
    "cd /root/smeh_new_desing/frontend && npm run build",
    "pm2 restart mrt-frontend"
]

for cmd in commands:
    print(f"Executing: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    
    # Read stdout/stderr block until completion
    exit_status = stdout.channel.recv_exit_status()
    print("STDOUT:", stdout.read().decode('utf-8'))
    print("STDERR:", stderr.read().decode('utf-8'))
    print(f"Exit Status: {exit_status}\n")

client.close()
