import paramiko

def run():
    hostname = '187.127.156.106'
    username = 'root'
    password = 'ManavRachna@Admin1234'
    
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password)
    
    command = """cd ~/smeh_new_desing/backend && node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.news.findMany({ take: 5 }).then(n => {
  console.log(JSON.stringify(n, null, 2));
  process.exit(0);
}).catch(console.error);
" """
    stdin, stdout, stderr = ssh.exec_command(command)
    
    print("STDOUT:")
    print(stdout.read().decode('utf-8'))
    print("STDERR:")
    print(stderr.read().decode('utf-8'))
    
    ssh.close()

if __name__ == '__main__':
    run()
