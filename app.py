from flask import Flask, render_template, request, jsonify
app = Flask(__name__)
from pymongo import MongoClient

import datetime
import certifi
ca = certifi.where()

client = MongoClient('mongodb+srv://test:sparta@cluster0.ffudy0q.mongodb.net/Cluster0?retryWrites=true&w=majority',tlsCAFile=ca)
db = client.daenamusup

# HTML 렌더링 부분
@app.route('/')
def home():
    return render_template('index.html')
    
@app.route('/create')
def create():
    return render_template('create.html')

@app.route('/detail')
def detail():
    return render_template('detail.html')

# API 부분
@app.route('/worry/list', methods=['GET'])
def worry_list():
    worry_list = list(db.worry.find({},{'_id':False}))
    return jsonify({'worries':worry_list})

@app.route('/worry/detail', methods=['GET'])
def worry_detail():
    board_id = int(request.args.get('id'))
    worry_detail = db.worry.find_one({'board_id':board_id},{'_id':False})
    print(worry_detail)
    return jsonify({'worry':worry_detail})

@app.route('/worry/create', methods=["POST"])
def worry_create():
    nickname_receive = request.form['nickname_give']
    title_receive = request.form['title_give']
    password_receive = request.form['password_give']
    desc_receive = request.form['desc_give']
    worries_list = list(db.worry.find({}, {'_id':False}))
    board_id = len(worries_list)+1
    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    view_count = '0'
    doc = {
        'board_id': board_id,
        'nickname': nickname_receive,
        'password': password_receive,
        'title': title_receive,
        'desc': desc_receive,
        'view_count': view_count,
        'created_at': now,
        'deleted_at': 'null',
        'comment' : {
            'comment_id': '1',
            'nickname': 'gyo',
            'password': '1234',
            'desc': '먹으셈 ㅇㅇ',
            'create_at': '2022-10-31 21:44:23',
            'deleted_at': 'null',
            'likes': '11',
        },
    }
    db.worry.insert_one(doc)
    return jsonify({'msg': 'db등록 완료!'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)