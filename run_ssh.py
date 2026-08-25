from vps_config import get_vps_credentials
import pty
import os
import sys

vps_host, vps_user, vps_pass, _ = get_vps_credentials()
host = f"{vps_user}@{vps_host}"
password = vps_pass
command = ["ssh", "-o", "StrictHostKeyChecking=no", host, "find / -name smeh_new_desing -type d 2>/dev/null || echo 'Not found'"]

pid, fd = pty.fork()
if pid == 0:
    os.execvp(command[0], command)
else:
    output = b""
    while True:
        try:
            data = os.read(fd, 1024)
            if not data:
                break
            output += data
            if b"password:" in output.lower():
                os.write(fd, (password + "\n").encode())
                output = b"" # clear after sending password
            sys.stdout.buffer.write(data)
        except OSError:
            break
