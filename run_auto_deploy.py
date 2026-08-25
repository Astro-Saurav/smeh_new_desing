from vps_config import get_vps_credentials
import paramiko
import os

vps_host, vps_user, vps_pass, _ = get_vps_credentials()
hostname = vps_host
username = "root"
password = vps_pass

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname, username=username, password=password)

cmd = "cd /root/smeh_new_desing && ./auto_deploy.sh --force"
print(f"Executing: {cmd}")
stdin, stdout, stderr = client.exec_command(cmd)
    
exit_status = stdout.channel.recv_exit_status()
print("STDOUT:", stdout.read().decode('utf-8'))
print("STDERR:", stderr.read().decode('utf-8'))
print(f"Exit Status: {exit_status}\n")

client.close()
