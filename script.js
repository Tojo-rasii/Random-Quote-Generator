document.addEventListener("DOMContentLoaded", function() {
const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
];

function generateQuote() {
    fetch('https://api.quotable.io/random')
        .then(response => response.json())
        .then(data => {
            const randomQuote = data.content;
            const randomAuthor = data.author;
            document.getElementById("quoteText").innerText = randomQuote;
            document.getElementById("quoteAuthor").innerText = `– ${randomAuthor}`;

             // Appeler fetchAuthorImage pour obtenir l'image de l'auteur
             fetchAuthorImage(randomAuthor);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de la citation :', error);
            document.getElementById("quoteText").innerText = "Erreur lors de la récupération de la citation.";
            document.getElementById("quoteAuthor").innerText = "";
        });
}
function speakQuote() {
    const quoteText = document.getElementById("quoteText").innerText;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(quoteText);
    // Utilisation de "auto" comme langue pour détecter automatiquement la langue
    utterance.lang = "auto";
    synth.speak(utterance);

    // Créer le contenu HTML de la notification toast avec l'icône Bootstrap et le texte
    const toastContent = document.createElement('div');
    toastContent.innerHTML = `
<div class="toast-icon"><i class="bi-volume-up-fill">&nbsp;La fonctionnalité vocale fonctionne !</i></div>
`;

    Toastify({
        node: toastContent,
        duration: 3000,
        gravity: "bottom",
        style: {
            background: "#007bff",
            color: "#fff",
            position: "absolute",
            left: "30%",
            transform: "translateX(-50%)",
            zIndex: "9999",
            width: "80%",
            maxWidth: "max-content",
            fontFamily: "Nunito, sans-serif",
            fontSize: "1.2em",
            padding: "0.3em",
            borderRadius: "5px",
            marginBottom: "10px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            transition: "opacity 0.3s ease-in-out",
            textTransform: "normal"
        },
    }).showToast();

}

function copyToClipboard() {
    const quoteText = document.getElementById("quoteText").innerText;
    navigator.clipboard.writeText(quoteText)
        .then(() => {
            // Créer le contenu HTML de la notification toast avec l'icône Bootstrap et le texte
            const toastContent = document.createElement('div');
            toastContent.innerHTML = `
    <div class="toast-icon"><i class="bi bi-check-circle-fill">&nbsp;Le texte a été copié dans le presse-papiers !</i></div>
`;

            Toastify({
                node: toastContent,
                duration: 3000,
                gravity: "bottom",
                style: {
                    background: "#007bff",
                    color: "#fff",
                    position: "absolute",
                    left: "30%",
                    transform: "translateX(-50%)",
                    zIndex: "9999",
                    width: "80%",
                    maxWidth: "max-content",
                    fontFamily: "Nunito, sans-serif",
                    fontSize: "1.2em",
                    padding: "0.3em",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                    transition: "opacity 0.3s ease-in-out",
                    textTransform: "normal"
                },
            }).showToast();
        })
        .catch((err) => {
            console.error('Erreur lors de la copie dans le presse-papiers :', err);
            Toastify({
                text: "Erreur lors de la copie dans le presse-papiers",
                duration: 3000,
                gravity: "top",
                position: "center",
            }).showToast();
        });
}

// Ouvrir la boîte modale de sélection de langue
document.getElementById("TranslateBtn").addEventListener("click", function () {
    const modal = document.getElementById("languageModal");
    modal.style.display = "block";

    // Fermer la boîte modale lorsque l'utilisateur clique sur le bouton de fermeture
    const closeBtn = modal.querySelector(".close");
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Gérer la sélection de la langue lorsque l'utilisateur clique sur un bouton de langue
    const languageList = document.getElementById("languageList");
    languageList.addEventListener("click", function (event) {
        if (event.target.tagName === "BUTTON") {
            const selectedLang = event.target.getAttribute("data-lang");
            translateQuote(selectedLang);
            modal.style.display = "none";
        }
    });
});

// Fonction de traduction mise à jour pour accepter la langue cible en paramètre
function translateQuote(targetLang) {
    const quoteText = document.getElementById("quoteText").innerText;

    // Appel à l'API Google Translate
    $.ajax({
        url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(quoteText)}`,
        type: 'GET',
        success: function (response) {
            const translatedText = response[0][0][0];
            document.getElementById("quoteText").innerText = translatedText;


        },
        error: function (error) {
            console.error('Erreur lors de la traduction :', error);

        }
    });
}
// Fonction de récupération de l'image de l'auteur
function fetchAuthorImage(authorName) {
    const clientId = 'g8Y4WOIfbKD4nxzIZjy62q5zw8ziVjLZphsVS13zVK8';
    const apiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(authorName)}&client_id=${clientId}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Rate Limit Exceeded');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.urls && data.urls.regular) {
                const authorImage = data.urls.regular;
                document.getElementById("authorImage").src = authorImage;
            } else {
                console.error('Aucune image trouvée pour cet auteur.');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de l\'image de l\'auteur :', error.message);
            if (error.message === 'Rate Limit Exceeded') {
                // Afficher une notification Toastify en bas de la page
                Toastify({
                    text: "Limite de taux dépassée pour l'image. Attendez un moment avant de réessayer.",
                    duration: 5000, // Durée de la notification en millisecondes (5 secondes dans cet exemple)
                    gravity: 'bottom', // Position de la notification (bas de la page) // Couleur de fond de la notification (rouge dans cet exemple)
                    style: {
                        background: "#007bff",
                        color: "#fff",
                        position: "absolute",
                        left: "30%",
                        transform: "translateX(-50%)",
                        zIndex: "9999",
                        width: "80%",
                        maxWidth: "max-content",
                        fontFamily: "Nunito, sans-serif",
                        fontSize: "1.2em",
                        padding: "0.3em",
                        borderRadius: "5px",
                        marginBottom: "10px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                        transition: "opacity 0.3s ease-in-out",
                        textTransform: "normal"
                    },
                }).showToast();
            }
        });
}





// Appeler generateQuote dès le chargement de la page
window.addEventListener("load", generateQuote);
document.getElementById("generateBtn").addEventListener("click", generateQuote);
document.getElementById("VoiceBtn").addEventListener("click", speakQuote);
document.getElementById("CopyBtn").addEventListener("click", copyToClipboard);
document.getElementById("TranslateBtn").addEventListener("click", translateQuote);

});
