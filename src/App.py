from flask import Flask;
from Routes import app;

# * Servidor
if __name__ == '__main__':
    app.run(host='localhost', port=3000, debug=True,use_reloader=True);