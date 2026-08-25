from vps_config import get_vps_credentials
import paramiko

def fix():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        vps_host, vps_user, vps_pass, _ = get_vps_credentials()
        client.connect(vps_host, username=vps_user, password=vps_pass)
        
        nginx_conf = """server {
    listen 80;
    listen [::]:80;

    server_name manavrachnatimes.com www.manavrachnatimes.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
"""
        
        # Write config
        command = f"cat << 'INNER_EOF' > /etc/nginx/sites-available/manavrachnatimes.com\n{nginx_conf}\nINNER_EOF"
        client.exec_command(command)
        
        # Test and restart
        stdin, stdout, stderr = client.exec_command("nginx -t && systemctl restart nginx")
        print(stdout.read().decode())
        print(stderr.read().decode())
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

fix()
