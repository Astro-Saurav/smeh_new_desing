from vps_config import get_vps_credentials
import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
vps_host, vps_user, vps_pass, _ = get_vps_credentials()
client.connect(vps_host, username=vps_user, password=vps_pass)

stdin, stdout, stderr = client.exec_command("curl -s -X POST http://127.0.0.1:3000/api/v1/auth/login")
print("STDOUT:", stdout.read().decode('utf-8'))
print("STDERR:", stderr.read().decode('utf-8'))
client.close()
