const { Todo } = require("../models/todo");
const bodyParser = require("body-parser");
const _ = require("lodash");
const { ObjectId } = require("mongodb");

module.exports = (app, publicPath) => {
  const views = publicPath + "/views";

  // MIDDLEWARE:

  app.use(bodyParser.json({ type: "*/*" }));
  app.use(bodyParser.urlencoded({ extended: false }));

  // ___________________________

  // GET /todos

  app.get("/todos", authenticate, (req, res) => {
    Todo.find({
      _creator: req.user._id
    }).then(
      todos => {
        res.render(views + "/todos", { todos });
      },
      e => {
        res.status(400).send(e);
      }
    );
  });

  app.get("/todos/:id", authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(404).send();
    }

    Todo.findOne({
      _id: id,
      _creator: req.user._id
    })
      .then(todo => {
        if (!todo) {
          return res.status(404).send();
        }
        res.send({ todo });
      })
      .catch(e => {
        res.status(400).send();
      });
  });

  // ___________________________

  // POST /todos

  app.post("/todos", authenticate, (req, res) => {
    var todo = new Todo({
      text: req.body.text,
      _creator: req.user._id
    });
    todo.save().then(
      doc => {
        res.send(doc);
      },
      e => {
        res.status(400).send(e);
      }
    );
  });

  // ___________________________

  // PATCH /todos/:id

  app.patch("/todos/:id", authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ["text", "completed"]);

    if (!ObjectId.isValid(id)) {
      return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }
    Todo.findOneAndUpdate(
      {
        _id: id,
        _creator: req.user._id
      },
      { $set: body },
      { new: true }
    )
      .then(todo => {
        if (!todo) {
          return res.status(404).send();
        }
        res.send({ todo });
      })
      .catch(e => {
        res.status(400).send();
      });
  });

  // ___________________________

  // DELETE /todos/:id

  app.delete("/todos/:id", authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(404).send();
    }

    Todo.findOneAndDelete({
      _id: id,
      _creator: req.user._id
    })
      .then(todo => {
        if (!todo) {
          return res.status(404).send();
        }
        res.send({ todo });
      })
      .catch(e => {
        res.status(400).send();
      });
  });
};
