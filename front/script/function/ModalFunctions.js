function openModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = "block"
    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal(id)
        }
    }
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}