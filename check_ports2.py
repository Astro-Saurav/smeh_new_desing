from vps_config import get_vps_credentials
import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    vps_host, vps_user, vps_pass, _ = get_vps_credentials()
    client.connect(vps_host, username=vps_user, password=vps_pass)
    stdin, stdout, stderr = client.exec_command('cat /root/smeh_new_desing/backend/.env')
    print("BACKEND ENV:\n", stdout.read().decode('utf-8'))
    stdin, stdout, stderr = client.exec_command('cat /root/smeh_new_desing/frontend/.env.local')
    print("FRONTEND ENV:\n", stdout.read().decode('utf-8'))
finally:
    client.close()
