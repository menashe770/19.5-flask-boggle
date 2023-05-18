from flask import Flask, render_template, session, request, jsonify
from boggle import Boggle

boggle_game = Boggle()

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret"


@app.route("/")
def homepage():
    """Show the Boggle board"""

    board = boggle_game.make_board()
    session["board"] = board

    return render_template("index.html", board=board)


@app.route("/check-word")
def check_word():
    """Check if a word is valid on the Boggle board"""

    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({"result": response})


played_times = 0
highest_score = 0


@app.route("/keep-score", methods=["POST"])
def keep_score():
    """Keep track of the game score and highest score"""

    global played_times, highest_score

    score = request.json.get("score")
    played_times += 1
    highest_score = max(highest_score, score)

    return jsonify({"success": True})
