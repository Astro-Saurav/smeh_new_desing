from vps_config import get_vps_credentials
import paramiko

def fix_vps():
    vps_host, vps_user, vps_pass, _ = get_vps_credentials()
    hostname = vps_host
    username = 'root'
    password = vps_pass
    
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(hostname, username=username, password=password)
        command = '''
        echo "PORT=8081" >> /root/smeh_new_desing/backend/.env
        cd /root/smeh_new_desing/backend && pm2 restart mrt-backend
        sleep 2
        curl -sS http://localhost:3000/api/v1/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"wrong"}'
        '''
        stdin, stdout, stderr = ssh.exec_command(command)
        print("STDOUT:")
        print(stdout.read().decode('utf-8'))
        err = stderr.read().decode('utf-8')
        if err:
            print("STDERR:")
            print(err)
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        ssh.close()

if __name__ == '__main__':
    fix_vps()
