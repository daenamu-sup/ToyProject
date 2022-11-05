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

@app.route('/edit')
def edit():
    return render_template('edit.html')

# API 부분
@app.route('/worry/list', methods=['GET'])
def worry_list():
    worry_list = list(db.worry.find({'deleted_at':None},{'_id':False}))
    return jsonify({'worries':worry_list})

@app.route('/worry/detail', methods=['GET'])
def worry_detail():
    board_id = int(request.args.get('id'))
    worry_detail = db.worry.find_one({'board_id': board_id},{'_id': False})

    # 들어 오는 순간 바로 조회수1 증가 하고 update.
    view_count = int(worry_detail['view_count']) + 1
    db.worry.update_one({"board_id": board_id}, {"$set": {"view_count": view_count}})
    worry_detail = db.worry.find_one({'board_id': board_id}, {'_id': False})
    return jsonify({'worry': worry_detail})

@app.route('/worry/create', methods=["POST"])
def worry_create():
    nickname_receive = request.form['nickname_give']
    title_receive = request.form['title_give']
    password_receive = request.form['password_give']
    desc_receive = request.form['desc_give']
    worries_list = list(db.worry.find({}, {'_id':False}))
    board_id = len(worries_list)+1
    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    view_count = 0
    doc = {
        'board_id': board_id,
        'nickname': nickname_receive,
        'password': password_receive,
        'title': title_receive,
        'desc': desc_receive,
        'view_count': view_count,
        'created_at': now,
        'deleted_at': None,
        'comment': [],
    }
    db.worry.insert_one(doc)
    return jsonify({'msg': 'db등록 완료!'})

@app.route('/worry/pw_check', methods=["POST"])
def worry_pw_check():
    board_id_receive = int(request.form['board_id_give'])
    password_receive = request.form['password_give']
    worry_detail = db.worry.find_one({'board_id': board_id_receive}, {'_id': False})
    password = worry_detail['password']
    if password == password_receive:
        return jsonify({'msg': True})
    else:
        return jsonify({'msg': False})

@app.route('/worry/edit', methods=["POST"])
def worry_edit():
    board_id_receive = int(request.form['board_id_give'])
    nickname_receive = request.form['nickname_give']
    title_receive = request.form['title_give']
    password_receive = request.form['password_give']
    desc_receive = request.form['desc_give']

    # 해당 board_id 데이터를 조회
    worry_detail = db.worry.find_one({'board_id': board_id_receive}, {'_id': False})
    password = worry_detail['password']
    # /worry/detail을 2번 호출하기 때문에 view_count -2
    view_count = int(worry_detail['view_count']) - 2

    # 비밀번호가 일치하는지 확인 후
    # 일치하면 update하고 True return, 일치하지 않으면 False return
    if password == password_receive:
        db.worry.update_one({'board_id': board_id_receive},
                            {'$set': {'nickname': nickname_receive,
                                      'title':title_receive,
                                      'desc':desc_receive,
                                      'view_count':view_count}})
        return jsonify({'msg': True})
    else:
        return jsonify({'msg': False})

@app.route('/worry/delete', methods=["POST"])
def worry_delete():
    board_id_receive = int(request.form['board_id_give'])
    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # updateResult 변수에 업데이트의 결과를 담아서 클라이언트로 전달(1: 성공, 0: 실패)
    updateResult = db.worry.update_one({'board_id': board_id_receive},{'$set': {'deleted_at': now}})
    if updateResult.modified_count == 1:
        return jsonify({'msg': True})
    else:
        return jsonify({'msg': False})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)