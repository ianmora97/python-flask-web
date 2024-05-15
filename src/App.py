# Estos son los imports que se ocupan de momento para poder correr el servidor
from flask import Flask;
from Routes import app;

# * Servidor
if __name__ == '__main__':
    # Se le crea la configuración al servidor
    app.run(host='localhost', port=3000, debug=True,use_reloader=True);