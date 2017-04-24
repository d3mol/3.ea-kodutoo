//note ikoon
var notesIcon ='<img src="https://icons.veryicon.com/ico/Application/openPhone/Notes.ico" id="drag-1" class="draggable">'

//close list button
var closeIcon = "<img src='https://www.faricy.com/wp-content/uploads/2016/08/close-button.png' class='closeIcon' id='closeIcon'>";

// list div, kogu sisu
var listDiv = '<div id="list"></div>';

var formData = '<input type="button" value="Submit" id="submitButton"><input type="text" id="listInput" placeholder="Type your notes here">';
//div kuhu sisse lähevad ul väärtused

//div kuhu kirjutatakse data
var dataDiv = '<div id="dataDiv"></div>'




// ADDING TO HTML

document.body.innerHTML += notesIcon;
//addin bodyle listi
document.body.innerHTML += listDiv;
//document.getElementById("list").innerHTML += listTitle;
document.getElementById("list").innerHTML += closeIcon;

//addin input fieldi ja submit buttoni, form elementi ei saa kasutada, sest muidu refreshib lehte iga kord, kui submitin
document.getElementById("list").innerHTML += formData;
//adding divi, kuhu sisse kuvatakse data
document.getElementById("list").innerHTML += dataDiv;





var mainList = document.getElementById("list");
// et list oleks alguses peidetud
mainList.style.visibility = "hidden";
// hide/show listi
document.getElementById("drag-1").addEventListener("dblclick", function(){
    var mainList = document.getElementById("list");

	if(mainList.style.visibility == "visible"){
		mainList.style.visibility = "hidden";
	} else {
		mainList.style.visibility = "visible";
	}
});
// sulge list [x] nupust
document.getElementById("closeIcon").addEventListener("click", function(){
	mainList.style.visibility = "hidden";
});




// FIREBASE START
var config = {
	// Kallis kursakaaslane, please keep scrolling
    apiKey: "AIzaSyAo_hm_wJNKnUxt-U6xbjAT_TdpMLEPj7E",
    authDomain: "note-bebd7.firebaseapp.com",
    databaseURL: "https://note-bebd7.firebaseio.com",
    projectId: "note-bebd7",
    storageBucket: "note-bebd7.appspot.com",
    messagingSenderId: "469109871476"
	//thank you
};

firebase.initializeApp(config);
//console.log(firebase);

var database = firebase.database();
var ref = database.ref("note");

// submit data onkeypress
window.addEventListener('keypress', function (e) {
    //kas keypress oli "Enter" ja et kas õige input field on active
	
	if(document.getElementById("listInput").value.length > 50) {
		alert("Ületasid maksimaalse sümbolite arvu 50!");
	} else {
	
		if (e.keyCode == 13 && document.activeElement.id == "listInput") {
			
				
			var userNote = document.getElementById("listInput").value;
			//input ei tohi tühi olla
			if(userNote.length == 0){
				alert("Tühi väli!");
			} else {
			var data = {
			note: userNote
			}
			//andmebaasi saatmine
			ref.push(data);
			console.log(userNote);
			}
			//teen inputi tühjaks peale väärtuse sisestamist
			document.getElementById("listInput").value = "";
			}
		}	
    
}, false);

// submit data onclick
document.getElementById("submitButton").addEventListener("click", function(){
	
	var userNote = document.getElementById("listInput").value;
	//input ei tohi tühi olla
	if(userNote.length == 0){
		alert("Tühi väli!");
	} else {
		var data = {
		note: userNote
		}
		//andmebaasi saatmine
		ref.push(data);
		console.log("added element with value: " + userNote);
		//teen inputi tühjaks peale väärtuse sisestamist
		document.getElementById("listInput").value = "";
		}
	
});

//remove elemendid class-i järgi
function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}



