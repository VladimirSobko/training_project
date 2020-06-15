const tasks = [
  {
    _id: '1x2v3',
    completed: true,
    body: 'занятия в онлайн школе по субботам и воскресеньям ' ,
    title: 'Изучение английского языка',
  },
  {
    _id: '1x234z',
    completed: false,
    body:
      'изучение JavaScript в онлайн академии Udemy каждый день',
      title: 'JavaScript',
  },
  {
    _id: '1x2dddd34z',
    completed: true,
    body:
      'занятия спортом по выходным',
    title: 'Бокс',
  },
  {
    _id: '1x234z444',
    completed: false,
    body:
      'поиск подходящего автомобиля на интернет ресурсах, консультация с менеджером по продажам',
    title:
      'покупка нового автомбиля',
  },
];

 document.body.style.background = "#6464af";



(function(arrOfTasks) {
  const objOfTask = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;},{}); // получаем обьъект обьъектов каждой отдельногй задачи, для удобьства обьращения, где ключ это айди.



  //elements UI
  const listContainer = document.querySelector(".tasks-list-section .list-group");
  const form = document.forms['addTask']; //данное свойсто выводит коллекцию всех форм на странице по ее атрибуту, а именно имени.
  const inputTitle = form.elements['title']; // при помощи свойства elements  по айди или имени можно получить доступ к каждому элементу
  const inputBody = form.elements['body'];

  let articleOfEmpty;

  renderTasks(objOfTask);

//events
  form.addEventListener('submit', onFormSubmit);
  listContainer.addEventListener('click', onDeleteHandler); //вешаем обработчик на весь список который динамически генерируется
  listContainer.addEventListener('click', completedTask);


//В каждый элемент li добавить кнопку которая будет делать задачу выполненной. завершенные задачи должны быть подсвечены любым цветом.
function completedTask(event){ // реализуем функционал который при нажатии на task completed  отмечает задачу зеленым цветом.
    if(event.target.classList.contains('btn-success')){   
     event.target.closest('li').style.background = "#6aec6a";
     const parentElem = event.target.closest('[data-task-id]');
     const id = parentElem.dataset.taskId;
   }
};

  function renderTasks(taskList){
    if(!taskList){
      console.error("передайте список задач");
      return;
    } 
    const fragment = document.createDocumentFragment();
    Object.values(taskList).forEach(task => {
      const li = listItemTemplate(task);
      fragment.appendChild(li);
    });
    listContainer.appendChild(fragment);
  }

  function listItemTemplate({_id, title, body} = {}){ // функция принимает одну задачу (task) для удобьства мы сразу деструктурируем обьъект task и выводим ключи
    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "align-items-center", 
      "flex-wrap", "mt-2"
      );

    li.setAttribute('data-task-id', _id);
    const span = document.createElement('span');
    span.textContent = title;
    span.style.fontWeight = "bold";

    const deleteBtn = document.createElement('button'); 
    deleteBtn.textContent = 'Delete task';
    deleteBtn.classList.add('btn', 'btn-danger', 'ml-auto', 'delete-btn');

    const completedBtn = document.createElement('button'); 
    completedBtn.textContent = 'Task completed';
    completedBtn.classList.add('ml-auto', 'btn', 'btn-success');
   
    const article = document.createElement('p');
    article.textContent = body;
    article.classList.add('mt-2', 'w-100');

    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(article);
    li.appendChild(completedBtn);

    return li;
  }

  function onFormSubmit(event){
    event.preventDefault();
    const titleValue = inputTitle.value; //в каждом инпуте есть текущее значение, мы можем обратиться к ниму через input.value
    const bodyValue = inputBody.value;

    if(!titleValue || !bodyValue){
      alert("вы не ввели данные");
      return;
    }
    const task = createNewTask(titleValue, bodyValue);
    const listItem = listItemTemplate(task);
    if(task){
      articleOfEmpty.remove();
    }
    
    listContainer.insertAdjacentElement('afterbegin', listItem);
    form.reset(); //данный метод очищает поле формы
  }

 function createNewTask(title, body, completed){
  const newTask = {
    title,
    body,
    completed: false,
    _id: `task-${Math.random()}`,
  };

  objOfTask[newTask._id] = newTask;
  return {...newTask}; //для будущего использования возвращаю копию объекта через оператор rest.
 }

 function deleteTask(id){
  const {title} = objOfTask[id];
  const isConfirm = confirm(`точно вы хотите удалить задачу: ${title}?`);
  if(!isConfirm) return isConfirm; //если пользователь ответил отменой, то мы просто возвращаем isConfirm false.
  delete objOfTask[id]; //если пользователь согласился, то мы удаляем задачу и возвращаем isConfirm true
  return isConfirm;
 }

 function deleteTaskFromHtml(confirmed, element){
  let count = listContainer.children.length;
  if(!confirmed) return;
  //выводить собщение если я удалю все задачи.
  element.remove();
  count--;
  if(count === 0){
    return ifNoTask();

  }
 }

 function onDeleteHandler(event){ //при клике на весь список мы определяем на каком элементе произощел клик  и если элемент имеет класс delete-btn  то тогда мы находим родителя по атрибуту data-task-id  предворительно мы его добавили для удобста и определения какой имеено элемент мы хотим удалить из дома.
  if(event.target.classList.contains('delete-btn')){
    const parent = event.target.closest('[data-task-id]');
    const id = parent.dataset.taskId;
    const confirmed = deleteTask(id); //получаем статус 
    deleteTaskFromHtml(confirmed, parent);
  } 
 }

 function ifNoTask(){ // реализуем функцию, если отсутствуют задачи в массиве task или все задачи удаленны, выводить надпись "задачи отсутствуют"
    let firstDiv = document.querySelector('#firstDiv');
    articleOfEmpty = document.createElement("span");
    articleOfEmpty.textContent = "В вашем списке задачи отсутствуют.";
    firstDiv.appendChild(articleOfEmpty);
    articleOfEmpty.style.marginLeft = "320px";
    articleOfEmpty.style.fontSize = "large";
    articleOfEmpty.style.fontWeight = "500";

    }

    //1. Если массив с задачами пустой то под формой нужно выводить сообщение об этом
    if(tasks.length === 0){
      ifNoTask();
    }


})(tasks);

 




