<script src="/socket.io/socket.io.js"></script>
<script>
	const socket = io();
</script>

socket.on('connect', () => {
	console.log('connected with id: ', socket.id);
});

socket.on('disconnect', (reason) => {
	console.log('disconnected: ', reason);
});

socket.emit('chatMessage', 'Вітаю, сервер!');

socket.on('welcome', (msg) => {
	console.log('server says: ', msg);
});

socket.on('reaction', ({ id, emoji }) => {
  io.emit('reactionUpdate', { id, emoji });
});

socket.on('reactionUpdate', (data) => {
  console.log('Reaction:', data);
});

