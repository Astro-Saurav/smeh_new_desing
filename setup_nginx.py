from vps_config import get_vps_credentials
import paramiko
import sys

commands = """
apt-get update
apt-get install -y nginx
mkdir -p /var/www/manavrachnatimes.com/html
chmod -R 755 /var/www/manavrachnatimes.com

cat << 'INNER_EOF' > /var/www/manavrachnatimes.com/html/index.html
<html>
    <head>
        <title>Welcome to Manav Rachna Times!</title>
        <style>
            body { font-family: sans-serif; text-align: center; margin-top: 50px; }
            h1 { color: #333; }
        </style>
    </head>
    <body>
        <h1>Success! manavrachnatimes.com is connected to your VPS!</h1>
        <p>This is a temporary landing page. You can upload your website files to <code>/var/www/manavrachnatimes.com/html</code>.</p>
    </body>
</html>
INNER_EOF

cat << 'INNER_EOF' > /etc/nginx/sites-available/manavrachnatimes.com
server {
    listen 80;
    listen [::]:80;

    root /var/www/manavrachnatimes.com/html;
    index index.html index.htm index.nginx-debian.html;

    server_name manavrachnatimes.com www.manavrachnatimes.com;

    location / {
        try_files $uri $uri/ =404;
    }
}
INNER_EOF

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/manavrachnatimes.com /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
ufw allow 'Nginx HTTP'
"""

def run_cmds():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        vps_host, vps_user, vps_pass, _ = get_vps_credentials()
        client.connect(vps_host, username=vps_user, password=vps_pass)
        stdin, stdout, stderr = client.exec_command(commands)
        
        # Wait for the command to finish and print output
        exit_status = stdout.channel.recv_exit_status()
        print("STDOUT:")
        print(stdout.read().decode())
        print("STDERR:")
        print(stderr.read().decode())
        print(f"Exit Status: {exit_status}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

run_cmds()
