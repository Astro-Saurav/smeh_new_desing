from vps_config import get_vps_credentials
import paramiko

vps_host, vps_user, vps_pass, _ = get_vps_credentials()
hostname = vps_host
username = "root"
password = vps_pass

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname, username=username, password=password)

stdin, stdout, stderr = client.exec_command('ls -l /etc/nginx/sites-enabled/')
print(stdout.read().decode())

client.close()
