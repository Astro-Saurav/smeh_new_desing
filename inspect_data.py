from vps_config import get_vps_credentials
import paramiko

def run():
    vps_host, vps_user, vps_pass, _ = get_vps_credentials()
    hostname = vps_host
    username = 'root'
    password = vps_pass
    
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
