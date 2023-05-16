class BoggleGame {
  constructor() {
    $('.add-word').on('submit', this.handleSubmit.bind(this));
  }

  handleSubmit(e) {
    e.preventDefault();
  }
}

let game = new BoggleGame();
