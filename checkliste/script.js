
    const inputField = document.getElementById('item');
    const list = document.getElementById('list');

    // 1. Beim Laden der Seite: Liste aus dem Speicher laden
    function loadItems() {
        const storedItems = localStorage.getItem('checklistItems');
        if (storedItems) {
            list.innerHTML = storedItems;
        }
    }

    // 2. Zustand in localStorage speichern
    function saveItems() {
        // HINWEIS: list.innerHTML zu speichern ist die einfachste, aber nicht die robusteste Methode. 
        // Für dieses kleine Projekt ist es aber okay.
        localStorage.setItem('checklistItems', list.innerHTML);
    }
    
    // 3. Element zur Liste hinzufügen und speichern
    function Additem() {
        if (inputField.value.trim() === "") {
            return; // Fügt keine leeren Einträge hinzu
        }
        // Fügt die Checkbox und den Text hinzu
        list.innerHTML += `<li><input type="checkbox" class="delete-checkbox"> ${inputField.value.trim()}</li>`;
        inputField.value = "";
        saveItems();
    }

    // Event-Listener für das Hinzufügen (Button)
    document.querySelector('button').addEventListener('click', Additem);

    // Event-Listener für das Hinzufügen (Enter-Taste)
    inputField.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Verhindert standardmäßiges Formular-Verhalten (falls es ein Formular wäre)
            Additem(); 
        }
    });

    // Event-Listener für das Löschen und das Durchstreichen (Checkbox)
    list.addEventListener('click', function(e) {
        if (e.target && e.target.nodeName === "LI") {
            // ALT: Wenn man auf den Text klickt, wird es gelöscht.
            e.target.remove();
            saveItems(); 
        } else if (e.target && e.target.classList.contains("delete-checkbox")) {
            // NEU: Wenn man auf die Checkbox klickt, wird die Klasse "completed" umgeschaltet
            e.target.parentElement.classList.toggle("completed");
            saveItems(); // Liste nach Statusänderung speichern
        }
    });

    // Event-Listener für den Tooltip
    list.addEventListener('mouseover', function(e) {
        if (e.target && e.target.nodeName === "LI") {
            e.target.title = "Klicken zum Entfernen | Checkbox zum Markieren";
        }
    });

    // Liste einmal beim Laden initialisieren
    loadItems();