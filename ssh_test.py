import paramiko
import sys

def main():
    hostname = "187.127.156.106"
    username = "root"
    password = "ManavRachna@Admin1234"
    command = "pm2 logs mrt-backend --nostream --lines 100"

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname, username=username, password=password)

    stdin, stdout, stderr = client.exec_command(command)
    print("STDOUT:")
    print(stdout.read().decode('utf-8'))
    print("STDERR:")
    print(stderr.read().decode('utf-8'))
    client.close()

if __name__ == "__main__":
    main()