document.addEventListener("click", function(e) {
	var click = e.target;
	//console.log("sinu click ID:  " + click.id);
	//console.log("sinu click CLASS:  " + click.className);
	
	//console.log(click);
	// et hiirega mujale, kui listi clickides paneks listi kinni.
	switch (click.id || click.className) {
    //Case ID järgi
		case "submitButton": break;
		case "dataDiv": break;
		case "drag-1": break;
		case "list": break;
		case "listInput": break;
		case "closeIcon": break;
		// Case ClassName põhjal
		case "listItem": break;
		case "draggable": break;
		case "deleteValue":break;
		default:
			// kontrollib seda elementi eraldi, sest igal img elemendil on erinev id
			if(click.id == document.getElementById(click.id).parentElement.parentElement.className){
				console.log("LISTI CLICKITUD");
			} else {
				mainList.style.visibility = "hidden";
			}
		}
});

//kuulab igale elemendile vajutamist ja kui className == deleteValue, siis toimetab edasi
document.addEventListener('click', function(e) {
	var str = e.target
	removeElementsByClass(str.id);
	
	//console.log(str);
	//kontrollib kas clickitud elemendi className on sama ja vastavalt juhul eemaldab andmebaasist väärtuse.
	if(str.className == "deleteValue"){
		//console.log("deleted");
		//console.log(str.id);
		database.ref("note/"+str.id).remove();
		console.log("Removed element with ID: " + str.id);
	}
});

ref.on("value", gotData, errData);

function gotData(data) {
	var notes = data.val();
	//consoloe.log(data.val());
	var keys = Object.keys(notes);
	console.log(keys);
	
	// removeElemtnsByClass removib ära, et peale igat uut väärtust ei kirjutataks tervet tabelit topelt üle
	removeElementsByClass("listItem");
	document.getElementById("dataDiv").innerHTML = "";
	for(var i = 0; i < keys.length; i++){
		var k = keys[i];
		//console.log(k);
		var oneNote = notes[k];
		//console.log(oneNote.note);
		
			var getInnerText = oneNote.note;
			//console.log(getInnerText);
			
			var words = getInnerText.split(' ');
			
			var startSentence = "";
			var endSentence = "";
			var e = 0;
			//vaatab nt kui on suurem kui 5
			if(getInnerText.length > 30){
				
				// tekitan esimene poole lausest
				while(startSentence.length < 30){
					startSentence += words[e++] + " ";
				}
				console.log("see on alguslause: " + startSentence);
				document.getElementById("dataDiv").innerHTML += '<ul class="'+ k +'"><li class="listItem">' + '<img id="'+k+'" class="deleteValue"src="https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-part-2/512/erase_delete_remove_wipe_out-512.png"><span class="spanText">' + startSentence + '</span></li></ul>';
				
				// tekitan teise poole lausest 
				while(e < words.length){
					endSentence += words[e++] + " ";	
				}
				console.log("see on lõpulause: " + endSentence);
				document.getElementById("dataDiv").innerHTML += '<ul class="'+ k +'"><li class="listItem"><span class="spanText">' + endSentence + '</span></li></ul>';
				
				
			} else {
				document.getElementById("dataDiv").innerHTML += '<ul class="'+ k +'"><li class="listItem">' + '<img id="'+k+'" class="deleteValue"src="https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-part-2/512/erase_delete_remove_wipe_out-512.png"><span class="spanText">' + oneNote.note + '</span></li></ul>';
			}
		
		
		
	}
	
}

function errData(err) {
	console.log("error!");
	console.log(err);
}



//-----------------Ikooni liigutamine algab interact.js------------------
interact('.draggable')
  .draggable({
    
    inertia: true,
    
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    
    autoScroll: true,

    
    onmove: dragMoveListener,
    
    onend: function (event) {
      var textEl = event.target.querySelector('p');

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(event.dx * event.dx +
                     event.dy * event.dy)|0) + 'px');
    }
  });

function dragMoveListener (event) {
    var target = event.target,
        
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }
window.dragMoveListener = dragMoveListener;
//-----------------Ikooni liigutamine lõppeb------------------


