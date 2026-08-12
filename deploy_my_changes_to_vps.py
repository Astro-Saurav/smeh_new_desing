import paramiko
import os

hostname = "187.127.156.106"
username = "root"
password = "ManavRachna@Admin1234"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname, username=username, password=password)

sftp = client.open_sftp()

def upload(local, remote):
    print(f"Uploading {local} to {remote}...")
    sftp.put(local, remote)

upload("/home/astro/Documents/code/smeh_new_desing/backend/script.js", "/root/smeh_new_desing/backend/script.js")
upload("/home/astro/Documents/code/smeh_new_desing/frontend/src/app/page.tsx", "/root/smeh_new_desing/frontend/src/app/page.tsx")
upload("/home/astro/Documents/code/smeh_new_desing/frontend/src/lib/routes.ts", "/root/smeh_new_desing/frontend/src/lib/routes.ts")

sftp.close()

commands = [
    "cd /root/smeh_new_desing/backend && node script.js",
    "cd /root/smeh_new_desing/frontend && npm run build && pm2 restart mrt-frontend"
]

for cmd in commands:
    print(f"Executing: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    
    exit_status = stdout.channel.recv_exit_status()
    print("STDOUT:", stdout.read().decode('utf-8'))
    print("STDERR:", stderr.read().decode('utf-8'))
    print(f"Exit Status: {exit_status}\n")

client.close()
