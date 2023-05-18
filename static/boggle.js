class BoggleGame {
  constructor(secs = 60) {
    $('.add-word').on('submit', this.handleSubmit.bind(this));

    this.score = 0;
    this.highScore = 0;
    this.updateHighScore();
    this.words = new Set();
    this.secs = secs;
    this.showTimer();
    this.timer = setInterval(this.tick.bind(this), 1000);
  }

  updateHighScore() {
    $('.high-score').text(this.highScore);
  }

  showScore() {
    $('.score').text(this.score);
  }

  showMessage(msg) {
    $('.msg').text(msg);
  }

  showTimer() {
    $('.timer').text(this.secs);
  }

  async tick() {
    this.secs -= 1;
    this.showTimer();

    if (this.secs === 0) {
      clearInterval(this.timer);
      $('.word').prop('disabled', true);
      await this.scoreGame();
    }
  }

  resetInput() {
    $('.add-word').trigger('reset');
  }

  async handleSubmit(e) {
    e.preventDefault();

    const $word = $('.word');

    let word = $word.val();
    if (!word) return;

    if (this.words.has(word)) {
      this.showMessage(`"${word}" already used`);
      this.resetInput();
      return;
    }

    const response = await axios.get('/check-word', { params: { word: word } });

    if (response.data.result === 'not-word') {
      this.showMessage(`"${word}" is not a valid English word`);
    } else if (response.data.result === 'not-on-board') {
      this.showMessage(`"${word}" is not on this board`);
    } else {
      this.score += word.length;
      this.showScore();
      this.showMessage(`"${word}" is A-OK!`);
      this.words.add(word);
      $('.added').append('<li>' + word + '</li>');
    }
    this.resetInput();
  }

  async scoreGame() {
    const response = await axios.post('/keep-score', { score: this.score });
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.updateHighScore();
    }
  }
}

let game = new BoggleGame();
