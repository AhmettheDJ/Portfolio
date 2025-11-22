  const BLOCK_SIZE = 20;
        const ROWS = 30;
        const COLS = 30;
        const FPS = 6; // Spielgeschwindigkeit (Frames pro Sekunde)

        // Spielzustand und Komponenten
        let canvas, ctx;
        let playerSnake = [];
        let foodItem = {};
        let currentDirection = 'right';
        let nextDirectionBuffer = 'right';
        let currentScore = 0;
        let bestScore = localStorage.getItem('snakeBestScore') || 0;
        let isGameActive = false;
        let isGamePaused = false;
        let mainGameLoop;
        let effectsContainer;

        // Spiel beim Laden der Seite initialisieren
        window.onload = function() {
            // Spielfeld (Canvas) vorbereiten
            canvas = document.getElementById('board');
            canvas.height = ROWS * BLOCK_SIZE;
            canvas.width = COLS * BLOCK_SIZE;
            ctx = canvas.getContext('2d');
            
            // Container für Partikel-Effekte
            effectsContainer = document.getElementById('particles');
            
            // Beste Punktzahl anzeigen
            document.getElementById('high-score').textContent = bestScore;
            
            // Spiel zurücksetzen
            resetGame();
            
            // Keyboard und Button-Events registrieren
            document.addEventListener('keydown', handleDirectionInput);
            document.getElementById('start-btn').addEventListener('click', startGame);
            document.getElementById('pause-btn').addEventListener('click', togglePause);
            document.getElementById('restart-btn').addEventListener('click', restartGame);
        };

        // Spiel starten
        function startGame() {
            if (!isGameActive) {
                isGameActive = true;
                isGamePaused = false;
                mainGameLoop = setInterval(updateGameState, 1000 / FPS);
            }
        }

        // Spiel neu starten („Nochmal spielen" Button)
        function restartGame() {
            resetGame();
            startGame();
        }

        // Pause-Funktion umschalten
        function togglePause() {
            if (!isGameActive) return;
            
            isGamePaused = !isGamePaused;
            document.getElementById('pause-btn').textContent = isGamePaused ? 'FORTSETZEN' : 'PAUSE';
            
            if (isGamePaused) {
                clearInterval(mainGameLoop);
            } else {
                mainGameLoop = setInterval(updateGameState, 1000 / FPS);
            }
        }

        // Spiel zurücksetzen
        function resetGame() {
            // Laufende Spiel-Loop beenden
            if (mainGameLoop) {
                clearInterval(mainGameLoop);
            }
            
            // Schlange zurücksetzen
            playerSnake = [
                {x: 5, y: 10},
                {x: 4, y: 10},
                {x: 3, y: 10}
            ];
            
            // Richtung zurücksetzen
            currentDirection = 'right';
            nextDirectionBuffer = 'right';
            
            // Punktzahl zurücksetzen
            currentScore = 0;
            document.getElementById('score').textContent = currentScore;
            document.getElementById('length').textContent = playerSnake.length;
            
            // Neues Futter spawnen
            spawnFood();
            
            // Game-Over Screen ausblenden
            document.getElementById('game-over').classList.remove('active');
            
            // Spielzustand zurücksetzen
            isGameActive = false;
            isGamePaused = false;
            
            // Pause-Button zurücksetzen
            document.getElementById('pause-btn').textContent = 'PAUSE';
        }

        // Futter an zufälliger Position spawnen
        function spawnFood() {
            let isValidSpot = false;
            
            while (!isValidSpot) {
                foodItem = {
                    x: Math.floor(Math.random() * COLS),
                    y: Math.floor(Math.random() * ROWS)
                };
                
                // Überprüfen, ob Futter nicht auf der Schlange ist
                isValidSpot = true;
                for (let bodyPart of playerSnake) {
                    if (bodyPart.x === foodItem.x && bodyPart.y === foodItem.y) {
                        isValidSpot = false;
                        break;
                    }
                }
            }
            
            // Partikel-Effekt für neues Futter
            spawnParticles(foodItem.x * BLOCK_SIZE + BLOCK_SIZE/2, foodItem.y * BLOCK_SIZE + BLOCK_SIZE/2, 15, '#ff3366');
        }

        // Schlangen-Richtung basierend auf Eingabe ändern
        function handleDirectionInput(e) {
            if (!isGameActive || isGamePaused) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    if (currentDirection !== 'down') nextDirectionBuffer = 'up';
                    break;
                case 'ArrowDown':
                    if (currentDirection !== 'up') nextDirectionBuffer = 'down';
                    break;
                case 'ArrowLeft':
                    if (currentDirection !== 'right') nextDirectionBuffer = 'left';
                    break;
                case 'ArrowRight':
                    if (currentDirection !== 'left') nextDirectionBuffer = 'right';
                    break;
            }
        }

        // Haupt-Spiel-Loop: Spielzustand aktualisieren
        function updateGameState() {
            if (isGamePaused) return;
            
            // Richtung aktualisieren
            currentDirection = nextDirectionBuffer;
            
            // Neue Kopfposition berechnen
            let snakeHead = {x: playerSnake[0].x, y: playerSnake[0].y};
            
            switch(currentDirection) {
                case 'up':
                    snakeHead.y--;
                    break;
                case 'down':
                    snakeHead.y++;
                    break;
                case 'left':
                    snakeHead.x--;
                    break;
                case 'right':
                    snakeHead.x++;
                    break;
            }
            
            // Wandkollision überprüfen
            if (snakeHead.x < 0 || snakeHead.x >= COLS || snakeHead.y < 0 || snakeHead.y >= ROWS) {
                endGame();
                return;
            }
            
            // Selbstkolli­sion überprüfen
            for (let bodyPart of playerSnake) {
                if (snakeHead.x === bodyPart.x && snakeHead.y === bodyPart.y) {
                    endGame();
                    return;
                }
            }
            
            // Neue Kopfposition zur Schlange hinzufügen
            playerSnake.unshift(snakeHead);
            
            // Futter gegessen?
            if (snakeHead.x === foodItem.x && snakeHead.y === foodItem.y) {
                // Punkte erhöhen
                currentScore += 10;
                document.getElementById('score').textContent = currentScore;
                document.getElementById('length').textContent = playerSnake.length;
                
                // Ess-Effekt anzeigen
                spawnParticles(foodItem.x * BLOCK_SIZE + BLOCK_SIZE/2, foodItem.y * BLOCK_SIZE + BLOCK_SIZE/2, 20, '#33ff66');
                
                // Neues Futter spawnen
                spawnFood();
                
                // Beste Punktzahl aktualisieren
                if (currentScore > bestScore) {
                    bestScore = currentScore;
                    localStorage.setItem('snakeBestScore', bestScore);
                    document.getElementById('high-score').textContent = bestScore;
                }
            } else {
                // Schwanz abschneiden (kein Wachstum ohne Futter)
                playerSnake.pop();
            }
            
            // Spielfeld neu zeichnen
            render();
        }

        // Spiel rendern
        function render() {
            // Hintergrund mit Gradient zeichnen
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#0a0e21');
            gradient.addColorStop(1, '#1a1f3c');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Gitter zeichnen
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < COLS; i++) {
                ctx.beginPath();
                ctx.moveTo(i * BLOCK_SIZE, 0);
                ctx.lineTo(i * BLOCK_SIZE, canvas.height);
                ctx.stroke();
            }
            
            for (let j = 0; j < ROWS; j++) {
                ctx.beginPath();
                ctx.moveTo(0, j * BLOCK_SIZE);
                ctx.lineTo(canvas.width, j * BLOCK_SIZE);
                ctx.stroke();
            }
            
            // Schlange mit Gradient zeichnen
            for (let i = 0; i < playerSnake.length; i++) {
                // Gradient für jeden Körperteil erstellen
                const segmentGradient = ctx.createRadialGradient(
                    playerSnake[i].x * BLOCK_SIZE + BLOCK_SIZE/2,
                    playerSnake[i].y * BLOCK_SIZE + BLOCK_SIZE/2,
                    0,
                    playerSnake[i].x * BLOCK_SIZE + BLOCK_SIZE/2,
                    playerSnake[i].y * BLOCK_SIZE + BLOCK_SIZE/2,
                    BLOCK_SIZE/2
                );
                
                if (i === 0) {
                    // Kopf - besondere Farbe
                    segmentGradient.addColorStop(0, '#33ff66');
                    segmentGradient.addColorStop(1, '#00cc44');
                } else {
                    // Körper - Farbverlauf basierend auf Position
                    const colorValue = Math.max(100, 255 - (i * 5));
                    segmentGradient.addColorStop(0, `rgb(${colorValue}, 255, ${colorValue})`);
                    segmentGradient.addColorStop(1, `rgb(0, ${200 - (i * 3)}, 0)`);
                }
                
                ctx.fillStyle = segmentGradient;
                ctx.fillRect(playerSnake[i].x * BLOCK_SIZE, playerSnake[i].y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                
                // Glanz-Effekt auf Segmente
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(
                    playerSnake[i].x * BLOCK_SIZE + 3, 
                    playerSnake[i].y * BLOCK_SIZE + 3, 
                    BLOCK_SIZE/3, 
                    BLOCK_SIZE/3
                );
            }
            
            // Futter mit Glow-Effekt zeichnen
            ctx.shadowColor = '#ff3366';
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#ff3366';
            ctx.beginPath();
            ctx.arc(
                foodItem.x * BLOCK_SIZE + BLOCK_SIZE/2,
                foodItem.y * BLOCK_SIZE + BLOCK_SIZE/2,
                BLOCK_SIZE/2 - 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Innerer Glow für Futter
            ctx.fillStyle = '#ff6699';
            ctx.beginPath();
            ctx.arc(
                foodItem.x * BLOCK_SIZE + BLOCK_SIZE/2,
                foodItem.y * BLOCK_SIZE + BLOCK_SIZE/2,
                BLOCK_SIZE/3,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Spiel beenden
        function endGame() {
            isGameActive = false;
            clearInterval(mainGameLoop);
            
            // Explosions-Effekt
            for (let bodyPart of playerSnake) {
                spawnParticles(
                    bodyPart.x * BLOCK_SIZE + BLOCK_SIZE/2,
                    bodyPart.y * BLOCK_SIZE + BLOCK_SIZE/2,
                    5,
                    '#ff3333'
                );
            }
            
            // Game-Over Screen anzeigen
            document.getElementById('final-score').textContent = currentScore;
            document.getElementById('game-over').classList.add('active');
        }

        // Partikel-Effekte erzeugen
        function spawnParticles(x, y, count, color) {
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.backgroundColor = color;
                
                // Zufällige Richtung und Distanz
                const angle = Math.random() * Math.PI * 2;
                const distance = 20 + Math.random() * 50;
                const duration = 0.5 + Math.random() * 1;
                
                particle.style.animation = `float ${duration}s ease-out forwards`;
                particle.style.setProperty('--end-x', Math.cos(angle) * distance + 'px');
                particle.style.setProperty('--end-y', Math.sin(angle) * distance + 'px');
                
                effectsContainer.appendChild(particle);
                
                // Partikel nach Animation entfernen
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, duration * 1000);
            }
        }