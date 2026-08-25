from vps_config import get_vps_credentials
import paramiko

def main():
    vps_host, vps_user, vps_pass, _ = get_vps_credentials()
    hostname = vps_host
    username = "root"
    password = vps_pass
    command = "pm2 list"

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname, username=username, password=password)

    stdin, stdout, stderr = client.exec_command(command)
    print(stdout.read().decode('utf-8'))
    client.close()

if __name__ == "__main__":
    main()
