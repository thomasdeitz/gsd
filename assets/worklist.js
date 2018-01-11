window.onload = function() {
    var form = document.querySelector("form.wi");
    var form2 = document.querySelector("form.w");

    if (form) {
	    form.onsubmit = submitted.bind(form);
    }
    
    if (form2) {
	    form2.onsubmit = submittedw.bind(form2);
    }
    
	window.onclick = function (e) {
	    if (e.target.classList.contains('remove')) {
	        deleted(e.target.parentNode.parentNode.id);
	    } else if (e.target.classList.contains('done') ) {
		    
		    var item = e.target.parentNode.parentNode.id;
		    console.log(item);
		    done(item, 1);
	    } else if (e.target.parentNode.classList.contains('work-item')) {
	        var item = e.target.parentNode.id;
	        document.getElementsByTagName("body")[0].classList.add("claim")
	    }
	}
	
	var selectors = document.getElementsByClassName("worker-select");
	for (var i = 0; i < selectors.length; i++) {
		selectors[i].addEventListener('change',function(){
			
	    	var item = this.parentNode.parentNode.id;
	    	console.log(item);
		        updated(item, this.value);
		});
	}
	

}

function getW() {
	var headers =  new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
	
    var request = new Request('/availableworkers', {
		method: 'GET',
		headers: headers,
	});
	    
	fetch(request)
	.then((res) => res.json())
	.then((data) => {
		const ul = document.getElementById('authors');
		console.log(data);
	    let authors = data; // Get the results
		return authors.map(function(author) { // Map through the results and for each run the code below
  			let li = document.createElement('li'), //  Create the elements we need
      		span = document.createElement('span');
  			span.innerHTML = `${author.name}`; // Make the HTML of our span to be the first and last name of our author
  			li.appendChild(span);
  			ul.appendChild(li);
	    })		
	})
}

function submitted(event) {
	event.preventDefault();
	var workItem = {};
	
	workItem.name = document.querySelector('form').getElementsByTagName('input')[0].value;
	workItem.value = document.querySelector('form').getElementsByTagName('input')[1].value;

    var request = new Request('/work', {
		method: 'POST',
		body:  JSON.stringify(workItem),
		headers: new Headers({ 
			'Content-Type': 'application/json; charset=utf-8' 
		})
	});
	    
	fetch(request).then(
		function(response) {
			location.reload();
	})

}


function submittedw(event) {
	event.preventDefault();
	var worker = {};
	
	worker.worker = document.querySelector('form').getElementsByTagName('input')[0].value;
	worker.gender = document.getElementsByTagName("select")[0].value;
	console.log(worker);
    var request = new Request('/worker', {
		method: 'POST',
		body:  JSON.stringify(worker),
		headers: new Headers({ 
			'Content-Type': 'application/json; charset=utf-8' 
		})
	});
	    
	fetch(request).then(
		function(response) {
			location.reload();
	})

}

function deleted(el) {

    var request = new Request('/work/'+el, {
		method: 'DELETE'
	});
	    
	fetch(request).then(
		function(response) {
			location.reload();
	})

}

function updated(el, worker) {
	console.log(el);
	var workItem = {};
	workItem.worker_id = worker;
    var request = new Request('/work/claim/'+el, {
		method: 'PATCH',
		body:  JSON.stringify(workItem),
		headers: new Headers({ 
			'Content-Type': 'application/json; charset=utf-8' 
		})
	});
	    
	fetch(request).then(
		function(response) {
			
	})

}

function claim(work) {
	
}

function done(el, status) {
	console.log(el);
	var workItem = {};
	workItem.status = status;
    var request = new Request('/work/status/'+el, {
		method: 'PATCH',
		body:  JSON.stringify(workItem),
		headers: new Headers({ 
			'Content-Type': 'application/json; charset=utf-8' 
		})
	});
	    
	fetch(request).then(
		function(response) {
			location.reload();
	})

}