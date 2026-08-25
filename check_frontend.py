from vps_config import get_vps_credentials
import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    vps_host, vps_user, vps_pass, _ = get_vps_credentials()
    client.connect(vps_host, username=vps_user, password=vps_pass)
    stdin, stdout, stderr = client.exec_command('ls -la /root/smeh_new_desing/frontend/')
    print("STDOUT:", stdout.read().decode('utf-8'))
    print("STDERR:", stderr.read().decode('utf-8'))
finally:
    client.close()
