from vps_config import get_vps_credentials
import paramiko
vps_host, vps_user, vps_pass, _ = get_vps_credentials()
hostname = vps_host
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname, username="root", password = vps_pass)
stdin, stdout, stderr = client.exec_command("cat /etc/nginx/sites-available/manavrachnatimes.com")
print(stdout.read().decode())
client.close()
