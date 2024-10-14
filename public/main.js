//Declaracion de constantes
const ul = document.getElementById('listaTareas');
const licontainer = document.querySelector('.li-container');
const empty = document.querySelector('.empty');

const agregarTareaALista = async (tarea) => {
    console.log(tarea);
    const div = document.createElement('div');
    const controw = document.createElement('div');
    const li = document.createElement('li');
    //Creacion del elemento para contener el nombre de la tarea
    const p = document.createElement('p');
    const descripcion = document.createElement('p');
    const date = document.createElement('p');
    p.textContent = tarea['nombre'];
    if(tarea['completada']){
        p.className = 'text-done';
    }else{
        p.className = 'li-text';
    }
    descripcion.textContent = tarea['descripcion'];
    descripcion.className = 'li-text';
    date.textContent = tarea['fecha'];
    date.className = 'li-text';
    div.className = 'contenedortareainfo';
    controw.className = 'controw';
    div.appendChild(FDoneInp(tarea['id'], tarea['completada']));
    div.appendChild(p);
    div.appendChild(date);
    div.appendChild(FDeleteBtn(tarea['id']));
    controw.appendChild(date);
    if(tarea['descripcion'] != ''){
        controw.appendChild(descripcion);
    }
    li.appendChild(div);
    li.append(controw);
    ul.appendChild(li);
}

const agregarTarea = async () => {
    console.log('Agreagr');
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    const nombre = document.querySelector('#nombre').value;
    const descripcion = document.querySelector('#descripcion').value;

    if (nombre.trim() === '') {
    alert('Por favor, ingresa un titulo para la tarea');
    return;
    }
    const values = {nombre:nombre, descripcion:descripcion, fecha:today};
    const response = await fetch('http://localhost:3000/tareas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
    });
    const tarea = await response.json();
    ul.innerHTML = '';
    obtenerLista();
};

async function obtenerLista() {
    const response = await fetch('http://localhost:3000/tareas');
    const data = await response.json();
    console.log(Object.keys(data.tareas).length)
    if(Object.keys(data.tareas).length >= 1){
        console.log(data.leght);
        empty.style.display = 'none';
        data.tareas.forEach((tarea) => agregarTareaALista(tarea));
        licontainer.style.display = 'block';
    }else{
        licontainer.style.display = 'none';
        empty.style.display = 'block';
    }
};
document.addEventListener('DOMContentLoaded', obtenerLista);


obtenerLista();

//Funcion de Tarea completada
function FDoneInp(id,done){
    //Input tipo checkbox para marcar tarea
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'input-check';
    if(done){
        checkbox.checked = 'true';
    }
    //Evento para cambiar estilo de texto
    checkbox.addEventListener('change', async (e)=> {
        //Obtener item
        const item = e.target.parentElement;
        if (checkbox.checked) {
            //Cambiar clase de p del item seleccionado == check sea true
            try{
                let result = await updateTareadone(id);
                if (result && result.message) {
                item.querySelector('p').className = 'text-done';
                }else {
                    alert('Error al actualizar la tarea');
                }
            }catch (error) {
            alert('Actualizar: Error al comunicarse con el servidor');
            }
             
        } else {
            //Cambiar clase de p del item desseleccionado == check es false
            try{
                let result = await updateTareaundone(id);
                if (result && result.message) {
                    item.querySelector('p').className = 'li-text';
                }else {
                    alert('Error al actualizar la tarea');
                }
            }catch (error) {
            alert('Actualizar: Error al comunicarse con el servidor');
            }
            
        } 
    })
    return checkbox;
}


//Funcion para eliminar tarea
function FDeleteBtn(id){
    //Creacion del bonton para eliminar tarea
    const deleteBtn = document.createElement('button');
    //Texto del boton
    deleteBtn.textContent = 'x';
    //Clase del boton
    deleteBtn.className = 'btn-delete';
    //Evento para cuando se haga click en el boton
    deleteBtn.addEventListener('click', async () => {
        try {
            let result = await deleteTarea(id);
            
            if (result && result.message) {
                ul.innerHTML = '';
                obtenerLista(); // Actualizar la lista si la eliminación fue exitosa
            } else {
                alert('Error al eliminar la tarea');
            }
        } catch (error) {
            alert('Eliminar: Error al comunicarse con el servidor');
        }
    });
    //Retornar elemento eliminar boton
    return deleteBtn;
}

async function deleteTarea(id) {
    let result = null;
    try {
        const response = await fetch(`http://localhost:3000/tareas/${id}`,
            {
                method: 'DELETE'
            });

        result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al eliminar el item');
        }
    } catch (error) {
        console.error('Error al eliminar el item:', error);
    }
    return result;
}

async function updateTareadone(id) {
    let result = null;
    try {
        const response = await fetch(`http://localhost:3000/tareadone/${id}`);

        result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al actualizar el item');
        }
    } catch (error) {
        console.error('Error al actualizar el item:', error);
    }
    return result;
}

async function updateTareaundone(id) {
    let result = null;
    try {
        const response = await fetch(`http://localhost:3000/tareaundone/${id}`);

        result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al actualizar el item');
        }
    } catch (error) {
        console.error('Error al actualizar el item:', error);
    }
    return result;
}