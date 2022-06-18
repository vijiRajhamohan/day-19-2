
//URL
const API_URL = "https://www.mecallapi.com/api/users";

//Read method
function loadUsers() {
  //http request
  const http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    const { readyState, status, responseText } = this;
    if (readyState === 4 && status === 200) {
      let users = JSON.parse(responseText);
      console.log(users);

      // mapping the API
      users = users.map((u) => {
        return `<tr>
                <td>${u.id}</td>
                <td>
                <img width="50px" src="${u.avatar}" class="avatar"></td>
                <td>${u.fname}</td>
                <td>${u.lname}</td>
                <td> ${u.username}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="populateUser(${u.id})">Edit</button>
                    <button  class="btn btn-sm btn-danger" onclick="deleteUser(${u.id})">Delete</button>
                </td>
       </tr> `;
      });
      document.getElementById("content").innerHTML = users.join("");
    }
  };
  http.open("GET", API_URL);
  http.send();
}
loadUsers();

//Create Method
function createUsers(evt) {
  evt.preventDefault(); // prevent default behaviour of page
  const id = document.getElementById("userId").value;
  const fname = document.getElementById("fname").value;
  const lname = document.getElementById("lname").value;
  const email = document.getElementById("email").value;
  const avatar = document.getElementById("avatar").value;
  const formData = { fname, lname, username: email, email, avatar };

  //common in both create and update
  const http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    const { readyState, status, responseText } = this;
    if (readyState === 4 && status === 200) {
      const response = JSON.parse(responseText);
      console.log(response);
      if (response.status === "ok") {
        document.getElementById("userForm").reset();
        loadUsers();
        document.getElementById("success").style.display = "block";
        setTimeout(() => {
          document.getElementById("success").style.display = "none";
        }, 3000);
      } else {
        document.getElementById("error").style.display = "block";
        setTimeout(() => {
          document.getElementById("error").style.display = "none";
        }, 3000);
      }
    }
  };

  // Is ID there it is UPDATE
  if (id) {
    http.open("PUT", `${API_URL}/update`);
    http.setRequestHeader("content-Type", "application/json");
    http.send(JSON.stringify({ id, ...formData }));
  }

  //Is no ID ..it is CREATE
  else {
    http.open("POST", `${API_URL}/create`);
    http.setRequestHeader("content-Type", "application/json");
    http.send(JSON.stringify({ ...formData }));
  }
}

//update
function populateUser(id) {
  const http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    const { readyState, status, responseText } = this;
    if (readyState === 4 && status === 200) {
      const {
        status,
        user: { fname, lname, email, avatar },
      } = JSON.parse(responseText);
      //console.log(response);
      if (status === "ok") {
        document.getElementById("userId").value = id;
        document.getElementById("fname").value = fname;
        document.getElementById("lname").value = lname;
        document.getElementById("email").value = email;
        document.getElementById("avatar").value = avatar;
      }
    }
  };
  http.open("GET", `${API_URL}/${id}`);
  http.send();
}

//Delete
function deleteUser(id) {
  const http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    const { readyState, status, responseText } = this;
    if (readyState === 4 && status === 200) {
      const { status, message } = JSON.parse(responseText);
      if (status === "ok") {
        const success = document.getElementById("success");
        success.innerHTML = message;
        success.style.display = "block";
        setTimeout(
          () => (document.getElementById("success").style.display = "none"),
          3000
        );
        loadUsers();
      } else {
        const error = document.getElementById("error");
        error.innerHTML = message;
        error.style.display = "block";
        setTimeout(
          () => (document.getElementById("error").style.display = "none"),
          3000
        );
      }
    }
  };
  http.open("DELETE", `${API_URL}/delete`);
  http.setRequestHeader("content-Type", "application/json");
  http.send(JSON.stringify({ id }));
}
