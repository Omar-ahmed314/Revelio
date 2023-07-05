from flask import Flask, render_template, request

# initialize the application
app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello World'

@app.route('/upload', methods=['POST'])
def upload():
    pass

if __name__ == '__main__':
    app.run(port=3000)