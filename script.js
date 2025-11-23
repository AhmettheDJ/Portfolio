  /*  Noch im bearbeitung
  
  // Spracheinstellung speichern und laden
            let currentLanguage = localStorage.getItem('portfolioLanguage') || 'de';
            
            // Alle Elemente mit Sprach-Attributen übersetzen
            function setLanguage(lang) {
                currentLanguage = lang;
                localStorage.setItem('snakeGameLanguage', lang);
                
                // Alle Elemente mit data-de und data-en Attributen durchgehen
                document.querySelectorAll('[data-de][data-en]').forEach(element => {
                    const text = element.getAttribute(`data-${lang}`);
                    // Nur Text-Knoten ersetzen, keine Kind-Elemente
                    if (element.id === 'game-over-text') {
                        element.innerHTML = text + '<span id="final-score">0</span>';
                    } else {
                        element.textContent = text;
                    }
                });
                
                // Sprachschalter aktualisieren
                document.querySelectorAll('.lang-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('data-lang') === lang) {
                        btn.classList.add('active');
                    }
                });
            }
            
            // Sprach-Buttons initialisieren
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    setLanguage(btn.getAttribute('data-lang'));
                });
            });
            
            // Initiale Sprache setzen
            setLanguage(currentLanguage); 
*/
                function toggleTheme() {
                    document.body.classList.toggle('dark');
                    document.querySelector('main').classList.toggle('dark');
                    const btn = document.getElementById('theme-toggle');
                    if (document.body.classList.contains('dark')) {
                        btn.textContent = "☀️ Theme";
                        btn.style.background = "#ffd54f";
                        btn.style.color = "#000";
                    } else {
                        btn.textContent = "🌙 Theme";
                        btn.style.background = "#7b1fa2";
                        btn.style.color = "#fff";
                    }
                }    
 
       //------------------------------=================================================------------------------------------------
 

            // Set initial theme icon based on system preference
            window.addEventListener('DOMContentLoaded', () => {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark && !document.body.classList.contains('dark')) {
                    toggleTheme();  
                }
            });
                    function animateOnScroll() {
                const elements = document.querySelectorAll('.project, .skills li');

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }
                    });
                }, { threshold: 0.1 });

                elements.forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    observer.observe(el);
                });
            }

            // Initialisierung
            window.addEventListener('DOMContentLoaded', () => {
             animateOnScroll();

    });

            //array for generating new projects,Do later


            // Warnung für noch nicht fertige Projekte - nur beim Klicken
            window.addEventListener('DOMContentLoaded', () => {
                const workLinks = document.querySelectorAll('a.WORK');
                workLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        alert("⚠️ Dieses Projekt ist noch in Bearbeitung!");
                    });
                });
            });


        // captcha for mail and number 
        function generateCaptcha() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let captcha = '';
            for (let i = 0; i < 6; i++) {
                captcha += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return captcha;
        }

        function displayCaptcha() {
            const captcha = generateCaptcha();
            document.getElementById('captcha-display').textContent = captcha;
            return captcha;
        }


        