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

function showTab(index) {
	console.log("show tab with index "+index);
}
function createTab() {
	$('#createTab').hide();
	$('#createTab').before("<li id='newTab'><input type='text' placeholder='new tab' name='newtab' autofocus='autofocus'><button type='submit'>save</button></li>");
	console.log("create a new tab");
}