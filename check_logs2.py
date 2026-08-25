from vps_config import get_vps_credentials
import paramiko
import sys

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    vps_host, vps_user, vps_pass, _ = get_vps_credentials()
    client.connect(vps_host, username=vps_user, password=vps_pass)
    stdin, stdout, stderr = client.exec_command('pm2 logs --lines 500 --nostream | grep -i -E "error|500|login"')
    print(stdout.read().decode('utf-8'))
    print(stderr.read().decode('utf-8'))
finally:
    client.close()
