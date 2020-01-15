const parseArgse = require("minimist");
var fs = require("fs");
// const colors = require("colors");
const command = parseArgse(process.argv.slice(2, 3));
delete command._;
console.log(command);

const handleCommand = ({ add, remove, list }) => {
  //   console.log(add, remove, list);
  if (add) {
    if (typeof add !== "string") {
      return console.log("nazwe dodawanego zadania to musi byc tekst!");
    } else if (add.length < 4) {
      return console.log("nazwa zadania musi być dłuższa niż 4 znaki");
    }
    handleData(1, add);
  } else if (remove) {
    if (typeof remove !== "string" || remove.length < 4) {
      return console.log(
        "wpiszm nazwe uswanego zadania, to musi być text, i musi być dłzuszy niż 4 znaki"
      );
    }
    handleData(2, remove);
  } else if (list || list === "") {
    handleData(3, null);
  } else {
    console.log(`Nie rozumiem polecenia. Użyj --add="Nazwa zadania"`);
  }
};
const handleData = (type, title) => {
  //type -number (1- add, 2 - remove, 3-list)
  // title  (string || null)

  const data = fs.readFileSync("data.json");
  // let data = fs.readFileSync("data.json");
  // data = data.toString();
  let tasks = JSON.parse(data);
  // console.log(tasks);

  if (type === 1 || type === 2) {
    const isExisted = tasks.find(task => task.title === title) ? true : false;
    if (type === 1 && isExisted) {
      return console.log("Takie zadanie juz istnieje!");
    } else if (type === 2 && !isExisted) {
      return console.log("Nie mogę usunąć nie istniejącego zadania");
    }
  }
  let dataJSON = "";
  switch (type) {
    case 1:
      tasks = tasks.map((task, index) => ({
        id: index + 1,
        title: task.title
      }));
      // console.log(tasks);

      console.log("dodaj zadanie");
      const id = tasks.length + 1;
      tasks.push({ id, title });
      dataJSON = JSON.stringify(tasks);
      // console.log(dataJSON);
      fs.writeFileSync("data.json", dataJSON);
      console.log(`dodaje zadanie: ${title}`);
      break;
    case 2:
      const index = tasks.findIndex(task => task.title === title);
      tasks.splice(index, 1);
      tasks = tasks.map((task, index) => ({
        id: index + 1,
        title: task.title
      })); // program nie zapisuje poprawnie do pliku
      console.log(tasks);
      fs.writeFile("data.json", dataJSON, "utf8", err => {
        if (err) throw err;
        console.log(`zadani ${title} zostało usunięte`);
      });
      break;
    case 3:
      console.log(`lista zadań do zrobienia: ${tasks.length} pozycji`);
      if (tasks.length) {
        tasks.forEach((task, index) => console.log(task.title));
      }
      break;
  }
  console.log(tasks);
};
handleCommand(command);
