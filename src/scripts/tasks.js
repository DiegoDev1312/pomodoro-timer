const addTaskArea = document.querySelector('[data-add-task-area]');
const addTaskButton = document.querySelector('[data-add-task-button]');
const addTaskCancelButton = document.querySelector('[data-cancel-task-button]');
const inputTask = document.querySelector('[data-task-name]');
const saveButtonTask = document.querySelector('[data-save-task-button]');
const messageError = document.querySelector('[data-message-task-error]');

// tratando ao clicar no check icon
function handleConfirmPress(cardTask, checkIcon) {
    const taskList = JSON.parse(localStorage.getItem('@task-user')) || [];

    if (cardTask.classList.contains('task-unchecked')) {
        cardTask.classList.remove('task-unchecked');
        cardTask.classList.add('task-checked');
        checkIcon.src = 'src/images/unchecked-icon.svg';

    } else {
        cardTask.classList.remove('task-checked');
        cardTask.classList.add('task-unchecked');
        checkIcon.src = 'src/images/check-icon.svg';
    }

    // atualizando o localStorage para tarefa concluída/incompleta
    const updateTaskList = taskList.map((userTask) => {
        if (String(userTask.id) === cardTask.attributes['task-card-id'].value) {
            const changeChecked = {
                ...userTask,
                isChecked: !userTask.isChecked,
            };
            return changeChecked;
        }
        return userTask;
    });
    localStorage.setItem('@task-user', JSON.stringify(updateTaskList));
}

// tratando ao clicar na lixeira
function handleDeletePress(cardTask) {
    const userTaskList = JSON.parse(localStorage.getItem('@task-user')) || [];
    cardTask.classList.add('hide-item');
    
    setTimeout(() => {
        const newJsonList = userTaskList.filter((userTask) => {
            return String(userTask.id) !== cardTask.attributes['task-card-id'].value;
        });
        localStorage.setItem('@task-user', JSON.stringify(newJsonList));
        cardTask.remove();
    }, 500);
}

// aplicando edições ao clicar em confirmar
function handleConfirmEdit(inputValue, oldCardText, taskArea, editArea) {
    if (inputValue.trim()) {
        const taskList = JSON.parse(localStorage.getItem('@task-user')) || [];

        const newTaskDescription = document.createElement('p');
        newTaskDescription.textContent = inputValue;
        newTaskDescription.classList.add('description-task-text');

        editArea.remove();
        taskArea.querySelector('.action-icon-area').before(newTaskDescription);

        if (inputValue !== oldCardText) {
            const updateTaskList = taskList.map((userTask) => {
                if (String(userTask.id) === taskArea.attributes['task-card-id'].value) {
                    const changeChecked = {
                        ...userTask,
                        title: inputValue,
                    };
                    return changeChecked;
                }
                return userTask;
            });
            localStorage.setItem('@task-user', JSON.stringify(updateTaskList));
        }
    } else {
        alert('Insira um nome válido!');
    }
}

// tratanto ao clicar na caneta
function handleEditPress(taskArea) {
    const cardText = taskArea.querySelector('p').innerHTML;
    taskArea.querySelector('p').remove();

    const editInputArea = document.createElement('div');
    editInputArea.style.display = 'flex';
    editInputArea.style.gap = '10px';
    editInputArea.style.alignItems = 'center';

    const editInput = document.createElement('input');
    editInput.placeholder = 'Digite o novo nome...'
    editInput.value = cardText;
    editInput.style.padding = '6px';

    const editInputConfirm = document.createElement('img');
    editInputConfirm.src = 'src/images/check-icon.svg' ;
    editInputConfirm.addEventListener('click', () => handleConfirmEdit(editInput.value, cardText, taskArea, editInputArea));
    editInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleConfirmEdit(editInput.value, cardText, taskArea, editInputArea)
        }
    });
    editInputArea.append(editInput, editInputConfirm);
    taskArea.querySelector('.action-icon-area').before(editInputArea);
}

function updateUserStorage(textValue) {
    const userTaskList = JSON.parse(localStorage.getItem('@task-user')) || [];
    const newText =  {
        title: textValue,
        id: userTaskList.length + 1,
        isChecked: false,
    };
    const storageBody = [...userTaskList, newText];
    localStorage.setItem('@task-user', JSON.stringify(storageBody));
}

// criação de uma nova tarefa.
function createTask(taskName, isInit, isChecked, id) {
    const userTaskList = JSON.parse(localStorage.getItem('@task-user')) || [];

    // area da tarefa no geral
    const taskArea = document.createElement('div');
    taskArea.classList.add('task-area');
    taskArea.classList.add(isChecked ? 'task-checked' : 'task-unchecked');
    taskArea.setAttribute('task-card-id', id || userTaskList.length + 1)

    // descrição da tarefa
    const taskDescription = document.createElement('p');
    taskDescription.textContent = taskName;
    taskDescription.classList.add('description-task-text');
    
    // area de opções do card
    const optionTaskArea = document.createElement('div');
    optionTaskArea.classList.add('action-icon-area');

    // icon de confirmar task
    const checkIcon = document.createElement('img');
    checkIcon.src = !isChecked ? 'src/images/check-icon.svg' : 'src/images/unchecked-icon.svg';
    checkIcon.addEventListener('click', () => handleConfirmPress(taskArea, checkIcon));

    // icon de excluir
    const binIcon = document.createElement('img');
    binIcon.src = 'src/images/bin-icon.svg';
    binIcon.addEventListener('click', () => handleDeletePress(taskArea));

    // icon de editar
    const editIcon = document.createElement('img');
    editIcon.src = 'src/images/pen-icon.svg';
    editIcon.addEventListener('click', () => handleEditPress(taskArea));

    optionTaskArea.append(checkIcon, binIcon, editIcon);
    taskArea.append(taskDescription, optionTaskArea);
    addTaskArea.before(taskArea);

    if (!isInit) {
        updateUserStorage(taskName);
    }
}

function handleAddTaskPress() {
    addTaskArea.style.display = 'flex';
    inputTask.focus();
}

function handleAddTaskCancel() {
    addTaskArea.style.display = 'none';
    inputTask.value = '';
}

function handleSaveButtonPress() {
    messageError.style.display = !inputTask.value ? 'block' : 'none';
    if (!inputTask.value) return;

    createTask(inputTask.value);
    inputTask.value = '';
}

function handleChangeInput() {
    messageError.style.display = 'none';
}

function init() {
    const userTaskList = JSON.parse(localStorage.getItem('@task-user')) || [];
    
    if (userTaskList.length) {
        for (const task of userTaskList) {
            createTask(task.title, true, task.isChecked, task.id);
        }
    }
}

addTaskButton.addEventListener('click', handleAddTaskPress);
addTaskCancelButton.addEventListener('click', handleAddTaskCancel);
saveButtonTask.addEventListener('click', handleSaveButtonPress);
inputTask.addEventListener('input', handleChangeInput);

init();
