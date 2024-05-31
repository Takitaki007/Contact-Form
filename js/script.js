function getCurrentDateTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var day = ("0" + now.getDate()).slice(-2);
  var hours = ("0" + now.getHours()).slice(-2);
  var minutes = ("0" + now.getMinutes()).slice(-2);
  return year + "/" + month + "/" + day + " " + hours + ":" + minutes;
}

function saveOrUpdateData() {
  var name = document.getElementById("name").value;
  var phone = document.getElementById("phone").value;
  var email = document.getElementById("email").value;
  var dateTime = getCurrentDateTime();

  // Validate form inputs
  if (!name) {
      alert("Please enter a name.");
      return;
  }

  if (!phone) {
      alert("Please enter a phone number.");
      return;
  }

  if (isNaN(phone)) {
      alert("Please enter a valid phone number containing only digits.");
      return;
  }

  if (!email) {
      alert("Please enter an email.");
      return;
  }

  if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
  }

  var table = document.getElementById("dataTable").getElementsByTagName("tbody")[0];
  var saveBtn = document.getElementById("saveBtn");

  if (saveBtn.innerText === "Save") {
      // Add new row
      var newRow = table.insertRow(table.rows.length);

      newRow.innerHTML = `
          <td>${table.rows.length + 1}</td>
          <td>${name}</td>
          <td>${phone}</td>
          <td>${email}</td>
          <td>${dateTime}</td>
          <td>
              <button class="btn btn-primary" onclick="editData(this)">Edit</button>
              <button class="btn btn-danger" onclick="deleteData(this)">Delete</button>
          </td>
      `;

      // Add to local storage
      var data = JSON.parse(localStorage.getItem("data")) || [];
      data.push({ name: name, phone: phone, email: email, date: dateTime });
      localStorage.setItem("data", JSON.stringify(data));
  } else {
      // Update existing row
      var rowIndex = saveBtn.getAttribute("data-row-index");
      var row = table.rows[rowIndex];

      row.cells[1].innerText = name;
      row.cells[2].innerText = phone;
      row.cells[3].innerText = email;
      row.cells[4].innerText = dateTime;

      var data = JSON.parse(localStorage.getItem("data")) || [];
      data[rowIndex] = { name: name, phone: phone, email: email, date: dateTime };
      localStorage.setItem("data", JSON.stringify(data));

      saveBtn.innerText = "Save";
      saveBtn.removeAttribute("data-row-index");
  }

  document.getElementById("contactForm").reset();
}

function deleteData(btn) {
  var row = btn.parentNode.parentNode;
  var index = row.rowIndex - 1;

  // Delete data from local storage
  var data = JSON.parse(localStorage.getItem("data"));
  data.splice(index, 1);
  localStorage.setItem("data", JSON.stringify(data));

  row.parentNode.removeChild(row);

  updateRowNumbers();
}

function updateRowNumbers() {
  var table = document.getElementById("dataTable").getElementsByTagName("tbody")[0];
  for (var i = 0; i < table.rows.length; i++) {
      table.rows[i].cells[0].innerText = i + 1;
  }
}

function editData(btn) {
  var row = btn.parentNode.parentNode;
  document.getElementById("name").value = row.cells[1].innerText;
  document.getElementById("phone").value = row.cells[2].innerText;
  document.getElementById("email").value = row.cells[3].innerText;

  var saveBtn = document.getElementById("saveBtn");
  saveBtn.innerText = "Update";
  saveBtn.setAttribute("data-row-index", row.rowIndex - 1);
}

function loadData() {
  var data = JSON.parse(localStorage.getItem("data")) || [];
  for (var i = 0; i < data.length; i++) {
      var table = document.getElementById("dataTable").getElementsByTagName("tbody")[0];
      var newRow = table.insertRow(table.rows.length);

      newRow.innerHTML = `
          <td>${table.rows.length}</td>
          <td>${data[i].name}</td>
          <td>${data[i].phone}</td>
          <td>${data[i].email}</td>
          <td>${data[i].date}</td>
          <td>
              <button class="btn btn-primary" onclick="editData(this)">Edit</button>
              <button class="btn btn-danger" onclick="deleteData(this)">Delete</button>
          </td>
      `;
  }

  updateRowNumbers();
}

window.onload = loadData;
