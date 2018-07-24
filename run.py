from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return('<h1>212 Burgers<h1>')


@app.route('/contact')
def contact():
    return('YOOOOOO ZZ')
