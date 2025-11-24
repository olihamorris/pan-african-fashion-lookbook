// Put the header HTML inside the <header> element
document.querySelector("header").innerHTML = `
  <h1>Pan-African Fashion Directory</h1>
  <nav>
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
  </nav>
`;

// Put the footer HTML inside the <footer> element
document.querySelector("footer").innerHTML = `
  <p>&copy; <span id="year"></span> | Pan-African Fashion Directory</p>
  <p>Last Updated: <span id="lastModified"></span></p>
`;

// Set Year
document.getElementById("year").textContent = new Date().getFullYear();

// Set Last Modified Full Format: Day, Month Day, Year
const lastMod = new Date(document.lastModified);
const formatted = lastMod.toLocaleDateString(undefined, {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});

document.getElementById("lastModified").textContent = formatted;