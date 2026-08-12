import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect("187.127.156.106", username="root", password="ManavRachna@Admin1234")

stdin, stdout, stderr = client.exec_command("curl -s -X POST http://127.0.0.1:3000/api/v1/auth/login")
print("STDOUT:", stdout.read().decode('utf-8'))
print("STDERR:", stderr.read().decode('utf-8'))
client.close()
