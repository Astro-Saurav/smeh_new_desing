from vps_config import get_vps_credentials
import paramiko
import sys

def run_cmd(cmd):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        vps_host, vps_user, vps_pass, _ = get_vps_credentials()
        client.connect(vps_host, username=vps_user, password=vps_pass)
        stdin, stdout, stderr = client.exec_command(cmd)
        print("STDOUT:")
        print(stdout.read().decode())
        print("STDERR:")
        print(stderr.read().decode())
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

run_cmd("uname -a; cat /etc/os-release; netstat -tulnp | grep -E ':(80|443) '")
