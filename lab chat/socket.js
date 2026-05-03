const { Server } = require('socket.io');

function initSocket(server) {
  const io = new Server(server);

  const userReactions = {};
  const clients = {};
  let messages = [];
  let nextId = 1;

  io.on('connection', (socket) => {
    console.log('Connected:', socket.id);

    // register user
    socket.on('register', (name) => {
      if (!name) return;

      clients[socket.id] = { name };
      io.emit('clientsList', clients);
    });

    // send message
    socket.on('sendMessage', (text) => {
      if (!text) return;

      const msg = {
        id: nextId++,
        name: clients[socket.id]?.name || 'Anon',
        text,
        reactions: { "👍": 0, "❤️": 0, "😂": 0 }
      };

      messages.push(msg);

      io.emit('messagesUpdate', messages);
    });

    // reactions
    socket.on("reaction", ({ messageId, emoji }) => {
      const msg = messages.find(m => m.id === messageId);
      if (!msg) return;

      if (!userReactions[messageId]) {
        userReactions[messageId] = {};
      }

      const prevEmoji = userReactions[messageId][socket.id];

      // калі ўжо ставіў такую ж — нічога не робім
      if (prevEmoji === emoji) return;

      // калі была старая рэакцыя — здымаем яе
      if (prevEmoji) {
        msg.reactions[prevEmoji]--;
      }

      // ставім новую
      userReactions[messageId][socket.id] = emoji;
      msg.reactions[emoji]++;

      io.emit("messagesUpdate", messages);
    });

    // disconnect
    socket.on('disconnect', () => {
      delete clients[socket.id];
      io.emit('clientsList', clients);
    });
  });
}

module.exports = { initSocket };