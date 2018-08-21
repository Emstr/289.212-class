from flask import Flask, render_template, request, redirect
import sqlite3
import os

app = Flask(__name__)

UPLOAD_FOLDER = os.getcwd()+'/static/uploads'

EVENTDB = 'events.db'

def fetchEvents(con):
    events = []
    cur = con.execute('SELECT title,date,location,start_time,end_time,first_name,last_name,attendees,description,image,ID FROM events')
    for row in cur:
        events.append(list(row))
    return {'events':events}

@app.route('/')
def index():
    con = sqlite3.connect(EVENTDB)
    eventsVar = fetchEvents(con)
    con.close()

    return render_template('index.html',events=eventsVar['events'])


@app.route('/add-event')
def addEvent():
    return render_template('addEvent.html')

@app.route('/action', methods=['POST'])
def action():
    con = sqlite3.connect(EVENTDB)
    eventsVar = fetchEvents(con)

    file = request.files['image']
    filename = str(eventsVar['events'][-1][10] + 1)
    fileext = file.filename.split('.')[-1]
    filename = filename + '.' + fileext
    file.save(os.path.join(UPLOAD_FOLDER, filename))

    cur = con.execute(
      'INSERT INTO events(title,date,location,start_time,end_time,first_name,last_name,attendees,description,image) VALUES(?,?,?,?,?,?,?,?,?,?)',
      (request.form['title'],request.form['date'],request.form['location'],request.form['start_time'],request.form['end_time'],request.form['first_name'],request.form['last_name'],request.form['attendees'],request.form['description'],filename)
    )

    con.commit()
    con.close()
    
    return redirect("/", code=302)

@app.route('/RSVP', methods=['POST'])
def RSVP():
    print(request.form["attend"])
    
    con = sqlite3.connect(EVENTDB)
    eventsVar = fetchEvents(con)
    
    attendees = con.execute(
      'SELECT attendees FROM events where ID=?',(request.form["attend"],))
    
    con.execute(
      'UPDATE events SET attendees=? where ID=?',(int(attendees.fetchone()[0])-1,request.form["attend"]))
    
    con.commit()
    con.close()
    
    return redirect("/", code=302)
    
    return "RSVP"
