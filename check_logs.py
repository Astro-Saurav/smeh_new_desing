import paramiko
import sys

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    client.connect('187.127.156.106', username='root', password='ManavRachna@Admin1234')
    stdin, stdout, stderr = client.exec_command('pm2 logs --lines 100 --nostream')
    print(stdout.read().decode('utf-8'))
    print(stderr.read().decode('utf-8'))
finally:
    client.close()
