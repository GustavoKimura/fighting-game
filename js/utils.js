function rectangularCollision(rectangle1, rectangle2) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

function determineWinner(player, enemy, currentTimerTimeoutId) {
    clearTimeout(currentTimerTimeoutId);

    displayText.style.display = 'flex';

    if (player.health === enemy.health) {
        displayText.innerHTML = 'palhaçada quem ganhou foi a emily';
    } else if (player.health > enemy.health) {
        displayText.innerHTML = 'te matei mais te amo ta S2!';
    } else if (enemy.health > player.health) {
        displayText.innerHTML = 'emily ganhou';
    }
}

function decreaseCurrentTimer() {
    if (currentTimer > 0) {
        currentTimerTimeoutId = setTimeout(decreaseCurrentTimer, 1000);

        currentTimer--;

        timer.innerHTML = currentTimer.toString();
    }

    if (currentTimer === 0) {
        determineWinner(player, enemy, currentTimerTimeoutId);
    }
}