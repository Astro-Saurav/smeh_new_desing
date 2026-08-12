import paramiko

def main():
    hostname = "187.127.156.106"
    username = "root"
    password = "ManavRachna@Admin1234"
    command = "pm2 list"

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname, username=username, password=password)

    stdin, stdout, stderr = client.exec_command(command)
    print(stdout.read().decode('utf-8'))
    client.close()

if __name__ == "__main__":
    main()
