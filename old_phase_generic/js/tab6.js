document.addEventListener('DOMContentLoaded', function () {
	const tab = document.getElementById('tab6');

	tab.insertAdjacentHTML('beforeend', `
		<div class="header">
			<input id="todoInput" type="text" placeholder="New entry...">
			<button id="addTodo" class="addBtn" type="button">Add</button>
		</div>
		<ul id="todoList"></ul>

        
		<style>
			
			#tab6 .header { background: #eee; padding: 12px; }
			#tab6 input { width: 75%; padding: 10px; border: 0; font-size: 16px; }
			#tab6 .addBtn { width: 25%; padding: 10px; border: 0; background: #d9d9d9; color: #555; font-size: 16px; }
			#tab6 #todoList { margin: 0; padding: 0; }
			#tab6 #todoList li { position: relative; padding: 12px 40px; list-style: none; background: #eee; cursor: pointer; }
			#tab6 #todoList li:nth-child(odd) { background: #f9f9f9; }
			#tab6 #todoList li.checked { background: #888; color: white; text-decoration: line-through; }
			#tab6 .close { position: absolute; right: 0; top: 0; padding: 12px 16px; border: 0; background: transparent; }
		</style>
	`);


    /* We adapted the style above from https://www.w3schools.com/howto/howto_js_todolist.asp */

	const input = document.getElementById('todoInput');
	const list = document.getElementById('todoList');

	document.getElementById('addTodo').addEventListener('click', function () {
		if (input.value.trim() === '') return;

		const item = document.createElement('li');
		const text = document.createElement('span');
		const remove = document.createElement('button');

		text.textContent = input.value.trim();
		remove.className = 'close';
		remove.textContent = 'X';
		item.append(text, remove);
		list.appendChild(item);
		input.value = '';
		input.focus();
	});

	list.addEventListener('click', function (event) {
		if (event.target.tagName === 'BUTTON') {
			event.target.parentElement.remove();
		} else {
			event.target.closest('li').classList.toggle('checked');
		}
	});
});

