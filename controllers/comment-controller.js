const { Pizza, Comment } = require('../models');

const commentController = {
    //methods
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                // To add a comment to a pizza, we create the comment then add it's id to the list of coments in the pizza
                return Pizza.findOneAndUpdate({ _id: params.pizzaId }, { $push: { comments: _id } }, { new: true, runValidators: true });
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    addReply({ params, body }, res) {
        Comment.findOneAndUpdate({ _id: params.commentId }, { $push: { replies: body } }, { new: true, runValidators: true })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    // remove reply
    removeReply({ params }, res) {
        Comment.findOneAndUpdate({ _id: params.commentId }, { $pull: { replies: { replyId: params.replyId } } }, { new: true })
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.json(err));
    },

    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No comment with this id!' });
                }
                return Pizza.findOneAndUpdate({ _id: params.pizzaId }, { $pull: { comments: params.commentId } }, { new: true });
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    }
}

module.exports = commentController;