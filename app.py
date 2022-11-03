from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.ffudy0q.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.daenamusup

# HTML 렌더링 부분
@app.route('/')
def home():
    return render_template('index.html')

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


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)