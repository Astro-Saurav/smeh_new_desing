import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.156.106', username='root', password='ManavRachna@Admin1234')

stdin, stdout, stderr = ssh.exec_command('pm2 logs --lines 20 --nostream')
print(stdout.read().decode())
print(stderr.read().decode())

ssh.close()
