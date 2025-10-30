  function generateName(length) {
            if (length < 2) {
                return "Name must be at least 2 characters long!";
            }

            const vowels = ['a', 'e', 'i', 'o', 'u'];
            const consonants = [
                'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
                'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'
            ];

            let name = "";
            let isVowelNext = Math.random() < 0.5; // Zufällig mit einem Vokal oder Konsonanten starten

            for (let i = 0; i < length; i++) {
                if (isVowelNext) {
                    name += vowels[Math.floor(Math.random() * vowels.length)];
                } else {
                    name += consonants[Math.floor(Math.random() * consonants.length)];
                }
                isVowelNext = !isVowelNext; // Wechsel zwischen Vokal und Konsonant
            }

            // Ersten Buchstaben großschreiben
            return name.charAt(0).toUpperCase() + name.slice(1);
        }

        document.getElementById("generate-names").addEventListener("click", () => {
            const nameLength = parseInt(document.getElementById("name-length").value, 10);
            const nameCount = parseInt(document.getElementById("name-count").value, 10);

            const nameList = document.getElementById("name-list");
            nameList.innerHTML = ""; // Vorherige Namen entfernen

            for (let i = 0; i < nameCount; i++) {
                const li = document.createElement("li");
                li.textContent = generateName(nameLength);
                nameList.appendChild(li);
            }
        });