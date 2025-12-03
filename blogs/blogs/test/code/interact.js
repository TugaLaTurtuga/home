console.log("js code linked thru test.html")
document.getElementById("interact").addEventListener("click", () => {
    document.getElementById("interact").textContent = "Interacted";
})