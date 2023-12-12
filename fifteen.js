document.addEventListener('DOMContentLoaded', function () {
    const puzzleContainer = document.getElementById('puzzle-container');
    const timeElement = document.getElementById('time');
    const movesElement = document.getElementById('moves');
    const bestTimeElement = document.getElementById('best-time');
    const bestMovesElement = document.getElementById('best-moves');
    const size = 4; // 4x4 grid
    const totalPieces = size * size;
    const pieces = [...Array(totalPieces).keys()]; // Array from 0 to 15
    let startTime, timerInterval, moves= 0;
    let backgroundUrl='background1.png';
    /*const backgroundImages = [
        'background1.png',
        'background2.png',
        'background3.png',
        'background4.png',
        'background5.jpg',
        'background6.jpg',
        'background7.jpg',
        'background8.jpg'
    ];*/

    // Initialize the puzzle pieces
    initializePuzzle();

    // Function to initialize the puzzle pieces
    function initializePuzzle() {
        puzzleContainer.innerHTML = '';

        // Create the puzzle pieces
        for (let i = 0; i < totalPieces; i++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.textContent = pieces[i] === totalPieces - 1 ? '' : pieces[i] + 1;
            piece.style.backgroundImage = `url('${backgroundUrl}')`; // Set background image on the piece
            piece.style.backgroundSize = `${size * 100}px ${size * 100}px`; // Set background size based on the puzzle size
            piece.style.backgroundPosition = `-${(i % size) * 100}px -${Math.floor(i / size) * 100}px`; // Adjust background position
            piece.addEventListener('click', () => movePiece(i));
            piece.addEventListener('mouseover', () => handleMouseOver(i));
            piece.addEventListener('mouseout', () => handleMouseOut(i));
            puzzleContainer.appendChild(piece);
        }
    }

    // Function to move puzzle piece
    function movePiece(index) {
        const emptyIndex = pieces.indexOf(totalPieces - 1);
        const adjacentIndices = getAdjacentIndices(emptyIndex);

        if (adjacentIndices.includes(index)) {
            // Swap the positions of the clicked piece and the empty space
            pieces[emptyIndex] = pieces[index];
            pieces[index] = totalPieces - 1;

            // Update the puzzle on the page
            updatePuzzle();
            moves++;
            updateMovesAndTime();

            if (isSolved()) {
                // Puzzle solved, stop the timer and update best record
                clearInterval(timerInterval);
                updateBestRecord();
                alert(`Congratulations! You solved the puzzle in ${moves} moves and ${getTimeElapsed()} seconds.`);
            }
        }
    }

    // Function to handle mouseover event
    function handleMouseOver(index) {
        const emptyIndex = pieces.indexOf(totalPieces - 1);
        const adjacentIndices = getAdjacentIndices(emptyIndex);

        if (adjacentIndices.includes(index)) {
            const pieceElement = puzzleContainer.children[index];
            pieceElement.classList.add('movable-piece');
        }
    }

    // Function to handle mouseout event
    function handleMouseOut(index) {
        const pieceElement = puzzleContainer.children[index];
        pieceElement.classList.remove('movable-piece');
    }

    // Function to update the puzzle on the page
    /*function updatePuzzle() {
        const puzzlePieces = document.querySelectorAll('.puzzle-piece');
        puzzlePieces.forEach((piece, index) => {
            piece.textContent = pieces[index] === totalPieces - 1 ? '' : pieces[index] + 1;
            piece.style.backgroundPosition = `-${(pieces[index] % size) * 100}px -${Math.floor(pieces[index] / size) * 100}px`; // Adjust background position
            piece.classList.remove('movable-piece'); // Remove movable class after updating

            piece.classList.add('shuffling');

            setTimeout(() => {
                piece.classList.remove('shuffling');
            }, 300);
        });
    }*/
    function updatePuzzle() {
        const puzzlePieces = document.querySelectorAll('.puzzle-piece');
        puzzlePieces.forEach((piece, index) => {
            piece.textContent = pieces[index] === totalPieces - 1 ? '' : pieces[index] + 1;
    
            // Update background position dynamically
            const backgroundX = (pieces[index] % size) * 100;
            const backgroundY = Math.floor(pieces[index] / size) * 100;
            piece.style.backgroundPosition = `-${backgroundX}px -${backgroundY}px`;
    
            piece.classList.remove('movable-piece'); // Remove movable class after updating
    
            piece.classList.add('shuffling');
    
            setTimeout(() => {
                piece.classList.remove('shuffling');
            }, 300);
        });
    }

    // Function to get adjacent indices
    function getAdjacentIndices(index) {
        const row = Math.floor(index / size);
        const col = index % size;
        const adjacentIndices = [];

        if (row > 0) adjacentIndices.push(index - size); // Up
        if (row < size - 1) adjacentIndices.push(index + size); // Down
        if (col > 0) adjacentIndices.push(index - 1); // Left
        if (col < size - 1) adjacentIndices.push(index + 1); // Right

        return adjacentIndices;
    }

    // Function to shuffle the puzzle pieces
    window.shuffle = function () {
    clearInterval(timerInterval);
    moves = 0;
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);

    // Clear the game-won notification (remove this line if not needed)
    // const gameWonNotification = document.getElementById('game-won-notification');
    // gameWonNotification.textContent = '';

    for (let i = 0; i < 300; i++) { // Perform a few hundred random moves
        const emptyIndex = pieces.indexOf(totalPieces - 1);
        const adjacentIndices = getAdjacentIndices(emptyIndex);

        // Choose a random adjacent index
        const randomIndex = adjacentIndices[Math.floor(Math.random() * adjacentIndices.length)];

        // Swap the positions of the random adjacent piece and the empty space
        pieces[emptyIndex] = pieces[randomIndex];
        pieces[randomIndex] = totalPieces - 1;
    }

    // Update the puzzle on the page after shuffling
    updatePuzzle();
    updateMovesAndTime();
};


    // Function to update the timer
    function updateTimer() {
        const elapsedTime = getTimeElapsed();
        timeElement.textContent = `Time: ${elapsedTime}s`;
    }

    // Function to get the time elapsed
    function getTimeElapsed() {
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        return elapsedSeconds;
    }

    // Function to update the number of moves and time
    function updateMovesAndTime() {
        movesElement.textContent = `Moves: ${moves}`;
    }

    // Function to check if the puzzle is solved
    function isSolved() {
        for (let i = 0; i < totalPieces - 1; i++) {
            if (pieces[i] !== i) {
                return false;
            }
        }
        return true;
    }

 // Function to update the best record
function updateBestRecord() {
    const bestTime = localStorage.getItem('bestTime');
    const bestMoves = localStorage.getItem('bestMoves');

    if (bestTime === null || getTimeElapsed() < bestTime) {
        localStorage.setItem('bestTime', getTimeElapsed());
        bestTimeElement.textContent = `Best Time: ${getTimeElapsed()}s`;
    }

    if (bestMoves === null || moves < bestMoves) {
        localStorage.setItem('bestMoves', moves);
        bestMovesElement.textContent = `Best Moves: ${moves}`;
    }
    //extra feauture1: Winner-notifcation with a cute image. 
    if (isSolved()) {
        const overlay = document.getElementById('overlay');
        const overlayContent = document.getElementById('overlayContent');
        const overlayMessage = document.getElementById('overlayMessage');
        const overlayImage = document.getElementById('overlayImage');

        overlayMessage.textContent = 'Congratulations! You solved the puzzle!';
        overlayImage.src = 'winner-image.gif';
        overlay.style.display = 'flex';

        overlay.addEventListener('click', () => {
            overlay.style.display = 'none';
        });
    }
}

  let musicEnabled = true;

    // Move toggleMusic function outside of the DOMContentLoaded event listener
    window.toggleMusic = function () {
        const backgroundMusic = document.getElementById('backgroundMusic');
        const toggleMusicButton = document.getElementById('toggleMusicButton');

        if (musicEnabled) {
            backgroundMusic.pause();
            toggleMusicButton.textContent = 'Enable Music';
        } else {
            backgroundMusic.play().then(() => {
                toggleMusicButton.textContent = 'Disable Music';
            }).catch((error) => {
                console.error('Error playing audio:', error);
            });
        }

        musicEnabled = !musicEnabled;
    };
    window.changeBackground=function(value){
        backgroundUrl=value;
        initializePuzzle();
    }
});