from flask import Flask, render_template, jsonify
import sqlite3

app = Flask(__name__)

SCORESDB = 'scores.db'

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/scores', methods=['GET'])
def scores_list():
    con = sqlite3.connect(SCORESDB)
    scores = []
    cur = con.execute('SELECT * FROM scores')
    for row in cur:
        scores.append(list(row))
    con.close()
    
    return jsonify(scores)


@app.route('/scores', methods=['POST'])
def scores_insert():
    return 'inserted!'