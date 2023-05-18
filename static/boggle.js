class BoggleGame {
  constructor(secs = 60) {
    $('.add-word').on('submit', this.handleSubmit.bind(this));

    // Button click to reload and start new game
    $('.new-game').on('click', function () {
      location.reload();
    });

    this.score = 0;
    this.highScore = this.loadHighScore() || 0;
    this.updateHighScore();
    this.words = new Set();
    this.secs = secs;
    this.showTimer();
    this.timer = setInterval(this.tick.bind(this), 1000);
  }

  // Update high score on the page
  updateHighScore(score) {
    $('.high-score').text(score);
  }

  // Save high score to local storage
  saveHighScore() {
    localStorage.setItem('highScore', this.highScore);
  }

  // Load high score from local storage
  loadHighScore() {
    return parseInt(localStorage.getItem('highScore'));
  }

  // Display high score on the page
  updateHighScore() {
    $('.high-score').text(this.highScore);
  }

  // Show current score on the page
  showScore() {
    $('.score').text(this.score);
  }

  // Show a message on the page
  showMessage(msg) {
    $('.msg').text(msg);
  }

  // Show the remaining time on the page
  showTimer() {
    $('.timer').text(this.secs);
  }

  // Handle each tick of the timer
  async tick() {
    this.secs -= 1;
    this.showTimer();

    if (this.secs === 0) {
      clearInterval(this.timer);
      $('.word').prop('disabled', true);
      await this.scoreGame();
    }
  }

  // Reset the input field
  resetInput() {
    $('.add-word').trigger('reset');
  }

  // Handle the form submission when a word is entered
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

  // Score the game when time is up
  async scoreGame() {
    const response = await axios.post('/keep-score', { score: this.score });
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.updateHighScore();
      this.saveHighScore();
    }
  }
}

let game = new BoggleGame();
