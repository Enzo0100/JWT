from flask import Flask, request, jsonify, render_template
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'sua-chave-secreta'  # Troque para uma chave secreta segura
jwt = JWTManager(app)

# Simulação de banco de dados
users_db = {}

# Rota para servir a página inicial
@app.route('/')
def index():
    return render_template('index.html')

# Rota para servir a página de registro
@app.route('/register')
def register_page():
    return render_template('register.html')

# Rota para servir a página de login
@app.route('/login')
def login_page():
    return render_template('login.html')

# Rota para registro
@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username or not password:
        return jsonify({"msg": "Username e password são obrigatórios"}), 400
    if username in users_db:
        return jsonify({"msg": "Usuário já existe"}), 400
    users_db[username] = password
    return jsonify({"msg": "Usuário registrado com sucesso"}), 200

# Rota para login
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username or not password:
        return jsonify({"msg": "Username e password são obrigatórios"}), 400
    if users_db.get(username) != password:
        return jsonify({"msg": "Credenciais inválidas"}), 401
    access_token = create_access_token(identity=username)
    print(f'Token created for user {username}: {access_token}')
    return jsonify(access_token=access_token), 200

# Rota protegida
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

# Rota para logout
@app.route('/logout', methods=['POST'])
def logout():
    # No backend, o logout é gerenciado no frontend removendo o token
    return jsonify({"msg": "Logout realizado com sucesso"}), 200

if __name__ == '__main__':
    app.run(debug=True)
