(function() {
  Convos.mixin.connectionEditor = {
    props: ["user"],
    methods: {
      saveConnection: function() {
        var self = this;
        var connection = this.connection || new Convos.Connection({user: this.user});
        var userinfo = [this.username, this.password].join(":");
        var params = [];

        userinfo = userinfo.match(/[^:]/) ? userinfo + "@" : "";
        connection.user = this.user;
        connection.url = "irc://" + userinfo + this.server;
        connection.on_connect_commands = this.onConnectCommands.split(/\n/).map(function(str) { return str.trim(); });

        if (this.nick) params.push("nick=" + this.nick);
        if (this.tls !== null) params.push("tls=" + (this.tls ? 1 : 0));
        if (params.length) connection.url += "?" + params.join("&");

        this.errors = []; // clear error on post
        connection.save(function(err) {
          if (err) return self.errors = err;
          self.deleted = false;
          self.updateForm(this);
          if (self.settings.main.indexOf(this.connection_id) == -1) self.settings.main = "#create-dialog";
        });
      }
    }
  };
})();
