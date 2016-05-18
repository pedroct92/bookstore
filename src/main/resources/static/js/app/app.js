/************ Jquery.rest and its configurations **************/

var client = new $.RestClient('/');
client.add('book',{stringifyData:true});


/************ Dropzone and its configurations **************/
Dropzone.autoDiscover = false;
var myDropzone = $("#file-form").dropzone({
    paramName: 'file',
    clickable: true,
    maxFilesize: 2,
    addRemoveLinks: true,
    maxFiles: 1,
    acceptedFiles: 'image/jpeg,image/png',
    uploadMultiple: false,
    autoProcessQueue: false,
    init: function () {
		$("#close, #close-top").click(function() {
			Dropzone.forElement("#file-form").removeAllFiles(true);
			$.notifyClose();
		});
		
		this.on("maxfilesexceeded", function(file){
			this.removeAllFiles(true);
			this.addFile(file);
	    });
    },
    accept: function(file, done){
        reader = new FileReader();
        reader.onload = handleReaderLoad;
        reader.readAsDataURL(file);
        function handleReaderLoad(evt) {
            document.getElementById("id_base64_data").setAttribute('value', evt.target.result);
            document.getElementById("id_base64_name").setAttribute('value', file.name);
            document.getElementById("id_base64_content_type").setAttribute('value', file.type);
        }
        done();
    },
});

/************ Datatables and its configurations **************/

var table = $('#example').DataTable({
		"ajax": '/book',
		"lengthMenu": [[5, 10, 15, 25, 50, -1], [5, 10, 15, 25, 50, "All"]],
	    columns: [
	      { data: "id"},
	      { data: "title"},
	      { data: "author"},
	      { data: "numPages"},
	      { data: "cover"},
	      { data: "id"}
	    ],
	    "columnDefs": [
	      { "orderable": false, "targets": [4,5]}
	    ],
	    "fnCreatedRow": function(row, data, index){
           $('td:eq(4)', row)
           		.html('<a href="" onclick="openImg(\''+data.cover+'\')" data-toggle="modal" data-target="#imgModal">'+
						'<img src="'+data.cover+'" class="img-rounded img-size-30-30">'+
					  '</a>');
           $('td:eq(5)', row)
				.html(
						'<button type="button" onclick="loadEditItem('+ data.id
								+ ')" class="btn btn-default" '
								+ 'data-toggle="modal" data-target="#myModal" title="Edit">'
								+ '<span class="glyphicon glyphicon glyphicon-pencil">'
								+ '</span></button>')
				.append(
						'<button type="button" onclick="deleteItem('+ data.id
								+ ')" class="btn btn-default" title="Delete">'
								+ '<span class="glyphicon glyphicon glyphicon-trash">'
								+ '</span></button>');
	       }
	  });

/************ READY FUNCTION **************/

$(document).ready(function() {
	$('#save').click(saveForm);

	$('<a class="btn btn-primary btn-primary btn-custom" data-toggle="modal" data-target="#myModal" onclick="loadNewItem()">'+
			'Add New</a>'
	  ).appendTo('div.dataTables_filter');
	
	$('#numPages').keyup(function(e) {
		if (/\D/g.test(this.value)) {
			this.value = this.value.replace(/\D/g, '');
		}
	});
});

/************ CRUD **************/

function loadNewItem(){
	resetFields();
}

function loadEditItem(id){
	client.book.read(id).done(function (res){
		loadFields(res);
		
		if(res.cover != null){
			loadSavedFileToDropzone(id);
		}
	}).fail(function(jqXHR, textStatus){
		nofityError(jqXHR);
	});
}

var saveForm = function(){
	var id = $('#id').val();
	var obj = buildJson();

	if(validateForm(obj)){
		if(isNumber(id)){
			updateItem(id, obj);
		}else{
			createItem(obj);
		}
	}
}

function createItem(obj){
	client.book.create(obj).done(function(res){
		unloadForm();
		nofityAction('success', 'Book was successfully created!');
	}).fail(function(jqXHR, textStatus){
		nofityError(jqXHR);
	});
}

function updateItem(id, obj){
	client.book.update(id, obj).done(function (data) {
		unloadForm();
		nofityAction('success', 'Book was successfully edited!');
	}).fail(function (jqXHR, textStatus) {
		nofityError(jqXHR);
	});	
}

function deleteItem(id) {
	client.book.del(id).done(function(res) {
		table.ajax.reload();
		nofityAction('success','Book was successfully deleted!');
	}).fail(function(jqXHR, textStatus){
		nofityError(jqXHR);
	});
}

function validateForm(obj){
	var msg = '';
	
	if(obj.title.trim() == ''){
		msg += '<li> Title is required. </li>';
	}
	
	if(obj.author.trim() == ''){
		msg += '<li> Author is required. </li>';
	}
	
	if(obj.numPages.trim() == ''){
		msg += '<li> Pages is required. </li>';
	}
	
	if(Dropzone.forElement("#file-form").files.length == 0){
		msg += ' <li> Cover is required. </li>';
	}
	
	if(msg != ''){
		notifyValidation(msg);
		return false;
	}
	
	$.notifyClose();
	return true;
}

/************ UTILS **************/

function notifyValidation(msg){
	$.notifyClose();
	$.notify({
		title: '<strong>Please, check missing fields:</strong> <br>',
		message: '<ul>' + msg + '</ul>'
	},{
		type: 'danger',
		z_index: 9999999,
		delay: 0,
		newest_on_top: true
	});
}

function nofityAction(_type, msg){
	$.notify({
		title: '<strong> Status: </strong>',
		message: msg
	},{
		type: _type,
		z_index: 9999999,
		newest_on_top: true
	});
}

function nofityError(jqXHR){
	$.notify({
		title: '<strong> Status: </strong>',
		message: jQuery.parseJSON(jqXHR.responseText).message
	},{
		z_index: 9999999,
		type: 'danger'
	});
}

function loadSavedFileToDropzone(id){
	var file = { name: "Cover", size: 1000, status: 'success',accepted: true };
	
	var myDropzone = Dropzone.forElement("#file-form");
	myDropzone.emit("addedfile", file);
	myDropzone.files.push(file);
	myDropzone.createThumbnailFromUrl(file, '/book/'+id+'/img/');
	myDropzone.emit("complete", file);
	myDropzone.options.maxFiles = 1;
}

function resetFields(){
	$('#id').val('');
	$('#title').val('');
	$('#author').val('');
	$('#numPages').val('');
	$('#description').val('');
	$('#id_base64_data').val('');
}

function loadFields(res){
	$('#id').val(res.id);
	$('#title').val(res.title);
	$('#author').val(res.author);
	$('#numPages').val(res.numPages);
	$('#description').val(res.description);
	$('#id_base64_data').val(res.cover);
}

function unloadForm(){
	$('#myModal').modal('toggle');
	Dropzone.forElement("#file-form").removeAllFiles(true);
	table.ajax.reload()
	resetFields();
}

function buildJson(){
	var obj = {
			title : $('#title').val(),
			author : $('#author').val(),
			numPages : $('#numPages').val(),
			description : $('#description').val(),
			cover : $('#id_base64_data').val()};
	return obj;
}

function openImg(url){
	$('#coverImg').attr('src', url);
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}