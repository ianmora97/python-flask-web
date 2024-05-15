from flask import Flask, render_template, request, jsonify;
from helpers.cipher import encrypt_password;
from flask_pymongo import PyMongo;
from bson.objectid import ObjectId;


# ? Objeto de Flask que se encarga de correr el servidor
app = Flask(__name__);

app.config['STATIC_FOLDER'] = './static';

# ? Configuración de la base de datos
app.config['MONGO_URI'] = 'mongodb://localhost:27017/flask';

# ? Objeto de PyMongo que se encarga de la conexión con la base de datos
mongo = PyMongo(app);

# todo: Ruta principal para el servidor
@app.route('/')
def index():
    return render_template('index.html');


# ? ------------------------------ GET ALL ------------------------------
# todo: Ruta para ver los usuarios
@app.route('/api/users', methods=['GET'])
def getUsers():
    # Se obtienen los usuarios de la base de datos
    users = mongo.db.users.find();
    
    # Se crea una lista de usuarios
    response = [];
    for user in users:
        response.append({
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'username': user['username']
        });
    
    # Se retorna la lista de usuarios
    return jsonify(response);


# ? ------------------------------ GET BY ID ------------------------------
# todo: Ruta para obtener un dato de un ID
@app.route('/api/users/<id>', methods=['GET'])
def getUser(id):
    # Se obtiene el usuario de la base de datos
    user = mongo.db.users.find_one({'_id': ObjectId(id)});
    
    # Se crea un objeto de respuesta
    response = {
        'id': str(user['_id']),
        'name': user['name'],
        'email': user['email'],
        'password': user['password'],
        'username': user['username']
    };
    
    # Se retorna el usuario
    return jsonify(response);

# ? ------------------------------ DELETE ------------------------------
# todo: Ruta para eliminar un dato - ID
@app.route('/api/users/<id>', methods=['DELETE'])
def deleteUser(id):
    # Se elimina el usuario de la base de datos
    mongo.db.users.delete_one({'_id': ObjectId(id)});
    
    # Se retorna un mensaje de éxito
    return jsonify({'message': 'Usuario eliminado exitosamente'});


# ? ------------------------------ ADD ------------------------------
# todo: Ruta para crear los usuarios
@app.route('/api/users', methods=['POST'])
def createUser():
    # Se obtienen los datos del usuario
    data = request.json;
    
    name = data['name'];
    email = data['email'];
    password = data['password'];
    username = data['username'];
    
    if name and email and password and username:
        # Se encripta la contraseña
        hashed_password = encrypt_password(password);
        
        # * Se inserta el usuario en la base de datos
        id = mongo.db.users.insert_one({
                'name': name,
                'email': email,
                'password': hashed_password,
                'username': username
            });
        
        # Se crea un objeto de respuesta
        response = {
            'id': str(id.inserted_id),
            'name': name,
            'email': email,
            'password': hashed_password,
            'username': username
        };
        
        # Se retorna un mensaje de éxito
        return jsonify({
            'message': 'Usuario creado exitosamente',
            'response': response
        });
    else:
        # Se retorna un mensaje de error
        return not_found();

# ? ------------------------------ UPDATE ------------------------------
# todo: Ruta para actualizar un dato - ID
@app.route('/api/users/<id>', methods=['PUT'])
def updateUser(id):
    # Se obtienen los datos del usuario
    data = request.json;
    # check if the password is empty
    name = data['name'];
    email = data['email'];
    username = data['username'];
    
    if name and email and username:
        
        # * Se actualiza el usuario en la base de datos
        mongo.db.users.update_one({'_id': ObjectId(id)}, {
            '$set': {
                'name': name,
                'email': email,
                'username': username
            }
        });
        
        # Se crea un objeto de respuesta
        response = {
            'id': id,
            'name': name,
            'email': email,
            'username': username
        };
        
        # Se retorna un mensaje de éxito
        return jsonify({
            'message': 'Usuario actualizado exitosamente',
            'response': response
        });
    else:
        # Se retorna un mensaje de error
        return not_found();

    
@app.errorhandler(404)
def not_found(error=None):
    response = jsonify({
        'message': 'Recurso no encontrado: ' + request.url,
        'status': 404
    });
    response.status_code = 404;
    return response;