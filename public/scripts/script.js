var socket = io();

//refreshed the page once to get new tabs after creation
window.onload = function() {
    if(!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }
}
// makes the text area dynamically scale
$(document)
    .one('focus.autoExpand', 'textarea.autoExpand', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', 'textarea.autoExpand', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
        this.rows = minRows + rows;
    });
function saveTab() {
	$("#tabForm").submit();
}
function showTab(index) {
	console.log("show tab with index "+index);
}
function createTab() {
	$('#createTab').hide();
	if($('#newTab').length == 0){
	$('#createTab').before("<li id='newTab'><input type='text' onblur='hideNewTab()' placeholder='new tab' name='newtab' id='newTabInput' autocomplete='off' /><button onmousedown='saveTab()'>save</button></li>");
	} else {
		$('#newTab').show();
	}
	$('#newTabInput').focus();
	console.log("create a new tab");
}
function hideNewTab() {
	$('#newTab').hide();
	$('#createTab').show();
}
function changeProfilePic() {
	console.log("change pic activated");
}