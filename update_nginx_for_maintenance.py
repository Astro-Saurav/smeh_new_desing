from vps_config import get_vps_credentials
import paramiko

def update_nginx():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        vps_host, vps_user, vps_pass, _ = get_vps_credentials()
        client.connect(vps_host, username=vps_user, password=vps_pass)
        
        # Read the current nginx config
        stdin, stdout, stderr = client.exec_command("cat /etc/nginx/sites-available/manavrachnatimes.com")
        config = stdout.read().decode()
        
        if "error_page 503 @maintenance;" not in config:
            print("Adding maintenance mode support to nginx config...")
            # We want to insert the error_page configuration right before the first location block
            # and the file check inside the main server block.
            
            maintenance_block = """
    error_page 503 @maintenance;
    location @maintenance {
        root /var/www/manavrachnatimes.com/html;
        rewrite ^(.*)$ /maintenance.html break;
    }
"""
            # Insert the maintenance check before `location / {`
            new_config = config.replace("location / {", maintenance_block + """
    location / {
        if (-f /var/www/manavrachnatimes.com/html/maintenance.html) {
            return 503;
        }""")
            
            # Write config back
            command = f"cat << 'INNER_EOF' > /etc/nginx/sites-available/manavrachnatimes.com\n{new_config}\nINNER_EOF"
            client.exec_command(command)
            
            # Test and restart
            stdin, stdout, stderr = client.exec_command("nginx -t && systemctl restart nginx")
            print("STDOUT:", stdout.read().decode())
            print("STDERR:", stderr.read().decode())
        else:
            print("Nginx config already supports maintenance mode.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    update_nginx()
