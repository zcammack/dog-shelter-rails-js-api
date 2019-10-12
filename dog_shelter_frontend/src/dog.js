
class Dog {
    constructor(data) {
        this.id = data.id
        this.name = data.name 
        this.sex = data.sex
        this.age = data.age
        this.description = data.description 
        this.status = data.status
    }
}

function renderDogFormFields() {
    return `
    <label>Name: </label><br/>
    <input type="text" id="name"><br/>

    <input type="hidden" id="dogId">

    <label>Age:   </label><br/>
    <input type="integer" id="age"><br/>  

    <label>Sex:   </label><br/>
    <input type="text" id="sex"><br/>  
    
    <label>Description: </label><br/>
    <textarea id="description" rows="3" cols="20"></textarea><br/>

    <label>Status: </label><br/>
    <input type="text" id="status"><br/><br/>`

}

function renderNewDogForm() {
    let newDogFormDiv = document.getElementById('dog-form')
    newDogFormDiv.innerHTML = `
    <form onsubmit="createDog(); return false;">` + 
    renderDogFormFields() + 
    `<input type="submit" value="Add New Dog">
    </form>
    <br/>`
}

function renderEditDogForm() {
    let editDogFormDiv = document.getElementById('dog-form')
    editDogFormDiv.innerHTML = `
    <form onsubmit="updateDog(); return false;">` + 
    renderDogFormFields() + 
    `<input type="submit" value="Update Info">
    </form>
    <br/>`
}

function createDog() {
    const dog = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        sex: document.getElementById('sex').value,
        description: document.getElementById('description').value,
        status: document.getElementById('status').value,
    }

    console.log("new dog", dog)
    console.log("json", JSON.stringify(dog)) 

    fetch("http://localhost:3000/api/v1/dogs", {
        method: 'POST',
        body: JSON.stringify(dog),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    })
    .then(resp => resp.json() )
    .then(dog => {
         console.log("dog", dog)
         clearDogsHtml()
         getDogs()
         renderNewDogForm()
      });
    
}


function getDogs() {
    fetch("http://localhost:3000/api/v1/dogs")
    .then(resp => resp.json())
    .then(data => {
        renderDogsHtml(data)
        addDogsClickListeners()

    })
}

function populateDogForm(id) {
    console.log("in populateDogForm")
    fetch(`http://localhost:3000/api/v1/dogs/${id}`)
    .then(resp => resp.json())
    .then(data => {
        console.log('data', data)
        renderEditDogForm()
        let dogForm = document.getElementById('dog-form')
        dogForm.querySelector('#name').value = data.name 
        dogForm.querySelector('#dogId').value = data.id 
        dogForm.querySelector('#sex').value = data.sex
        dogForm.querySelector('#description').value = data.description
        dogForm.querySelector('#age').value = data.age
        dogForm.querySelector('#status').value = data.status
        
        
    })

    
    
    
}

function getDog(id) {
    fetch(`http://localhost:3000/api/v1/dogs/${id}`)
    .then(resp => resp.json())
    .then(data => {
        console.log(data)
        renderDogHtml(data)
        addDogsClickListeners()

    })
}

function showMoreInfo(dogId) {
    renderNewDogForm()
    getDog(dogId)
   
}

function updateDog() {

    console.log('update button clicked')
    let dogId = this.event.target.dogId.value

    const dog = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        sex: document.getElementById('sex').value,
        description: document.getElementById('description').value,
        status: document.getElementById('status').value,
    }


    fetch(`http://localhost:3000/api/v1/dogs/${dogId}`, {
        method: 'PATCH',
        body: JSON.stringify(dog),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    })
    .then(resp => resp.json() )
    .then(dog => {
         console.log("updated dog", dog)
         clearDogsHtml()
         getDogs()
         renderNewDogForm()

        });
}


function editDog(dogId) {
    console.log("dogId", dogId)
    populateDogForm(dogId)

}

function addDogsClickListeners() {
     document.querySelectorAll('.dog-name').forEach(element => {
       element.addEventListener("click", e => {
            e.preventDefault()   
            showMoreInfo(e.target.parentElement.dataset.dogId )
        })
   
    })

    document.querySelectorAll('.edit-dog-button').forEach(element => {
        element.addEventListener("click", e => {
            e.preventDefault() 
            editDog(e.target.parentElement.dataset.dogId)
        })
    })

    
}



function renderDogHtml(data) {
    let dogShow = document.querySelector(`.card[data-dog-id="${data.id}"]`)
    let additionalInfo = dogShow.querySelector('.additional-info')
    // console.log("additional info", additionalInfo)
    // console.log("!!additional info", !!additionalInfo)

    if (!!additionalInfo === false) {
        dogShow.innerHTML += `<div class="additional-info">
        <p>Description: ${data.description}</p>
        <p>Status: ${data.status}</p>
        </div>
      `
    } else {
        additionalInfo.remove('additional-info')
    }
                       

}

function clearDogsHtml() {
    let dogsIndex = document.getElementById("dogs-list")
    dogsIndex.innerHTML = ''
}

function clearDogHtml(id) {
     let dogShow = document.querySelector(`.card[data-dog-id="${id}"]`)
      
     let isAdditionalInfoDisplayed = dogShow.querySelector('.additional-info')
        console.log("add info", isAdditionalInfoDisplayed)
        console.log("!!add info", !!isAdditionalInfoDisplayed)

        if (!!isAdditionalInfoDisplayed) {
            isAdditionalInfoDisplayed.innerHTML = ''
        }
    //dogShow.innerHTML = ''

}

function renderDogsHtml(data) {
    let dogsIndex = document.getElementById("dogs-list")

    data.forEach((dog) => {
        let newDog = new Dog(dog)
        dogsIndex.innerHTML += 
        `<div class="card" data-dog-id="${dog.id}">
            <button class="edit-dog-button">Edit Info</button>  <button class="delete-dog-button">Delete Dog</button>
            </br></br>
            <strong class="dog-name">${newDog.name}</strong> 
            <p>Age: ${newDog.age} years young</p>
            <p>Sex: ${newDog.sex} </p> 
        </div>`
    });

}



 

