from vps_config import get_vps_credentials
import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
vps_host, vps_user, vps_pass, _ = get_vps_credentials()
client.connect(vps_host, username=vps_user, password=vps_pass)
stdin, stdout, stderr = client.exec_command("cd /root/smeh_new_desing && ./maintenance.sh")
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())
client.close()
